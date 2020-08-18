import {
  actAndFlushPromises,
  makeAuthPusherConfig,
  renderHookWithProvider,
} from "../../testUtils";

import { PusherMock } from "pusher-js-mock";
import { __PusherContext } from "../PusherProvider";
import { act } from "@testing-library/react-hooks";
import {
  usePresenceChannel,
  SET_STATE,
  presenceChannelReducer,
  ADD_MEMBER,
  REMOVE_MEMBER,
} from "../usePresenceChannel";

describe("presenceChannelReducer", () => {
  /** Default state */
  const defaultState = {
    members: {},
    count: 0,
    me: undefined,
    myID: undefined,
  };

  test(SET_STATE, () => {
    const state = presenceChannelReducer(defaultState, {
      type: SET_STATE,
      payload: { count: 1 },
    });
    expect(state.count).toBe(1);
  });

  test(ADD_MEMBER, () => {
    const state = presenceChannelReducer(defaultState, {
      type: ADD_MEMBER,
      payload: { id: "their-id", info: {} },
    });
    expect(state.members).toEqual({ "their-id": {} });
    expect(state.count).toBe(1);
  });

  test(REMOVE_MEMBER, () => {
    const state = presenceChannelReducer(
      { ...defaultState, members: { "their-id": {} }, count: 1 },
      { type: REMOVE_MEMBER, payload: { id: "their-id" } }
    );
    expect(state.members).toEqual({});
    expect(state.count).toBe(0);
  });
});

describe("usePresenceChannel()", () => {
  test('should throw an error if channelName doesn\'t have "presence-" in it', async () => {
    const { result } = await renderHookWithProvider(
      () => usePresenceChannel("public-channel"),
      makeAuthPusherConfig()
    );
    expect(result.error.message).toBe(
      "Presence channels should use prefix 'presence-' in their name. Use the useChannel hook instead."
    );
  });

  test("should bind to pusher events and unbind on mount", async () => {
    const { result, unmount } = await renderHookWithProvider(
      () => usePresenceChannel("presence-channel"),
      makeAuthPusherConfig()
    );

    const channel = result.current.channel;
    expect(channel).toBeDefined();
    channel &&
      expect(channel.callbacks["pusher:subscription_succeeded"]).toHaveLength(
        1
      );
    channel && expect(channel.callbacks["pusher:member_added"]).toHaveLength(1);
    channel &&
      expect(channel.callbacks["pusher:member_removed"]).toHaveLength(1);

    unmount();
    channel &&
      expect(channel.callbacks["pusher:subscription_succeeded"]).toHaveLength(
        0
      );
    channel && expect(channel.callbacks["pusher:member_added"]).toHaveLength(0);
    channel &&
      expect(channel.callbacks["pusher:member_removed"]).toHaveLength(0);
  });

  test("should return new member list when members are added and remove them when they unsubscribe", async () => {
    const { result } = await renderHookWithProvider(
      () => usePresenceChannel("presence-channel"),
      makeAuthPusherConfig()
    );

    expect(result.current.members).toEqual({ "my-id": {} });
    expect(result.current.myID).toEqual("my-id");
    expect(result.current.me).toEqual({ id: "my-id", info: {} });
    expect(result.current.count).toBe(1);

    let otherClient: PusherMock;
    await act(async () => {
      otherClient = new PusherMock("key", makeAuthPusherConfig("your-id"));
      otherClient.subscribe("presence-channel");
      await actAndFlushPromises();
    });

    expect(result.current.members).toEqual({ "my-id": {}, "your-id": {} });
    expect(result.current.count).toBe(2);

    await act(async () => {
      otherClient.unsubscribe("presence-channel");
    });
    expect(result.current.members).toEqual({ "my-id": {} });
    expect(result.current.count).toBe(1);
  });
});
