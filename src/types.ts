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
  children: React.ReactNode;
}

export interface useChannelOptions {
  skip?: boolean;
}
