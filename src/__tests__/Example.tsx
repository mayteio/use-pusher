// example.tsx
import React, { useState } from "react";
import { render, act } from "@testing-library/react";
import {
  PusherProvider,
  useChannel,
  useEvent,
  PusherMock,
  PusherChannelMock,
  usePresenceChannel,
  PusherPresenceChannelMock
} from "../";

import { mocked } from "ts-jest/utils";

// Example component
const Example = () => {
  const [title, setTitle] = useState();
  const channel = useChannel("my-channel");
  useEvent(channel, "title", ({ data }) => setTitle(data));

  return <span>{title}</span>;
};

// mock out the result of the useChannel hook

const clientKey = "key";
const options = { cluster: "ap4" };
const client = { current: new PusherMock(clientKey, options) };

jest.mock("../useChannel", () => ({
  // ...require.requireActual("../"),
  useChannel: jest.fn()
}));

beforeEach(jest.resetModules);

test("should show a title when it receives a title event from the socket.", async () => {
  const mockChannel = new PusherChannelMock();
  mocked(useChannel).mockReturnValue(mockChannel);
  // render the provider with a mocked context value
  const { findByText } = render(
    <PusherProvider clientKey={clientKey} {...options} value={{ client }}>
      <Example />
    </PusherProvider>
  );
  // call an event on the mocked channel
  act(() => mockChannel.emit("title", { data: "Hello world" }));

  // assert expectations
  expect(await findByText("Hello world")).toBeTruthy();
});

/**
 * Mocking presence channels
 */
const PresenceExample = () => {
  const { members } = usePresenceChannel("presence-channel");

  return (
    <ul>
      {Object.entries(members).map(([id, info]: any) => (
        <li key={id}>{info.name}</li>
      ))}
    </ul>
  );
};

test("should display correct members as they are added and removed", async () => {
  const mockPresenceChannel = new PusherPresenceChannelMock();
  mocked(useChannel).mockImplementation(() => mockPresenceChannel);

  const { getByText } = render(
    <PusherProvider clientKey={clientKey} {...options} value={{ client }}>
      <PresenceExample />
    </PusherProvider>
  );

  act(() => {
    mockPresenceChannel.emit("pusher:member_added", {
      id: "0b",
      info: { name: "Harley" }
    });
  });

  expect(getByText("Harley")).toBeTruthy();
});
