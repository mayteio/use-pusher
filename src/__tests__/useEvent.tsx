import { Channel, PresenceChannel } from "pusher-js";
import { PusherChannelMock, PusherPresenceChannelMock } from "pusher-js-mock";
import { renderHook } from "@testing-library/react-hooks";
import { useEvent } from "../core/useEvent";

describe("useEvent()", () => {
  test("should bind to events when the hook is called", () => {
    const listener = jest.fn();
    const channel = new PusherChannelMock();
    const { unmount } = renderHook(() =>
      useEvent((channel as unknown) as Channel, "event", listener)
    );
    channel.emit("event", {});
    expect(listener).toHaveBeenCalledWith({});

    // test unbinding
    unmount();
    channel.emit("event", {});
    expect(listener).toHaveBeenCalledTimes(1);
  });

  test("should not bind when there is no channel", () => {
    const listener = jest.fn();
    const channel = new PusherChannelMock();
    renderHook(() => useEvent(undefined, "event", listener));
    channel.emit("event", {});
    expect(listener).not.toHaveBeenCalled();
  });

  /** pusher-js-mock needs to be updated to test this */
  test.skip("should accept metadata from presence channels", () => {
    const listener = jest.fn();
    const channel = new PusherPresenceChannelMock();
    renderHook(() =>
      useEvent(
        (channel as unknown) as PresenceChannel,
        "presence-event",
        listener
      )
    );

    // @ts-ignore
    channel.emit("presence-event", {}, { user_id: "my-id" });
  });
});
