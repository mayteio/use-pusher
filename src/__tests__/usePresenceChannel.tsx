import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { usePresenceChannel } from "../usePresenceChannel";
import { PusherProvider } from "../PusherProvider";
import { act } from "@testing-library/react-hooks";

beforeEach(() => {
  jest.resetAllMocks();
});

jest.mock("pusher-js", () => {
  const { PusherMock } = require("../mocks");
  return PusherMock;
});

const config = {
  clientKey: "client-key",
  cluster: "ap4",
  children: "Test"
};

const setup = (channelName = "my-channel", customConfig = {}) => {
  const wrapper = ({ children }: any) => (
    <PusherProvider {...config} {...customConfig}>
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
        value={{ client: { current: undefined }, triggerEndpoint: "d" }}
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
    const { result, rerender } = setup("presence-channel");
    rerender();

    // emits members object
    await act(async () => {
      result.current.channel.emit("pusher:subscription_succeeded", {
        myID: "0a",
        members: {
          "0b": {
            id: "0b",
            info: {}
          }
        }
      });
    });

    expect(result.current.members["0b"]).toBeDefined();
    rerender();

    act(() => {
      result.current.channel.emit("pusher:member_removed", {
        id: "0b",
        info: {}
      });
      result.current.channel.emit("pusher:member_added", {
        id: "0c",
        info: {}
      });
    });

    expect(result.current.members["0b"]).toBeUndefined();
    expect(result.current.members["0c"]).toBeDefined();
  });

  test("should return myID if present", async () => {
    const { result, rerender } = setup("presence-channel");
    rerender();
    await act(async () => {
      result.current.channel.emit("pusher:subscription_succeeded", {
        myID: "0a",
        members: {
          "0b": {
            id: "0b",
            info: {}
          }
        }
      });
    });
    expect(result.current.myID).toBe("0a");
  });
});
