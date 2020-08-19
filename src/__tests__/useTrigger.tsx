import "jest-fetch-mock";
import React from "react";
import Pusher from "pusher-js";
import { PusherMock } from "pusher-js-mock";
import { renderHook } from "@testing-library/react-hooks";
import { __PusherContext } from "../core/PusherProvider";
import { NO_AUTH_HEADERS_WARNING, useTrigger } from "../core/useTrigger";

describe("useTrigger()", () => {
  beforeEach(() => {
    // @ts-ignore
    fetch.resetMocks();
  });
  test("should trigger a fetch event on use and warn about no headers", async () => {
    jest.spyOn(console, "warn");
    const wrapper: React.FC = ({ children }) => (
      <__PusherContext.Provider
        value={{
          client: (new PusherMock("key") as unknown) as Pusher,
          triggerEndpoint: "http://example.com",
        }}
      >
        {children}
      </__PusherContext.Provider>
    );

    const { result } = await renderHook(() => useTrigger("presence-channel"), {
      wrapper,
    });

    result.current("event", {});
    // @ts-ignore
    expect(fetch.mock.calls.length).toBe(1);
    expect(console.warn).toHaveBeenCalledWith(NO_AUTH_HEADERS_WARNING);
  });
  test("should trigger a fetch event on use and warn", async () => {
    jest.spyOn(console, "warn");
    const wrapper: React.FC = ({ children }) => (
      <__PusherContext.Provider
        value={{
          client: (new PusherMock("key", {
            auth: {
              headers: {
                Authorization: "Bearer token",
              },
            },
          }) as unknown) as Pusher,
          triggerEndpoint: "http://example.com",
        }}
      >
        {children}
      </__PusherContext.Provider>
    );

    const { result } = await renderHook(() => useTrigger("public-channel"), {
      wrapper,
    });

    result.current("event", {});
    // @ts-ignore
    expect(fetch.mock.calls[0]).toEqual([
      "http://example.com",
      {
        method: "POST",
        body: JSON.stringify({
          channelName: "public-channel",
          eventName: "event",
          data: {},
        }),
        headers: {
          Authorization: "Bearer token",
        },
      },
    ]);
  });
});
