import { useCallback, useEffect, useState } from "react";

import { Member, PresenceChannel } from "pusher-js";
import invariant from "invariant";

import { useChannelOptions } from "./types";
import { useChannel } from "./useChannel";

/**
 * Subscribe to presence channel events and get members back
 *
 * @param channelName name of presence channel. Should have presence- suffix.
 * @param eventName name of event to bind to
 * @param onEvent callback to fire when event is called
 * @param dependencies dependencies array that onEvent uses
 * @param options optional argument to skip events
 *
 * @example
 * const {members} = usePresenceChannel(
 *   "my-channel",
 *   "my-event",
 *   (message) => console.log(message),
 * )
 */
export function usePresenceChannel(
  channelName: string,
  eventName?: string,
  onEvent?: (message: any) => void,
  dependencies?: any[]
) {
  // errors for missing arguments
  invariant(channelName, "channelName required to subscribe to a channel");
  invariant(
    channelName.includes("presence-"),
    "Presence channels should use prefix 'presence-' in their name. Use the useChannel hook instead."
  );

  // Get regular channel functionality
  const { channel } = useChannel(channelName, eventName, onEvent, dependencies);

  const [members, setMembers] = useState({});
  const [myID, setMyID] = useState();
  /**
   * Get members info on subscription success
   */
  const handleSubscriptionSuccess = useCallback((members: any) => {
    setMembers(members.members);
    setMyID(members.myID);
  }, []);

  /**
   * Add or update member in object.
   * @note not using a new Map() here to match pusher-js library.
   */
  const handleAdd = useCallback((member: Member<any>) => {
    setMembers(previousMembers => ({
      ...previousMembers,
      [member.id]: member.info
    }));
  }, []);

  /**
   * Remove member from the state object.
   * @note using delete here so it matches the way pusher-js handles it.
   */
  const handleRemove = useCallback((member: any) => {
    setMembers(previousMembers => {
      const nextMembers: any = { ...previousMembers };
      delete nextMembers[member.id];
      return nextMembers;
    });
  }, []);
  /**
   * Bind and unbind to membership events
   */
  useEffect(() => {
    if (channel) {
      channel.bind("pusher:subscription_succeeded", handleSubscriptionSuccess);
      channel.bind("pusher:member_added", handleAdd);
      channel.bind("pusher:member_removed", handleRemove);
    }

    // cleanup
    return () => {
      if (channel) {
        channel.unbind(
          "pusher:subscription_succeeded",
          handleSubscriptionSuccess
        );
        channel.unbind("pusher:member_added", handleAdd);
        channel.unbind("pusher:member_removed", handleRemove);
      }
    };
  }, [channel, handleSubscriptionSuccess, handleAdd, handleRemove]);

  const presenceChannel = channel as PresenceChannel<any>;

  return { channel: presenceChannel, members, myID };
}
