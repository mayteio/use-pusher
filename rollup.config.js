import typescript from "rollup-plugin-typescript2";
import commonjs from "rollup-plugin-commonjs";
import external from "rollup-plugin-peer-deps-external";
import resolve from "rollup-plugin-node-resolve";
import url from "rollup-plugin-url";
import babel from "rollup-plugin-babel";

import pkg from "./package.json";

export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true
    },
    {
      // build into our example app for testing with a real client
      file: "example/src/use-pusher/index.js",
      format: "es",
      exports: "named",
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    url({ exclude: ["**/*.svg"] }),
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      exclude: ["./src/__tests__/*"]
    }),
    babel({
      extensions: [".tsx"],
      exclude: ["node_modules/**", "./src/__tests__"],
      presets: ["@babel/env", "@babel/preset-react"]
    }),
    commonjs()
  ],
  external: ["pusher-js"]
};
