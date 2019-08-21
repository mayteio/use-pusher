import { useCallback, useEffect } from "react";
import { usePusher } from "./usePusher";
import invariant from "invariant";
import { useChannel } from "./useChannel";

/**
 * Trigger events hook
 *
 * @example
 *
 * const trigger = useTrigger('my-channel');
 * trigger('my-event', {message: 'hello'});
 */
export function useTrigger(channelName: string) {
  const { client, triggerEndpoint } = usePusher();

  // subscribe to the channel we'll be triggering to.
  useChannel(channelName);

  invariant(channelName, "No channel specified to trigger to.");

  invariant(
    triggerEndpoint,
    "No trigger endpoint specified to <PusherProvider />. Cannot trigger an event."
  );

  /**
   * Memoized trigger function
   */
  const trigger = useCallback(
    (eventName: string, data: any) => {
      const fetchOptions: RequestInit = {
        method: "POST",
        body: JSON.stringify({ channelName, eventName, data })
      };

      if (client.current.config && client.current.config.auth) {
        fetchOptions.headers = client.current.config.auth.headers;
      } else {
        console.warn(
          "No auth parameters supplied to <PusherProvider />. Your events will be unauthenticated."
        );
      }

      // forcing triggerEndpoint to exist for TS here
      // because invariant will throw during dev
      return fetch(triggerEndpoint!, fetchOptions);
    },
    [client, triggerEndpoint, channelName]
  );

  return trigger;
}
