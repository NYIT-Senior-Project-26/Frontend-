import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { predictSymptoms } from '../../services/api';

// Adaptive question engine — questions branch based on prior answers
const QUESTION_TREE = {
  chest_pain: {
    q: 'Do you have chest pain or pressure?',
    options: ['Yes, sharp pain', 'Yes, pressure/tightness', 'Dull ache', 'No'],
    next: {
      'Yes, sharp pain': 'sob',
      'Yes, pressure/tightness': 'sob',
      'Dull ache': 'radiation',
      'No': 'fever',
    },
  },
  sob: {
    q: 'Are you having difficulty breathing or shortness of breath?',
    options: ['Yes, severe', 'Yes, mild', 'No'],
    next: {
      'Yes, severe': 'emergency_flag',
      'Yes, mild': 'cough',
      'No': 'fever',
    },
  },
  radiation: {
    q: 'Does the pain spread to your arm, jaw, or neck?',
    options: ['Yes', 'No'],
    next: { 'Yes': 'emergency_flag', 'No': 'fever' },
  },
  emergency_flag: {
    q: '🚨 These symptoms could indicate a cardiac emergency. Are you experiencing any other signs like sweating, nausea, or arm pain?',
    options: ['Yes, multiple symptoms', 'Just one', 'No other symptoms'],
    next: { default: 'done' },
    urgent: true,
  },
  fever: {
    q: 'Do you have a fever (temperature above 100.4°F / 38°C)?',
    options: ['Yes, high (103°F+)', 'Yes, mild (100-103°F)', 'No'],
    next: { default: 'cough' },
  },
  cough: {
    q: 'Do you have a cough?',
    options: ['Yes, productive (with mucus)', 'Yes, dry cough', 'No'],
    next: { default: 'nausea' },
  },
  nausea: {
    q: 'Are you experiencing nausea, vomiting, or diarrhea?',
    options: ['Nausea only', 'Vomiting', 'Diarrhea', 'None'],
    next: { default: 'duration_change' },
  },
  duration_change: {
    q: 'Are your symptoms getting better, worse, or staying the same?',
    options: ['Getting worse', 'Same', 'Getting better'],
    next: { default: 'done' },
  },
};

const START_QUESTION = 'chest_pain';
const MAX_QUESTIONS = 7;

