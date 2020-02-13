import { Options, AuthOptions } from 'pusher-js';
import * as React from 'react';

export interface PusherContextValues {
  client?: any | undefined;
  triggerEndpoint?: string;
}

export interface PusherProviderProps extends Options {
  clientKey: string;
  cluster: string;
  authEndpoint?: string;
  auth?: AuthOptions;
  triggerEndpoint?: string;
  defer?: boolean;
  children: React.ReactNode;
  // for testing purposes
  value?: any;
}

export interface useChannelOptions {
  skip?: boolean;
}
