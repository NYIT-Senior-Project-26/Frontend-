import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';

const { width, height } = Dimensions.get('window');

const features = [
  { icon: '🔬', title: 'AI Diagnosis', desc: 'Advanced models analyze your symptoms' },
  { icon: '🏥', title: 'Find Care', desc: 'Locate nearby doctors and hospitals' },
  { icon: '💊', title: 'Drug Safety', desc: 'Check medications and interactions' },
  { icon: '🔒', title: 'HIPAA Secure', desc: 'Your data is encrypted and private' },
];

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.header}>
        <View style={styles.headerIconCircle}>
          <Text style={styles.headerIcon}>🩺</Text>
        </View>
        <Text style={styles.headerTitle}>SymptomPredict</Text>
        <Text style={styles.headerSubtitle}>Your AI health companion</Text>
      </LinearGradient>

      <Animated.View style={[styles.body, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.sectionTitle}>What we offer</Text>

        <View style={styles.featuresGrid}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureCard}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerIcon}>⚠️</Text>
          <Text style={styles.disclaimerText}>
            Not a replacement for professional medical advice. Always consult a doctor for serious concerns.
          </Text>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.btnPrimary}
          onPress={() => navigation.navigate('Auth', { mode: 'signup' })}
          activeOpacity={0.85}
        >
          <Text style={styles.btnPrimaryText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnSecondary}
          onPress={() => navigation.navigate('Auth', { mode: 'login' })}
          activeOpacity={0.85}
        >
          <Text style={styles.btnSecondaryText}>I already have an account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  headerIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerIcon: { fontSize: 40 },
  headerTitle: { fontSize: 28, fontWeight: '800', color: colors.white, marginBottom: 4 },
  headerSubtitle: { fontSize: 15, color: 'rgba(255,255,255,0.8)' },

  body: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: (width - 52) / 2,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: { fontSize: 28, marginBottom: 8 },
  featureTitle: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 4 },
  featureDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 16 },

  disclaimer: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    gap: 8,
  },
  disclaimerIcon: { fontSize: 16 },
  disclaimerText: { flex: 1, fontSize: 12, color: '#92400E', lineHeight: 18 },

  footer: { padding: 20, gap: 12 },
  btnPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnPrimaryText: { color: colors.white, fontSize: 16, fontWeight: '700' },
  btnSecondary: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  btnSecondaryText: { color: colors.textSecondary, fontSize: 15, fontWeight: '600' },
});
