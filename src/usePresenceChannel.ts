import { Members, PresenceChannel } from "pusher-js";
import { useEffect, useReducer } from "react";

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

/** Internal state */
type PresenceChannelState = {
  members: Record<string, any>;
  me: Record<string, any> | undefined;
  myID: string | undefined;
  count: number;
};

type MemberAction = { id: string; info?: Record<string, any> };

type ReducerAction = {
  type: typeof SET_STATE | typeof ADD_MEMBER | typeof REMOVE_MEMBER;
  payload: Partial<PresenceChannelState> | MemberAction;
};

/** Hook return value */
interface usePresenceChannelValue extends Partial<PresenceChannelState> {
  channel?: PresenceChannel;
}

/** Presence channel reducer to keep track of state */
export const SET_STATE = "set-state";
export const ADD_MEMBER = "add-member";
export const REMOVE_MEMBER = "remove-member";
export const presenceChannelReducer = (
  state: PresenceChannelState,
  { type, payload }: ReducerAction
) => {
  switch (type) {
    /** Generic setState */
    case SET_STATE:
      return { ...state, ...payload };

    /** Member added */
    case ADD_MEMBER:
      const { id: addedMemberId, info } = payload as MemberAction;
      return {
        ...state,
        count: state.count + 1,
        members: {
          ...state.members,
          [addedMemberId]: info,
        },
      };

    /** Member removed */
    case REMOVE_MEMBER:
      const { id: removedMemberId } = payload as MemberAction;
      const members = { ...state.members };
      delete members[removedMemberId];
      return {
        ...state,
        count: state.count - 1,
        members: {
          ...members,
        },
      };
  }
};

export function usePresenceChannel(
  channelName: string | undefined
): usePresenceChannelValue {
  // errors for missing arguments
  invariant(
    channelName && channelName.includes("presence-"),
    "Presence channels should use prefix 'presence-' in their name. Use the useChannel hook instead."
  );

  /** Store internal channel state */
  const [state, dispatch] = useReducer(presenceChannelReducer, {
    members: {},
    me: undefined,
    myID: undefined,
    count: 0,
  });

  // bind and unbind member events events on our channel
  const channel = useChannel<PresenceChannel>(channelName);
  useEffect(() => {
    if (channel) {
      // Get membership info on successful subscription
      const handleSubscriptionSuccess = (members: Members) => {
        dispatch({
          type: SET_STATE,
          payload: {
            members: members.members,
            myID: members.myID,
            me: members.me,
            count: Object.keys(members.members).length,
          },
        });
      };

      // Add member to the members object
      const handleAdd = (member: any) => {
        dispatch({
          type: ADD_MEMBER,
          payload: member,
        });
      };

      // Remove member from the members object
      const handleRemove = (member: any) => {
        dispatch({
          type: REMOVE_MEMBER,
          payload: member,
        });
      };

      // bind to all member addition/removal events
      channel.bind("pusher:subscription_succeeded", handleSubscriptionSuccess);
      channel.bind("pusher:member_added", handleAdd);
      channel.bind("pusher:member_removed", handleRemove);

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
    ...state,
  };
}
