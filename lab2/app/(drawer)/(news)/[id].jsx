import React, { useMemo } from 'react';
import { ScrollView, Text, Image, StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { buildPost } from '../../../src/data/feed';
import { palette, spacing } from '../../../src/theme';

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams();
  const post = useMemo(() => buildPost(Number(id)), [id]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: post.headline,
          headerTintColor: palette.primaryDark,
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={{ uri: post.cover }} style={styles.cover} />
        <Text style={styles.meta}>
          {post.topic} · {post.published} · id: {id}
        </Text>
        <Text style={styles.title}>{post.headline}</Text>
        <Text style={styles.body}>{post.body}</Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg },
  cover: { width: '100%', height: 220, borderRadius: 14 },
  meta: { marginTop: spacing.lg, color: palette.accent, fontWeight: '700' },
  title: { fontSize: 24, fontWeight: '800', color: palette.textMain, marginVertical: spacing.sm },
  body: { fontSize: 16, lineHeight: 24, color: palette.textMain },
});
