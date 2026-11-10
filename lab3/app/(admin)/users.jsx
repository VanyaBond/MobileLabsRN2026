import React, { useCallback } from 'react';
import { View, Text, VirtualizedList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePortal } from '../../src/context/PortalContext';
import { PALETTE } from '../../src/theme/palette';

const ITEM_HEIGHT = 80;

export default function UsersListScreen() {
  const router = useRouter();
  const {
    users,
    filteredUsers,
    toggleUserStatus,
    userFilterStatus,
    setUserFilterStatus,
    userFilterRole,
    setUserFilterRole,
  } = usePortal();

  const hasActiveFilter = userFilterStatus !== 'ALL' || userFilterRole !== 'ALL';

  const getItemCount = (data) => (data ? data.length : 0);
  const getItem = (data, index) => data[index];
  const getItemLayout = (_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  const renderUserItem = useCallback(({ item }) => {
    const isActive = item.status === 'Активний';
    return (
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userEmail}>{item.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{item.role}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.toggleBtn, { backgroundColor: isActive ? '#065F46' : '#991B1B' }]}
          onPress={() => toggleUserStatus(item.id)}
        >
          <Ionicons name={isActive ? 'lock-open' : 'lock-closed'} size={14} color="#fff" />
          <Text style={styles.toggleBtnText}>{item.status}</Text>
        </TouchableOpacity>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topFilterBar}>
        <TouchableOpacity
          style={[styles.filterBtn, hasActiveFilter && styles.filterBtnActive]}
          onPress={() => router.push('/modals/user-filter')}
        >
          <Ionicons name="options" size={16} color={hasActiveFilter ? '#fff' : PALETTE.textPrimary} />
          <Text style={[styles.filterBtnText, hasActiveFilter && { color: '#fff' }]}>
            Фільтр користувачів {hasActiveFilter ? `(${filteredUsers.length})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      {hasActiveFilter && (
        <View style={styles.activeRow}>
          <Text style={styles.statsText}>Знайдено: {filteredUsers.length} з {users.length}</Text>
          <TouchableOpacity
            onPress={() => {
              setUserFilterStatus('ALL');
              setUserFilterRole('ALL');
            }}
          >
            <Text style={styles.resetAllText}>Скинути ✕</Text>
          </TouchableOpacity>
        </View>
      )}

      <VirtualizedList
        data={filteredUsers}
        extraData={filteredUsers}
        initialNumToRender={12}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
        getItemLayout={getItemLayout}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Немає користувачів за заданими критеріями</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bgMain },
  topFilterBar: {
    padding: 12,
    backgroundColor: PALETTE.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.border,
  },
  filterBtn: {
    backgroundColor: PALETTE.bgInput,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  filterBtnActive: { backgroundColor: PALETTE.accent },
  filterBtnText: { color: PALETTE.textPrimary, fontWeight: '600', fontSize: 14 },
  activeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#1E293B99',
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.border,
  },
  statsText: { color: PALETTE.textSecondary, fontSize: 12, fontWeight: '600' },
  resetAllText: { color: PALETTE.danger, fontSize: 12, fontWeight: '700' },
  listContent: { padding: 12 },
  card: {
    height: ITEM_HEIGHT - 10,
    backgroundColor: PALETTE.bgCard,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  info: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '700', color: PALETTE.textPrimary },
  userEmail: { fontSize: 12, color: PALETTE.textSecondary, marginVertical: 2 },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#6366F120',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleText: { fontSize: 10, color: PALETTE.accentLight, fontWeight: '700' },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    gap: 4,
  },
  toggleBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  emptyText: { color: PALETTE.textSecondary, textAlign: 'center', marginTop: 40 },
});