import { Config } from "pusher-js";
import { ReactNode } from "react";

export interface PusherContextValues {
  client?: any | undefined;
  triggerEndpoint?: string;
  pusherOptions?: Config;
}

export interface PusherProviderProps extends Config {
  clientKey: string;
  triggerEndpoint?: string;
  children: ReactNode;
}

export interface useChannelOptions {
  skip?: boolean;
}
