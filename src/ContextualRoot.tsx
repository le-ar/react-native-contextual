import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import {
  ContextualContext,
  type ContextualContextType,
  type ContextualContextVars,
} from './ContextualContext';
import { ContextualRootView } from './ContextualRootView';

export type ContextualRootProps = React.PropsWithChildren<{
  offsetTop?: number;
  offsetBottom?: number;
  background?: React.ReactNode;
}>;

export function ContextualRoot(props: ContextualRootProps) {
  const { offsetTop, offsetBottom, background, children } = props;

  const anim = useSharedValue(0);
  const scroll = useSharedValue(0);
  const scaleAnim = useSharedValue(0.96);

  const [context, setContext] = useState<ContextualContextVars<{
    [key: string]: any;
  }> | null>();

  const showContext = useCallback((vars) => setContext(vars), [setContext]);
  const closeContext = useCallback(() => {
    scroll.value = withTiming(0, { duration: 250 });
    anim.value = withTiming(0, { duration: 250 });
    setTimeout(() => {
      setContext(null);
      context?.onClose?.();
    }, 250);
  }, [context, setContext]);

  const value = useMemo<ContextualContextType>(
    () => ({ anim, showContext, closeContext }),
    [anim, showContext, closeContext]
  );

  useEffect(() => {
    if (context != null) {
      anim.value = withTiming(1, { duration: 250 });
      scaleAnim.value = withTiming(1, { duration: 250 });
    }
  }, [context, anim, scaleAnim]);

  return (
    <ContextualContext.Provider value={value}>
      {children}
      {context == null || (
        <ContextualRootView
          offsetTop={offsetTop}
          offsetBottom={offsetBottom}
          background={background}
          view={context.view}
          viewLayout={context.viewLayout}
          viewStyle={context.viewStyle}
          Menu={context.Menu}
          menuProps={context.menuProps}
          menuSize={context.menuSize}
          anim={anim}
          scroll={scroll}
          scaleAnim={scaleAnim}
        />
      )}
    </ContextualContext.Provider>
  );
}
