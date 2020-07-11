import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";
import babel from "rollup-plugin-babel";

import pkg from "./package.json";

const plugins = [
  external(),
  url({ exclude: ["**/*.svg"] }),
  resolve(),
  typescript({
    rollupCommonJSResolveHack: true,
    clean: true,
    exclude: ["./src/__tests__/*"],
  }),
  babel({
    extensions: [".tsx"],
    exclude: ["node_modules/**", "./src/__tests__"],
    presets: ["@babel/env", "@babel/preset-react"],
  }),
  commonjs(),
];

export default [
  {
    input: "src/index.ts",
    external: ["pusher-js"],
    plugins,
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: "es",
        exports: "named",
        sourcemap: true,
      },
      {
        // build into our example app for testing with a real client
        file: "example/src/use-pusher/index.js",
        format: "es",
        exports: "named",
        sourcemap: true,
      },
    ],
  },
  {
    external: ["pusher-js", "react-native"],
    plugins,
    input: "src/react-native/index.ts",
    output: [
      {
        file: "react-native/index.js",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
      {
        file: "example-rn/use-pusher/index.js",
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
    ],
  },
];
