import React, { useContext, useEffect, useMemo } from 'react';
import {
  Pressable,
  View,
  useWindowDimensions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  type SharedValue,
} from 'react-native-reanimated';
import { ContextualContext } from './ContextualContext';

export interface ContextualRootViewProps<P extends {}> {
  offsetTop?: number;
  offsetBottom?: number;
  offsetRight?: number;

  background?: React.ReactNode;

  view: React.ReactNode;
  viewLayout: { x: number; y: number; width: number; height: number };
  viewStyle: StyleProp<ViewStyle>;
  Menu: React.ComponentType<P>;
  menuProps: P;
  menuSize: { width: number; height: number };

  anim: SharedValue<number>;
  scroll: SharedValue<number>;
  scaleAnim: SharedValue<number>;
}

export function ContextualRootView<P extends {}>(
  props: ContextualRootViewProps<P>
) {
  const {
    offsetTop: offsetTopProps,
    offsetBottom: offsetBottomProps,
    offsetRight: offsetRightProps,
    background,
    view,
    viewLayout,
    viewStyle,
    Menu,
    menuProps,
    menuSize,
    anim,
    scroll,
    scaleAnim,
  } = props;

  const offsetTop = offsetTopProps ?? 0;
  const offsetBottom = offsetBottomProps ?? 0;
  const offsetRight = offsetRightProps ?? 0;

  const window = useWindowDimensions();
  const context = useContext(ContextualContext);
  const { closeContext } = context;

  const maxScroll = useSharedValue(0);
  const topAnim = useSharedValue(viewLayout.y);
  const leftAnim = useSharedValue(viewLayout.x);

  useEffect(() => {
    const topSafe = offsetTop ?? 0;
    const bottomSafe = offsetBottom ?? 0;

    const safeHeight = window.height - topSafe - bottomSafe;
    const fullHeight = viewLayout.height + menuSize.height;
    if (fullHeight > safeHeight) {
      maxScroll.value = fullHeight - safeHeight;
    }
  }, [
    maxScroll,
    menuSize.height,
    offsetBottom,
    offsetTop,
    viewLayout.height,
    window.height,
  ]);

  const topStart = useDerivedValue(() => {
    const topSafe = offsetTop ?? 0;
    const bottomSafe = offsetBottom ?? 0;

    let topResult = topAnim.value;
    const isTopOverflow = topResult < topSafe;
    if (isTopOverflow) {
      topResult = topSafe;
    }

    const fullHeight = viewLayout.height + menuSize.height;

    const isBottomOverflow =
      topResult + fullHeight > window.height - bottomSafe;
    if (isBottomOverflow) {
      const delta = window.height - bottomSafe - topResult - fullHeight;
      topResult = topResult + delta;
    }

    return topResult;
  }, [offsetTop, offsetBottom, viewLayout]);

  const menuWidth = useSharedValue(0);

  useDerivedValue(() => {
    'worklet';

    topAnim.value = interpolate(
      anim.value,
      [0, 1],
      [viewLayout.y, topStart.value],
      Extrapolate.CLAMP
    );
  }, []);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onChange((e) => {
          const newTop = scroll.value + e.changeY;
          scroll.value = Math.min(maxScroll.value, Math.max(0, newTop));
        })
        .onEnd((e) => {
          scroll.value = withDecay({
            velocity: e.velocityY,
            clamp: [0, maxScroll.value],
          });
        }),
    [scroll, maxScroll]
  );

  const viewAnimStyle = useAnimatedStyle(
    () => ({
      left: viewLayout.x,
      top: topAnim.value + scroll.value,
      transform: [{ scale: scaleAnim.value }],
    }),
    [scaleAnim, topAnim, leftAnim, scroll]
  );

  const menuStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          translateX: Math.min(
            window.width - leftAnim.value - menuWidth.value - offsetRight,
            0
          ),
        },
      ],
    }),
    [menuWidth, leftAnim, window.width, offsetRight]
  );

  return (
    <View
      style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
    >
      <Pressable
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
        }}
        onPress={closeContext}
      >
        {background}
      </Pressable>

      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              position: 'absolute',
            },
            viewAnimStyle,
          ]}
        >
          <View
            style={[
              viewStyle,
              {
                width: viewLayout.width,
                height: viewLayout.height,
              },
            ]}
          >
            {view}
          </View>
          <Animated.View
            style={menuStyle}
            onLayout={(e) => {
              menuWidth.value = e.nativeEvent.layout.width;
            }}
          >
            <Menu {...menuProps} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
