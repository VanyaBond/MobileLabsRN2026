import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usePortal } from '../../src/context/PortalContext';
import { PALETTE } from '../../src/theme/palette';

export default function EditorModal() {
  const router = useRouter();
  const { editId } = useLocalSearchParams();
  const { news, createNewsItem, updateNewsItem, CATEGORIES, NEWS_STATUSES } = usePortal();

  const existingArticle = editId ? news.find((item) => item.id === editId) : null;

  const [title, setTitle] = useState(existingArticle?.title || '');
  const [category, setCategory] = useState(existingArticle?.category || CATEGORIES[0]);
  const [status, setStatus] = useState(existingArticle?.status || NEWS_STATUSES[0]);
  const [imageUrl, setImageUrl] = useState(existingArticle?.imageUrl || 'https://picsum.photos/seed/new/600/350');
  const [body, setBody] = useState(existingArticle?.body || '');

  const handleSave = () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert('Помилка валідації', 'Заголовок та текст новини є обов’язковими!');
      return;
    }

    if (existingArticle) {
      updateNewsItem(existingArticle.id, { title, category, status, imageUrl, body });
    } else {
      createNewsItem({ title, category, status, imageUrl, body });
    }
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.screenHeading}>{existingArticle ? 'Редагувати новину' : 'Створити публікацію'}</Text>

      <Text style={styles.label}>Заголовок матеріалу</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Введіть заголовок..."
        placeholderTextColor={PALETTE.textMuted}
      />

      <Text style={styles.label}>Категорія</Text>
      <View style={styles.pillRow}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.pill, category === cat && styles.pillActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.pillText, category === cat && styles.pillTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Статус публікації</Text>
      <View style={styles.pillRow}>
        {NEWS_STATUSES.map((st) => (
          <TouchableOpacity
            key={st}
            style={[styles.pill, status === st && styles.pillActive]}
            onPress={() => setStatus(st)}
          >
            <Text style={[styles.pillText, status === st && styles.pillTextActive]}>{st}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Посилання на зображення (URL)</Text>
      <TextInput
        style={styles.input}
        value={imageUrl}
        onChangeText={setImageUrl}
        placeholder="https://..."
        placeholderTextColor={PALETTE.textMuted}
      />

      <Text style={styles.label}>Повний текст новини</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={body}
        onChangeText={setBody}
        multiline
        numberOfLines={6}
        placeholder="Введіть основний зміст статті..."
        placeholderTextColor={PALETTE.textMuted}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Зберегти зміни</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PALETTE.bgMain },
  content: { padding: 18 },
  screenHeading: { fontSize: 20, fontWeight: '800', color: PALETTE.textPrimary, marginBottom: 18 },
  label: { fontSize: 13, fontWeight: '700', color: PALETTE.textSecondary, marginTop: 12, marginBottom: 6 },
  input: {
    backgroundColor: PALETTE.bgInput,
    color: PALETTE.textPrimary,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PALETTE.border,
    fontSize: 14,
  },
  textArea: { height: 120, textAlignVertical: 'top' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 4 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: PALETTE.bgCard,
    borderWidth: 1,
    borderColor: PALETTE.border,
  },
  pillActive: { backgroundColor: PALETTE.accent, borderColor: PALETTE.accentLight },
  pillText: { fontSize: 12, color: PALETTE.textSecondary, fontWeight: '600' },
  pillTextActive: { color: '#fff' },
  saveBtn: {
    backgroundColor: PALETTE.accent,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 40,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});