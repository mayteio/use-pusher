import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { PusherProvider } from "../PusherProvider";
import { useChannel } from "../useChannel";

jest.mock("pusher-js", () => {
  const { PusherMock } = require("../mocks.ts");
  return {
    __esModule: true,
    default: jest.fn(() => new PusherMock())
  };
});

test("should subscribe to channel and listen to events", async () => {
  const onEvent = jest.fn();
  const wrapper = ({ children }: any) => (
    <PusherProvider clientKey="client-key" cluster="ap4">
      {children}
    </PusherProvider>
  );
  const { result, unmount } = renderHook(
    () => useChannel("my-channel", "my-event", onEvent),
    { wrapper }
  );

  expect(result.current!.bind).toHaveBeenCalledTimes(1);

  result.current!.emit("my-event", "test");
  expect(onEvent).toHaveBeenCalledTimes(1);
  expect(onEvent).toHaveBeenCalledWith("test");

  unmount();
  expect(result.current!.unbind).toHaveBeenCalledTimes(1);
});
