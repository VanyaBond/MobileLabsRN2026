import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePortal } from '../../src/context/PortalContext';
import { PALETTE } from '../../src/theme/palette';

export default function UserFilterSheet() {
  const router = useRouter();
  const {
    users,
    USER_ROLES,
    userFilterStatus,
    setUserFilterStatus,
    userFilterRole,
    setUserFilterRole,
  } = usePortal();

  const [selectedStat, setSelectedStat] = useState(userFilterStatus);
  const [selectedRole, setSelectedRole] = useState(userFilterRole);

  const previewCount = users.filter((u) => {
    const matchStat = selectedStat === 'ALL' || u.status === selectedStat;
    const matchRole = selectedRole === 'ALL' || u.role === selectedRole;
    return matchStat && matchRole;
  }).length;

  const handleApply = () => {
    setUserFilterStatus(selectedStat);
    setUserFilterRole(selectedRole);
    router.back();
  };

  const handleReset = () => {
    setSelectedStat('ALL');
    setSelectedRole('ALL');
    setUserFilterStatus('ALL');
    setUserFilterRole('ALL');
    router.back();
  };

  return (
    <SafeAreaView style={styles.sheetContainer} edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Фільтр користувачів</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Скинути все</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subHeading}>Статус облікового запису:</Text>
        <View style={styles.optionsWrap}>
          {['ALL', 'Активний', 'Заблокований'].map((st) => {
            const isActive = selectedStat === st;
            return (
              <TouchableOpacity
                key={st}
                style={[styles.btn, isActive && styles.btnActive]}
                onPress={() => setSelectedStat(st)}
              >
                {isActive && <Ionicons name="checkmark" size={14} color="#fff" />}
                <Text style={[styles.btnText, isActive && styles.btnTextActive]}>
                  {st === 'ALL' ? 'Всі статуси' : st}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.subHeading}>Роль користувача:</Text>
        <View style={styles.optionsWrap}>
          <TouchableOpacity
            style={[styles.btn, selectedRole === 'ALL' && styles.btnActive]}
            onPress={() => setSelectedRole('ALL')}
          >
            {selectedRole === 'ALL' && <Ionicons name="checkmark" size={14} color="#fff" />}
            <Text style={[styles.btnText, selectedRole === 'ALL' && styles.btnTextActive]}>Всі ролі</Text>
          </TouchableOpacity>
          {USER_ROLES.map((r) => {
            const isActive = selectedRole === r;
            return (
              <TouchableOpacity
                key={r}
                style={[styles.btn, isActive && styles.btnActive]}
                onPress={() => setSelectedRole(r)}
              >
                {isActive && <Ionicons name="checkmark" size={14} color="#fff" />}
                <Text style={[styles.btnText, isActive && styles.btnTextActive]}>{r}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.footer}>
          <Text style={styles.matchCounter}>Знайдено користувачів: {previewCount}</Text>
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
  resetText: { color: PALETTE.danger, fontSize: 13, fontWeight: '700' },
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