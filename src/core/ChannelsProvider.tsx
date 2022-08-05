import { Channel, PresenceChannel } from "pusher-js";
import React, { useCallback, useRef, useState } from "react";
import { ChannelsContextValues } from "./types";

import { usePusher } from "./usePusher";

// context setup
const ChannelsContext = React.createContext<ChannelsContextValues>({});
export const __ChannelsContext = ChannelsContext;

type AcceptedChannels = Channel | PresenceChannel;
type ConnectedChannels = Record<string, AcceptedChannels>;

/**
 * Provider that creates your channels instances and provides it to child hooks throughout your app.
 */

export const ChannelsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { client } = usePusher();
  const usageRef = useRef<Record<string, number>>({});
  const [channels, setChannels] = useState<ConnectedChannels>({});

  const subscribe = useCallback(
    <T extends Channel & PresenceChannel>(channelName: string) => {
      /** Return early if there's no client */
      if (!client) return;

      /** Return early if channel name is falsy */
      if (!channelName) return;

      /** Subscribe to channel and set it in state */
      const pusherChannel = client.subscribe(channelName);
      if (!channels[channelName]) {
        usageRef.current[channelName] = 1;
        setChannels({
          ...channels,
          [channelName]: pusherChannel,
        });
      } else {
        usageRef.current[channelName]++;
      }
      return pusherChannel as T;
    },
    [client, channels, usageRef.current]
  );

  const unsubscribe = useCallback(
    (channelName: string) => {
      /** Return early if there's no client */
      if (!client) return;
      /** Return early if channel name is falsy */
      if (!channelName) return;
      /** Unsubscribe from channel and remove it from state */
      if (channels[channelName] && usageRef.current[channelName] === 1) {
        client.unsubscribe(channelName);
        setChannels((current) => {
          // 👇️ remove channel key from object
          const { [channelName]: _, ...rest } = current;
          return rest;
        });
        delete usageRef.current[channelName];
      } else {
        usageRef.current[channelName]--;
      }
    },
    [client, channels, usageRef.current]
  );

  const getChannel = useCallback(
    <T extends Channel & PresenceChannel>(channelName: string) => {
      /** Return early if there's no client */
      if (!client) return;
      /** Return early if channel name is falsy */
      if (!channelName) return;
      /** Return early if channel is not in state */
      if (!channels[channelName]) return;
      /** Return channel */
      return channels[channelName] as T;
    },
    [channels, client]
  );

  return (
    <ChannelsContext.Provider
      value={{
        unsubscribe,
        subscribe,
        getChannel,
      }}
      children={children}
    />
  );
};
