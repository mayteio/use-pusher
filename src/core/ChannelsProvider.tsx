import { Channel, PresenceChannel } from "pusher-js";
import React, { useCallback, useRef } from "react";
import { ChannelsContextValues } from "./types";

import { usePusher } from "./usePusher";

// context setup
const ChannelsContext = React.createContext<ChannelsContextValues>({});
export const __ChannelsContext = ChannelsContext;

type AcceptedChannels = Channel | PresenceChannel;
type ConnectedChannels = {
  [channelName: string]: AcceptedChannels[];
};

/**
 * Provider that creates your channels instances and provides it to child hooks throughout your app.
 */

export const ChannelsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { client } = usePusher();
  const connectedChannels = useRef<ConnectedChannels>({});

  const subscribe = useCallback(
    <T extends Channel & PresenceChannel>(channelName: string) => {
      /** Return early if there's no client */
      if (!client) return;

      /** Return early if channel name is falsy */
      if (!channelName) return;

      /** Subscribe to channel and set it in state */
      const pusherChannel = client.subscribe(channelName);
      connectedChannels.current[channelName] = [
        ...(connectedChannels.current[channelName] || []),
        pusherChannel,
      ];
      return pusherChannel as T;
    },
    [client, connectedChannels]
  );

  const unsubscribe = useCallback(
    (channelName: string) => {
      /** Return early if there's no client */
      if (!client) return;
      /** Return early if channel name is falsy */
      if (!channelName) return;
      /** If no connection, just skip*/
      if (!connectedChannels.current[channelName]?.length) return;

      /** If just one connection, unsubscribe totally*/
      if (connectedChannels.current[channelName].length === 1) {
        client.unsubscribe(channelName);
        delete connectedChannels.current[channelName];
      } else {
        connectedChannels.current[channelName].pop();
      }
    },
    [connectedChannels, client]
  );

  const getChannel = useCallback(
    <T extends Channel & PresenceChannel>(channelName: string) => {
      /** Return early if there's no client */
      if (!client) return;
      /** Return early if channel name is falsy */
      if (!channelName) return;
      /** Return early if channel is not in state */
      if (!connectedChannels.current[channelName]) return;
      /** Return channel */
      return connectedChannels.current[channelName][0] as T;
    },
    [connectedChannels, client]
  );

  return (
    <ChannelsContext.Provider
      value={{
        unsubscribe,
        subscribe,
        getChannel,
      }}
    >
      {children}
    </ChannelsContext.Provider>
  );
};
