import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const TRIAGE_CONFIG = {
  'self-care': {
    label: 'Self-Care Recommended',
    icon: '🏠',
    color: colors.secondary,
    bgColor: '#ECFDF5',
    desc: 'Your symptoms appear manageable at home. Monitor and rest.',
    gradient: ['#10B981', '#059669'],
  },
  'appointment': {
    label: 'See a Doctor Soon',
    icon: '🏥',
    color: colors.warning,
    bgColor: '#FEF3C7',
    desc: 'Consider scheduling an appointment within 1-2 days.',
    gradient: ['#F59E0B', '#D97706'],
  },
  'er': {
    label: 'Go to ER Now',
    icon: '🚨',
    color: colors.danger,
    bgColor: '#FEE2E2',
    desc: 'These symptoms require immediate medical attention.',
    gradient: ['#EF4444', '#B91C1C'],
  },
};

function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100);
  const color = pct >= 70 ? colors.secondary : pct >= 40 ? colors.warning : colors.textLight;
  return (
    <View style={styles.confRow}>
      <View style={styles.confBarBg}>
        <View style={[styles.confBarFill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.confPct, { color }]}>{pct}%</Text>
    </View>
  );
}

export default function DiagnosisResultScreen({ navigation, route }) {
  const { result, sessionData } = route.params;
  const [expandedIdx, setExpandedIdx] = useState(0);

  const triage = TRIAGE_CONFIG[result.triage] || TRIAGE_CONFIG['self-care'];
  const top = result.diagnoses[0];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Triage header */}
        <LinearGradient colors={triage.gradient} style={styles.triageHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('MainApp')}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>

          <View style={styles.triageContent}>
            <Text style={styles.triageIcon}>{triage.icon}</Text>
            <Text style={styles.triageLabel}>{triage.label}</Text>
            <Text style={styles.triageDesc}>{result.triageMessage}</Text>
          </View>

          {/* Action buttons */}
          <View style={styles.triageActions}>
            {result.triage === 'self-care' && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate('Pharmacy')}
              >
                <Ionicons name="medical" size={18} color={triage.color} />
                <Text style={[styles.actionBtnText, { color: triage.color }]}>Find Pharmacy</Text>
              </TouchableOpacity>
            )}
            {result.triage === 'appointment' && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate('NearbyProviders', { sessionData })}
              >
                <Ionicons name="location" size={18} color={triage.color} />
                <Text style={[styles.actionBtnText, { color: triage.color }]}>Find Doctors Near Me</Text>
              </TouchableOpacity>
            )}
            {result.triage === 'appointment' && (
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate('Telehealth')}
              >
                <Ionicons name="videocam" size={18} color={triage.color} />
                <Text style={[styles.actionBtnText, { color: triage.color }]}>Telehealth Now</Text>
              </TouchableOpacity>
            )}
            {result.triage === 'er' && (
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
                <Ionicons name="call" size={18} color={colors.white} />
                <Text style={[styles.actionBtnText, { color: colors.white }]}>Call 911</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Top diagnosis summary */}
          <View style={styles.topDxCard}>
            <View style={styles.topDxHeader}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankBadgeText}>#1</Text>
              </View>
              <Text style={styles.topDxLabel}>Most Likely Diagnosis</Text>
            </View>
            <Text style={styles.topDxName}>{top.name}</Text>
            <Text style={styles.topDxIcd}>ICD-10: {top.icd10}</Text>
            <ConfidenceBar value={top.confidence} />
            <Text style={styles.topDxNote}>
              AI confidence is informational only — always consult a healthcare provider for an official diagnosis.
            </Text>
          </View>

          {/* All 5 diagnoses */}
          <Text style={styles.sectionTitle}>Top 5 Possible Diagnoses</Text>

          {result.diagnoses.map((dx, i) => (
            <TouchableOpacity
              key={i}
              style={styles.dxCard}
              onPress={() => setExpandedIdx(expandedIdx === i ? -1 : i)}
              activeOpacity={0.85}
            >
              <View style={styles.dxCardHeader}>
                <View style={[styles.dxRank, { backgroundColor: i === 0 ? colors.primary : colors.inputBg }]}>
                  <Text style={[styles.dxRankText, { color: i === 0 ? colors.white : colors.textSecondary }]}>#{i + 1}</Text>
                </View>
                <View style={styles.dxInfo}>
                  <Text style={styles.dxName}>{dx.name}</Text>
                  <ConfidenceBar value={dx.confidence} />
                </View>
                <Ionicons
                  name={expandedIdx === i ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.textLight}
                />
              </View>

              {expandedIdx === i && (
                <View style={styles.dxExpanded}>
                  <View style={styles.dxSection}>
                    <Text style={styles.dxSectionLabel}>✅ Compatible Symptoms</Text>
                    {dx.compatibleSymptoms.map((s, j) => (
                      <Text key={j} style={styles.dxBullet}>• {s}</Text>
                    ))}
                  </View>
                  {dx.unlikelyWith.length > 0 && (
                    <View style={styles.dxSection}>
                      <Text style={styles.dxSectionLabel}>⚠️ Less Consistent With</Text>
                      {dx.unlikelyWith.map((s, j) => (
                        <Text key={j} style={styles.dxBullet}>• {s}</Text>
                      ))}
                    </View>
                  )}
                  <View style={styles.dxSection}>
                    <Text style={styles.dxSectionLabel}>🔬 Recommended Tests</Text>
                    {dx.recommendedTests.map((t, j) => (
                      <Text key={j} style={styles.dxBullet}>• {t}</Text>
                    ))}
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <Ionicons name="information-circle-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.disclaimerText}>
              SymptomPredict is not a substitute for professional medical diagnosis. These results are AI-generated based on your reported symptoms and should be verified by a licensed healthcare provider.
            </Text>
          </View>

          {/* Triage detail */}
          <TouchableOpacity
            style={styles.triageDetailBtn}
            onPress={() => navigation.navigate('Triage', { result, sessionData })}
            activeOpacity={0.85}
          >
            <Text style={styles.triageDetailBtnText}>View Full Care Plan</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.white} />
          </TouchableOpacity>

          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  triageHeader: { padding: 20, paddingTop: 50, paddingBottom: 24 },
  backBtn: { marginBottom: 16 },
  triageContent: { alignItems: 'center', marginBottom: 20 },
  triageIcon: { fontSize: 52, marginBottom: 10 },
  triageLabel: { fontSize: 22, fontWeight: '800', color: colors.white, marginBottom: 6 },
  triageDesc: { fontSize: 14, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 22 },

  triageActions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionBtnText: { fontSize: 13, fontWeight: '700' },

  body: { padding: 20 },

  topDxCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  topDxHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  rankBadge: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rankBadgeText: { fontSize: 12, fontWeight: '800', color: colors.white },
  topDxLabel: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  topDxName: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 4, lineHeight: 24 },
  topDxIcd: { fontSize: 12, color: colors.textLight, marginBottom: 10 },
  topDxNote: { fontSize: 11, color: colors.textLight, lineHeight: 17, marginTop: 10 },

  sectionTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: 14 },

  dxCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  dxCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dxRank: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dxRankText: { fontSize: 13, fontWeight: '800' },
  dxInfo: { flex: 1 },
  dxName: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 6, lineHeight: 20 },

  confRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  confBarBg: { flex: 1, height: 6, backgroundColor: colors.inputBg, borderRadius: 3, overflow: 'hidden' },
  confBarFill: { height: '100%', borderRadius: 3 },
  confPct: { fontSize: 12, fontWeight: '700', width: 36, textAlign: 'right' },

  dxExpanded: { marginTop: 14, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 14, gap: 12 },
  dxSection: {},
  dxSectionLabel: { fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 6 },
  dxBullet: { fontSize: 13, color: colors.textSecondary, marginBottom: 3, lineHeight: 19 },

  disclaimer: {
    flexDirection: 'row',
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginVertical: 20,
    alignItems: 'flex-start',
  },
  disclaimerText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },

  triageDetailBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  triageDetailBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },
});
