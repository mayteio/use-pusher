import { useCallback } from "react";
import invariant from "invariant";
import { Channel, PresenceChannel } from "pusher-js";

export function useClientTrigger<T>(channel: Channel | PresenceChannel<T>) {
  channel &&
    invariant(
      channel.name.match(/(private-|presence-)/gi),
      "Channel pass wasn't private or presence channel. Client events only work on these types of channels."
    );

  // memoize trigger so it's not being created every render
  const trigger = useCallback(
    (eventName: string, data?: any) => {
      invariant(eventName, "Must pass event name to trigger a client event.");
      channel && channel.trigger(eventName, data);
    },
    [channel]
  );

  return trigger;
}
