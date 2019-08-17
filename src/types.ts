import { Config } from "pusher-js";
import { ReactNode } from "react";

export interface PusherContextValues {
  client?: any | undefined;
  triggerEndpoint?: string;
  pusherOptions?: Config;
}

export interface PusherProviderProps extends Config {
  clientKey: string;
  cluster: string;
  authEndpoint?: string;
  auth?: any;
  triggerEndpoint?: string;
  children: ReactNode;
}

export interface useChannelOptions {
  skip?: boolean;
}
