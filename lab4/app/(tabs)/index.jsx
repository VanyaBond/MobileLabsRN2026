import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { InteractiveOrb } from '../../src/components/InteractiveOrb';
import { useGame } from '../../src/context/GameContext';
import { THEME } from '../../src/theme/colors';

export default function GameScreen() {
  const { score, lastAction } = useGame();

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Панель лічильника очок */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreSubTitle}>НАКОПИЧЕНІ ОЧКИ</Text>
          <Text style={styles.scoreValue}>{score}</Text>
          <View style={styles.actionBadge}>
            <Ionicons name="flash" size={14} color={THEME.amber} />
            <Text style={styles.actionText}>{lastAction}</Text>
          </View>
        </View>

        {/* Інтерактивний об'єкт із жестами */}
        <InteractiveOrb />

        {/* Шпаргалка з жестів */}
        <View style={styles.hintsBox}>
          <Text style={styles.hintsTitle}>Матриця доступних жестів:</Text>
          <View style={styles.hintRow}>
            <Text style={styles.hintDot}>•</Text>
            <Text style={styles.hintText}><Text style={styles.bold}>1 Тап:</Text> +1 очко</Text>
          </View>
          <View style={styles.hintRow}>
            <Text style={styles.hintDot}>•</Text>
            <Text style={styles.hintText}><Text style={styles.bold}>Подвійний тап:</Text> +2 очки</Text>
          </View>
          <View style={styles.hintRow}>
            <Text style={styles.hintDot}>•</Text>
            <Text style={styles.hintText}><Text style={styles.bold}>Утримання 3с:</Text> +15 очок (Бонус)</Text>
          </View>
          <View style={styles.hintRow}>
            <Text style={styles.hintDot}>•</Text>
            <Text style={styles.hintText}><Text style={styles.bold}>Свайп (Fling L/R):</Text> Випадковий бонус</Text>
          </View>
          <View style={styles.hintRow}>
            <Text style={styles.hintDot}>•</Text>
            <Text style={styles.hintText}><Text style={styles.bold}>Перетягування (Pan):</Text> Рух по полю</Text>
          </View>
          <View style={styles.hintRow}>
            <Text style={styles.hintDot}>•</Text>
            <Text style={styles.hintText}><Text style={styles.bold}>Масштабування (Pinch):</Text> Розширення</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: THEME.bgApp },
  container: { padding: 18, alignItems: 'center' },
  scoreCard: {
    width: '100%',
    backgroundColor: THEME.bgCard,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.bgCardBorder,
    marginBottom: 10,
  },
  scoreSubTitle: { fontSize: 12, fontWeight: '800', color: THEME.cyan, letterSpacing: 1.5 },
  scoreValue: { fontSize: 44, fontWeight: '900', color: THEME.textPrimary, marginVertical: 4 },
  actionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#0B0F19',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  actionText: { fontSize: 13, color: THEME.textMuted, fontWeight: '600' },
  hintsBox: {
    width: '100%',
    backgroundColor: THEME.bgCard,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.bgCardBorder,
    marginTop: 10,
  },
  hintsTitle: { fontSize: 14, fontWeight: '700', color: THEME.textPrimary, marginBottom: 8 },
  hintRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  hintDot: { color: THEME.cyan, fontSize: 16, marginRight: 8 },
  hintText: { fontSize: 13, color: THEME.textMuted },
  bold: { fontWeight: '700', color: THEME.textPrimary },
});