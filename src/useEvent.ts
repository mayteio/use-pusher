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
export function useEvent(
  channel: Channel | PresenceChannel<any> | undefined,
  eventName: string,
  callback: EventCallback,
  dependencies: any[] = []
) {
  invariant(eventName, "Must supply eventName and callback to onEvent");
  invariant(callback, "Must supply callback to onEvent");

  const callbackRef = useCallback<EventCallback>(callback, dependencies);
  useEffect(() => {
    if (channel === undefined) {
      console.warn("No channel supplied to onEvent.");
      return;
    }
    channel.bind(eventName, callbackRef);
    return () => {
      channel.unbind(eventName, callbackRef);
    };
  }, [channel, eventName, callbackRef]);
}
