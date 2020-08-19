import React from "react";
import { default as PusherReactNative } from "pusher-js/react-native";
import { CorePusherProvider } from "../core/PusherProvider";
import { PusherProviderProps } from "../core/types";

/** Wrapper around the core PusherProvider that passes in the Pusher react-native lib */
export const PusherProvider: React.FC<PusherProviderProps> = (props) => (
  <CorePusherProvider _PusherRuntime={PusherReactNative} {...props} />
);
