import { Channel, PresenceChannel } from "pusher-js";

import invariant from "invariant";
import { useEffect } from "react";

/**
 * Subscribes to a channel event and registers a callback.
 * @param channel Pusher channel to bind to
 * @param eventName Name of event to bind to
 * @param callback Callback to call on a new event
 */
export function useEvent<D>(
  channel: Channel | Channel[] | PresenceChannel | undefined,
  eventName: string,
  callback: (data?: D, metadata?: { user_id: string }) => void
) {
  // error when required arguments aren't passed.
  invariant(eventName, "Must supply eventName and callback to onEvent");
  invariant(callback, "Must supply callback to onEvent");

  // bind and unbind events whenever the channel, eventName or callback changes.
  useEffect(() => {
    if (channel === undefined) {
      return;
    } else if (Array.isArray(channel)) {
      channel.forEach((cn) => cn.bind(eventName, callback));
    } else channel.bind(eventName, callback);
    return () => {
      if (Array.isArray(channel)) {
        channel.forEach((cn) => cn.bind(eventName, callback));
      } else channel.unbind(eventName, callback);
    };
  }, [channel, eventName, callback]);
}
