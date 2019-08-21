import React from "react";
import { renderHook } from "@testing-library/react-hooks";
import { useEvent } from "../";
import { PusherProvider } from "../PusherProvider";
import { PusherChannelMock } from "../mocks";
import { Channel } from "pusher-js";
import { cleanup } from "@testing-library/react";

beforeEach(() => {
  cleanup();
  jest.resetAllMocks();
});

jest.mock("pusher-js", () => {
  const { PusherMock } = require("../mocks");
  return PusherMock;
});

const setup = (
  channel?: PusherChannelMock | Channel,
  eventName?: string,
  callback?: Function
) => {
  const config = { clientKey: "a", cluster: "b", children: "Test" };
  const wrapper = (props: any) => <PusherProvider {...config} {...props} />;
  return {
    ...renderHook(
      ([
        channelProp = channel,
        eventNameProp = eventName,
        callbackProp = callback
      ]: any = []) =>
        useEvent(channelProp as Channel, eventNameProp, callbackProp),
      {
        wrapper
      }
    )
  };
};

describe("useEvent hook", () => {
  test("should throw an error when required props are not supplied", () => {
    jest.spyOn(global.console, "warn");
    const channel = new PusherChannelMock();

    const { result: result2 } = setup(channel);
    expect(result2.error.message).toBe(
      "Must supply eventName and callback to onEvent"
    );
    const { result: result3 } = setup(channel, "my-event");
    expect(result3.error.message).toBe("Must supply callback to onEvent");

    setup(undefined, "my-event", () => {});
    expect(global.console.warn).toHaveBeenCalledWith(
      "No channel supplied to onEvent."
    );
  });

  test("subscribe to channel and call events emitted", () => {
    const channel = new PusherChannelMock();
    const callback = jest.fn();
    const { rerender } = setup(channel, "my-event", callback);
    rerender();

    channel.emit("my-event", "test");
    expect(callback).toHaveBeenCalledWith("test");
  });

  test("should unbind on unmount", () => {
    const channel = new PusherChannelMock();
    const { rerender, unmount } = setup(channel, "my-event", () => {});
    rerender();
    expect(channel.callbacks["my-event"]).toHaveLength(1);
    unmount();
    expect(channel.callbacks["my-event"]).toHaveLength(0);
  });

  test("should subscribe to correct channel on prop changes and unbind accordingly.", () => {
    const channel = new PusherChannelMock();
    const callback = jest.fn();

    const { rerender, unmount } = setup(channel, "my-event", callback);
    rerender([channel, "your-event", callback]);

    channel.emit("your-event", "test");
    expect(callback).toHaveBeenCalledWith("test");

    unmount();
    expect(channel.callbacks["my-event"]).toHaveLength(0);
    expect(channel.callbacks["your-event"]).toHaveLength(0);
  });
});
