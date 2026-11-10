import React, { useCallback } from 'react';
import { View, Text, VirtualizedList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePortal } from '../../src/context/PortalContext';
import { PALETTE } from '../../src/theme/palette';

const ITEM_HEIGHT = 105;

export default function NewsListScreen() {
  const router = useRouter();
  const {
    news,
    filteredNews,
    newsFilterCategory,
    setNewsFilterCategory,
    newsFilterStatus,
    setNewsFilterStatus,
  } = usePortal();

  const hasActiveFilter = newsFilterCategory !== 'ALL' || newsFilterStatus !== 'ALL';

  const getItemCount = (data) => (data ? data.length : 0);
  const getItem = (data, index) => data[index];
  const getItemLayout = (_, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Опубліковано': return PALETTE.statusPublished;
      case 'Чернетка': return PALETTE.statusDraft;
      default: return PALETTE.statusReview;
    }
  };

  const renderNewsItem = useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/news/${item.id}`)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.thumbnail} />
      <View style={styles.cardDetails}>
        <View style={styles.tagRow}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={[styles.statusTag, { color: getStatusColor(item.status) }]}>{item.status}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.date}>{item.createdAt}</Text>
      </View>
    </TouchableOpacity>
  ), []);

  return (
    <View style={styles.container}>
      {/* Верхня панель дій */}
      <View style={styles.actionsBar}>
        <TouchableOpacity
          style={[styles.actionBtnSecondary, hasActiveFilter && styles.filterBtnHighlighted]}
          onPress={() => router.push('/modals/news-filter')}
        >
          <Ionicons name="filter" size={16} color={hasActiveFilter ? '#fff' : PALETTE.textPrimary} />
          <Text style={[styles.actionBtnText, hasActiveFilter && { color: '#fff' }]}>
            Фільтр {hasActiveFilter ? '(Активний)' : ''}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtnPrimary}
          onPress={() => router.push('/modals/editor')}
        >
          <Ionicons name="add-circle" size={18} color="#fff" />
          <Text style={styles.actionPrimaryText}>Додати новину</Text>
        </TouchableOpacity>
      </View>

      {/* Індикатор активних фільтрів */}
      {hasActiveFilter && (
        <View style={styles.activeFilterRow}>
          <Text style={styles.filterStats}>
            Показано {filteredNews.length} з {news.length}
          </Text>
          <View style={styles.chipRow}>
            {newsFilterCategory !== 'ALL' && (
              <TouchableOpacity
                style={styles.chip}
                onPress={() => setNewsFilterCategory('ALL')}
              >
                <Text style={styles.chipText}>{newsFilterCategory} ✕</Text>
              </TouchableOpacity>
            )}
            {newsFilterStatus !== 'ALL' && (
              <TouchableOpacity
                style={styles.chip}
                onPress={() => setNewsFilterStatus('ALL')}
              >
                <Text style={styles.chipText}>{newsFilterStatus} ✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Оптимізований список */}
      <VirtualizedList
        data={filteredNews}
        extraData={filteredNews}
        initialNumToRender={10}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        getItemCount={getItemCount}
        getItem={getItem}
        getItemLayout={getItemLayout}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="search-outline" size={40} color={PALETTE.textMuted} />
            <Text style={styles.emptyText}>Жодної новини за обраними фільтрами не знайдено</Text>
            <TouchableOpacity
              style={styles.resetInlineBtn}
              onPress={() => {
                setNewsFilterCategory('ALL');
                setNewsFilterStatus('ALL');
              }}
            >
              <Text style={styles.resetInlineBtnText}>Скинути всі фільтри</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bgMain },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.border,
    backgroundColor: PALETTE.bgCard,
    gap: 10,
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.bgInput,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  filterBtnHighlighted: {
    backgroundColor: PALETTE.accent,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PALETTE.accentDark,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  actionBtnText: { color: PALETTE.textPrimary, fontSize: 13, fontWeight: '600' },
  actionPrimaryText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  activeFilterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#1E293B99',
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.border,
  },
  filterStats: { fontSize: 12, color: PALETTE.textSecondary, fontWeight: '600' },
  chipRow: { flexDirection: 'row', gap: 6 },
  chip: {
    backgroundColor: PALETTE.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  chipText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  listContent: { padding: 12 },
  card: {
    height: ITEM_HEIGHT - 10,
    backgroundColor: PALETTE.bgCard,
    borderRadius: 10,
    flexDirection: 'row',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: PALETTE.border,
    overflow: 'hidden',
  },
  thumbnail: { width: 90, height: '100%', backgroundColor: PALETTE.bgInput },
  cardDetails: { flex: 1, padding: 8, justifyContent: 'space-between' },
  tagRow: { flexDirection: 'row', justifyContent: 'space-between' },
  category: { fontSize: 11, fontWeight: '700', color: PALETTE.accentLight },
  statusTag: { fontSize: 11, fontWeight: '700' },
  title: { fontSize: 13, fontWeight: '600', color: PALETTE.textPrimary, marginVertical: 2 },
  date: { fontSize: 11, color: PALETTE.textMuted },
  emptyWrap: { alignItems: 'center', marginTop: 50, paddingHorizontal: 20 },
  emptyText: { color: PALETTE.textSecondary, textAlign: 'center', marginTop: 10, fontSize: 14 },
  resetInlineBtn: {
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: PALETTE.accent,
  },
  resetInlineBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
});