import { default as Pusher, Options } from "pusher-js";
import { PusherContextValues, PusherProviderProps } from "./types";
import React, { useEffect, useRef, useState } from "react";

import { dequal } from "dequal";

// context setup
const PusherContext = React.createContext<PusherContextValues>({});
export const __PusherContext = PusherContext;

/**
 * Provider that creates your pusher instance and provides it to child hooks throughout your app.
 * Note, you can pass in value={{}} as a prop if you'd like to override the pusher client passed.
 * This is handy when simulating pusher locally, or for testing.
 * @param props Config for Pusher client
 */

export const CorePusherProvider: React.FC<PusherProviderProps> = ({
  clientKey,
  cluster,
  triggerEndpoint,
  defer = false,
  logToConsole = false,
  children,
  _PusherRuntime,
  ...props
}) => {
  // errors when required props are not passed.
  useEffect(() => {
    if (!clientKey) console.error("A client key is required for pusher");
    if (!cluster) console.error("A cluster is required for pusher");
  }, [clientKey, cluster]);

  Pusher.logToConsole = logToConsole;

  const config: Options = { cluster, ...props };

  // track config for comparison
  const previousConfig = useRef<Options | undefined>(props);
  useEffect(() => {
    previousConfig.current = props;
  });
  const [client, setClient] = useState<any | undefined>();

  useEffect(() => {
    // Skip creation of client if deferring, a value prop is passed, or config props are the same.
    if (
      !_PusherRuntime ||
      defer ||
      props.value ||
      (dequal(previousConfig.current, props) && client !== undefined)
    ) {
      return;
    }

    // @ts-ignore
    setClient(new _PusherRuntime(clientKey, config));
  }, [client, clientKey, props, defer]);

  return (
    <PusherContext.Provider
      value={{
        client,
        triggerEndpoint,
      }}
      children={children}
      {...props}
    />
  );
};
