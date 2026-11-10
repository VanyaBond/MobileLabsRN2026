import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../../src/context/GameContext';
import { THEME } from '../../src/theme/colors';

export default function SettingsScreen() {
  const { score, clickCount, doubleClickCount, resetGame } = useGame();

  const confirmReset = () => {
    Alert.alert(
      'Скидання прогресу',
      'Ви впевнені, що бажаєте обнулити всі очки та скинути виконання завдань?',
      [
        { text: 'Скасувати', style: 'cancel' },
        { text: 'Скинути все', style: 'destructive', onPress: resetGame },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeading}>Статистика профілю</Text>
      <View style={styles.card}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Поточний рахунок</Text>
          <Text style={styles.statValue}>{score} очок</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Одиночних кліків</Text>
          <Text style={styles.statValue}>{clickCount}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Подвійних кліків</Text>
          <Text style={styles.statValue}>{doubleClickCount}</Text>
        </View>
      </View>

      <Text style={styles.sectionHeading}>Управління додатком</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.resetBtn} onPress={confirmReset} activeOpacity={0.8}>
          <Ionicons name="trash-bin-outline" size={20} color="#fff" />
          <Text style={styles.resetBtnText}>Скинути весь прогрес</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bgApp, padding: 18 },
  sectionHeading: { fontSize: 13, fontWeight: '800', color: THEME.cyan, letterSpacing: 1, marginTop: 12, marginBottom: 8 },
  card: {
    backgroundColor: THEME.bgCard,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.bgCardBorder,
    marginBottom: 16,
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  statLabel: { fontSize: 14, color: THEME.textMuted },
  statValue: { fontSize: 14, fontWeight: '700', color: THEME.textPrimary },
  divider: { height: 1, backgroundColor: THEME.bgCardBorder, marginVertical: 8 },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: THEME.rose,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});