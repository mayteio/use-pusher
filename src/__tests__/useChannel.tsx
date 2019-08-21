import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { PusherProvider } from "../PusherProvider";
import { useChannel } from "../useChannel";

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

describe("useChannel hook", () => {
  test("should render without error", () => {
    const wrapper = ({ children }: any) => (
      <PusherProvider
        {...config}
        children={children}
        value={{ client: { current: undefined }, triggerEndpoint: "d" }}
      />
    );
    const { result, rerender } = renderHook(() => useChannel("my-channel"), {
      wrapper
    });
    rerender();
    expect(result.current).toBeUndefined();
  });

  test("should subscribe to a channel with default options", () => {
    const wrapper = ({ children }: any) => (
      <PusherProvider {...config}>{children}</PusherProvider>
    );
    const { result, unmount, rerender } = renderHook(
      () => useChannel("my-channel"),
      {
        wrapper
      }
    );

    rerender();
    const channel = result.current;
    expect(Object.keys(channel.callbacks)).toHaveLength(0);

    unmount();
  });
});
