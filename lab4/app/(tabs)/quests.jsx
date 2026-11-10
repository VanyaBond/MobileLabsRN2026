import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../../src/context/GameContext';
import { THEME } from '../../src/theme/colors';

export default function QuestsScreen() {
  const { quests } = useGame();

  const completedCount = quests.filter((q) => q.completed).length;

  const renderQuestItem = ({ item }) => {
    const progressPercent = Math.min(100, Math.round((item.current / item.target) * 100));

    return (
      <View style={[styles.questCard, item.completed && styles.questCardDone]}>
        <View style={styles.cardHeader}>
          <View style={styles.titleWrap}>
            <Text style={styles.questTitle}>{item.title}</Text>
            <Text style={styles.questDesc}>{item.desc}</Text>
          </View>
          <View style={[styles.badge, item.completed ? styles.badgeDone : styles.badgeProgress]}>
            <Ionicons
              name={item.completed ? 'checkmark-circle' : 'hourglass-outline'}
              size={14}
              color={item.completed ? '#fff' : THEME.amber}
            />
            <Text style={[styles.badgeText, item.completed ? styles.textWhite : styles.textAmber]}>
              {item.completed ? 'Виконано' : 'В процесі'}
            </Text>
          </View>
        </View>

        {/* Шкала виконання */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%`, backgroundColor: item.completed ? THEME.emerald : THEME.primary }]} />
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.progressCounter}>
            Прогрес: {item.current} / {item.target}
          </Text>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryBar}>
        <Text style={styles.summaryTitle}>Статус прогресу:</Text>
        <Text style={styles.summaryCount}>
          {completedCount} з {quests.length} виконано
        </Text>
      </View>

      <FlatList
        data={quests}
        keyExtractor={(item) => item.id}
        renderItem={renderQuestItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bgApp },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: THEME.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: THEME.bgCardBorder,
  },
  summaryTitle: { fontSize: 14, color: THEME.textMuted, fontWeight: '600' },
  summaryCount: { fontSize: 14, color: THEME.cyan, fontWeight: '800' },
  listContent: { padding: 16, gap: 12 },
  questCard: {
    backgroundColor: THEME.bgCard,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.bgCardBorder,
  },
  questCardDone: { borderColor: '#10B98155' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  titleWrap: { flex: 1, marginRight: 10 },
  questTitle: { fontSize: 15, fontWeight: '700', color: THEME.textPrimary },
  questDesc: { fontSize: 12, color: THEME.textMuted, marginTop: 3 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeDone: { backgroundColor: THEME.emerald },
  badgeProgress: { backgroundColor: '#F59E0B20' },
  badgeText: { fontSize: 11, fontWeight: '700' },
  textWhite: { color: '#fff' },
  textAmber: { color: THEME.amber },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#0B0F19',
    borderRadius: 3,
    marginVertical: 10,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 3 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  progressCounter: { fontSize: 11, color: THEME.textMuted },
  progressPercent: { fontSize: 11, color: THEME.textPrimary, fontWeight: '700' },
});