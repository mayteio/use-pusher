import React from "react";
import PusherReactNative from "pusher-js/react-native";
import { PusherProvider as CorePusherProvider } from "../PusherProvider";
import { PusherProviderProps } from "../types";

export { __PusherContext } from "../PusherProvider";

/** Wrapper around the core PusherProvider that passes in the Pusher react-native lib */
export const PusherProvider: React.FC<PusherProviderProps> = (props) => (
  <CorePusherProvider _PusherRuntime={PusherReactNative} {...props} />
);
