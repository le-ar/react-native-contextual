import React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export interface ContextualContextVars<P extends {}> {
  view: React.ReactNode;
  viewLayout: { x: number; y: number; width: number; height: number };
  viewStyle: StyleProp<ViewStyle>;
  Menu: React.ComponentType<P>;
  menuProps: P;
  menuSize: { width: number; height: number };
  onClose: () => void;
}

export interface ContextualContextType {
  anim: SharedValue<number>;
  showContext: <P extends {}>(vars: ContextualContextVars<P>) => void;
  closeContext: () => void;
  openContext?: () => void;
}

export const ContextualContext = React.createContext<ContextualContextType>({
  anim: { value: 0 },
  showContext: () => {},
  closeContext: () => {},
});
