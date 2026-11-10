import React from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PortalProvider } from '../src/context/PortalContext';
import { PALETTE } from '../src/theme/palette';

export default function RootLayout() {
  // На iOS вмикаємо formSheet із вимог лабораторної, на Android — надійний modal
  const isIOS = Platform.OS === 'ios';

  return (
    <SafeAreaProvider>
      <PortalProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: PALETTE.bgCard },
            headerTintColor: PALETTE.textPrimary,
            contentStyle: { backgroundColor: PALETTE.bgMain },
          }}
        >
          <Stack.Screen name="login" options={{ headerShown: false }} />

          <Stack.Screen name="(admin)" options={{ headerShown: false }} />

  
          <Stack.Screen
            name="news/[id]"
            options={{
              title: 'Деталі матеріалу',
              headerBackTitle: 'Назад',
            }}
          />

          <Stack.Screen
            name="modals/editor"
            options={{
              presentation: 'modal',
              title: 'Редагування публікації',
              headerBackTitle: 'Закрити',
            }}
          />

          <Stack.Screen
            name="modals/news-filter"
            options={{
              presentation: isIOS ? 'formSheet' : 'modal',
              sheetAllowedDetents: [0.55, 0.85],
              sheetGrabberVisible: true,
              title: 'Фільтр матеріалів',
            }}
          />

          <Stack.Screen
            name="modals/user-filter"
            options={{
              presentation: isIOS ? 'formSheet' : 'modal',
              sheetAllowedDetents: [0.45, 0.7],
              sheetGrabberVisible: true,
              title: 'Фільтр авторів і користувачів',
            }}
          />
        </Stack>
      </PortalProvider>
    </SafeAreaProvider>
  );
}