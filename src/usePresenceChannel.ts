import { Members, PresenceChannel } from "pusher-js";
import { useEffect, useState } from "react";

import invariant from "invariant";
import { useChannel } from "./useChannel";

/**
 * Subscribe to presence channel events and get members back
 *
 * @param channelName name of presence the channel. Should have `presence-` suffix.
 * @returns Object with `channel`, `members` and `myID` properties.
 *
 * @example
 * ```javascript
 * const { channel, members, myID } = usePresenceChannel("presence-my-channel");
 * ```
 */
export function usePresenceChannel(channelName: string) {
  // errors for missing arguments
  invariant(
    channelName.includes("presence-"),
    "Presence channels should use prefix 'presence-' in their name. Use the useChannel hook instead."
  );

  // Get regular channel functionality
  const [members, setMembers] = useState({});
  const [myID, setMyID] = useState();

  // bind and unbind member events events on our channel
  const channel = useChannel<PresenceChannel>(channelName);
  useEffect(() => {
    if (channel) {
      // Get membership info on successful subscription
      const handleSubscriptionSuccess = (members: Members) => {
        setMembers(members.members);
        setMyID(members.myID);
      };

      // add a member to the members object
      const handleAdd = (member: any) => {
        setMembers((previousMembers) => ({
          ...previousMembers,
          [member.id]: member.info
        }));
      };

      // remove a member from the members object
      const handleRemove = (member: any) => {
        setMembers((previousMembers) => {
          const nextMembers: any = { ...previousMembers };
          delete nextMembers[member.id];
          return nextMembers;
        });
      };

      // bind to all member addition/removal events
      channel.bind("pusher:subscription_succeeded", handleSubscriptionSuccess);
      channel.bind("pusher:member_added", handleAdd);
      channel.bind("pusher:member_removed", handleRemove);

      // set any members that already existed on the channel
      if (channel.members) {
        setMembers(channel.members.members);
        setMyID(channel.members.myID);
      }

      // cleanup
      return () => {
        channel.unbind(
          "pusher:subscription_succeeded",
          handleSubscriptionSuccess
        );
        channel.unbind("pusher:member_added", handleAdd);
        channel.unbind("pusher:member_removed", handleRemove);
      };
    }

    // to make typescript happy.
    return () => {};
  }, [channel]);

  return {
    channel,
    members,
    myID
  };
}
