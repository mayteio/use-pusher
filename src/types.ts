import Pusher, { Options } from 'pusher-js';
import * as React from 'react';

export interface PusherContextValues {
  client?: React.MutableRefObject<Pusher | undefined>;
  triggerEndpoint?: string;
}

export interface PusherProviderProps extends Options {
  clientKey: string;
  cluster: 'mt1' | 'us2' | 'us3' | 'eu' | 'ap1' | 'ap2' | 'ap3' | 'ap4';
  triggerEndpoint?: string;
  defer?: boolean;
  // for testing purposes
  value?: PusherContextValues;
}
