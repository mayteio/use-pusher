import React from "react";
import { renderHook } from "@testing-library/react-hooks";

import { PusherProvider } from "../PusherProvider";
import { useTrigger } from "../useTrigger";
import { FetchMock } from "jest-fetch-mock/types";

jest.mock("pusher-js", () => {
  const { PusherMock } = require("../mocks.ts");
  return {
    __esModule: true,
    default: jest.fn((clientKey, config) => new PusherMock(clientKey, config))
  };
});

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

test("should push event to trigger endpoint without authentication and warn", async () => {
  (fetch as FetchMock).mockResponseOnce("success");
  const props = {
    clientKey: "client-key",
    cluster: "ap4",
    triggerEndpoint: "trigger-endpoint"
  };

  const wrapper = ({ children }: any) => (
    <PusherProvider {...props}>{children}</PusherProvider>
  );
  const { result } = renderHook(() => useTrigger(), { wrapper });

  const res = await result
    .current("my-channel", "my-event", "test")
    .then(res => res.text());
  expect(fetch as FetchMock).toHaveBeenCalledTimes(1);
  expect(res).toBe("success");
});

test("should push event to trigger endpoint with authentication", async () => {
  (fetch as FetchMock).mockResponseOnce("success");
  const props = {
    clientKey: "client-key",
    cluster: "ap4",
    triggerEndpoint: "trigger-endpoint",
    authEndpoint: "auth-endpoint",
    auth: {
      headers: { Authorization: `Bearer token` }
    }
  };

  const wrapper = ({ children }: any) => (
    <PusherProvider {...props}>{children}</PusherProvider>
  );
  const { result } = renderHook(() => useTrigger(), { wrapper });

  const expectedOptions = {
    method: "POST",
    body: JSON.stringify({
      channelName: "my-channel",
      eventName: "my-event",
      data: "test"
    }),
    headers: { Authorization: "Bearer token" }
  };

  const res = await result
    .current("my-channel", "my-event", "test")
    .then(res => res.text());

  expect(fetch as FetchMock).toHaveBeenCalledTimes(1);
  expect(fetch as FetchMock).toHaveBeenCalledWith(
    "trigger-endpoint",
    expectedOptions
  );

  expect(res).toBe("success");
});
