import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const INSURANCE_OPTIONS = [
  'Aetna', 'Blue Cross Blue Shield', 'Cigna', 'Humana', 'Kaiser Permanente',
  'Medicare', 'Medicaid', 'United Healthcare', 'Oscar Health', 'Molina Healthcare',
  'Other', 'No Insurance',
];

const BLOOD_PRESSURE_OPTIONS = ['Normal', 'Elevated', 'High (Stage 1)', 'High (Stage 2)', 'Unknown'];
const SMOKING_OPTIONS = ['Never', 'Former smoker', 'Current smoker'];
const SEX_OPTIONS = ['Male', 'Female', 'Prefer not to say'];

export default function ProfileSetupScreen({ navigation }) {
  const [step, setStep] = useState(1); // 1: basics, 2: conditions
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    age: '',
    sex: '',
    bloodPressure: '',
    smoking: '',
    allergies: '',
    medications: '',
    insurance: '',
  });

  const update = (key, val) => setProfile(prev => ({ ...prev, [key]: val }));

  const step1Valid = profile.age && profile.sex && profile.bloodPressure && profile.smoking;

  const handleFinish = async () => {
    setLoading(true);
    try {
      // TODO: Save profile to Supabase
      await new Promise(resolve => setTimeout(resolve, 800));
      navigation.replace('MainApp');
    } catch {
      Alert.alert('Error', 'Could not save your profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          {step > 1 && (
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          )}
          <Text style={styles.title}>Set Up Your Profile</Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? 'Basic health information helps us give you accurate results.'
              : 'Optional details improve diagnosis accuracy.'}
          </Text>

          {/* Progress bar */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: step === 1 ? '50%' : '100%' }]} />
          </View>
          <Text style={styles.progressLabel}>Step {step} of 2</Text>
        </View>

        {step === 1 ? (
          <View style={styles.section}>
            {/* Age */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Age *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 25"
                placeholderTextColor={colors.textLight}
                value={profile.age}
                onChangeText={val => update('age', val.replace(/\D/g, ''))}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            {/* Sex */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Biological Sex *</Text>
              <View style={styles.optionRow}>
                {SEX_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.optionChip, profile.sex === opt && styles.optionChipActive]}
                    onPress={() => update('sex', opt)}
                  >
                    <Text style={[styles.optionChipText, profile.sex === opt && styles.optionChipTextActive]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Blood Pressure */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Blood Pressure *</Text>
              <View style={styles.optionColumn}>
                {BLOOD_PRESSURE_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.optionRow2, profile.bloodPressure === opt && styles.optionRow2Active]}
                    onPress={() => update('bloodPressure', opt)}
                  >
                    <View style={[styles.radioCircle, profile.bloodPressure === opt && styles.radioCircleActive]}>
                      {profile.bloodPressure === opt && <View style={styles.radioDot} />}
                    </View>
                    <Text style={[styles.optionRow2Text, profile.bloodPressure === opt && styles.optionRow2TextActive]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Smoking */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Smoking Status *</Text>
              <View style={styles.optionColumn}>
                {SMOKING_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.optionRow2, profile.smoking === opt && styles.optionRow2Active]}
                    onPress={() => update('smoking', opt)}
                  >
                    <View style={[styles.radioCircle, profile.smoking === opt && styles.radioCircleActive]}>
                      {profile.smoking === opt && <View style={styles.radioDot} />}
                    </View>
                    <Text style={[styles.optionRow2Text, profile.smoking === opt && styles.optionRow2TextActive]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.section}>
            {/* Allergies */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Known Allergies <Text style={styles.optional}>(Optional)</Text></Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="e.g. Penicillin, Peanuts, Latex..."
                placeholderTextColor={colors.textLight}
                value={profile.allergies}
                onChangeText={val => update('allergies', val)}
                multiline
                numberOfLines={3}
              />
              <Text style={styles.hint}>Separate multiple allergies with commas</Text>
            </View>

            {/* Current Medications */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Current Medications <Text style={styles.optional}>(Optional)</Text></Text>
              <TextInput
                style={[styles.input, styles.textarea]}
                placeholder="e.g. Lisinopril 10mg, Metformin 500mg..."
                placeholderTextColor={colors.textLight}
                value={profile.medications}
                onChangeText={val => update('medications', val)}
                multiline
                numberOfLines={3}
              />
              <Text style={styles.hint}>This helps us check for drug interactions</Text>
            </View>

            {/* Insurance */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Insurance Plan <Text style={styles.optional}>(Optional)</Text></Text>
              <Text style={styles.hint} style={{ marginBottom: 10 }}>
                Used to filter doctors who accept your plan (via Zocdoc)
              </Text>
              <View style={styles.insuranceGrid}>
                {INSURANCE_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={[styles.insuranceChip, profile.insurance === opt && styles.insuranceChipActive]}
                    onPress={() => update('insurance', opt)}
                  >
                    <Text style={[styles.insuranceChipText, profile.insurance === opt && styles.insuranceChipTextActive]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 10 }} />
      </ScrollView>

      <View style={styles.footer}>
        {step === 1 ? (
          <TouchableOpacity
            style={[styles.nextBtn, !step1Valid && styles.nextBtnDisabled]}
            onPress={() => setStep(2)}
            disabled={!step1Valid}
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>Next</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </TouchableOpacity>
        ) : (
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={handleFinish}
              disabled={loading}
            >
              <Text style={styles.skipBtnText}>Skip for now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.nextBtn, { flex: 1 }]}
              onPress={handleFinish}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={colors.white} />
                : <>
                    <Text style={styles.nextBtnText}>Finish Setup</Text>
                    <Ionicons name="checkmark" size={18} color={colors.white} />
                  </>
              }
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, padding: 20 },
  header: { marginBottom: 24 },
  backBtn: { marginBottom: 16 },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.textSecondary, lineHeight: 22, marginBottom: 16 },

  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressLabel: { fontSize: 12, color: colors.textLight, textAlign: 'right' },

  section: { gap: 4 },
  fieldGroup: { marginBottom: 22 },
  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 10 },
  optional: { fontWeight: '400', color: colors.textLight },
  hint: { fontSize: 12, color: colors.textLight, marginTop: 6 },

  input: {
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.text,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  textarea: { height: 80, textAlignVertical: 'top', paddingTop: 14 },

  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  optionChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  optionChipText: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },
  optionChipTextActive: { color: colors.primary, fontWeight: '700' },

  optionColumn: { gap: 8 },
  optionRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  optionRow2Active: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  optionRow2Text: { fontSize: 14, color: colors.textSecondary },
  optionRow2TextActive: { color: colors.primary, fontWeight: '600' },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: { borderColor: colors.primary },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },

  insuranceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  insuranceChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  insuranceChipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  insuranceChipText: { fontSize: 13, color: colors.textSecondary },
  insuranceChipTextActive: { color: colors.primary, fontWeight: '700' },

  footer: { padding: 20, paddingTop: 0 },
  footerRow: { flexDirection: 'row', gap: 12 },
  nextBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  skipBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  skipBtnText: { fontSize: 15, color: colors.textSecondary, fontWeight: '600' },
});
