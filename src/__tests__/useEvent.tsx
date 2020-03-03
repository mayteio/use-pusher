import { Channel } from "pusher-js";
import { PusherChannelMock } from "pusher-js-mock";
import { renderHook } from "@testing-library/react-hooks";
import { useEvent } from "../useEvent";

describe("useEvent()", () => {
  test("should ", () => {
    const listener = jest.fn();
    const channel = new PusherChannelMock();
    renderHook(() =>
      useEvent((channel as unknown) as Channel, "event", listener)
    );
    channel.emit("event", {});
    expect(listener).toHaveBeenCalledWith({});
  });
});
