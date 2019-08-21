import { Config, AuthConfig } from "pusher-js";
import * as React from "react";

export interface PusherContextValues {
  client?: any | undefined;
  triggerEndpoint?: string;
  pusherOptions?: Config;
}

export interface PusherProviderProps extends Config {
  clientKey: string;
  cluster: string;
  authEndpoint?: string;
  auth?: AuthConfig;
  triggerEndpoint?: string;
  defer?: boolean;
  children: React.ReactNode;
  // for testing purposes
  value: any;
}

export interface useChannelOptions {
  skip?: boolean;
}
