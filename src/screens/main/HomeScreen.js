import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

const quickSymptoms = [
  '🤒 Fever', '🤧 Cold & Flu', '😮‍💨 Shortness of Breath',
  '💢 Headache', '🤢 Nausea', '🦷 Chest Pain',
];

const recentChecks = [
  { date: 'Oct 5, 2026', symptom: 'Fever, headache', top: 'Common Cold', triage: 'self-care' },
  { date: 'Sep 28, 2026', symptom: 'Back pain', top: 'Muscle Strain', triage: 'appointment' },
];

const triageColor = (level) => {
  if (level === 'self-care') return { bg: '#ECFDF5', text: '#065F46', label: 'Self-care' };
  if (level === 'appointment') return { bg: '#FEF3C7', text: '#92400E', label: 'See a Doctor' };
  return { bg: '#FEE2E2', text: '#991B1B', label: 'Emergency' };
};

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good morning 👋</Text>
              <Text style={styles.name}>How are you feeling?</Text>
            </View>
            <TouchableOpacity style={styles.avatarBtn}>
              <Ionicons name="person-circle" size={40} color="rgba(255,255,255,0.85)" />
            </TouchableOpacity>
          </View>

          {/* Check symptoms card */}
          <TouchableOpacity
            style={styles.checkCard}
            onPress={() => navigation.navigate('Check')}
            activeOpacity={0.9}
          >
            <View style={styles.checkCardLeft}>
              <Text style={styles.checkCardTitle}>Check Your Symptoms</Text>
              <Text style={styles.checkCardSub}>AI-powered diagnosis in minutes</Text>
            </View>
            <View style={styles.checkCardIcon}>
              <Text style={{ fontSize: 28 }}>🔬</Text>
            </View>
          </TouchableOpacity>
        </LinearGradient>

        <View style={styles.body}>

          {/* Quick symptoms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Check</Text>
            <Text style={styles.sectionSub}>Tap a common symptom to get started fast</Text>
            <View style={styles.symptomsGrid}>
              {quickSymptoms.map((s, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.symptomChip}
                  onPress={() => navigation.navigate('Check', { prefill: s.split(' ').slice(1).join(' ') })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.symptomChipText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 3-step explainer */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <View style={styles.stepsRow}>
              {[
                { num: '1', icon: '✍️', label: 'Describe\nSymptoms' },
                { num: '2', icon: '🤖', label: 'AI Analyzes\nPatterns' },
                { num: '3', icon: '📋', label: 'Get Ranked\nDiagnoses' },
              ].map((step, i) => (
                <View key={i} style={styles.stepCard}>
                  <View style={styles.stepNum}>
                    <Text style={styles.stepNumText}>{step.num}</Text>
                  </View>
                  <Text style={styles.stepIcon}>{step.icon}</Text>
                  <Text style={styles.stepLabel}>{step.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent checks */}
          {recentChecks.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Recent Checks</Text>
                <TouchableOpacity onPress={() => navigation.navigate('History')}>
                  <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
              </View>
              {recentChecks.map((c, i) => {
                const t = triageColor(c.triage);
                return (
                  <TouchableOpacity key={i} style={styles.recentCard} activeOpacity={0.85}>
                    <View style={styles.recentLeft}>
                      <Text style={styles.recentDate}>{c.date}</Text>
                      <Text style={styles.recentSymptom}>{c.symptom}</Text>
                      <Text style={styles.recentTop}>Top: {c.top}</Text>
                    </View>
                    <View style={[styles.triageBadge, { backgroundColor: t.bg }]}>
                      <Text style={[styles.triageText, { color: t.text }]}>{t.label}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Emergency banner */}
          <TouchableOpacity style={styles.emergencyBanner} activeOpacity={0.9}>
            <Ionicons name="call" size={22} color={colors.white} />
            <View style={{ flex: 1 }}>
              <Text style={styles.emergencyTitle}>Emergency? Call 911</Text>
              <Text style={styles.emergencySub}>For chest pain, difficulty breathing, or severe symptoms</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: { padding: 20, paddingTop: 50, paddingBottom: 30 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 2 },
  name: { fontSize: 22, fontWeight: '800', color: colors.white },
  avatarBtn: {},

  checkCard: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  checkCardLeft: { flex: 1 },
  checkCardTitle: { fontSize: 17, fontWeight: '800', color: colors.white, marginBottom: 4 },
  checkCardSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  checkCardIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: { padding: 20 },
  section: { marginBottom: 28 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 4 },
  sectionSub: { fontSize: 13, color: colors.textSecondary, marginBottom: 12 },
  seeAll: { fontSize: 14, color: colors.primary, fontWeight: '600' },

  symptomsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  symptomChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  symptomChipText: { fontSize: 13, color: colors.text, fontWeight: '500' },

  stepsRow: { flexDirection: 'row', gap: 10 },
  stepCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  stepNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepNumText: { fontSize: 12, fontWeight: '800', color: colors.primary },
  stepIcon: { fontSize: 24, marginBottom: 6 },
  stepLabel: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', lineHeight: 17 },

  recentCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  recentLeft: { flex: 1 },
  recentDate: { fontSize: 11, color: colors.textLight, marginBottom: 2 },
  recentSymptom: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 2 },
  recentTop: { fontSize: 12, color: colors.textSecondary },
  triageBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  triageText: { fontSize: 12, fontWeight: '700' },

  emergencyBanner: {
    backgroundColor: colors.danger,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emergencyTitle: { fontSize: 15, fontWeight: '800', color: colors.white },
  emergencySub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
});
