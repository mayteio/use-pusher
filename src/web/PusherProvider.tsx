import React from "react";
import { default as Pusher } from "pusher-js";
import { CorePusherProvider } from "../core/PusherProvider";
import { PusherProviderProps } from "../core/types";

/** Wrapper around the core PusherProvider that passes in the Pusher lib */
export const PusherProvider: React.FC<PusherProviderProps> = (props) => (
  <CorePusherProvider _PusherRuntime={Pusher} {...props} />
);
