import { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Paths } from 'expo-file-system';
import { colors } from '../src/theme';
import { formatBytes } from '../src/utils';

export default function StorageScreen() {
  const [stats, setStats] = useState({ total: 0, free: 0 });

  useFocusEffect(
    useCallback(() => {
      setStats({ total: Paths.totalDiskSpace, free: Paths.availableDiskSpace });
    }, [])
  );

  const used = Math.max(stats.total - stats.free, 0);
  const percent = stats.total ? Math.round((used / stats.total) * 100) : 0;

  const rows = [
    ['Загальний обсяг', formatBytes(stats.total)],
    ['Вільно', formatBytes(stats.free)],
    ['Зайнято', formatBytes(used)],
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Пам’ять пристрою</Text>
      <View style={styles.card}>
        <Text style={styles.percent}>{percent}%</Text>
        <Text style={styles.muted}>простору зайнято</Text>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${percent}%` }]} />
        </View>
        {rows.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, padding: 20 },
  title: { color: colors.text, fontSize: 26, fontWeight: '700', marginBottom: 20 },
  card: { backgroundColor: colors.card, borderRadius: 14, padding: 20, borderWidth: 1, borderColor: colors.border },
  percent: { color: colors.accent, fontSize: 48, fontWeight: '800' },
  muted: { color: colors.muted, marginBottom: 16 },
  track: { height: 10, backgroundColor: colors.border, borderRadius: 5, overflow: 'hidden', marginBottom: 20 },
  fill: { height: '100%', backgroundColor: colors.accent },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border },
  label: { color: colors.muted, fontSize: 16 },
  value: { color: colors.text, fontSize: 16, fontWeight: '600' },
});