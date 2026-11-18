import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Modal, TextInput, Alert, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Directory, File, Paths } from 'expo-file-system';
import { colors } from '../src/theme';
import { cleanPath, getMeta, isTxt } from '../src/utils';

export default function FilesScreen() {
  const root = useMemo(() => new Directory(Paths.document), []);
  const [dir, setDir] = useState(root);
  const [items, setItems] = useState([]);

  const [create, setCreate] = useState(null); // 'folder' | 'file' | null
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  const [viewer, setViewer] = useState(null); // { file }
  const [text, setText] = useState('');
  const [editing, setEditing] = useState(false);

  const [info, setInfo] = useState(null);

  const load = useCallback(() => {
    try {
      const list = dir.list();
      list.sort((a, b) => {
        const diff = Number(b instanceof Directory) - Number(a instanceof Directory);
        return diff || a.name.localeCompare(b.name);
      });
      setItems(list);
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося прочитати вміст папки.');
    }
  }, [dir]);

  useEffect(load, [load]);

  const canGoBack = dir.uri !== root.uri;
  const goBack = () => canGoBack && setDir(dir.parentDirectory);

  const closeCreate = () => { setCreate(null); setName(''); setContent(''); };

  const submitCreate = () => {
    const clean = name.trim();
    if (!clean || /[\\/:*?"<>|]/.test(clean)) {
      Alert.alert('Некоректна назва', 'Введіть назву без символів \\ / : * ? " < > |');
      return;
    }
    try {
      if (create === 'folder') {
        const folder = new Directory(dir, clean);
        if (folder.exists) return Alert.alert('Помилка', 'Папка з такою назвою вже існує.');
        folder.create();
      } else {
        const fileName = clean.toLowerCase().endsWith('.txt') ? clean : `${clean}.txt`;
        const file = new File(dir, fileName);
        if (file.exists) return Alert.alert('Помилка', 'Файл з такою назвою вже існує.');
        file.create();
        file.write(content);
      }
      closeCreate();
      load();
    } catch (e) {
      Alert.alert('Помилка', String(e.message || e));
    }
  };

  const openItem = async (item) => {
    if (item instanceof Directory) return setDir(item);
    if (!isTxt(item)) {
      Alert.alert('Формат не підтримується', 'Переглядати можна лише .txt файли. Деталі файлу — через кнопку «i».');
      return;
    }
    try {
      setText(await item.text());
      setViewer({ file: item });
      setEditing(false);
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося прочитати файл.');
    }
  };

  const saveFile = () => {
    try {
      viewer.file.write(text);
      setEditing(false);
      load();
      Alert.alert('Збережено', 'Зміни записано у файл.');
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося зберегти файл.');
    }
  };

  const confirmDelete = (item) => {
    const kind = item instanceof Directory ? 'папку' : 'файл';
    Alert.alert('Видалення', `Видалити ${kind} «${item.name}»? Цю дію неможливо скасувати.`, [
      { text: 'Скасувати', style: 'cancel' },
      {
        text: 'Видалити',
        style: 'destructive',
        onPress: () => {
          try { item.delete(); load(); } catch (e) { Alert.alert('Помилка', 'Не вдалося видалити.'); }
        },
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const isDir = item instanceof Directory;
    return (
      <TouchableOpacity style={styles.row} onPress={() => openItem(item)}>
        <Ionicons name={isDir ? 'folder' : 'document-text-outline'} size={26} color={isDir ? colors.folder : colors.muted} />
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <TouchableOpacity onPress={() => setInfo(getMeta(item))} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="information-circle-outline" size={24} color={colors.muted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmDelete(item)} hitSlop={10} style={styles.iconBtn}>
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Файловий менеджер</Text>

      <View style={styles.pathBar}>
        <TouchableOpacity onPress={goBack} disabled={!canGoBack} style={{ opacity: canGoBack ? 1 : 0.3 }}>
          <Ionicons name="arrow-back" size={24} color={colors.accent} />
        </TouchableOpacity>
        <Text style={styles.path} numberOfLines={2}>{cleanPath(dir.uri)}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => setCreate('folder')}>
          <Ionicons name="folder-outline" size={18} color={colors.bg} />
          <Text style={styles.btnText}>Нова папка</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => setCreate('file')}>
          <Ionicons name="document-outline" size={18} color={colors.bg} />
          <Text style={styles.btnText}>Новий .txt</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.uri}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={styles.empty}>Папка порожня. Створіть папку або текстовий файл.</Text>}
      />

      {/* Створення */}
      <Modal visible={!!create} transparent animationType="fade" onRequestClose={closeCreate}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{create === 'folder' ? 'Нова папка' : 'Новий текстовий файл'}</Text>
            <TextInput
              style={styles.input}
              placeholder={create === 'folder' ? 'Назва папки' : 'Ім’я файлу (.txt)'}
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
              autoFocus
            />
            {create === 'file' && (
              <TextInput
                style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                placeholder="Початковий вміст"
                placeholderTextColor={colors.muted}
                value={content}
                onChangeText={setContent}
                multiline
              />
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={closeCreate}><Text style={styles.cancel}>Скасувати</Text></TouchableOpacity>
              <TouchableOpacity style={styles.btn} onPress={submitCreate}><Text style={styles.btnText}>Створити</Text></TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Перегляд / редагування */}
      <Modal visible={!!viewer} animationType="slide" onRequestClose={() => setViewer(null)}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.viewerHead}>
            <TouchableOpacity onPress={() => setViewer(null)}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.viewerTitle} numberOfLines={1}>{viewer?.file.name}</Text>
            {editing ? (
              <TouchableOpacity style={styles.btn} onPress={saveFile}><Text style={styles.btnText}>Зберегти</Text></TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.btn} onPress={() => setEditing(true)}><Text style={styles.btnText}>Редагувати</Text></TouchableOpacity>
            )}
          </View>
          <TextInput
            style={[styles.input, { flex: 1, textAlignVertical: 'top' }]}
            value={text}
            onChangeText={setText}
            editable={editing}
            multiline
          />
        </SafeAreaView>
      </Modal>

      {/* Інформація */}
      <Modal visible={!!info} transparent animationType="fade" onRequestClose={() => setInfo(null)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Інформація</Text>
            {info && [
              ['Назва', info.name],
              ['Тип', info.type],
              ['Розмір', info.size],
              ['Остання зміна', info.modified],
            ].map(([k, v]) => (
              <View key={k} style={styles.infoRow}>
                <Text style={styles.label}>{k}</Text>
                <Text style={styles.infoValue}>{v}</Text>
              </View>
            ))}
            <TouchableOpacity style={[styles.btn, { alignSelf: 'flex-end', marginTop: 12 }]} onPress={() => setInfo(null)}>
              <Text style={styles.btnText}>Закрити</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16 },
  title: { color: colors.text, fontSize: 26, fontWeight: '700', marginVertical: 12 },
  pathBar: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.card, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  path: { flex: 1, color: colors.muted, fontSize: 12 },
  actions: { flexDirection: 'row', gap: 10, marginVertical: 12 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.accent, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  btnText: { color: colors.bg, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  itemName: { flex: 1, color: colors.text, fontSize: 16 },
  iconBtn: { paddingHorizontal: 4 },
  empty: { color: colors.muted, textAlign: 'center', marginTop: 40 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modal: { backgroundColor: colors.card, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: colors.border },
  modalTitle: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 12 },
  input: { backgroundColor: colors.bg, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 20 },
  cancel: { color: colors.muted, fontSize: 16 },
  viewerHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginVertical: 12 },
  viewerTitle: { flex: 1, color: colors.text, fontSize: 18, fontWeight: '600' },
  infoRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { color: colors.muted, fontSize: 13 },
  infoValue: { color: colors.text, fontSize: 16, marginTop: 2 },
});