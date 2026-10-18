import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const InputField = ({ label, field, placeholder, secure, keyboardType = 'default', icon, value, onChangeText, error, showPassword, onTogglePassword }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrapper, error && styles.inputError]}>
      <Ionicons name={icon} size={18} color={colors.textLight} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textLight}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure && !showPassword}
        keyboardType={keyboardType}
        autoCapitalize={field === 'email' ? 'none' : 'words'}
        autoCorrect={false}
        blurOnSubmit={false}
      />
      {secure && (
        <TouchableOpacity onPress={onTogglePassword}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color={colors.textLight}
          />
        </TouchableOpacity>
      )}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export default function AuthScreen({ navigation, route }) {
  const initialMode = route?.params?.mode || 'signup';
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (mode === 'signup' && !form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (mode === 'signup' && form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      navigation.navigate('MFA', { email: form.email });
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    Alert.alert('Coming Soon', 'Google sign-in will be available soon.');
  };

  const updateField = (field) => (val) => {
    setForm(prev => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.titleSection}>
          <Text style={styles.title}>{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</Text>
          <Text style={styles.subtitle}>
            {mode === 'signup'
              ? 'Sign up to get personalized health insights'
              : 'Sign in to continue to SymptomPredict'}
          </Text>
        </View>

        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, mode === 'signup' && styles.tabActive]}
            onPress={() => { setMode('signup'); setErrors({}); }}
          >
            <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'login' && styles.tabActive]}
            onPress={() => { setMode('login'); setErrors({}); }}
          >
            <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>Log In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          {mode === 'signup' && (
            <InputField
              label="Full Name"
              field="name"
              placeholder="Your full name"
              icon="person-outline"
              value={form.name}
              onChangeText={updateField('name')}
              error={errors.name}
            />
          )}
          <InputField
            label="Email"
            field="email"
            placeholder="your@email.com"
            icon="mail-outline"
            keyboardType="email-address"
            value={form.email}
            onChangeText={updateField('email')}
            error={errors.email}
          />
          <InputField
            label="Password"
            field="password"
            placeholder="At least 8 characters"
            icon="lock-closed-outline"
            secure
            value={form.password}
            onChangeText={updateField('password')}
            error={errors.password}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />
          {mode === 'signup' && (
            <InputField
              label="Confirm Password"
              field="confirmPassword"
              placeholder="Repeat your password"
              icon="lock-closed-outline"
              secure
              value={form.confirmPassword}
              onChangeText={updateField('confirmPassword')}
              error={errors.confirmPassword}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />
          )}

          {mode === 'login' && (
            <TouchableOpacity style={styles.forgotLink}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={colors.white} />
              : <Text style={styles.submitBtnText}>{mode === 'signup' ? 'Create Account' : 'Sign In'}</Text>
            }
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogleAuth} activeOpacity={0.85}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            By continuing you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, padding: 20 },
  backBtn: { marginTop: 10, marginBottom: 24, width: 40 },

  titleSection: { marginBottom: 28 },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 6 },
  subtitle: { fontSize: 15, color: colors.textSecondary, lineHeight: 22 },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.inputBg,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  tabTextActive: { color: colors.primary },

  form: { gap: 4 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: 'transparent',
    height: 52,
  },
  inputError: { borderColor: colors.danger },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: colors.text },
  errorText: { marginTop: 4, fontSize: 12, color: colors.danger },

  forgotLink: { alignSelf: 'flex-end', marginBottom: 4 },
  forgotText: { fontSize: 13, color: colors.primary, fontWeight: '600' },

  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { color: colors.white, fontSize: 16, fontWeight: '700' },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontSize: 13, color: colors.textLight },

  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 10,
    backgroundColor: colors.white,
  },
  googleIcon: { fontSize: 18, fontWeight: '800', color: '#4285F4' },
  googleText: { fontSize: 15, fontWeight: '600', color: colors.text },

  termsSection: { marginTop: 24, paddingBottom: 20, alignItems: 'center' },
  termsText: { fontSize: 12, color: colors.textSecondary, textAlign: 'center', lineHeight: 18 },
  termsLink: { color: colors.primary, fontWeight: '600' },
});
