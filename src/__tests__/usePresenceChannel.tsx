import Pusher from "pusher-js";
import { PusherMock } from "pusher-js-mock";
import { PusherProvider } from "../PusherProvider";
import React from "react";
import { act } from "@testing-library/react-hooks";
import { renderHook } from "@testing-library/react-hooks";
import { usePresenceChannel } from "../usePresenceChannel";

beforeEach(() => {
  jest.resetAllMocks();
});

// jest.mock("pusher-js", () => {
//   const { PusherMock } = require("pusher-js-mock");
//   return PusherMock;
// });

const config = {
  clientKey: "client-key",
  cluster: "ap4",
  children: "Test"
};

const setup = (channelName = "my-channel", customConfig = {}) => {
  const client = new PusherMock("my-id", {}) as unknown;
  const wrapper = ({ children }: any) => (
    <PusherProvider
      {...config}
      {...customConfig}
      value={{ client: client as Pusher }}
    >
      {children}
    </PusherProvider>
  );
  return renderHook(() => usePresenceChannel(channelName), { wrapper });
};

describe("usePresenceChannel hook", () => {
  test("should render without error", () => {
    const wrapper = ({ children }: any) => (
      <PusherProvider
        {...config}
        children={children}
        value={{ client: undefined }}
      />
    );
    const { result, rerender } = renderHook(
      () => usePresenceChannel("presence-channel"),
      { wrapper }
    );
    rerender();
    // no client was provided
    expect(result.current.channel).toBeUndefined();
  });

  test('should throw an error if channelName doesn\'t have "presence-" in it', () => {
    const { result } = setup("public-channel");
    expect(result.error.message).toBe(
      "Presence channels should use prefix 'presence-' in their name. Use the useChannel hook instead."
    );
  });

  test("should automatically bind to pusher events and unbind on unmount", () => {
    const { result, unmount, rerender } = setup("presence-channel");
    rerender();
    const { channel } = result.current as any;

    expect(channel.callbacks["pusher:subscription_succeeded"]).toHaveLength(1);
    expect(channel.callbacks["pusher:member_added"]).toHaveLength(1);
    expect(channel.callbacks["pusher:member_removed"]).toHaveLength(1);

    unmount();

    expect(channel.callbacks["pusher:subscription_succeeded"]).toHaveLength(0);
    expect(channel.callbacks["pusher:member_added"]).toHaveLength(0);
    expect(channel.callbacks["pusher:member_removed"]).toHaveLength(0);
  });

  test("should return new member list when members are added", async () => {
    const { result, waitForNextUpdate } = setup("presence-channel");
    await waitForNextUpdate();
    expect(result.current.members).toEqual({ "my-id": {} });
    act(() => {
      // new client connecting
      const otherClient = new PusherMock("your-id", {});
      otherClient.subscribe("presence-channel");
    });

    await waitForNextUpdate();
    expect(result.current.members).toEqual({ "my-id": {}, "your-id": {} });
  });
});
