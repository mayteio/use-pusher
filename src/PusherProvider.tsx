import React, { useEffect, useRef } from "react";
import PusherClass, { Pusher, Config } from "pusher-js";
import invariant from "invariant";
// import { useDeepCompareMemoize } from "./helpers";
import { PusherContextValues, PusherProviderProps } from "./types";
import dequal from "dequal";

// context setup
const PusherContext = React.createContext<PusherContextValues>({});
export const __PusherContext = PusherContext;
export const __PusherConsumer = PusherContext.Consumer;

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
  defer = false,
  ...props
}: PusherProviderProps) {
  // errors when required props are not passed.
  invariant(clientKey, "A client key is required for pusher");
  invariant(cluster, "A cluster is required for pusher");

  const config: Config = { cluster };
  if (authEndpoint) config.authEndpoint = authEndpoint;
  if (auth) config.auth = auth;

  const pusherClientRef = useRef<Pusher>(new PusherClass(clientKey, config));
  useEffect(() => {
    if (
      dequal(previousConfig.current, config) &&
      pusherClientRef.current !== undefined
    ) {
      return;
    }

    if (!defer) {
      pusherClientRef.current && pusherClientRef.current.disconnect();
      pusherClientRef.current = new PusherClass(clientKey, config);
    }
  }, [clientKey, config, defer, pusherClientRef]);

  // track config for comparison
  const previousConfig = useRef<Config | undefined>();
  useEffect(() => {
    previousConfig.current = config;
  });

  return (
    <PusherContext.Provider
      value={{
        client: pusherClientRef,
        triggerEndpoint
      }}
      {...props}
    />
  );
}
