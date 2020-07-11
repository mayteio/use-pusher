import React from "react";
import Pusher from "pusher-js/react-native";
import { CorePusherProvider } from "./PusherProvider";
import { PusherProviderProps } from "./types";

/** Wrapper around the core PusherProvider that passes in the Pusher react-native lib */
export const PusherProvider: React.FC<PusherProviderProps> = (props) => (
  <CorePusherProvider _PusherRuntime={Pusher} {...props} />
);
