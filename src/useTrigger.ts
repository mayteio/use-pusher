import { useCallback } from "react";
import { usePusher } from "./usePusher";
import invariant from "invariant";

/**
 * Trigger events hook
 *
 * @example
 *
 * const trigger = useTrigger();
 * trigger('my-channel', 'my-event', {message: 'hello'});
 */
export function useTrigger() {
  const { client, triggerEndpoint } = usePusher();

  invariant(
    triggerEndpoint,
    "No trigger endpoint specified to <PusherProvider />. Cannot trigger an event."
  );

  /**
   * Memoized trigger function
   */
  const trigger = useCallback(
    (channelName: string, eventName: string, data: any) => {
      const fetchOptions: RequestInit = {
        method: "POST",
        body: JSON.stringify({ channelName, eventName, data })
      };

      if (client.config && client.config.auth) {
        fetchOptions.headers = client.config.auth.headers;
      }

      if (triggerEndpoint) {
        return fetch(triggerEndpoint, fetchOptions);
      }

      return Promise.reject("No trigger endpoint specified");
    },
    [client, triggerEndpoint]
  );

  if (!client.config.auth) {
    console.warn(
      "No auth parameters provided to <PusherProvider />. Event will be unauthenticated."
    );
  }

  return trigger;
}
