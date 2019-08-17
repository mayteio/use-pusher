import { useCallback, useEffect, useState } from "react";

import { Channel, EventCallback } from "pusher-js";
import invariant from "invariant";

import { usePusher } from "./usePusher";
import { useChannelOptions } from "./types";

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

export function useChannel(
  channelName: string,
  eventName?: string,
  onEvent?: (message: any) => void,
  dependencies?: any[],
  options?: useChannelOptions
) {
  // errors for missing arguments
  invariant(channelName, "channelName required to subscribe to a channel");
  invariant(eventName, "eventName required to bind to an event");
  invariant(onEvent, "onEvent required to callback on event");

  // initialise defaults
  const defaultOptions = { skip: false };
  const hookOptions = options
    ? { ...defaultOptions, ...options }
    : defaultOptions;
  const eventHandler = onEvent ? onEvent : () => {};
  const deps = dependencies ? dependencies : [];

  // hook setup
  const { client } = usePusher();
  const callback = useCallback<EventCallback>(eventHandler, deps);
  const [channel, setChannel] = useState<Channel | undefined>();

  useEffect(() => {
    if (client && !hookOptions.skip && channelName) {
      // subscribe to the channel
      const pusherChannel = client.subscribe(channelName);
      // if there's an eventName, bind to it.
      eventName && pusherChannel.bind(eventName, callback);

      // store the ref for cleanup
      setChannel(pusherChannel);
    }
  }, [client, callback, hookOptions.skip, eventName, channelName]);

  // cleanup on unmount
  useEffect(
    () => () => {
      if (client && channel) {
        client.unsubscribe(channelName);
      }

      if (client && channel && eventName) {
        channel.unbind(eventName, callback);
      }
    },
    [client, channel]
  );

  // return channel instance back for unsafe things like channel.trigger()
  return channel;
}
