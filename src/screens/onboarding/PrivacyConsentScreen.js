import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const consentItems = [
  {
    id: 'terms',
    title: 'Terms of Service',
    desc: 'I agree to the SymptomPredict Terms of Service and understand how the platform works.',
    required: true,
  },
  {
    id: 'hipaa',
    title: 'HIPAA Authorization',
    desc: 'I authorize SymptomPredict to use my health information for diagnosis and care recommendations, as required by HIPAA.',
    required: true,
  },
  {
    id: 'data',
    title: 'Data Processing',
    desc: 'I understand my symptom data will be processed by AI models (encrypted end-to-end) to generate diagnoses.',
    required: true,
  },
  {
    id: 'location',
    title: 'Location Access (Optional)',
    desc: 'Allow SymptomPredict to access my location to show nearby doctors, hospitals, and pharmacies.',
    required: false,
  },
  {
    id: 'notifications',
    title: 'Push Notifications (Optional)',
    desc: 'Receive 24-hour follow-up reminders and health alerts on your device.',
    required: false,
  },
  {
    id: 'analytics',
    title: 'Anonymized Analytics (Optional)',
    desc: 'Help improve SymptomPredict by sharing anonymized, de-identified usage data. No personal info is ever shared.',
    required: false,
  },
];

export default function PrivacyConsentScreen({ navigation }) {
  const [checked, setChecked] = useState({});

  const toggle = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const requiredChecked = consentItems
    .filter(i => i.required)
    .every(i => checked[i.id]);

  const handleContinue = () => {
    if (!requiredChecked) return;
    navigation.navigate('ProfileSetup');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.iconCircle}>
          <Ionicons name="document-text" size={36} color={colors.primary} />
        </View>
        <Text style={styles.title}>Privacy & Consent</Text>
        <Text style={styles.subtitle}>
          Please review and accept these agreements to use SymptomPredict safely and securely.
        </Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hipaaCard}>
          <Ionicons name="shield-checkmark" size={20} color={colors.secondary} />
          <Text style={styles.hipaaText}>
            SymptomPredict is HIPAA-compliant. Your health data is encrypted in transit and at rest. We never sell your data.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Required to continue</Text>
        {consentItems.filter(i => i.required).map(item => (
          <ConsentCard key={item.id} item={item} checked={!!checked[item.id]} onToggle={() => toggle(item.id)} />
        ))}

        <Text style={styles.sectionLabel}>Optional permissions</Text>
        {consentItems.filter(i => !i.required).map(item => (
          <ConsentCard key={item.id} item={item} checked={!!checked[item.id]} onToggle={() => toggle(item.id)} />
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>

      <View style={styles.footer}>
        {!requiredChecked && (
          <Text style={styles.footerHint}>Please accept all required items above</Text>
        )}
        <TouchableOpacity
          style={[styles.continueBtn, !requiredChecked && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!requiredChecked}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>I Agree — Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function ConsentCard({ item, checked, onToggle }) {
  return (
    <TouchableOpacity style={styles.consentCard} onPress={onToggle} activeOpacity={0.8}>
      <View style={styles.cardLeft}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          {item.required && (
            <View style={styles.requiredBadge}>
              <Text style={styles.requiredText}>Required</Text>
            </View>
          )}
        </View>
        <Text style={styles.cardDesc}>{item.desc}</Text>
      </View>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={14} color={colors.white} />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingTop: 10 },
  backBtn: { marginBottom: 16 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },

  scroll: { flex: 1, paddingHorizontal: 20 },

  hipaaCard: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  hipaaText: { flex: 1, fontSize: 13, color: '#065F46', lineHeight: 20 },

  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginTop: 4,
  },

  consentCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardLeft: { flex: 1 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: colors.text },
  requiredBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  requiredText: { fontSize: 10, fontWeight: '700', color: '#92400E' },
  cardDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  footer: { padding: 20, paddingTop: 12 },
  footerHint: { fontSize: 12, color: colors.textLight, textAlign: 'center', marginBottom: 8 },
  continueBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueBtnDisabled: { opacity: 0.4 },
  continueBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
