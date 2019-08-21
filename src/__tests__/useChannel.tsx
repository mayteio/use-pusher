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

describe("useChannel hook", () => {
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
    const { channel } = result.current;
    expect(Object.keys(channel.callbacks)).toHaveLength(0);

    unmount();
  });
});
