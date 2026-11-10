import React, { memo, useCallback, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { buildPosts, INITIAL_COUNT, PAGE_SIZE } from '../../../src/data/feed';
import { palette, spacing } from '../../../src/theme';

const CARD_HEIGHT = 128;
const GAP = 10;
const ROW_SIZE = CARD_HEIGHT + GAP;

const PostCard = memo(function PostCard({ post, onOpen }) {
  return (
    <Pressable
      onPress={() => onOpen(post.id)}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
      <Image source={{ uri: post.cover }} style={styles.cover} />
      <View style={styles.info}>
        <Text style={styles.topic}>{post.topic} · {post.published}</Text>
        <Text style={styles.headline} numberOfLines={1}>{post.headline}</Text>
        <Text style={styles.teaser} numberOfLines={3}>{post.teaser}</Text>
      </View>
    </Pressable>
  );
});

export default function FeedScreen() {
  const router = useRouter();
  const [posts, setPosts] = useState(() => buildPosts(0, INITIAL_COUNT));
  const [reloading, setReloading] = useState(false);
  const [appending, setAppending] = useState(false);

  const openPost = useCallback(
    (id) => router.push({ pathname: '/[id]', params: { id } }),
    [router]
  );

  const reload = useCallback(() => {
    setReloading(true);
    setTimeout(() => {
      setPosts(buildPosts(0, INITIAL_COUNT));
      setReloading(false);
    }, 1200);
  }, []);

  const appendPage = useCallback(() => {
    if (appending || reloading) return;
    setAppending(true);
    setTimeout(() => {
      setPosts((prev) => [...prev, ...buildPosts(prev.length, PAGE_SIZE)]);
      setAppending(false);
    }, 900);
  }, [appending, reloading]);

  const renderPost = useCallback(
    ({ item }) => <PostCard post={item} onOpen={openPost} />,
    [openPost]
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(p) => p.id}
      getItemLayout={(_, index) => ({ length: ROW_SIZE, offset: ROW_SIZE * index, index })}
      refreshControl={
        <RefreshControl
          refreshing={reloading}
          onRefresh={reload}
          colors={[palette.primary]}
          tintColor={palette.primary}
        />
      }
      onEndReached={appendPage}
      onEndReachedThreshold={0.4}
      initialNumToRender={8}
      maxToRenderPerBatch={8}
      windowSize={7}
      removeClippedSubviews
      contentContainerStyle={styles.list}
      ListFooterComponent={
        appending ? <ActivityIndicator style={{ margin: spacing.lg }} color={palette.primary} /> : null
      }
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md },
  card: {
    height: CARD_HEIGHT,
    marginBottom: GAP,
    flexDirection: 'row',
    backgroundColor: palette.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.border,
  },
  cover: { width: 110, height: '100%' },
  info: { flex: 1, padding: spacing.md },
  topic: { fontSize: 11, color: palette.accent, fontWeight: '700' },
  headline: { fontSize: 16, fontWeight: '800', color: palette.textMain, marginVertical: 2 },
  teaser: { fontSize: 13, color: palette.textMuted },
});
