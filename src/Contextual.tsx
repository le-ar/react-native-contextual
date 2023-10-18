import React, {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  Pressable,
  StatusBar,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { ContextualContext } from './ContextualContext';
import { Waiter } from './utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type ContextualProps<P extends {}> = React.PropsWithChildren<{
  style: StyleProp<ViewStyle>;
  Menu: React.ComponentType<P>;
  menuProps: P | (() => P) | (() => Promise<P>);
  onMenuPropsError?: () => void;
}>;

interface DataWaiter<P extends {}> {
  anim: true;
  view: { x: number; y: number; width: number; height: number };
  menu: { width: number; height: number };
  menuProps: P;
}

export function Contextual<P extends {}>(props: ContextualProps<P>) {
  const {
    style,
    children,
    Menu,
    menuProps: menuPropsLocal,
    onMenuPropsError,
  } = props;

  const context = useContext(ContextualContext);
  const { anim, showContext, closeContext } = context;

  const [isContexted, setContexted] = useState(false);
  const [isTouchDown, setTouchDown] = useState(false);
  const [menuProps, setMenuProps] = useState<P>();
  const dataWaiter = useRef<Waiter<DataWaiter<P>> | null>(null);

  const viewRef = useRef<View>(null);

  const onLayoutMenu = useCallback(
    (event: LayoutChangeEvent) => {
      dataWaiter.current?.setData({
        menu: {
          width: normalizeSize(event.nativeEvent.layout.width),
          height: normalizeSize(event.nativeEvent.layout.height),
        },
      });
      setMenuProps(undefined);
    },
    [dataWaiter, setMenuProps]
  );

  const loadMenuProps = useCallback(async () => {
    try {
      const menuPropsValue =
        menuPropsLocal instanceof Function
          ? await menuPropsLocal()
          : menuPropsLocal;
      dataWaiter.current?.setData({ menuProps: menuPropsValue });
      setMenuProps(menuPropsValue);
    } catch (e) {
      onMenuPropsError?.();
    }
  }, [dataWaiter, menuPropsLocal, setMenuProps, onMenuPropsError]);

  const onLongPress = useCallback(() => {
    dataWaiter.current = new Waiter<DataWaiter<P>>(
      { anim: null, view: null, menu: null, menuProps: null },
      (data) => {
        setContexted(true);
        showContext({
          view: children,
          viewLayout: {
            x: data.view.x,
            y: data.view.y,
            width: data.view.width,
            height: data.view.height,
          },
          viewStyle: style,
          Menu,
          menuProps: data.menuProps,
          onClose: () => {
            setContexted(false);
          },
          menuSize: { width: data.menu.width, height: data.menu.height },
        });
      }
    );
    setTouchDown(true);
    loadMenuProps();

    setTimeout(() => dataWaiter.current?.setData({ anim: true }), 100);

    viewRef.current?.measureInWindow((x, y, width, height) => {
      dataWaiter.current?.setData({
        view: {
          x,
          y: y + (Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0),
          width: normalizeSize(width),
          height: normalizeSize(height),
        },
      });
    });
  }, [
    dataWaiter,
    viewRef,
    style,
    children,
    Menu,
    setTouchDown,
    showContext,
    setContexted,
    loadMenuProps,
  ]);

  const onTouchEnd = useCallback(() => setTouchDown(false), [setTouchDown]);

  const animStyle = useAnimatedStyle(
    () => ({
      transform: [
        {
          scale: isTouchDown
            ? withTiming(0.96, { duration: 300 })
            : withTiming(1, { duration: 100 }),
        },
      ],
    }),
    [isTouchDown]
  );

  const contextValue = useMemo(
    () => ({ anim, showContext, closeContext, openContext: onLongPress }),
    [anim, showContext, closeContext, onLongPress]
  );

  return (
    <ContextualContext.Provider value={contextValue}>
      <AnimatedPressable
        onLongPress={onLongPress}
        onTouchEnd={onTouchEnd}
        style={[style, { opacity: isContexted ? 0 : 1 }, animStyle]}
        ref={viewRef}
      >
        {children}
        {isTouchDown && menuProps != null && (
          <View
            style={{ position: 'absolute', opacity: 0 }}
            onLayout={onLayoutMenu}
          >
            <Menu {...menuProps} />
          </View>
        )}
      </AnimatedPressable>
    </ContextualContext.Provider>
  );
}

function normalizeSize(size: number) {
  return Math.ceil(size * 1000) / 1000;
}
