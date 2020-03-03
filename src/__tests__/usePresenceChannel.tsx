import { act, renderHook } from "@testing-library/react-hooks";
import {
  actAndFlushPromises,
  makeAuthPusherConfig,
  renderHookWithProvider
} from "../../testUtils";

import Pusher from "pusher-js";
import { PusherMock } from "pusher-js-mock";
import React from "react";
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
    const { result, unmount, rerender } = await renderHookWithProvider(
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

  test("should return new member list when members are added", async () => {
    const { result } = await renderHookWithProvider(
      () => usePresenceChannel("presence-channel"),
      makeAuthPusherConfig()
    );

    expect(result.current.members).toEqual({ "my-id": {} });
    expect(result.current.myID).toEqual("my-id");

    await act(async () => {
      const otherClient = new PusherMock(
        "key",
        makeAuthPusherConfig("your-id")
      );
      otherClient.subscribe("presence-channel");
      await actAndFlushPromises();
    });

    expect(result.current.members).toEqual({ "my-id": {}, "your-id": {} });
  });
});
