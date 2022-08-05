import {
  Channel,
  default as Pusher,
  Options,
  PresenceChannel,
} from "pusher-js";
import * as React from "react";
import "jest-fetch-mock";

export interface PusherContextValues {
  // client?: React.MutableRefObject<Pusher | undefined>;
  client?: Pusher;
  triggerEndpoint?: string;
}

export interface ChannelsContextValues {
  subscribe?: <T extends Channel & PresenceChannel>(
    channelName: string
  ) => T | undefined;
  unsubscribe?: <T extends Channel & PresenceChannel>(
    channelName: string
  ) => void;
  getChannel?: <T extends Channel & PresenceChannel>(
    channelName: string
  ) => T | undefined;
}

export interface PusherProviderProps extends Options {
  _PusherRuntime?: typeof Pusher;
  children: React.ReactNode;
  clientKey: string | undefined;
  cluster:
    | "mt1"
    | "us2"
    | "us3"
    | "eu"
    | "ap1"
    | "ap2"
    | "ap3"
    | "ap4"
    | string
    | undefined;
  triggerEndpoint?: string;
  defer?: boolean;
  // for testing purposes
  value?: PusherContextValues;
}
