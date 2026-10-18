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

const TELEHEALTH_OPTIONS = [
  {
    id: 'teladoc',
    name: 'Teladoc',
    desc: 'On-demand video visits with board-certified doctors. Most insurance plans accepted.',
    wait: '< 15 min',
    cost: '$0 – $75',
    insurance: true,
    url: 'https://teladoc.com',
    icon: '📱',
    features: ['24/7 availability', 'Prescriptions available', 'Mental health services'],
  },
  {
    id: 'mdlive',
    name: 'MDLive',
    desc: 'Connect with doctors, therapists and psychiatrists. HIPAA-compliant platform.',
    wait: '< 20 min',
    cost: '$0 – $82',
    insurance: true,
    url: 'https://mdlive.com',
    icon: '🩺',
    features: ['Urgent care', 'Behavioral health', 'Dermatology'],
  },
  {
    id: 'amazon_clinic',
    name: 'Amazon Clinic',
    desc: 'Affordable, fast care for common conditions. No insurance required.',
    wait: 'Same day',
    cost: '$35 – $75',
    insurance: false,
    url: 'https://amazon.com/clinic',
    icon: '📦',
    features: ['No insurance needed', 'Flat-rate pricing', 'Common conditions only'],
  },
  {
    id: 'cerebral',
    name: 'Cerebral (Mental Health)',
    desc: 'Mental health telehealth for therapy, psychiatry, and medication management.',
    wait: 'Schedule in advance',
    cost: '$30 – $85/session',
    insurance: true,
    url: 'https://cerebral.com',
    icon: '🧠',
    features: ['Therapy & psychiatry', 'Medication management', 'Ongoing care'],
  },
];

export default function TelehealthScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Telehealth Options</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        <View style={styles.infoBanner}>
          <Text style={styles.infoIcon}>📹</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>See a Doctor From Home</Text>
            <Text style={styles.infoDesc}>Video visits are HIPAA-compliant and typically covered by insurance.</Text>
          </View>
        </View>

        {TELEHEALTH_OPTIONS.map((opt) => (
          <View key={opt.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardIcon}>{opt.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardName}>{opt.name}</Text>
                <Text style={styles.cardDesc}>{opt.desc}</Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Wait time</Text>
                <Text style={styles.statValue}>{opt.wait}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Cost</Text>
                <Text style={styles.statValue}>{opt.cost}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Insurance</Text>
                <Text style={[styles.statValue, { color: opt.insurance ? colors.secondary : colors.textSecondary }]}>
                  {opt.insurance ? '✓ Accepted' : 'Out-of-pocket'}
                </Text>
              </View>
            </View>

            <View style={styles.features}>
              {opt.features.map((f, i) => (
                <View key={i} style={styles.featureChip}>
                  <Text style={styles.featureChipText}>{f}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.startBtn}
              onPress={() => Linking.openURL(opt.url)}
              activeOpacity={0.85}
            >
              <Text style={styles.startBtnText}>Start Visit on {opt.name}</Text>
              <Ionicons name="open-outline" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.note}>
          <Ionicons name="information-circle-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.noteText}>
            These services are independent of SymptomPredict. Costs and availability vary by plan and location. SymptomPredict is not affiliated with any telehealth provider.
          </Text>
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
  scroll: { padding: 20, paddingTop: 10 },

  infoBanner: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoIcon: { fontSize: 34 },
  infoTitle: { fontSize: 15, fontWeight: '800', color: colors.primary, marginBottom: 2 },
  infoDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },

  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', gap: 12, padding: 16, paddingBottom: 12 },
  cardIcon: { fontSize: 36 },
  cardName: { fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 4 },
  cardDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 12,
    marginHorizontal: 16,
  },
  stat: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 11, color: colors.textLight, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.3 },
  statValue: { fontSize: 13, fontWeight: '700', color: colors.text },
  statDivider: { width: 1, backgroundColor: colors.border },

  features: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingBottom: 14 },
  featureChip: {
    backgroundColor: colors.inputBg,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  featureChipText: { fontSize: 12, color: colors.textSecondary },

  startBtn: {
    backgroundColor: colors.primary,
    margin: 16,
    marginTop: 0,
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  startBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },

  note: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 12,
    alignItems: 'flex-start',
  },
  noteText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});
