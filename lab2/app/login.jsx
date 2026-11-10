import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Redirect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '../src/auth/SessionContext';
import { palette, spacing } from '../src/theme';

export default function LoginScreen() {
  const { isAuthenticated, login } = useSession();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');
  const [problem, setProblem] = useState('');

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  const submit = () => {
    if (!email.includes('@') || secret.length < 4) {
      setProblem('Вкажіть коректну пошту та пароль від 4 символів');
      return;
    }
    setProblem('');
    login(email.trim());
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.panel}>
          <Text style={styles.brand}>Lab2 Hub</Text>
          <Text style={styles.caption}>Увійдіть, щоб переглянути стрічку</Text>

          <TextInput
            style={styles.field}
            placeholder="Електронна пошта"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.field}
            placeholder="Пароль"
            secureTextEntry
            value={secret}
            onChangeText={setSecret}
            onSubmitEditing={submit}
          />

          {problem ? <Text style={styles.problem}>{problem}</Text> : null}

          <Pressable
            onPress={submit}
            style={({ pressed }) => [styles.cta, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.ctaLabel}>Увійти</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.primaryDark, justifyContent: 'center' },
  panel: {
    marginHorizontal: spacing.xl,
    padding: spacing.xl,
    borderRadius: 20,
    backgroundColor: palette.surface,
  },
  brand: { fontSize: 28, fontWeight: '800', color: palette.primary, textAlign: 'center' },
  caption: { textAlign: 'center', color: palette.textMuted, marginBottom: spacing.xl, marginTop: spacing.xs },
  field: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.md,
    backgroundColor: palette.background,
  },
  problem: { color: palette.danger, marginBottom: spacing.md },
  cta: { backgroundColor: palette.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  ctaLabel: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
