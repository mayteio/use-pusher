// jest.config.js
const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  ...tsjPreset,
  preset: "react-native",
  transform: {
    ...tsjPreset.transform,
    "\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
  },
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
  testPathIgnorePatterns: [
    "<rootDir>/src/__tests__/useTrigger.tsx",
    "<rootDir>/examples/native-use-pusher-example/__tests__/App.js",
  ],
  // This is the only part which you can keep
  // from the above linked tutorial's config:
  cacheDirectory: ".jest/cache",
  setupFiles: ["<rootDir>/setupTests.rn.js"],
};
