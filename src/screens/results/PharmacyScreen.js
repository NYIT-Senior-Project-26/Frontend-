import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

// Mock pharmacies — replace with Google Places API (type=pharmacy)
const MOCK_PHARMACIES = [
  {
    id: '1',
    name: 'Duane Reade',
    address: '250 W 57th St, New York, NY 10107',
    distance: '0.2 mi',
    phone: '+12124567890',
    hours: 'Open 24 hours',
    isOpen: true,
    is24Hr: true,
  },
  {
    id: '2',
    name: 'CVS Pharmacy',
    address: '800 8th Ave, New York, NY 10019',
    distance: '0.4 mi',
    phone: '+12124561111',
    hours: 'Open until 10:00 PM',
    isOpen: true,
    is24Hr: false,
  },
  {
    id: '3',
    name: 'Walgreens',
    address: '1440 Broadway, New York, NY 10018',
    distance: '0.6 mi',
    phone: '+12125552222',
    hours: 'Open until 9:00 PM',
    isOpen: true,
    is24Hr: false,
  },
];

// Common OTC recommendations based on symptoms — normally powered by AI/backend
const OTC_SUGGESTIONS = [
  { name: 'Acetaminophen (Tylenol)', use: 'Fever & pain relief', dose: 'Adults: 325-1000mg every 4-6 hours' },
  { name: 'Ibuprofen (Advil, Motrin)', use: 'Inflammation, fever & pain', dose: 'Adults: 200-400mg every 4-6 hours with food' },
  { name: 'Pseudoephedrine (Sudafed)', use: 'Nasal congestion', dose: 'Adults: 30-60mg every 4-6 hours' },
  { name: 'Diphenhydramine (Benadryl)', use: 'Allergy symptoms, runny nose', dose: 'Adults: 25-50mg every 4-6 hours' },
  { name: 'Dextromethorphan (Robitussin)', use: 'Dry cough suppression', dose: 'Adults: 10-20mg every 4 hours' },
];

export default function PharmacyScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [pharmacies, setPharmacies] = useState([]);

  useEffect(() => {
    // TODO: Replace with Google Places API call filtered by type=pharmacy
    const timer = setTimeout(() => {
      setPharmacies(MOCK_PHARMACIES);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pharmacies & OTC Meds</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            {/* OTC Suggestions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💊 Recommended OTC Medications</Text>
              <Text style={styles.sectionSub}>Based on your symptoms. Ask a pharmacist before purchasing.</Text>
              {OTC_SUGGESTIONS.map((med, i) => (
                <View key={i} style={styles.medCard}>
                  <View style={styles.medHeader}>
                    <Text style={styles.medName}>{med.name}</Text>
                  </View>
                  <Text style={styles.medUse}>{med.use}</Text>
                  <Text style={styles.medDose}>📏 {med.dose}</Text>
                </View>
              ))}
              <View style={styles.warningCard}>
                <Ionicons name="warning-outline" size={16} color="#92400E" />
                <Text style={styles.warningText}>
                  Do not take ibuprofen and acetaminophen together without doctor guidance. Check interactions with your current medications.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle} style={{ paddingHorizontal: 20, fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 12 }}>
              🗺️ Nearby Pharmacies
            </Text>

            {loading && (
              <View style={styles.loadingView}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.loadingText}>Finding pharmacies near you...</Text>
              </View>
            )}
          </>
        )}
        data={loading ? [] : pharmacies}
        keyExtractor={item => item.id}
        renderItem={({ item: p }) => (
          <View style={styles.pharmacyCard}>
            <View style={styles.pharmacyHeader}>
              <Text style={styles.pharmacyIcon}>💊</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.pharmacyName}>{p.name}</Text>
                <Text style={styles.pharmacyAddress}>{p.address}</Text>
                <View style={styles.metaRow}>
                  <Ionicons name="navigate-outline" size={12} color={colors.textLight} />
                  <Text style={styles.metaText}>{p.distance}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Ionicons
                    name="time-outline"
                    size={12}
                    color={p.isOpen ? colors.secondary : colors.danger}
                  />
                  <Text style={[styles.metaText, { color: p.isOpen ? colors.secondary : colors.danger }]}>
                    {p.hours}
                  </Text>
                  {p.is24Hr && (
                    <View style={styles.badge24}>
                      <Text style={styles.badge24Text}>24/7</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={styles.callBtn}
              onPress={() => Linking.openURL(`tel:${p.phone}`)}
            >
              <Ionicons name="call-outline" size={16} color={colors.primary} />
              <Text style={styles.callBtnText}>Call {p.name}</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
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
    marginBottom: 4,
  },
  headerTitle: { fontSize: 17, fontWeight: '800', color: colors.text },

  section: { padding: 20 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginBottom: 6 },
  sectionSub: { fontSize: 13, color: colors.textSecondary, marginBottom: 16, lineHeight: 19 },

  medCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  medHeader: { marginBottom: 4 },
  medName: { fontSize: 14, fontWeight: '800', color: colors.text },
  medUse: { fontSize: 13, color: colors.textSecondary, marginBottom: 4 },
  medDose: { fontSize: 12, color: colors.primary, fontWeight: '600' },

  warningCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    alignItems: 'flex-start',
  },
  warningText: { flex: 1, fontSize: 12, color: '#92400E', lineHeight: 18 },

  loadingView: { padding: 40, alignItems: 'center', gap: 10 },
  loadingText: { fontSize: 14, color: colors.textSecondary },

  pharmacyCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pharmacyHeader: { flexDirection: 'row', padding: 14, gap: 10 },
  pharmacyIcon: { fontSize: 30 },
  pharmacyName: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 2 },
  pharmacyAddress: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  metaText: { fontSize: 12, color: colors.textSecondary },
  metaDot: { color: colors.textLight },
  badge24: {
    backgroundColor: colors.primaryLight,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 4,
  },
  badge24Text: { fontSize: 10, fontWeight: '800', color: colors.primary },

  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: 12,
  },
  callBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary },
});
