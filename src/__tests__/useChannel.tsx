import { PusherChannelMock, PusherMock } from "pusher-js-mock";

import Pusher from "pusher-js";
import React from "react";
import { __PusherContext } from "../PusherProvider";
import { renderHook } from "@testing-library/react-hooks";
import { renderHookWithProvider } from "../testUtils";
import { useChannel } from "../useChannel";

describe("useChannel()", () => {
  test("should throw an error when no channelName present", () => {
    const { result } = renderHook(() => useChannel(undefined));
    expect(result.error.message).toBe(
      "channelName required to subscribe to a channel"
    );
  });

  test("should return undefined if no pusher client present", () => {
    const wrapper = (props) => (
      <__PusherContext.Provider value={{ client: undefined }} {...props} />
    );
    const { result } = renderHook(() => useChannel("public-channel"), {
      wrapper
    });

    expect(result.current).toBeUndefined();
  });

  test("should return instance of channel", async () => {
    const { result } = await renderHookWithProvider(() =>
      useChannel("public-channel")
    );
    expect(result.current).toBeInstanceOf(PusherChannelMock);
  });
});
