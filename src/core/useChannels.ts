import { Channel, PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";
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

export const NO_CHANNEL_NAME_WARNING =
  "No channel name passed to useChannel. No channel has been subscribed to.";

export function useChannels<T extends Channel & PresenceChannel>(
  channelNames: string[] | undefined
) {
  const { client } = usePusher();
  const [channels, setChannels] = useState<T[] | undefined>();
  const sortedJoinedChannelNames = (channelNames || []).sort().join(".");
  useEffect(() => {
    /** Return early if there's no client */
    if (!client) return;

    /** Return early and warn if there's no channels */
    if (channelNames === undefined || channelNames.length === 0) {
      console.warn(NO_CHANNEL_NAME_WARNING);
      return;
    }

    /** Subscribe to channels and set it in state */
    const pusherChannels = channelNames.map((cn) => client.subscribe(cn));
    setChannels(pusherChannels as T);

    /** Cleanup on unmount/re-render */
    return () => channelNames.forEach((cn) => client?.unsubscribe(cn));
  }, [sortedJoinedChannelNames, client]);

  /** Return the channel for use. */
  return channels;
}
