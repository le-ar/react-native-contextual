import React, { useContext } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { ContextualContext } from './ContextualContext';

export interface ContextualMenuProps {
  actions: { key: string; label: string; action: () => void; color?: string }[];
}

export function ContextualMenu(props: ContextualMenuProps) {
  const { actions } = props;

  const { anim, closeContext } = useContext(ContextualContext);

  const viewAnimStyle = useAnimatedStyle(
    () => ({ opacity: anim.value }),
    [anim]
  );

  return (
    <View style={{ paddingVertical: 4, alignItems: 'flex-start' }}>
      <Pressable
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
        onPress={closeContext}
      />
      <Animated.View
        style={[
          {
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
            borderRadius: 8,
            alignItems: 'stretch',
          },
          viewAnimStyle,
        ]}
      >
        {actions.map((action, i) => (
          <Pressable
            key={action.key}
            onPress={action.action}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderBottomColor: '#D3D3D3',
              borderBottomWidth: i >= actions.length - 1 ? 0 : 1,
            }}
          >
            <Text style={{ color: action.color, fontWeight: '500' }}>
              {action.label}
            </Text>
          </Pressable>
        ))}
      </Animated.View>
    </View>
  );
}
