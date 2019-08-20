import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { PusherProvider } from "../PusherProvider";
import { useChannel } from "../useChannel";
import { cleanup } from "@testing-library/react";

beforeEach(() => {
  cleanup();
  jest.resetAllMocks();
});

jest.mock("pusher-js", () => {
  const { PusherMock } = require("pusher-js-mock");
  // monkey patch missing function
  PusherMock.prototype.disconnect = () => {};
  return PusherMock;
});

const config = {
  clientKey: "client-key",
  cluster: "ap4",
  children: "Test"
};

test("should fill default options", () => {
  const wrapper = ({ children }: any) => (
    <PusherProvider {...config}>{children}</PusherProvider>
  );
  const { result, unmount } = renderHook(() => useChannel("my-channel"), {
    wrapper
  });

  const { channel } = result.current;
  expect(Object.keys(channel.callbacks)).toHaveLength(0);

  unmount();
});

test("should subscribe to channel and emit events", async () => {
  const onEvent = jest.fn();
  const wrapper = ({ children }: any) => (
    <PusherProvider {...config}>{children}</PusherProvider>
  );
  const { result, unmount, rerender } = renderHook(
    () => useChannel("my-channel", "my-event", onEvent, [], { skip: false }),
    { wrapper }
  );

  rerender();

  const { channel } = result.current;

  channel.emit("my-event", "test");
  expect(channel.callbacks["my-event"]).toBeTruthy();
  expect(onEvent).toHaveBeenCalledTimes(1);
  expect(onEvent).toHaveBeenCalledWith("test");

  unmount();
});

test("should subscribe to channel as prop changes", () => {
  const onEvent = jest.fn();
  const wrapper = ({ children }: any) => (
    <PusherProvider {...config}>{children}</PusherProvider>
  );
  const { result, unmount, rerender } = renderHook(
    ([a = "my-channel", b = "my-event", c = onEvent]: any) =>
      useChannel(a, b, c),
    { wrapper }
  );

  rerender(["your-channel", "some-event", onEvent]);
  const { channel } = result.current;

  // simulate event
  channel.emit("some-event", "test");

  expect(onEvent).toHaveBeenCalledTimes(1);
  expect(onEvent).toHaveBeenCalledWith("test");
  unmount();
});

test("should skip channel subscription if option is passed", () => {
  const wrapper = ({ children }: any) => (
    <PusherProvider {...config}>{children}</PusherProvider>
  );
  const { result, unmount } = renderHook(
    () => useChannel("a", "b", () => {}, [], { skip: true }),
    { wrapper }
  );

  const { channel } = result.current;
  expect(channel).toBeUndefined();

  unmount();
});
