import { useCallback, useEffect } from "react";
import invariant from "invariant";
import { Channel, PresenceChannel, EventCallback } from "pusher-js";

/**
 *
 * @param channel Pusher channel to bind to
 * @param eventName Name of event to bind to
 * @param callback Callback to call on a new event
 * @param dependencies Dependencies the callback uses.
 */
export function useEvent<T>(
  channel: Channel | PresenceChannel<any> | undefined,
  eventName: string,
  callback: (data?: T) => void,
  dependencies: any[] = []
) {
  invariant(eventName, "Must supply eventName and callback to onEvent");
  invariant(callback, "Must supply callback to onEvent");

  useEffect(() => {
    if (dependencies) {
      console.warn(
        "dependencies are no longer honoured - memoizing the callback is up to the developer."
      );
    }
  }, [dependencies]);

  // const callbackRef = useCallback<EventCallback>(callback, dependencies);
  useEffect(() => {
    if (channel === undefined) {
      // console.warn("No channel supplied to onEvent. Not binding callback.");
      return;
    }
    channel.bind(eventName, callback);
    return () => {
      channel.unbind(eventName, callback);
    };
  }, [channel, eventName, callback]);
}
