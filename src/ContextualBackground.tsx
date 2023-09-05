import React, { useContext } from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { ContextualContext } from './ContextualContext';

export interface ContextualBackgroundProps {}

export function ContextualBackground(props: ContextualBackgroundProps) {
  const {} = props;

  const { anim } = useContext(ContextualContext);

  const viewAnim = useAnimatedStyle(
    () => ({
      width: '100%',
      height: '100%',
      backgroundColor: 'white',
      opacity: interpolate(anim.value, [0, 1], [0, 0.7], Extrapolate.CLAMP),
    }),
    [anim]
  );

  return <Animated.View style={viewAnim} />;
}
