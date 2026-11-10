import React from 'react';
import { Stack } from 'expo-router';
import { palette } from '../../../src/theme';

export default function NewsStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.background },
      }}
    />
  );
}
