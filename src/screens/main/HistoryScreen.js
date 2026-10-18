import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const MOCK_HISTORY = [
  {
    id: '1',
    date: 'Oct 5, 2026',
    time: '9:32 AM',
    symptom: 'Fever, headache, body aches',
    topDx: 'Common Cold',
    triage: 'self-care',
    diagnoses: 5,
  },
  {
    id: '2',
    date: 'Sep 28, 2026',
    time: '3:14 PM',
    symptom: 'Lower back pain, stiffness',
    topDx: 'Muscle Strain',
    triage: 'appointment',
    diagnoses: 5,
  },
  {
    id: '3',
    date: 'Sep 10, 2026',
    time: '7:55 PM',
    symptom: 'Upset stomach, nausea',
    topDx: 'Gastroenteritis',
    triage: 'self-care',
    diagnoses: 5,
  },
];

const TRIAGE_COLORS = {
  'self-care': { bg: '#ECFDF5', text: '#065F46', label: 'Self-care' },
  'appointment': { bg: '#FEF3C7', text: '#92400E', label: 'See Doctor' },
  'er': { bg: '#FEE2E2', text: '#991B1B', label: 'Emergency' },
};

export default function HistoryScreen({ navigation }) {
  const [history] = useState(MOCK_HISTORY);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Check History</Text>
        <Text style={styles.subtitle}>{history.length} previous checks</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔬</Text>
          <Text style={styles.emptyTitle}>No history yet</Text>
          <Text style={styles.emptyDesc}>Start a symptom check and your results will appear here.</Text>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => navigation.navigate('Check')}
          >
            <Text style={styles.startBtnText}>Check Symptoms</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const t = TRIAGE_COLORS[item.triage];
            return (
              <TouchableOpacity style={styles.card} activeOpacity={0.85}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.date}>{item.date} · {item.time}</Text>
                  </View>
                  <View style={[styles.triageBadge, { backgroundColor: t.bg }]}>
                    <Text style={[styles.triageText, { color: t.text }]}>{t.label}</Text>
                  </View>
                </View>

                <Text style={styles.symptom}>{item.symptom}</Text>

                <View style={styles.cardFooter}>
                  <View style={styles.topDxRow}>
                    <View style={styles.dxNumBadge}>
                      <Text style={styles.dxNumText}>#1</Text>
                    </View>
                    <Text style={styles.topDxText}>{item.topDx}</Text>
                  </View>
                  <Text style={styles.viewDetail}>View →</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, paddingTop: 50, marginBottom: 4 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 14, color: colors.textSecondary },

  list: { padding: 20, paddingTop: 8, gap: 12 },

  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  date: { fontSize: 12, color: colors.textLight },
  triageBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  triageText: { fontSize: 12, fontWeight: '700' },

  symptom: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 12, lineHeight: 22 },

  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topDxRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dxNumBadge: { backgroundColor: colors.primaryLight, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  dxNumText: { fontSize: 11, fontWeight: '800', color: colors.primary },
  topDxText: { fontSize: 14, color: colors.textSecondary },
  viewDetail: { fontSize: 13, color: colors.primary, fontWeight: '700' },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  startBtnText: { color: colors.white, fontSize: 15, fontWeight: '700' },
});
