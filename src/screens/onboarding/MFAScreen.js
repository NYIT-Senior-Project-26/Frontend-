import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const CODE_LENGTH = 6;

export default function MFAScreen({ navigation, route }) {
  const email = route?.params?.email || 'your email';
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (val, index) => {
    if (val.length > 1) {
      // Handle paste
      const digits = val.replace(/\D/g, '').slice(0, CODE_LENGTH);
      const newCode = [...code];
      digits.split('').forEach((d, i) => {
        if (index + i < CODE_LENGTH) newCode[index + i] = d;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, CODE_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }
    const newCode = [...code];
    newCode[index] = val;
    setCode(newCode);
    if (val && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent: { key } }, index) => {
    if (key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    if (fullCode.length < CODE_LENGTH) {
      Alert.alert('Incomplete Code', 'Please enter the 6-digit code.');
      return;
    }
    Keyboard.dismiss();
    setLoading(true);
    try {
      // TODO: Replace with real Supabase MFA verification
      await new Promise(resolve => setTimeout(resolve, 1200));
      navigation.navigate('PrivacyConsent');
    } catch (err) {
      Alert.alert('Invalid Code', 'The code you entered is incorrect. Please try again.');
      setCode(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setCanResend(false);
    setResendTimer(30);
    setCode(Array(CODE_LENGTH).fill(''));
    inputRefs.current[0]?.focus();
    // TODO: Re-trigger auth code send
    Alert.alert('Code Sent', 'A new verification code has been sent.');
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) { setCanResend(true); clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const isComplete = code.every(d => d !== '');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="shield-checkmark" size={40} color={colors.primary} />
        </View>

        <Text style={styles.title}>Verify Your Identity</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        {/* OTP Input boxes */}
        <View style={styles.codeRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={ref => (inputRefs.current[i] = ref)}
              style={[
                styles.codeBox,
                digit && styles.codeBoxFilled,
                i === code.findIndex(d => d === '') && styles.codeBoxActive,
              ]}
              value={digit}
              onChangeText={val => handleChange(val, i)}
              onKeyPress={e => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={6}
              textAlign="center"
              caretHidden
              autoFocus={i === 0}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.verifyBtn, (!isComplete || loading) && styles.verifyBtnDisabled]}
          onPress={handleVerify}
          disabled={!isComplete || loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color={colors.white} />
            : <Text style={styles.verifyBtnText}>Verify Code</Text>
          }
        </TouchableOpacity>

        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't get it? </Text>
          {canResend ? (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendLink}>Resend code</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.resendTimer}>Resend in {resendTimer}s</Text>
          )}
        </View>

        <View style={styles.securityNote}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.textLight} />
          <Text style={styles.securityText}>
            This step is required to protect your health data (HIPAA compliant)
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20 },
  backBtn: { marginTop: 10, marginBottom: 20 },
  content: { alignItems: 'center', flex: 1 },

  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 24, marginBottom: 36 },
  email: { fontWeight: '700', color: colors.primary },

  codeRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  codeBox: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.white,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  codeBoxFilled: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  codeBoxActive: { borderColor: colors.primary },

  verifyBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  verifyBtnDisabled: { opacity: 0.5 },
  verifyBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },

  resendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  resendLabel: { fontSize: 14, color: colors.textSecondary },
  resendLink: { fontSize: 14, color: colors.primary, fontWeight: '700' },
  resendTimer: { fontSize: 14, color: colors.textLight },

  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    width: '100%',
  },
  securityText: { flex: 1, fontSize: 12, color: colors.textSecondary, lineHeight: 18 },
});
