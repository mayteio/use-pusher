import { PusherChannelMock } from "pusher-js-mock";
import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { renderHookWithProvider } from "../testUtils";
import { useChannel } from "../core/useChannel";
import { __PusherContext } from "../core/PusherProvider";

describe("useChannel()", () => {
  test("should return undefined when channelName is falsy", () => {
    const wrapper: React.FC = (props) => (
      <__PusherContext.Provider value={{ client: {} as any }} {...props} />
    );

    const { result } = renderHook(() => useChannel(""), {
      wrapper,
    });

    expect(result.current).toBeUndefined();
  });

  test("should return undefined if no pusher client present", () => {
    const wrapper: React.FC = (props) => (
      <__PusherContext.Provider value={{ client: undefined }} {...props} />
    );
    const { result } = renderHook(() => useChannel("public-channel"), {
      wrapper,
    });

    expect(result.current).toBeUndefined();
  });

  test("should return instance of channel", async () => {
    const { result } = await renderHookWithProvider(() =>
      useChannel("public-channel")
    );
    expect(result.current).toBeInstanceOf(PusherChannelMock);
  });

  test("should unsubscribe on unmount", async () => {
    const mockUnsubscribe = jest.fn();
    const client = {
      subscribe: jest.fn(),
      unsubscribe: mockUnsubscribe,
    };
    const wrapper: React.FC = (props) => (
      <__PusherContext.Provider value={{ client: client as any }} {...props} />
    );
    const { unmount } = await renderHook(() => useChannel("public-channel"), {
      wrapper,
    });
    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
