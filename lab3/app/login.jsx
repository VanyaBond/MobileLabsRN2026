import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePortal } from '../src/context/PortalContext';
import { PALETTE } from '../src/theme/palette';

export default function LoginScreen() {
  const router = useRouter();
  const { session, authenticate } = usePortal();
  const [email, setEmail] = useState('admin@pulsecms.io');
  const [password, setPassword] = useState('admin2026');

  if (session.isAuthenticated) {
    return <Redirect href="/(admin)" />;
  }

  const handleSignIn = () => {
    const success = authenticate(email, password);
    if (success) {
      router.replace('/(admin)');
    } else {
      Alert.alert('Помилка', 'Введіть коректну пошту (@) та пароль від 4 символів.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoBadge}>
          <Ionicons name="shield-checkmark" size={38} color={PALETTE.accent} />
        </View>
        <Text style={styles.title}>PulseCMS Control</Text>
        <Text style={styles.subtitle}>Вхід до порталу новин</Text>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>Службовий Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={PALETTE.textMuted}
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>Пароль адміністратора</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={PALETTE.textMuted}
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSignIn}>
          <Text style={styles.submitBtnText}>Авторизуватися</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bgMain, justifyContent: 'center', padding: 20 },
  card: { backgroundColor: PALETTE.bgCard, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: PALETTE.border },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6366F120',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: '800', color: PALETTE.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 14, color: PALETTE.textSecondary, textAlign: 'center', marginBottom: 24 },
  inputWrap: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: PALETTE.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: PALETTE.bgInput,
    color: PALETTE.textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PALETTE.border,
    fontSize: 15,
  },
  submitBtn: {
    backgroundColor: PALETTE.accent,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    gap: 8,
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});