import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePortal } from '../../src/context/PortalContext';
import { PALETTE } from '../../src/theme/palette';

export default function NewsDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { news, removeNewsItem } = usePortal();

  const article = news.find((item) => item.id === id);

  if (!article) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundText}>Матеріал не знайдено або вже видалено.</Text>
      </View>
    );
  }

  const confirmDeletion = () => {
    Alert.alert(
      'Підтвердження видалення',
      `Ви справді бажаєте видалити новину: "${article.title}"?`,
      [
        { text: 'Скасувати', style: 'cancel' },
        {
          text: 'Видалити',
          style: 'destructive',
          onPress: () => {
            removeNewsItem(article.id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: article.imageUrl }} style={styles.image} />

      <View style={styles.metaRow}>
        <Text style={styles.category}>{article.category}</Text>
        <Text style={styles.date}>{article.createdAt}</Text>
      </View>

      <Text style={styles.title}>{article.title}</Text>
      <Text style={styles.body}>{article.body}</Text>

      <View style={styles.footerActions}>
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push({ pathname: '/modals/editor', params: { editId: article.id } })}
        >
          <Ionicons name="pencil" size={18} color="#fff" />
          <Text style={styles.btnText}>Редагувати</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={confirmDeletion}>
          <Ionicons name="trash" size={18} color="#fff" />
          <Text style={styles.btnText}>Видалити</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bgMain },
  content: { padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: PALETTE.bgMain },
  notFoundText: { color: PALETTE.textSecondary, fontSize: 16 },
  image: { width: '100%', height: 220, borderRadius: 12, backgroundColor: PALETTE.bgInput },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14, marginBottom: 8 },
  category: { color: PALETTE.accentLight, fontWeight: '700', fontSize: 13 },
  date: { color: PALETTE.textMuted, fontSize: 12 },
  title: { fontSize: 20, fontWeight: '800', color: PALETTE.textPrimary, lineHeight: 28, marginBottom: 14 },
  body: { fontSize: 15, color: PALETTE.textSecondary, lineHeight: 24 },
  footerActions: { flexDirection: 'row', gap: 12, marginTop: 30 },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: PALETTE.accent,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: PALETTE.danger,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});