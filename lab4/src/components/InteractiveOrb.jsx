import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Gesture, GestureDetector, Directions } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';
import { THEME } from '../theme/colors';

const ORB_SIZE = 160;

export const InteractiveOrb = () => {
  const {
    handleSingleTap,
    handleDoubleTap,
    handleLongPress,
    handlePan,
    handleFling,
    handlePinch,
    handleSimultaneousPanPinch,
  } = useGame();

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const isPinching = useSharedValue(false);
  const isPanning = useSharedValue(false);

  // 1. Одиночний тап (з пріоритетом після невдачі подвійного)
  const singleTap = Gesture.Tap()
    .maxDuration(250)
    .onEnd((_e, success) => {
      if (success) {
        scale.value = withSequence(withTiming(0.92, { duration: 60 }), withSpring(1));
        runOnJS(handleSingleTap)();
      }
    });

  // 2. Подвійний тап (має вищий пріоритет над одиночним)
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(300)
    .onEnd((_e, success) => {
      if (success) {
        scale.value = withSequence(withTiming(1.2, { duration: 80 }), withSpring(1));
        runOnJS(handleDoubleTap)();
      }
    });

  // Взаємовиключний вибір: подвійний тап або одиночний
  const taps = Gesture.Exclusive(doubleTap, singleTap);

  // 3. Довге натискання (3 секунди)
  const longPress = Gesture.LongPress()
    .minDuration(3000)
    .onStart(() => {
      scale.value = withSequence(withTiming(1.3, { duration: 150 }), withSpring(1));
      runOnJS(handleLongPress)();
    });

  // 4. Перетягування (Pan)
  const pan = Gesture.Pan()
    .onStart(() => {
      isPanning.value = true;
    })
    .onChange((e) => {
      translateX.value += e.changeX;
      translateY.value += e.changeY;

      // Перевірка комбінованого жесту (Pan + Pinch)
      if (isPinching.value) {
        runOnJS(handleSimultaneousPanPinch)();
      }
    })
    .onEnd(() => {
      isPanning.value = false;
      // Плавне повернення кулі в центр
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
      runOnJS(handlePan)();
    });

  // 5. Масштабування (Pinch)
  const pinch = Gesture.Pinch()
    .onStart(() => {
      isPinching.value = true;
    })
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      isPinching.value = false;
      savedScale.value = 1;
      scale.value = withSpring(1);
      runOnJS(handlePinch)();
    });

  // 6. Швидкі свайпи (Fling)
  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      translateX.value = withSequence(withTiming(60, { duration: 100 }), withSpring(0));
      runOnJS(handleFling)('right');
    });

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      translateX.value = withSequence(withTiming(-60, { duration: 100 }), withSpring(0));
      runOnJS(handleFling)('left');
    });

  // Компонування жестів:
  // - Pan та Pinch можуть працювати одночасно (Simultaneous)
  // - Свайпи, тапи та утримання працюють паралельно, але взаємно виключають подвійний/одинарний клік
  const composedGesture = Gesture.Simultaneous(
    pan,
    pinch,
    Gesture.Race(flingRight, flingLeft, taps, longPress)
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.orb, animatedStyle]}>
          <View style={styles.coreGlow}>
            <Ionicons name="finger-print" size={60} color={THEME.cyanLight} />
            <Text style={styles.orbLabel}>KINETIC</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orb: {
    width: ORB_SIZE,
    height: ORB_SIZE,
    borderRadius: ORB_SIZE / 2,
    backgroundColor: THEME.primary,
    borderWidth: 4,
    borderColor: THEME.cyan,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  coreGlow: {
    width: ORB_SIZE - 24,
    height: ORB_SIZE - 24,
    borderRadius: (ORB_SIZE - 24) / 2,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#38BDF844',
  },
  orbLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: THEME.textMuted,
    marginTop: 4,
    letterSpacing: 2,
  },
});