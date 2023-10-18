import { BlurView } from 'expo-blur';
import * as React from 'react';
import { useContext, useMemo } from 'react';

import { StyleSheet, Text, View } from 'react-native';
import {
  Contextual,
  ContextualContext,
  ContextualMenu,
  ContextualRoot,
  type ContextualMenuProps,
} from 'react-native-contextual';
import {
  GestureHandlerRootView,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

export default function App() {
  return (
    <GestureHandlerRootView style={style.flex1}>
      <ContextualRoot
        offsetTop={80}
        offsetBottom={20}
        offsetRight={16}
        background={<ContextBackground />}
      >
        <View style={style.header}>
          <Text style={style.boldText}>HEADER</Text>
        </View>
        <ScrollView style={style.flex1}>
          <Message left textLength={100} asyncMenu />
          <Message left textLength={5} />
          <Message textLength={5} />
          <Message textLength={1500} />
          <Message left textLength={250} />
          <Message textLength={50} />
          <Message left textLength={2000} />
        </ScrollView>
        <View style={{}}>
          <Text style={style.boldText}>BOTTOM</Text>
        </View>
      </ContextualRoot>
    </GestureHandlerRootView>
  );
}

const MENU_PROPS: ContextualMenuProps = {
  actions: [
    { key: 'Reply', label: 'Reply', action: () => {} },
    { key: 'Edit', label: 'Edit', action: () => {} },
    {
      key: 'Delete',
      label: 'Delete',
      action: () => {},
      color: 'red',
    },
  ],
};

interface MessageProps {
  asyncMenu?: boolean;
  left?: boolean;
  textLength: number;
}

function Message(props: MessageProps) {
  const { asyncMenu, left, textLength } = props;

  const text = TEXT.substring(0, textLength);

  const menuProps = useMemo(() => {
    if (asyncMenu) {
      return async () => {
        await new Promise<void>((res) => {
          setTimeout(() => res(), 3000);
        });
        return MENU_PROPS;
      };
    }
    return MENU_PROPS;
  }, [asyncMenu]);

  return (
    <View style={[style.messageContainer, left && style.messageContainerLeft]}>
      <View style={style.messageLimit}>
        <Contextual<ContextualMenuProps>
          style={{}}
          Menu={ContextualMenu}
          menuProps={menuProps}
        >
          <View style={[style.message, left && style.messageLeft]}>
            <Text>{text}</Text>
          </View>
        </Contextual>
      </View>
    </View>
  );
}

const TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum eros mi, fringilla vitae lectus id, pharetra molestie sem. Phasellus porta nisl eget tristique venenatis. Etiam facilisis, tortor ac faucibus cursus, ex risus vulputate nunc, et consequat mauris mi at massa. Ut sem leo, tincidunt et tellus vel, consequat eleifend mi. Nam id enim ut lectus sagittis porttitor. Donec a ex justo. Pellentesque efficitur laoreet ligula non vulputate. Donec nec nisl ultrices, ullamcorper nisi eget, dapibus metus. Fusce tempor est dui, eu mollis eros pretium a.

In ac dui vel odio convallis ornare a eget dolor. Donec blandit augue et augue tincidunt, vitae imperdiet tortor efficitur. Fusce eu viverra justo, nec ullamcorper lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas sed diam ut mi mollis suscipit ut id est. Nunc quis luctus nisi, quis gravida mauris. Cras posuere nec mi viverra egestas. Nullam sit amet consequat turpis, quis vestibulum ipsum. Nullam magna leo, semper vel eleifend a, placerat efficitur purus. Fusce dui tellus, dictum quis tellus ut, finibus interdum quam. Vivamus id ligula leo.

Curabitur id placerat eros. Vestibulum fermentum nisi vitae bibendum eleifend. Integer mattis egestas mattis. Aliquam quis urna non neque commodo posuere sit amet quis lorem. Aenean ac turpis commodo, laoreet metus ornare, finibus nunc. Proin a eros eget ex facilisis suscipit ac quis erat. Ut felis massa, porta a sapien sed, scelerisque molestie arcu. Suspendisse aliquet arcu enim, vitae pharetra purus ornare sed. Vivamus at rutrum mauris. Aliquam eleifend non eros auctor semper. Praesent imperdiet posuere odio, ac placerat est egestas non. Nulla interdum efficitur velit vitae mattis. Aliquam non sapien leo.

Sed pulvinar semper ante, at scelerisque sapien maximus ac. Duis condimentum massa sed tellus hendrerit faucibus. Nunc placerat nulla purus, vel ornare nunc fringilla a. Nulla maximus placerat lobortis. Curabitur sed ligula tristique, fringilla lorem non, commodo justo. Pellentesque malesuada, lectus at finibus pretium, augue risus sodales massa, eu convallis erat felis eu massa. Donec feugiat, nisl id venenatis rutrum, felis magna dignissim neque, quis luctus ligula nisi at nulla. Integer condimentum metus vitae lorem sagittis, eu malesuada nulla pretium. Aenean eget velit ut nisl pulvinar varius at eget velit. Pellentesque efficitur nulla erat, ac semper metus pulvinar at. Quisque id nulla at risus pellentesque efficitur sit amet in elit. Vestibulum efficitur fermentum nisl, sed porttitor purus volutpat in. Quisque dignissim vehicula gravida. Praesent sit amet efficitur lorem. Nullam velit odio, placerat id mattis at, suscipit vehicula ipsum.

Nam laoreet quam quis enim pulvinar molestie. Morbi ac est venenatis, cursus urna nec, euismod mi. Duis dictum leo eu sem gravida maximus. Maecenas egestas lorem lorem, at placerat enim facilisis dapibus. Quisque pharetra fermentum rhoncus. Cras vitae dui sem. Phasellus at facilisis augue. Vivamus euismod arcu sit amet sagittis porta. Duis facilisis lorem eget mi dapibus, id fringilla purus auctor. Ut libero nisl, ullamcorper ut porta in, tincidunt cursus lectus. In molestie a eros at auctor.`;

function ContextBackground() {
  const { anim } = useContext(ContextualContext);

  const viewStyle = useAnimatedStyle(
    () => ({ width: '100%', height: '100%', opacity: anim.value }),
    [anim]
  );

  return (
    <Animated.View style={viewStyle}>
      <BlurView style={style.fullSize} />
    </Animated.View>
  );
}

const style = StyleSheet.create({
  header: {
    paddingTop: 80,
    paddingBottom: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  footer: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  boldText: { fontWeight: '700' },
  flex1: { flex: 1 },
  fullSize: { width: '100%', height: '100%' },
  messageLimit: { maxWidth: '80%' },
  messageContainer: {
    width: '100%',
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
  },
  messageContainerLeft: {
    alignItems: 'flex-start',
  },
  message: {
    backgroundColor: '#B9D9EB',
    borderRadius: 8,
    padding: 4,
  },
  messageLeft: { backgroundColor: '#E8E8E8' },
});
