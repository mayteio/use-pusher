import { Channel, PresenceChannel } from "pusher-js";

import invariant from "invariant";
import { useCallback } from "react";

/**
 *
 * @param channel the channel you'd like to trigger clientEvents on. Get this from [[useChannel]] or [[usePresenceChannel]].
 * @typeparam TData shape of the data you're sending with the event.
 * @returns A memoized trigger function that will perform client events on the channel.
 * @example
 * ```javascript
 * const channel = useChannel('my-channel');
 * const trigger = useClientTrigger(channel)
 *
 * const handleClick = () => trigger('some-client-event', {});
 * ```
 */
export function useClientTrigger<TData = {}>(
  channel: Channel | PresenceChannel
) {
  channel &&
    invariant(
      channel.name.match(/(private-|presence-)/gi),
      "Channel provided to useClientTrigger wasn't private or presence channel. Client events only work on these types of channels."
    );

  // memoize trigger so it's not being created every render
  const trigger = useCallback(
    (eventName: string, data: TData) => {
      invariant(eventName, "Must pass event name to trigger a client event.");
      channel && channel.trigger(eventName, data);
    },
    [channel]
  );

  return trigger;
}
