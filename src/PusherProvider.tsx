import React, { useEffect, useState } from "react";
import Pusher, { Config } from "pusher-js";
import invariant from "invariant";
import { useDeepCompareMemoize } from "./helpers";
import { PusherContextValues, PusherProviderProps } from "./types";

// context setup
export const __PusherContext = React.createContext<PusherContextValues>({});
export const __PusherConsumer = __PusherContext.Consumer;

/**
 * Provider for the pusher service in an app
 * @param props Config for Pusher client
 */
export function PusherProvider({
  clientKey,
  cluster,
  triggerEndpoint,
  authEndpoint,
  auth,
  ...props
}: PusherProviderProps) {
  // errors when required props are not passed.
  invariant(clientKey, "A client key is required for pusher");
  invariant(cluster, "A cluster is required for pusher");

  const pusherOptions: Config = { cluster };
  if (authEndpoint) pusherOptions.authEndpoint = authEndpoint;
  if (auth) pusherOptions.auth = auth;

  // when the options passed to the provider change,
  // create a new instance of pusher
  const [pusherClient, setPusherClient] = useState();

  useEffect(() => {
    setPusherClient(new Pusher(clientKey, pusherOptions));
  }, useDeepCompareMemoize([clientKey, pusherOptions]));

  return (
    <__PusherContext.Provider
      value={{
        client: pusherClient,
        triggerEndpoint
      }}
      {...props}
    />
  );
}
