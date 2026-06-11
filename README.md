# with-build-settings

An [Expo Config Plugin](https://docs.expo.dev/config-plugins/introduction/) that lets you set arbitrary iOS build settings directly from your `app.config.js` / `app.config.ts`.

## Why?

Expo's managed workflow abstracts away the native Xcode project, but some libraries or deployment requirements need specific entries in the build settings (e.g. `SWIFT_VERSION`, `OTHER_LDFLAGS`, `ENABLE_BITCODE`, custom preprocessor macros, etc.). Rather than ejecting or maintaining a custom prebuild script, this plugin patches every build configuration in your `.xcodeproj` at prebuild time.

## Installation

```bash
npm install with-build-settings
# or
yarn add with-build-settings
```

## Usage

Add the plugin to your `app.config.js` or `app.config.ts` and pass the build settings you want to inject as key-value pairs:

```js
// app.config.js
export default {
  plugins: [
    [
      "@leko/expo-ios-build-settings",
      {
        SWIFT_VERSION: "5.0",
        ENABLE_BITCODE: "NO",
        OTHER_LDFLAGS: "$(inherited) -ObjC",
      },
    ],
  ],
};
```

Then run prebuild to apply the changes:

```bash
npx expo prebuild --platform ios
```

## Configuration

The plugin accepts a plain `object` — any key-value pair that is valid in an Xcode build configuration block.

| Key                   | Type     | Description                                      |
| --------------------- | -------- | ------------------------------------------------ |
| `[BUILD_SETTING_KEY]` | `string` | Any valid Xcode build setting name and its value |

### Common examples

| Setting                        | Example value              | Purpose                                 |
| ------------------------------ | -------------------------- | --------------------------------------- |
| `SWIFT_VERSION`                | `"5.0"`                    | Set the Swift language version          |
| `ENABLE_BITCODE`               | `"NO"`                     | Disable Bitcode (required by some SDKs) |
| `GCC_PREPROCESSOR_DEFINITIONS` | `"$(inherited) MY_FLAG=1"` | Inject preprocessor macros              |
| `OTHER_LDFLAGS`                | `"$(inherited) -ObjC"`     | Append linker flags                     |
| `IPHONEOS_DEPLOYMENT_TARGET`   | `"14.0"`                   | Override the minimum iOS version        |

## How it works

The plugin uses `withXcodeProject` from `@expo/config-plugins` to access the parsed `.xcodeproj` at prebuild time. It then iterates over every entry in `pbxXCBuildConfigurationSection()` — which covers both **Debug** and **Release** configurations — and writes the provided key-value pairs into each configuration's `buildSettings` object.

```
app.config.js  ──►  withBuildSettings  ──►  withXcodeProject  ──►  .xcodeproj
                    (your key/values)        (Expo mod system)     buildSettings{}
```

> **Note:** Settings are applied to **all** build configurations (Debug, Release, and any custom ones).

## Requirements

- Expo SDK 47+
- `@expo/config-plugins` (included transitively with Expo)

## License

MIT
