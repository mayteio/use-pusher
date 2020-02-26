import { FetchMock } from "jest-fetch-mock/types";
import { PusherProvider } from "../PusherProvider";
import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { useTrigger } from "../useTrigger";

jest.mock("pusher-js", () => {
  const { PusherMock } = require("pusher-js-mock");
  return {
    __esModule: true,
    default: PusherMock
  };
});

beforeEach(() => {
  (fetch as FetchMock).resetMocks();
});

const config = {
  clientKey: "client-key",
  cluster: "ap4",
  triggerEndpoint: "trigger-endpoint"
};

test("should render without error", () => {
  const wrapper = ({ children }: any) => (
    <PusherProvider
      {...config}
      children={children}
      value={{ client: undefined, triggerEndpoint: "endpoint" }}
    />
  );
  const { result } = renderHook(() => useTrigger("my-channel"), { wrapper });
  result.current("my-event", "data");
});

test("should push event to trigger endpoint without authentication and warn", async () => {
  (fetch as FetchMock).mockResponseOnce("success");
  jest.spyOn(global.console, "warn");

  const wrapper = ({ children }: any) => (
    <PusherProvider {...config}>{children}</PusherProvider>
  );
  const { result, rerender } = renderHook(() => useTrigger("my-channel"), {
    wrapper
  });
  rerender();
  const trigger = result.current;

  const res = await trigger("my-event", "test").then((res) => res.text());
  expect(fetch as FetchMock).toHaveBeenCalledTimes(1);
  expect(res).toBe("success");

  expect(global.console.warn).toHaveBeenCalledWith(
    "No auth parameters supplied to <PusherProvider />. Your events will be unauthenticated."
  );
});

// skipping this one because pusher-js-mock doesn't set this.config
test.skip("should push event to trigger endpoint with authentication", async () => {
  (fetch as FetchMock).mockResponseOnce("success");
  const config = {
    clientKey: "client-key",
    cluster: "ap4",
    triggerEndpoint: "trigger-endpoint",
    authEndpoint: "auth-endpoint",
    auth: {
      headers: { Authorization: `Bearer token` },
      params: {}
    }
  };

  const wrapper = ({ children }: any) => (
    <PusherProvider {...config}>{children}</PusherProvider>
  );
  const { result, rerender } = renderHook(() => useTrigger("my-channel"), {
    wrapper
  });

  const expectedOptions = {
    method: "POST",
    body: JSON.stringify({
      channelName: "my-channel",
      eventName: "my-event",
      data: "test"
    }),
    headers: { Authorization: "Bearer token" },
    params: {}
  };

  rerender();
  const trigger = result.current;

  const res = await trigger("my-event", "test").then((res: any) => res.text());

  expect(fetch as FetchMock).toHaveBeenCalledTimes(1);
  expect(fetch as FetchMock).toHaveBeenCalledWith(
    "trigger-endpoint",
    expectedOptions
  );

  expect(res).toBe("success");
});

test("should throw an error when trigger endpoint wasn't provided (JS only, TS catches it.)", () => {
  const wrapper = ({ children }: any) => (
    <PusherProvider clientKey="key" cluster="ap4">
      {children}
    </PusherProvider>
  );

  const { result } = renderHook(() => useTrigger("my-channel"), {
    wrapper
  });
  expect(result.error.message).toBe(
    "No trigger endpoint specified to <PusherProvider />. Cannot trigger an event."
  );
});
