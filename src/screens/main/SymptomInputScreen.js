import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const BODY_PARTS = [
  '🧠 Head', '👁️ Eyes', '👂 Ears', '👃 Nose', '🦷 Throat',
  '🫁 Chest', '❤️ Heart', '🫃 Abdomen', '🦴 Back', '💪 Arms',
  '🦵 Legs', '🦶 Feet', '🌡️ Whole Body', '🧠 Mental',
];

const DURATION_OPTIONS = [
  'Just started', 'A few hours', '1-2 days', '3-7 days', '1-2 weeks', 'More than 2 weeks'
];

const SEVERITY_OPTIONS = [
  { label: 'Mild', desc: 'Noticeable but manageable', icon: '😐', color: colors.secondary },
  { label: 'Moderate', desc: 'Affecting daily activity', icon: '😟', color: colors.warning },
  { label: 'Severe', desc: 'Debilitating or worsening', icon: '😰', color: colors.danger },
];

export default function SymptomInputScreen({ navigation, route }) {
  const prefill = route?.params?.prefill || '';
  const [description, setDescription] = useState(prefill);
  const [selectedParts, setSelectedParts] = useState([]);
  const [severity, setSeverity] = useState('');
  const [duration, setDuration] = useState('');

  const togglePart = (part) => {
    setSelectedParts(prev =>
      prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
    );
  };

  const canSubmit = description.trim().length >= 10 && severity && duration;

  const handleSubmit = () => {
    if (!canSubmit) {
      Alert.alert('Almost there', 'Please describe your symptoms, select severity and duration.');
      return;
    }

    // Emergency keyword detection
    const lower = description.toLowerCase();
    const emergencyWords = ['chest pain', 'can\'t breathe', 'cannot breathe', 'stroke', 'unconscious', 'severe chest', 'heart attack'];
    const isEmergency = emergencyWords.some(w => lower.includes(w));

    if (isEmergency && severity === 'Severe') {
      Alert.alert(
        '⚠️ This may be an emergency',
        'Your symptoms could indicate a serious condition. Please call 911 or go to an ER immediately.',
        [
          { text: 'Call 911', style: 'destructive', onPress: () => console.log('Call 911') },
          { text: 'Continue with Check', onPress: () => goToQA() },
        ]
      );
      return;
    }

    goToQA();
  };

  const goToQA = () => {
    navigation.navigate('AdaptiveQA', {
      description,
      bodyParts: selectedParts,
      severity,
      duration,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        <View style={styles.header}>
          <Text style={styles.title}>What's going on?</Text>
          <Text style={styles.subtitle}>Describe your symptoms in your own words</Text>
        </View>

        {/* Main description box */}
        <View style={styles.section}>
          <Text style={styles.label}>Describe your symptoms *</Text>
          <View style={styles.textAreaWrapper}>
            <TextInput
              style={styles.textArea}
              placeholder="e.g. I've had a fever for 2 days with a sore throat and body aches..."
              placeholderTextColor={colors.textLight}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
            <View style={styles.textAreaFooter}>
              <Text style={styles.charCount}>{description.length} chars</Text>
              {/* Voice to text button - placeholder */}
              <TouchableOpacity style={styles.voiceBtn}>
                <Ionicons name="mic-outline" size={18} color={colors.primary} />
                <Text style={styles.voiceBtnText}>Voice</Text>
              </TouchableOpacity>
            </View>
          </View>
          {description.length > 0 && description.length < 10 && (
            <Text style={styles.inputHint}>Please add more detail (at least 10 characters)</Text>
          )}
        </View>

        {/* Body part selection */}
        <View style={styles.section}>
          <Text style={styles.label}>Where does it hurt? <Text style={styles.optional}>(Select all that apply)</Text></Text>
          <View style={styles.partsGrid}>
            {BODY_PARTS.map((part) => (
              <TouchableOpacity
                key={part}
                style={[styles.partChip, selectedParts.includes(part) && styles.partChipActive]}
                onPress={() => togglePart(part)}
                activeOpacity={0.8}
              >
                <Text style={[styles.partChipText, selectedParts.includes(part) && styles.partChipTextActive]}>
                  {part}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Severity */}
        <View style={styles.section}>
          <Text style={styles.label}>How severe is it? *</Text>
          <View style={styles.severityRow}>
            {SEVERITY_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.label}
                style={[styles.severityCard, severity === opt.label && { borderColor: opt.color, backgroundColor: `${opt.color}15` }]}
                onPress={() => setSeverity(opt.label)}
                activeOpacity={0.8}
              >
                <Text style={styles.severityIcon}>{opt.icon}</Text>
                <Text style={[styles.severityLabel, severity === opt.label && { color: opt.color }]}>{opt.label}</Text>
                <Text style={styles.severityDesc}>{opt.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.label}>How long have you had these symptoms? *</Text>
          <View style={styles.durationGrid}>
            {DURATION_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.durationChip, duration === opt && styles.durationChipActive]}
                onPress={() => setDuration(opt)}
                activeOpacity={0.8}
              >
                <Text style={[styles.durationChipText, duration === opt && styles.durationChipTextActive]}>
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 10 }} />
      </ScrollView>

      {/* Submit button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit}
          activeOpacity={0.85}
        >
          <Text style={styles.submitBtnText}>Analyze Symptoms</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.footerNote}>
          AI analysis • Takes about 10 seconds
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, padding: 20 },

  header: { marginBottom: 24, marginTop: 10 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 15, color: colors.textSecondary },

  section: { marginBottom: 26 },
  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10 },
  optional: { fontWeight: '400', color: colors.textLight },

  textAreaWrapper: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  textArea: {
    padding: 16,
    fontSize: 15,
    color: colors.text,
    minHeight: 110,
    lineHeight: 22,
  },
  textAreaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.inputBg,
  },
  charCount: { fontSize: 12, color: colors.textLight },
  voiceBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  voiceBtnText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  inputHint: { marginTop: 6, fontSize: 12, color: colors.warning },

  partsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  partChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  partChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  partChipText: { fontSize: 13, color: colors.textSecondary },
  partChipTextActive: { color: colors.primary, fontWeight: '700' },

  severityRow: { flexDirection: 'row', gap: 10 },
  severityCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  severityIcon: { fontSize: 26, marginBottom: 6 },
  severityLabel: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 4 },
  severityDesc: { fontSize: 11, color: colors.textSecondary, textAlign: 'center', lineHeight: 15 },

  durationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  durationChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  durationChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  durationChipText: { fontSize: 13, color: colors.textSecondary },
  durationChipTextActive: { color: colors.primary, fontWeight: '700' },

  footer: { padding: 20, paddingTop: 10 },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  footerNote: { textAlign: 'center', fontSize: 12, color: colors.textLight, marginTop: 8 },
});
