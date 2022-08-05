import { Channel, PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";
import { useChannels } from "./useChannels";
import { usePusher } from "./usePusher";

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
  const { client } = usePusher();
  const [channel, setChannel] = useState<T>();
  const { subscribe, unsubscribe } = useChannels();

  useEffect(() => {
    if (!channelName || !subscribe || !unsubscribe) return;

    const channel = subscribe<T>(channelName);
    setChannel(channel);
    return () => unsubscribe(channelName);
  }, [channelName, client, subscribe, unsubscribe]);

  if (!channelName) return undefined;

  /** Return the channel for use. */
  return channel;
}
