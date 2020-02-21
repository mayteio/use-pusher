import React, { useEffect, useRef, useState } from "react";
import Pusher, { Options } from "pusher-js";
import invariant from "invariant";
// import { useDeepCompareMemoize } from "./helpers";
import { PusherContextValues, PusherProviderProps } from "./types";
import dequal from "dequal";

// context setup
const PusherContext = React.createContext<PusherContextValues>({});
export const __PusherContext = PusherContext;

/**
 * Provider that creates your pusher instance and provides it to child hooks throughout your app.
 * Note, you can pass in value={{}} as a prop if you'd like to override the pusher client passed.
 * This is handy when simulating pusher locally, or for testing.
 * @param props Config for Pusher client
 */

export const PusherProvider: React.FC<PusherProviderProps> = ({
  clientKey,
  cluster,
  triggerEndpoint,
  defer = false,
  children,
  ...props
}) => {
  // errors when required props are not passed.
  invariant(clientKey, "A client key is required for pusher");
  invariant(cluster, "A cluster is required for pusher");

  const config: Options = { cluster, ...props };

  // const pusherClientRef = useRef();
  const [client, setClient] = useState<Pusher | undefined>();

  // track config for comparison
  const previousConfig = useRef<Options | undefined>(props);
  useEffect(() => {
    previousConfig.current = props;
  });

  useEffect(() => {
    // Skip creation of client if deferring, a value prop is passed, or config props are the same.
    if (
      defer ||
      props.value ||
      (dequal(previousConfig.current, props) && client !== undefined)
    ) {
      return;
    }

    // create the client and assign it to the ref
    setClient(new Pusher(clientKey, config));
  }, [client, clientKey, props, defer]);

  return (
    <PusherContext.Provider
      value={{
        client,
        triggerEndpoint
      }}
      children={children}
      {...props}
    />
  );
};
