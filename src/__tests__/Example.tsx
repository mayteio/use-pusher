// example.tsx
import React, { useState } from "react";
import { render, act } from "@testing-library/react";
import {
  PusherProvider,
  useChannel,
  useEvent,
  PusherMock,
  PusherChannelMock
} from "../";

// Example component
const Example = () => {
  const [title, setTitle] = useState();
  const channel = useChannel("my-channel");
  useEvent(channel, "title", ({ data }) => setTitle(data));

  return <span>{title}</span>;
};

// mock out the result of the useChannel hook
const mockChannel = new PusherChannelMock();
jest.mock("../", () => ({
  ...require.requireActual("../"),
  useChannel: () => mockChannel
}));

test("should show a title when it receives a title event from the socket.", async () => {
  // render the provider with a mocked context value
  const clientKey = "key";
  const options = { cluster: "ap4" };
  const client = { current: new PusherMock(clientKey, options) };
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
