import { PusherChannelMock, PusherMock } from "pusher-js-mock";
import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { renderHookWithProvider } from "../testUtils";
import { useChannel } from "../core/useChannel";
import { __PusherContext } from "../core/PusherProvider";
import { ChannelsProvider } from "../web";

describe("useChannel()", () => {
  test("should return undefined when channelName is falsy", () => {
    const wrapper: React.FC = ({ children }) => (
      <__PusherContext.Provider value={{ client: {} as any }}>
        <ChannelsProvider>{children}</ChannelsProvider>
      </__PusherContext.Provider>
    );
    const { result } = renderHook(() => useChannel(""), {
      wrapper,
    });

    expect(result.current).toBeUndefined();
  });

  test("should return undefined if no pusher client present", () => {
    const wrapper: React.FC = ({ children }) => (
      <__PusherContext.Provider value={{ client: undefined }}>
        <ChannelsProvider>{children}</ChannelsProvider>
      </__PusherContext.Provider>
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
    const client = new PusherMock("key");
    client.unsubscribe = jest.fn();
    const wrapper: React.FC = ({ children, ...props }) => (
      <__PusherContext.Provider value={{ client: client as any }} {...props}>
        <ChannelsProvider>{children}</ChannelsProvider>
      </__PusherContext.Provider>
    );
    const { unmount } = renderHook(() => useChannel("public-channel"), {
      wrapper,
    });
    unmount();

    expect(client.unsubscribe).toHaveBeenCalled();
  });
});
