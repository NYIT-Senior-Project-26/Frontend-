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

// Mock data — replace with Google Places API call
const MOCK_PROVIDERS = [
  {
    id: '1',
    name: 'Manhattan Medical Associates',
    specialty: 'Internal Medicine',
    address: '123 W 57th St, New York, NY 10019',
    distance: '0.3 mi',
    rating: 4.7,
    reviews: 284,
    phone: '+12124561234',
    hours: 'Open until 6:00 PM',
    isOpen: true,
    acceptsInsurance: ['Aetna', 'Cigna', 'Blue Cross Blue Shield'],
    bookingUrl: 'https://zocdoc.com',
    type: 'doctor',
  },
  {
    id: '2',
    name: 'CityMD Urgent Care - Midtown',
    specialty: 'Urgent Care',
    address: '55 W 39th St, New York, NY 10018',
    distance: '0.6 mi',
    rating: 4.4,
    reviews: 1102,
    phone: '+12125551234',
    hours: 'Open 24 hours',
    isOpen: true,
    acceptsInsurance: ['Most plans accepted'],
    bookingUrl: null,
    type: 'urgent_care',
  },
  {
    id: '3',
    name: 'Mount Sinai Urgent Care',
    specialty: 'Urgent Care / ER',
    address: '1000 10th Ave, New York, NY 10019',
    distance: '1.1 mi',
    rating: 4.6,
    reviews: 783,
    phone: '+12128888000',
    hours: 'Open until 10:00 PM',
    isOpen: true,
    acceptsInsurance: ['Medicare', 'Medicaid', 'Most plans'],
    bookingUrl: 'https://mountsinai.org',
    type: 'hospital',
  },
  {
    id: '4',
    name: 'Dr. Sarah Chen, MD',
    specialty: 'Family Medicine',
    address: '250 W 57th St Suite 1414, New York, NY 10107',
    distance: '0.5 mi',
    rating: 4.9,
    reviews: 167,
    phone: '+12124444321',
    hours: 'Open until 5:00 PM',
    isOpen: true,
    acceptsInsurance: ['Aetna', 'United Healthcare', 'Oscar'],
    bookingUrl: 'https://zocdoc.com',
    type: 'doctor',
  },
];

const TYPE_ICONS = {
  doctor: '👨‍⚕️',
  urgent_care: '🏥',
  hospital: '🏨',
  pharmacy: '💊',
};

function StarRating({ rating }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
      <Ionicons name="star" size={12} color="#F59E0B" />
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
}

export default function NearbyProvidersScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // TODO: Replace with real Google Places API call using user's location
    // const fetchNearby = async () => { ... }
    const timer = setTimeout(() => {
      setProviders(MOCK_PROVIDERS);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filtered = filter === 'all' ? providers : providers.filter(p => p.type === filter);

  const renderProvider = ({ item: p }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.typeIcon}>{TYPE_ICONS[p.type] || '🏥'}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.providerName}>{p.name}</Text>
          <Text style={styles.specialty}>{p.specialty}</Text>
          <View style={styles.metaRow}>
            <StarRating rating={p.rating} />
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{p.reviews} reviews</Text>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>{p.distance}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color={colors.textLight} />
          <Text style={styles.infoText}>{p.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color={p.isOpen ? colors.secondary : colors.danger} />
          <Text style={[styles.infoText, { color: p.isOpen ? colors.secondary : colors.danger, fontWeight: '600' }]}>
            {p.hours}
          </Text>
        </View>
        <View style={styles.insuranceRow}>
          {p.acceptsInsurance.slice(0, 2).map((ins, i) => (
            <View key={i} style={styles.insChip}>
              <Text style={styles.insChipText}>{ins}</Text>
            </View>
          ))}
          {p.acceptsInsurance.length > 2 && (
            <Text style={styles.insMore}>+{p.acceptsInsurance.length - 2} more</Text>
          )}
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.callBtn}
          onPress={() => Linking.openURL(`tel:${p.phone}`)}
        >
          <Ionicons name="call-outline" size={16} color={colors.primary} />
          <Text style={styles.callBtnText}>Call</Text>
        </TouchableOpacity>
        {p.bookingUrl ? (
          <TouchableOpacity
            style={styles.bookBtn}
            onPress={() => Linking.openURL(p.bookingUrl)}
          >
            <Text style={styles.bookBtnText}>Book Appointment</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.bookBtn}>
            <Text style={styles.bookBtnText}>Walk-ins Welcome</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nearby Providers</Text>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {[['all', 'All'], ['doctor', 'Doctors'], ['urgent_care', 'Urgent Care'], ['hospital', 'Hospitals']].map(([val, label]) => (
          <TouchableOpacity
            key={val}
            style={[styles.filterTab, filter === val && styles.filterTabActive]}
            onPress={() => setFilter(val)}
          >
            <Text style={[styles.filterTabText, filter === val && styles.filterTabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Finding providers near you...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderProvider}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
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

  filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 14 },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: colors.inputBg,
  },
  filterTabActive: { backgroundColor: colors.primary },
  filterTabText: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  filterTabTextActive: { color: colors.white, fontWeight: '700' },

  loadingView: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: colors.textSecondary },

  list: { padding: 20, paddingTop: 0, gap: 14 },

  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', padding: 16, gap: 12 },
  typeIcon: { fontSize: 36, width: 44 },
  cardInfo: { flex: 1 },
  providerName: { fontSize: 15, fontWeight: '800', color: colors.text, marginBottom: 2 },
  specialty: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, fontWeight: '700', color: colors.text },
  metaDot: { color: colors.textLight },
  metaText: { fontSize: 12, color: colors.textSecondary },

  cardBody: { paddingHorizontal: 16, paddingBottom: 12, gap: 6 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  infoText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  insuranceRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  insChip: {
    backgroundColor: colors.primaryLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  insChipText: { fontSize: 11, color: colors.primary, fontWeight: '600' },
  insMore: { fontSize: 11, color: colors.textLight, alignSelf: 'center' },

  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 12,
    gap: 10,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  callBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  bookBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bookBtnText: { fontSize: 14, fontWeight: '700', color: colors.white },
});
