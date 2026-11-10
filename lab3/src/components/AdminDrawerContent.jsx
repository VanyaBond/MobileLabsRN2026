import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePortal } from '../context/PortalContext';
import { PALETTE } from '../theme/palette';

const MENU_ITEMS = [
  { name: 'index', label: 'Дашборд', icon: 'pie-chart-outline', iconActive: 'pie-chart' },
  { name: 'news', label: 'Стрічка новин', icon: 'newspaper-outline', iconActive: 'newspaper' },
  { name: 'users', label: 'Користувачі', icon: 'people-outline', iconActive: 'people' },
  { name: 'logs', label: 'Системні логи', icon: 'list-outline', iconActive: 'list' },
];

export const AdminDrawerContent = (props) => {
  const insets = useSafeAreaInsets();
  const { session, terminateSession } = usePortal();

  const activeRouteName = props.state.routeNames[props.state.index];

  return (
    <View style={styles.container}>
      <View style={[styles.profileHeader, { paddingTop: insets.top + 16 }]}>
        <Image source={{ uri: session.admin.avatar }} style={styles.avatar} />
        <View style={styles.profileDetails}>
          <Text style={styles.adminBadge}>ГОЛОВНИЙ АДМІНІСТРАТОР</Text>
          <Text style={styles.adminName} numberOfLines={1}>{session.admin.name}</Text>
          <Text style={styles.adminEmail} numberOfLines={1}>{session.admin.email}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {MENU_ITEMS.map((item) => {
          const isFocused = activeRouteName === item.name;

          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.navItem, isFocused && styles.navItemActive]}
              activeOpacity={0.7}
              onPress={() => props.navigation.navigate(item.name)}
            >
              <Ionicons
                name={isFocused ? item.iconActive : item.icon}
                size={22}
                color={isFocused ? PALETTE.accentLight : PALETTE.textSecondary}
              />
              <Text style={[styles.navLabel, isFocused && styles.navLabelActive]}>
                {item.label}
              </Text>
              {isFocused && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.logoutBtn} onPress={terminateSession} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={22} color={PALETTE.danger} />
          <Text style={styles.logoutText}>Вийти з системи</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bgMain },
  profileHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PALETTE.bgCard,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: PALETTE.accent },
  profileDetails: { marginLeft: 14, flex: 1 },
  adminBadge: { fontSize: 10, color: PALETTE.accentLight, fontWeight: '800', letterSpacing: 0.5 },
  adminName: { fontSize: 16, fontWeight: '700', color: PALETTE.textPrimary, marginTop: 2 },
  adminEmail: { fontSize: 12, color: PALETTE.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: PALETTE.border },
  scrollContent: { paddingVertical: 12, paddingHorizontal: 10, gap: 6 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: '#6366F120',
  },
  navLabel: {
    marginLeft: 14,
    fontSize: 15,
    fontWeight: '600',
    color: PALETTE.textSecondary,
  },
  navLabelActive: {
    color: PALETTE.accentLight,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    width: 4,
    height: 24,
    backgroundColor: PALETTE.accent,
    borderRadius: 2,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: PALETTE.border,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: PALETTE.bgMain,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#7F1D1D25',
  },
  logoutText: { marginLeft: 12, fontSize: 15, fontWeight: '600', color: PALETTE.danger },
});