import "jest-fetch-mock";

import { NO_AUTH_HEADERS_WARNING, useTrigger } from "../useTrigger";

import Pusher from "pusher-js";
import { PusherMock } from "pusher-js-mock";
import React from "react";
import { __PusherContext } from "../PusherProvider";
import { renderHook } from "@testing-library/react-hooks";

describe("useTrigger()", () => {
  beforeEach(() => {
    fetch.resetMocks();
  });
  test("should trigger a fetch event on use and warn about no headers", async () => {
    jest.spyOn(console, "warn");
    const wrapper = ({ children }) => (
      <__PusherContext.Provider
        value={{
          client: (new PusherMock("key") as unknown) as Pusher,
          triggerEndpoint: "http://example.com"
        }}
      >
        {children}
      </__PusherContext.Provider>
    );

    const { result } = await renderHook(() => useTrigger("presence-channel"), {
      wrapper
    });

    result.current("event", {});
    expect(fetch.mock.calls.length).toBe(1);
    expect(console.warn).toHaveBeenCalledWith(NO_AUTH_HEADERS_WARNING);
  });
  test("should trigger a fetch event on use and warn", async () => {
    jest.spyOn(console, "warn");
    const config = {
      auth: {
        headers: "Bearer token"
      }
    };

    const wrapper = ({ children }) => (
      <__PusherContext.Provider
        value={{
          client: (new PusherMock("key", {
            auth: {
              headers: {
                Authorization: "Bearer token"
              }
            }
          }) as unknown) as Pusher,
          triggerEndpoint: "http://example.com"
        }}
      >
        {children}
      </__PusherContext.Provider>
    );

    const { result } = await renderHook(() => useTrigger("public-channel"), {
      wrapper
    });

    result.current("event", {});
    expect(fetch.mock.calls[0]).toEqual([
      "http://example.com",
      {
        method: "POST",
        body: JSON.stringify({
          channelName: "public-channel",
          eventName: "event",
          data: {}
        }),
        headers: {
          Authorization: "Bearer token"
        }
      }
    ]);
  });
});
