import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePortal } from '../../src/context/PortalContext';
import { PALETTE } from '../../src/theme/palette';

export default function NewsFilterSheet() {
  const router = useRouter();
  const {
    news,
    CATEGORIES,
    NEWS_STATUSES,
    newsFilterCategory,
    setNewsFilterCategory,
    newsFilterStatus,
    setNewsFilterStatus,
  } = usePortal();

  const [selectedCat, setSelectedCat] = useState(newsFilterCategory);
  const [selectedStat, setSelectedStat] = useState(newsFilterStatus);

  const previewCount = news.filter((item) => {
    const matchCat = selectedCat === 'ALL' || item.category === selectedCat;
    const matchStat = selectedStat === 'ALL' || item.status === selectedStat;
    return matchCat && matchStat;
  }).length;

  const handleApply = () => {
    setNewsFilterCategory(selectedCat);
    setNewsFilterStatus(selectedStat);
    router.back();
  };

  const handleReset = () => {
    setSelectedCat('ALL');
    setSelectedStat('ALL');
    setNewsFilterCategory('ALL');
    setNewsFilterStatus('ALL');
    router.back();
  };

  return (
    <SafeAreaView style={styles.sheetContainer} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Фільтрація новин</Text>
          <TouchableOpacity onPress={handleReset} style={styles.resetHeaderBtn}>
            <Text style={styles.resetHeaderText}>Скинути все</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subHeading}>Категорія публікації:</Text>
        <View style={styles.optionsWrap}>
          <TouchableOpacity
            style={[styles.btn, selectedCat === 'ALL' && styles.btnActive]}
            onPress={() => setSelectedCat('ALL')}
          >
            {selectedCat === 'ALL' && <Ionicons name="checkmark" size={14} color="#fff" />}
            <Text style={[styles.btnText, selectedCat === 'ALL' && styles.btnTextActive]}>Всі категорії</Text>
          </TouchableOpacity>
          {CATEGORIES.map((c) => {
            const isActive = selectedCat === c;
            return (
              <TouchableOpacity
                key={c}
                style={[styles.btn, isActive && styles.btnActive]}
                onPress={() => setSelectedCat(c)}
              >
                {isActive && <Ionicons name="checkmark" size={14} color="#fff" />}
                <Text style={[styles.btnText, isActive && styles.btnTextActive]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.subHeading}>Статус публікації:</Text>
        <View style={styles.optionsWrap}>
          <TouchableOpacity
            style={[styles.btn, selectedStat === 'ALL' && styles.btnActive]}
            onPress={() => setSelectedStat('ALL')}
          >
            {selectedStat === 'ALL' && <Ionicons name="checkmark" size={14} color="#fff" />}
            <Text style={[styles.btnText, selectedStat === 'ALL' && styles.btnTextActive]}>Всі статуси</Text>
          </TouchableOpacity>
          {NEWS_STATUSES.map((s) => {
            const isActive = selectedStat === s;
            return (
              <TouchableOpacity
                key={s}
                style={[styles.btn, isActive && styles.btnActive]}
                onPress={() => setSelectedStat(s)}
              >
                {isActive && <Ionicons name="checkmark" size={14} color="#fff" />}
                <Text style={[styles.btnText, isActive && styles.btnTextActive]}>{s}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.matchCounter}>Знайдено матеріалів: {previewCount}</Text>
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyBtnText}>Застосувати ({previewCount})</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sheetContainer: { flex: 1, backgroundColor: PALETTE.bgCard },
  content: { padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  heading: { fontSize: 18, fontWeight: '800', color: PALETTE.textPrimary },
  resetHeaderBtn: { padding: 4 },
  resetHeaderText: { color: PALETTE.danger, fontSize: 13, fontWeight: '700' },
  subHeading: { fontSize: 13, fontWeight: '700', color: PALETTE.textSecondary, marginTop: 14, marginBottom: 8 },
  optionsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: PALETTE.bgInput,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  btnActive: { backgroundColor: PALETTE.accent, borderColor: PALETTE.accentLight },
  btnText: { fontSize: 13, color: PALETTE.textSecondary, fontWeight: '600' },
  btnTextActive: { color: '#fff', fontWeight: '700' },
  footer: { marginTop: 28, paddingTop: 16, borderTopWidth: 1, borderTopColor: PALETTE.border },
  matchCounter: { textAlign: 'center', color: PALETTE.textSecondary, fontSize: 13, marginBottom: 12 },
  applyBtn: {
    backgroundColor: PALETTE.accent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});