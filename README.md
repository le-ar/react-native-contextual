# React Native Contextual

<img src="https://github.com/le-ar/react-native-contextual/blob/main/reactNativeContextualExample.gif" width="350px" />

Context menu like `UIContextMenuInteraction` on iOS

- ✅ Works seamlessly on both ios and android platforms
- ✅ Expo support

## Installation

1. Install [react-native-reanimated](https://www.npmjs.com/package/react-native-reanimated). [Installation](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/#installation)
2. Install [react-native-gesture-handler](https://www.npmjs.com/package/react-native-gesture-handler)
3. Install [react-native-contextual](https://www.npmjs.com/package/react-native-contextual)

```sh
npm install react-native-contextual
```

## Usage

### Top of components

```js
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ContextualBackground, ContextualRoot } from 'react-native-contextual';

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ContextualRoot
        offsetTop={80}
        offsetBottom={20}
        background={<ContextualBackground />}
      >
        {/* Your code here */}
      </ContextualRoot>
    </GestureHandlerRootView>
  );
}
const result = await multiply(3, 7);
```

### Contexted component

```js
import { Contextual, ContextualMenu } from 'react-native-contextual';

function ContextedComponent() {
  return (
    <Contextual
      style={{}}
      Menu={ContextualMenu}
      menuProps={{
        actions: [
          { key: 'Action1', label: 'Action1', action: () => {} },
          {
            key: 'Action2',
            label: 'Action2',
            action: () => {},
            color: 'red',
          },
        ],
      }}
    >
      {/* Some Component */}
    </Contextual>
  );
}
```

## Example

The source code for the example (showcase) app is under the [Example](https://github.com/le-ar/react-native-contextual/tree/main/example) directory. If you want to play with the API but don't feel like trying it on a real app, you can run the example project. Check Example/ directory README for installation instructions.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
