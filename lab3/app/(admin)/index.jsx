import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePortal } from '../../src/context/PortalContext';
import { PALETTE } from '../../src/theme/palette';

export default function DashboardScreen() {
  const { news, users, logs } = usePortal();
  const [stats, setStats] = useState({ totalNews: 0, totalUsers: 0, totalLogs: 0, lastSync: '' });

  useFocusEffect(
    useCallback(() => {
      setStats({
        totalNews: news.length,
        totalUsers: users.length,
        totalLogs: logs.length,
        lastSync: new Date().toLocaleTimeString('uk-UA'),
      });
    }, [news.length, users.length, logs.length])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Статистика платформи</Text>
        <Text style={styles.bannerSubtitle}>Останнє автооновлення (useFocusEffect): {stats.lastSync}</Text>
      </View>

      <View style={styles.cardsGrid}>
        <View style={[styles.statCard, { borderLeftColor: PALETTE.accent }]}>
          <View style={styles.statIconBox}>
            <Ionicons name="newspaper" size={24} color={PALETTE.accent} />
          </View>
          <Text style={styles.statCount}>{stats.totalNews}</Text>
          <Text style={styles.statLabel}>Публікацій у системі</Text>
        </View>

        <View style={[styles.statCard, { borderLeftColor: PALETTE.statusPublished }]}>
          <View style={styles.statIconBox}>
            <Ionicons name="people" size={24} color={PALETTE.statusPublished} />
          </View>
          <Text style={styles.statCount}>{stats.totalUsers}</Text>
          <Text style={styles.statLabel}>Облікових записів</Text>
        </View>

        <View style={[styles.statCard, { borderLeftColor: PALETTE.statusDraft }]}>
          <View style={styles.statIconBox}>
            <Ionicons name="receipt" size={24} color={PALETTE.statusDraft} />
          </View>
          <Text style={styles.statCount}>{stats.totalLogs}</Text>
          <Text style={styles.statLabel}>Зафіксованих подій аудиту</Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Статус системи: Активна</Text>
        <Text style={styles.infoText}>Всі модулі (новостий рушій, список авторів, модальні фільтри FormSheet) синхронізовані.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bgMain },
  content: { padding: 16 },
  banner: { marginBottom: 20 },
  bannerTitle: { fontSize: 22, fontWeight: '800', color: PALETTE.textPrimary },
  bannerSubtitle: { fontSize: 13, color: PALETTE.textSecondary, marginTop: 4 },
  cardsGrid: { gap: 14 },
  statCard: {
    backgroundColor: PALETTE.bgCard,
    padding: 18,
    borderRadius: 12,
    borderLeftWidth: 5,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  statIconBox: { marginBottom: 8 },
  statCount: { fontSize: 32, fontWeight: '800', color: PALETTE.textPrimary },
  statLabel: { fontSize: 14, color: PALETTE.textSecondary, marginTop: 2 },
  infoBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: PALETTE.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  infoTitle: { color: PALETTE.statusPublished, fontWeight: '700', fontSize: 16 },
  infoText: { color: PALETTE.textSecondary, fontSize: 13, marginTop: 6, lineHeight: 18 },
});