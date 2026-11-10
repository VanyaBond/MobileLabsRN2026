import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSession } from '../../src/auth/SessionContext';
import { palette, spacing } from '../../src/theme';

function SideMenu(props) {
  const { userEmail, logout } = useSession();
  const insets = useSafeAreaInsets();
  const activeRoute = props.state.routeNames[props.state.index];

  return (
    <View style={styles.menu}>
      <ScrollView
        contentContainerStyle={{ paddingTop: 0 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={[styles.profile, { paddingTop: insets.top + spacing.lg }]}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={34} color={palette.primary} />
          </View>
          <Text style={styles.email} numberOfLines={1}>{userEmail}</Text>
        </View>

        {/* list btn */}
        <Pressable
          onPress={() => props.navigation.navigate('(news)')}
          style={[
            styles.navItem,
            activeRoute === '(news)' && styles.navItemActive,
          ]}
        >
          <Ionicons
            name="newspaper-outline"
            size={22}
            color={activeRoute === '(news)' ? palette.primary : palette.textMain}
          />
          <Text
            style={[
              styles.navLabel,
              activeRoute === '(news)' && styles.navLabelActive,
            ]}
          >
            Стрічка
          </Text>
        </Pressable>

        {/* faq*/}
        <Pressable
          onPress={() => props.navigation.navigate('faq')}
          style={[
            styles.navItem,
            activeRoute === 'faq' && styles.navItemActive,
          ]}
        >
          <Ionicons
            name="help-circle-outline"
            size={22}
            color={activeRoute === 'faq' ? palette.primary : palette.textMain}
          />
          <Text
            style={[
              styles.navLabel,
              activeRoute === 'faq' && styles.navLabelActive,
            ]}
          >
            Довідковий центр
          </Text>
        </Pressable>
      </ScrollView>

      {/* Logout  */}
      <Pressable
        onPress={logout}
        style={[styles.exit, { paddingBottom: insets.bottom + spacing.lg }]}
      >
        <Ionicons name="log-out-outline" size={22} color={palette.danger} />
        <Text style={styles.exitLabel}>Вийти</Text>
      </Pressable>
    </View>
  );
}

export default function DrawerGroupLayout() {
  const { isAuthenticated } = useSession();

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer
      drawerContent={(props) => <SideMenu {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: palette.primary },
        headerTintColor: '#fff',
      }}
    >
      <Drawer.Screen
        name="(news)"
        options={{
          title: 'Стрічка',
        }}
      />
      <Drawer.Screen
        name="faq"
        options={{
          title: 'Довідковий центр',
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  menu: { flex: 1, backgroundColor: palette.surface },
  profile: {
    backgroundColor: '#D7ECE9',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  email: { fontWeight: '700', color: palette.textMain },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.sm,
    borderRadius: 10,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: '#D7ECE9',
  },
  navLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.textMain,
  },
  navLabelActive: {
    color: palette.primary,
    fontWeight: '700',
  },
  exit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: palette.border,
  },
  exitLabel: { color: palette.danger, fontWeight: '700', fontSize: 16 },
});