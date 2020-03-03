import Pusher, { Options } from "pusher-js";
import * as React from "react";
import "jest-fetch-mock";

export interface PusherContextValues {
  // client?: React.MutableRefObject<Pusher | undefined>;
  client?: Pusher;
  triggerEndpoint?: string;
}

export interface PusherProviderProps extends Options {
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
