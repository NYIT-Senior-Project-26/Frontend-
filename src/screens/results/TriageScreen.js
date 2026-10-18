import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const SELF_CARE_TIPS = [
  { icon: '💧', title: 'Stay Hydrated', desc: 'Drink 8-10 glasses of water, electrolyte drinks if vomiting or diarrhea.' },
  { icon: '🛌', title: 'Rest', desc: 'Allow your body to recover. Avoid strenuous activity.' },
  { icon: '🌡️', title: 'Monitor Symptoms', desc: 'Track temperature, symptoms over time. Come back in 24-48 hrs to re-check.' },
  { icon: '💊', title: 'OTC Medications', desc: 'Acetaminophen or ibuprofen for fever and pain. See a pharmacist for guidance.' },
];

const WHEN_TO_ESCALATE = [
  'Fever rises above 103°F (39.4°C)',
  'Difficulty breathing or chest tightness',
  'Symptoms worsen significantly after 48 hours',
  'Confusion, fainting, or extreme weakness',
  'No improvement after 7-10 days',
];

export default function TriageScreen({ navigation, route }) {
  const { result, sessionData } = route.params;
  const triage = result.triage;

  const handleCall911 = () => Linking.openURL('tel:911');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Care Plan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Triage level banner */}
        {triage === 'er' ? (
          <View style={[styles.banner, styles.bannerER]}>
            <Text style={styles.bannerIcon}>🚨</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>Go to the ER Immediately</Text>
              <Text style={styles.bannerSub}>Your symptoms indicate a potential emergency. Do not wait.</Text>
            </View>
            <TouchableOpacity style={styles.call911Btn} onPress={handleCall911}>
              <Ionicons name="call" size={18} color={colors.white} />
              <Text style={styles.call911Text}>911</Text>
            </TouchableOpacity>
          </View>
        ) : triage === 'appointment' ? (
          <View style={[styles.banner, styles.bannerAppointment]}>
            <Text style={styles.bannerIcon}>🏥</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.bannerTitle, { color: '#92400E' }]}>Schedule an Appointment</Text>
              <Text style={[styles.bannerSub, { color: '#78350F' }]}>Recommend seeing a doctor within 1-2 days.</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.banner, styles.bannerSelfCare]}>
            <Text style={styles.bannerIcon}>🏠</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.bannerTitle, { color: '#065F46' }]}>Self-Care at Home</Text>
              <Text style={[styles.bannerSub, { color: '#047857' }]}>Your symptoms can likely be managed at home.</Text>
            </View>
          </View>
        )}

        {/* Care steps */}
        {triage === 'self-care' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Self-Care Steps</Text>
            {SELF_CARE_TIPS.map((tip, i) => (
              <View key={i} style={styles.tipCard}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDesc}>{tip.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Care access buttons */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Care Access</Text>
          <View style={styles.careGrid}>
            <TouchableOpacity
              style={styles.careCard}
              onPress={() => navigation.navigate('NearbyProviders', { sessionData })}
            >
              <Text style={styles.careCardIcon}>🗺️</Text>
              <Text style={styles.careCardTitle}>Nearby Doctors</Text>
              <Text style={styles.careCardSub}>Find providers near you</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.careCard}
              onPress={() => navigation.navigate('Telehealth')}
            >
              <Text style={styles.careCardIcon}>📹</Text>
              <Text style={styles.careCardTitle}>Telehealth</Text>
              <Text style={styles.careCardSub}>Video visit now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.careCard}
              onPress={() => navigation.navigate('Pharmacy')}
            >
              <Text style={styles.careCardIcon}>💊</Text>
              <Text style={styles.careCardTitle}>Pharmacies</Text>
              <Text style={styles.careCardSub}>OTC medications</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.careCard, styles.careCardER]}
              onPress={handleCall911}
            >
              <Text style={styles.careCardIcon}>🚑</Text>
              <Text style={[styles.careCardTitle, { color: colors.danger }]}>Emergency</Text>
              <Text style={[styles.careCardSub, { color: colors.danger }]}>Call 911</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* When to escalate */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ When to Seek Immediate Care</Text>
          <View style={styles.escalateCard}>
            {WHEN_TO_ESCALATE.map((item, i) => (
              <View key={i} style={styles.escalateRow}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.warning} />
                <Text style={styles.escalateText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Follow-up note */}
        <View style={styles.followUpCard}>
          <Ionicons name="notifications-outline" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.followUpTitle}>24-Hour Follow-Up</Text>
            <Text style={styles.followUpDesc}>
              We'll send you a notification tomorrow to check if your symptoms improved, stayed the same, or got worse.
            </Text>
          </View>
        </View>

        <View style={{ height: 30 }} />
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
  headerTitle: { fontSize: 18, fontWeight: '800', color: colors.text },
  scroll: { padding: 20 },

  banner: { borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  bannerER: { backgroundColor: '#FEE2E2' },
  bannerAppointment: { backgroundColor: '#FEF3C7' },
  bannerSelfCare: { backgroundColor: '#ECFDF5' },
  bannerIcon: { fontSize: 36 },
  bannerTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 2 },
  bannerSub: { fontSize: 13, lineHeight: 18 },

  call911Btn: {
    backgroundColor: colors.danger,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  call911Text: { fontSize: 12, fontWeight: '800', color: colors.white },

  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 14 },

  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    gap: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  tipIcon: { fontSize: 26 },
  tipTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 3 },
  tipDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  careGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  careCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  careCardER: { borderColor: '#FECACA' },
  careCardIcon: { fontSize: 30, marginBottom: 8 },
  careCardTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 2 },
  careCardSub: { fontSize: 12, color: colors.textSecondary },

  escalateCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  escalateRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  escalateText: { flex: 1, fontSize: 13, color: '#78350F', lineHeight: 19 },

  followUpCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    padding: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  followUpTitle: { fontSize: 14, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  followUpDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },
});
