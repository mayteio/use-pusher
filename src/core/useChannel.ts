import { Channel, PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";
import { useChannels } from "./useChannels";

/**
 * Subscribe to a channel
 *
 * @param channelName The name of the channel you want to subscribe to.
 * @typeparam Type of channel you're subscribing to. Can be one of `Channel` or `PresenceChannel` from `pusher-js`.
 * @returns Instance of the channel you just subscribed to.
 *
 * @example
 * ```javascript
 * const channel = useChannel("my-channel")
 * channel.bind('some-event', () => {})
 * ```
 */

export function useChannel<T extends Channel & PresenceChannel>(
  channelName: string | undefined
) {
  const [channel, setChannel] = useState<Channel & PresenceChannel>();
  const { subscribe, unsubscribe } = useChannels();

  useEffect(() => {
    if (!channelName || !subscribe || !unsubscribe) return;

    const _channel = subscribe<T>(channelName);
    setChannel(_channel);
    return () => unsubscribe(channelName);
  }, [channelName, subscribe, unsubscribe]);

  /** Return the channel for use. */
  return channel;
}
