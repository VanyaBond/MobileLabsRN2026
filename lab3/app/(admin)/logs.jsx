import React, { useCallback } from 'react';
import { View, Text, VirtualizedList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePortal } from '../../src/context/PortalContext';
import { PALETTE } from '../../src/theme/palette';

const ITEM_HEIGHT = 75;

export default function LogsScreen() {
  const { logs } = usePortal();

  const getItemCount = (data) => (data ? data.length : 0);
  const getItem = (data, index) => data[index];
  const getItemLayout = (_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  const getLogIcon = (action) => {
    switch (action) {
      case 'Вхід у систему': return { name: 'log-in', color: PALETTE.statusPublished };
      case 'Вихід із системи': return { name: 'log-out', color: PALETTE.danger };
      case 'Створення новини': return { name: 'add-circle', color: PALETTE.accentLight };
      case 'Редагування новини': return { name: 'create', color: PALETTE.statusDraft };
      case 'Видалення новини': return { name: 'trash', color: PALETTE.danger };
      case 'Зміна статусу користувача': return { name: 'swap-horizontal', color: PALETTE.statusReview };
      default: return { name: 'information-circle', color: PALETTE.textSecondary };
    }
  };

  const renderLogItem = useCallback(({ item }) => {
    const iconConfig = getLogIcon(item.action);
    return (
      <View style={styles.card}>
        <View style={[styles.iconWrap, { backgroundColor: `${iconConfig.color}20` }]}>
          <Ionicons name={iconConfig.name} size={18} color={iconConfig.color} />
        </View>
        <View style={styles.details}>
          <View style={styles.headerRow}>
            <Text style={styles.actionTitle}>{item.action}</Text>
            <Text style={styles.time}>{item.timestamp}</Text>
          </View>
          <Text style={styles.desc} numberOfLines={1}>{item.details}</Text>
        </View>
      </View>
    );
  }, []);

  return (
    <View style={styles.container}>
      <VirtualizedList
        data={logs}
        initialNumToRender={12}
        renderItem={renderLogItem}
        keyExtractor={(item) => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
        getItemLayout={getItemLayout}
        maxToRenderPerBatch={12}
        windowSize={5}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Системних дій ще не зафіксовано</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bgMain },
  listContent: { padding: 12 },
  card: {
    height: ITEM_HEIGHT - 10,
    backgroundColor: PALETTE.bgCard,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  iconWrap: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  details: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  actionTitle: { fontSize: 13, fontWeight: '700', color: PALETTE.textPrimary },
  time: { fontSize: 11, color: PALETTE.textMuted },
  desc: { fontSize: 12, color: PALETTE.textSecondary, marginTop: 2 },
  emptyContainer: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: PALETTE.textSecondary, fontSize: 14 },
});