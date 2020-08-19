import { Channel } from "pusher-js";
import { PusherPresenceChannelMock } from "pusher-js-mock";
import { renderHook } from "@testing-library/react-hooks";
import { useClientTrigger } from "../core/useClientTrigger";

describe("useClientTrigger()", () => {
  test("should trigger client events on the channel", async () => {
    const listener = jest.fn();
    const channel = new PusherPresenceChannelMock();
    channel.bind("event", listener);
    const { result } = renderHook(() =>
      useClientTrigger((channel as unknown) as Channel)
    );

    result.current("event", {});
    expect(listener).toHaveBeenCalledWith({});
  });
});
