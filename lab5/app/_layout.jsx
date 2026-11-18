import { Tabs } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Пам’ять',
            tabBarIcon: ({ color, size }) => <Ionicons name="hardware-chip-outline" color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="files"
          options={{
            title: 'Файли',
            tabBarIcon: ({ color, size }) => <Ionicons name="folder-open-outline" color={color} size={size} />,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}