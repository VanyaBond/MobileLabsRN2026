import React from 'react';
import { SectionList, View, Text, StyleSheet } from 'react-native';
import { FAQ_GROUPS } from '../../src/data/feed';
import { palette, spacing } from '../../src/theme';

export default function HelpCenterScreen() {
  return (
    <SectionList
      sections={FAQ_GROUPS}
      keyExtractor={(entry) => entry.id}
      stickySectionHeadersEnabled
      contentContainerStyle={{ paddingBottom: spacing.xl }}
      renderSectionHeader={({ section }) => (
        <Text style={styles.groupTitle}>{section.title}</Text>
      )}
      renderItem={({ item }) => (
        <View style={styles.entry}>
          <Text style={styles.question}>{item.question}</Text>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.line} />}
    />
  );
}

const styles = StyleSheet.create({
  groupTitle: {
    backgroundColor: palette.primary,
    color: '#fff',
    fontWeight: '800',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  entry: { backgroundColor: palette.surface, padding: spacing.lg },
  question: { fontWeight: '700', color: palette.textMain, fontSize: 16 },
  answer: { marginTop: spacing.xs, color: palette.textMuted, lineHeight: 20 },
  line: { height: 1, backgroundColor: palette.border },
});