export default function AdaptiveQAScreen({ navigation, route }) {
  const { description, bodyParts = [], severity, duration } = route.params;

  const [currentKey, setCurrentKey] = useState(START_QUESTION);
  const [answers, setAnswers] = useState([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const currentQ = QUESTION_TREE[currentKey];
  const progress = Math.min(questionCount / MAX_QUESTIONS, 1);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  }, [currentKey]);

  const handleAnswer = (option) => {
    const newAnswers = [...answers, { question: currentQ.q, answer: option }];
    setAnswers(newAnswers);

    const nextKey = currentQ.next?.[option] || currentQ.next?.default;

    if (nextKey === 'done' || !nextKey || questionCount >= MAX_QUESTIONS - 1) {
      setDone(true);
      analyzeAndNavigate(newAnswers);
    } else {
      fadeAnim.setValue(0);
      setCurrentKey(nextKey);
      setQuestionCount(prev => prev + 1);
    }
  };

  /**
   * Maps the backend's PredictionResult to the shape DiagnosisResultScreen
   * expects. The backend returns conditions with likelihood strings; we turn
   * them into 0–1 confidence numbers so the existing UI bars work correctly.
   */
  const adaptApiResponse = (apiResult) => {
    const LIKELIHOOD_SCORE = { high: 0.85, medium: 0.55, low: 0.25 };

    // Map backend urgency → DiagnosisResultScreen triage key
    const URGENCY_TO_TRIAGE = {
      self_care: 'self-care',
      see_doctor: 'appointment',
      urgent_care: 'appointment',
      emergency: 'er',
    };

    // Map backend urgency → human-readable triage message
    const URGENCY_MESSAGE = {
      self_care: 'Your symptoms appear manageable at home. Rest, stay hydrated, and monitor for any changes.',
      see_doctor: 'Consider scheduling an appointment with a doctor within the next day or two.',
      urgent_care: 'You should visit an urgent care center today. Don\'t wait for a regular appointment.',
      emergency: 'These symptoms require immediate medical attention. Go to an ER or call 911 now.',
    };

    const diagnoses = apiResult.conditions.map((c, i) => ({
      rank: i + 1,
      name: c.name,
      icd10: '',  // backend doesn't return ICD-10 codes yet
      confidence: LIKELIHOOD_SCORE[c.likelihood] ?? 0.4,
      compatibleSymptoms: c.rationale ? [c.rationale] : [],
      unlikelyWith: [],
      recommendedTests: i === 0 && apiResult.recommended_specialty
        ? [`See a ${apiResult.recommended_specialty}`]
        : [],
    }));

    // Ensure at least one diagnosis exists (defensive)
    if (diagnoses.length === 0) {
      diagnoses.push({
        rank: 1,
        name: 'Assessment pending',
        icd10: '',
        confidence: 0,
        compatibleSymptoms: [],
        unlikelyWith: [],
        recommendedTests: ['Please consult a healthcare provider'],
      });
    }

    return {
      diagnoses,
      triage: URGENCY_TO_TRIAGE[apiResult.urgency] ?? 'self-care',
      triageMessage: apiResult.advice || URGENCY_MESSAGE[apiResult.urgency] || URGENCY_MESSAGE.self_care,
      urgencyLevel: Object.keys(URGENCY_TO_TRIAGE).indexOf(apiResult.urgency),
      sessionId: `sess_${Date.now()}`,
      // Pass through originals for any downstream use
      recommended_specialty: apiResult.recommended_specialty,
      disclaimer: apiResult.disclaimer,
    };
  };

  const analyzeAndNavigate = async (finalAnswers) => {
    setLoading(true);
    try {
      // Build the symptom list: start with the free-text description,
      // then enrich with body-part context and Q&A answers.
      const symptomParts = [description.trim()];
      if (bodyParts.length > 0) {
        // Strip emojis from body part labels before sending to backend
        symptomParts.push(...bodyParts.map(p => p.replace(/[^\w\s]/g, '').trim()));
      }
      finalAnswers.forEach(({ answer }) => {
        if (answer && answer !== 'No' && answer !== 'None') {
          symptomParts.push(answer);
        }
      });

      // Map duration string to days
      const DURATION_MAP = {
        'Just started': 0,
        'A few hours': 0,
        '1-2 days': 1,
        '3-7 days': 5,
        '1-2 weeks': 10,
        'More than 2 weeks': 20,
      };

      const apiResult = await predictSymptoms({
        symptoms: symptomParts.filter(Boolean),
        duration_days: DURATION_MAP[duration] ?? undefined,
        notes: severity ? `Severity: ${severity}` : undefined,
      });

      navigation.replace('DiagnosisResult', {
        result: adaptApiResponse(apiResult),
        sessionData: {
          description,
          bodyParts,
          severity,
          duration,
          answers: finalAnswers,
        },
      });
    } catch (err) {
      console.error('API error:', err);
      Alert.alert(
        'Could not reach server',
        'The backend isn\'t running yet. Make sure Tulsi\'s FastAPI server is up, or check your IP address in src/services/api.js.\n\n' + err.message,
        [{ text: 'Go Back', onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    setDone(true);
    analyzeAndNavigate(answers);
  };

  if (loading || done) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingTitle}>Analyzing your symptoms...</Text>
        <Text style={styles.loadingSubtitle}>Our AI is reviewing your answers and generating diagnoses</Text>
        <View style={styles.loadingSteps}>
          {['Parsing symptoms', 'Running ML classifier', 'Querying AI model', 'Ranking diagnoses'].map((s, i) => (
            <View key={i} style={styles.loadingStep}>
              <ActivityIndicator size="small" color={colors.primary} style={{ opacity: 0.5 + i * 0.15 }} />
              <Text style={styles.loadingStepText}>{s}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Follow-Up Questions</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.progressLabel}>Question {questionCount + 1} of ~{MAX_QUESTIONS}</Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {currentQ.urgent && (
            <View style={styles.urgentBanner}>
              <Ionicons name="warning" size={18} color={colors.danger} />
              <Text style={styles.urgentText}>These symptoms may need urgent attention</Text>
            </View>
          )}

          <Text style={styles.question}>{currentQ.q}</Text>

          <View style={styles.optionsContainer}>
            {currentQ.options.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.optionBtn}
                onPress={() => handleAnswer(opt)}
                activeOpacity={0.8}
              >
                <Text style={styles.optionText}>{opt}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>

          {answers.length > 0 && (
            <View style={styles.answeredSection}>
              <Text style={styles.answeredLabel}>Previous answers</Text>
              {answers.slice(-2).map((a, i) => (
                <View key={i} style={styles.answeredCard}>
                  <Text style={styles.answeredQ}>{a.question}</Text>
                  <Text style={styles.answeredA}>✓ {a.answer}</Text>
                </View>
              ))}
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  skipText: { fontSize: 14, color: colors.primary, fontWeight: '600' },

  progressBar: { height: 4, backgroundColor: colors.border, marginHorizontal: 20 },
  progressFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 2 },
  progressLabel: { fontSize: 12, color: colors.textLight, margin: 10, marginHorizontal: 20 },

  scroll: { flex: 1 },
  scrollContent: { padding: 20 },

  urgentBanner: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  urgentText: { flex: 1, fontSize: 13, color: colors.danger, fontWeight: '600' },

  question: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 28,
    marginBottom: 24,
  },

  optionsContainer: { gap: 10 },
  optionBtn: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  optionText: { fontSize: 15, color: colors.text, fontWeight: '500', flex: 1 },

  answeredSection: { marginTop: 32 },
  answeredLabel: { fontSize: 12, color: colors.textLight, marginBottom: 8, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  answeredCard: { backgroundColor: colors.inputBg, borderRadius: 12, padding: 12, marginBottom: 6 },
  answeredQ: { fontSize: 12, color: colors.textSecondary, marginBottom: 3 },
  answeredA: { fontSize: 13, fontWeight: '600', color: colors.secondary },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 24, marginBottom: 8, textAlign: 'center' },
  loadingSubtitle: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  loadingSteps: { gap: 12 },
  loadingStep: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  loadingStepText: { fontSize: 14, color: colors.textSecondary },
});
