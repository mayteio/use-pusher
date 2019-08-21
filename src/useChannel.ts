import { useEffect, useState } from "react";
import invariant from "invariant";

import { usePusher } from "./usePusher";

/**
 * Subscribe to channel events
 *
 * @example
 * useChannel(
 *   "my-channel",
 *   "my-event",
 *   (message) => console.log(message)
 * )
 */

export function useChannel(channelName: string) {
  // errors for missing arguments
  invariant(channelName, "channelName required to subscribe to a channel");

  const { client } = usePusher();
  const [channel, setChannel] = useState<any>();

  const pusherClient = client.current;
  useEffect(() => {
    if (!pusherClient) return;
    const pusherChannel = pusherClient.subscribe(channelName);
    setChannel(pusherChannel);
  }, [channelName, pusherClient]);
  return channel;
}
