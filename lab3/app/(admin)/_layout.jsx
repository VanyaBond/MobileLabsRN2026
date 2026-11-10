import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePortal } from '../../src/context/PortalContext';
import { AdminDrawerContent } from '../../src/components/AdminDrawerContent';
import { PALETTE } from '../../src/theme/palette';

export default function AdminDrawerLayout() {
  const { session } = usePortal();

  if (!session.isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer
      drawerContent={(props) => <AdminDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: PALETTE.bgCard },
        headerTintColor: PALETTE.textPrimary,
        drawerActiveBackgroundColor: '#6366F125',
        drawerActiveTintColor: PALETTE.accentLight,
        drawerInactiveTintColor: PALETTE.textSecondary,
        drawerLabelStyle: { fontSize: 15, fontWeight: '600', marginLeft: -8 },
        sceneStyle: { backgroundColor: PALETTE.bgMain },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Дашборд',
          drawerIcon: ({ color, size }) => <Ionicons name="pie-chart-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="news"
        options={{
          title: 'Стрічка новин',
          drawerIcon: ({ color, size }) => <Ionicons name="newspaper-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="users"
        options={{
          title: 'Користувачі',
          drawerIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="logs"
        options={{
          title: 'Системні логи',
          drawerIcon: ({ color, size }) => <Ionicons name="list-outline" size={size} color={color} />,
        }}
      />
    </Drawer>
  );
}