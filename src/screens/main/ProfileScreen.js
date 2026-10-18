import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const MENU_ITEMS = [
  { section: 'Health Profile', items: [
    { icon: 'person-outline', label: 'Personal Information', sub: 'Name, age, sex', nav: 'ProfileSetup' },
    { icon: 'medical-outline', label: 'Medications & Allergies', sub: 'Manage your medications', nav: null },
    { icon: 'shield-checkmark-outline', label: 'Insurance Plan', sub: 'Aetna (on file)', nav: null },
  ]},
  { section: 'App Settings', items: [
    { icon: 'notifications-outline', label: 'Notifications', sub: 'Follow-ups, reminders', nav: null },
    { icon: 'language-outline', label: 'Language', sub: 'English', nav: null },
    { icon: 'moon-outline', label: 'Appearance', sub: 'Light mode', nav: null },
  ]},
  { section: 'Privacy & Security', items: [
    { icon: 'lock-closed-outline', label: 'Security Settings', sub: 'MFA, auto log-off', nav: null },
    { icon: 'document-text-outline', label: 'Privacy Policy', sub: 'HIPAA & data usage', nav: null },
    { icon: 'trash-outline', label: 'Delete Account', sub: 'Remove all your data', danger: true, nav: null },
  ]},
];

export default function ProfileScreen({ navigation }) {
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => navigation.replace('Welcome') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Profile header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MH</Text>
          </View>
          <View>
            <Text style={styles.name}>Muaz Hussain</Text>
            <Text style={styles.email}>user@email.com</Text>
            <View style={styles.hipaaTag}>
              <Ionicons name="shield-checkmark" size={12} color={colors.secondary} />
              <Text style={styles.hipaaTagText}>HIPAA Protected Account</Text>
            </View>
          </View>
        </View>

        {/* Health summary cards */}
        <View style={styles.healthRow}>
          {[
            { icon: '🧬', label: 'Sex', value: 'Male' },
            { icon: '🎂', label: 'Age', value: '21' },
            { icon: '🩸', label: 'Blood Pressure', value: 'Normal' },
            { icon: '🚬', label: 'Smoking', value: 'Never' },
          ].map((item, i) => (
            <View key={i} style={styles.healthCard}>
              <Text style={styles.healthIcon}>{item.icon}</Text>
              <Text style={styles.healthValue}>{item.value}</Text>
              <Text style={styles.healthLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Checks summary */}
        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>3</Text>
            <Text style={styles.statLabel}>Total Checks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>2</Text>
            <Text style={styles.statLabel}>Self-Care</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>1</Text>
            <Text style={styles.statLabel}>Doctor Visit</Text>
          </View>
        </View>

        {/* Menu */}
        {MENU_ITEMS.map((section, si) => (
          <View key={si} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.section}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[styles.menuItem, ii < section.items.length - 1 && styles.menuItemBorder]}
                  onPress={() => item.nav ? navigation.navigate(item.nav) : null}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconBox, item.danger && styles.menuIconBoxDanger]}>
                    <Ionicons
                      name={item.icon}
                      size={18}
                      color={item.danger ? colors.danger : colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.menuLabel, item.danger && { color: colors.danger }]}>{item.label}</Text>
                    <Text style={styles.menuSub}>{item.sub}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>SymptomPredict v1.0.0 · NYIT Senior Project 2026</Text>

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
    gap: 16,
    padding: 20,
    paddingTop: 50,
    marginBottom: 4,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '800', color: colors.white },
  name: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: 2 },
  email: { fontSize: 14, color: colors.textSecondary, marginBottom: 6 },
  hipaaTag: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  hipaaTagText: { fontSize: 12, color: colors.secondary, fontWeight: '600' },

  healthRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  healthCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  healthIcon: { fontSize: 20, marginBottom: 4 },
  healthValue: { fontSize: 12, fontWeight: '800', color: colors.text, marginBottom: 2, textAlign: 'center' },
  healthLabel: { fontSize: 10, color: colors.textLight, textAlign: 'center' },

  statRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1,
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  statNum: { fontSize: 24, fontWeight: '800', color: colors.primary, marginBottom: 2 },
  statLabel: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },

  menuSection: { paddingHorizontal: 20, marginBottom: 16 },
  menuSectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconBoxDanger: { backgroundColor: '#FEE2E2' },
  menuLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 1 },
  menuSub: { fontSize: 12, color: colors.textSecondary },

  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  signOutText: { fontSize: 15, fontWeight: '700', color: colors.danger },

  version: { textAlign: 'center', fontSize: 12, color: colors.textLight, marginBottom: 10 },
});
