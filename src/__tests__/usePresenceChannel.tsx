import { PusherMock, PusherPresenceChannelMock } from "pusher-js-mock";
import { act, renderHook } from "@testing-library/react-hooks";
import {
  actAndFlushPromises,
  makeAuthPusherConfig,
  renderHookWithProvider
} from "../../testUtils";

import { __PusherContext } from "../PusherProvider";
import { usePresenceChannel } from "../usePresenceChannel";

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
    expect(channel.callbacks["pusher:subscription_succeeded"]).toHaveLength(1);
    expect(channel.callbacks["pusher:member_added"]).toHaveLength(1);
    expect(channel.callbacks["pusher:member_removed"]).toHaveLength(1);

    unmount();
    expect(channel.callbacks["pusher:subscription_succeeded"]).toHaveLength(0);
    expect(channel.callbacks["pusher:member_added"]).toHaveLength(0);
    expect(channel.callbacks["pusher:member_removed"]).toHaveLength(0);
  });

  test("should return new member list when members are added and remove them when they unsubscribe", async () => {
    const { result } = await renderHookWithProvider(
      () => usePresenceChannel("presence-channel"),
      makeAuthPusherConfig()
    );

    expect(result.current.members).toEqual({ "my-id": {} });
    expect(result.current.myID).toEqual("my-id");

    let otherClient;
    await act(async () => {
      otherClient = new PusherMock("key", makeAuthPusherConfig("your-id"));
      otherClient.subscribe("presence-channel");
      await actAndFlushPromises();
    });

    expect(result.current.members).toEqual({ "my-id": {}, "your-id": {} });

    await act(async () => {
      otherClient.unsubscribe("presence-channel");
    });
    expect(result.current.members).toEqual({ "my-id": {} });
  });
});
