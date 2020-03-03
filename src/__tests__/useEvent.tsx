import { Channel } from "pusher-js";
import { PusherChannelMock } from "pusher-js-mock";
import { renderHook } from "@testing-library/react-hooks";
import { useEvent } from "../useEvent";

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
});
