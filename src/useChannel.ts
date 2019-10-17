import { useEffect, useState } from "react";
import invariant from "invariant";

import { usePusher } from "./usePusher";

/**
 * Subscribe to channel
 *
 * @example
 * useChannel("my-channel")
 */

export function useChannel(channelName: string) {
  // errors for missing arguments
  invariant(channelName, "channelName required to subscribe to a channel");

  const { client } = usePusher();
  const pusherClient = client.current;

  const [channel, setChannel] = useState<any>();

  useEffect(() => {
    if (!pusherClient) return;
    const channel = pusherClient.subscribe(channelName);
    setChannel(channel);
  }, [channelName, pusherClient]);
  return channel;
}
