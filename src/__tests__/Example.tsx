import { PusherChannelMock, PusherMock } from "pusher-js-mock";
import { PusherProvider, useChannel, useEvent } from "../";
// example.tsx
import React, { useState } from "react";
import { act, render } from "@testing-library/react";

import Pusher from "pusher-js";

// Example component
const Example = () => {
  const [title, setTitle] = useState();
  const channel = useChannel("my-channel");
  useEvent<{ message: string }>(channel, "title", (data) => {
    setTitle(data && data.message);
  });

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
  const client = (new PusherMock() as unknown) as Pusher;
  const { findByText } = render(
    <PusherProvider clientKey={clientKey} cluster="ap4" value={{ client }}>
      <Example />
    </PusherProvider>
  );
  // call an event on the mocked channel
  act(() => mockChannel.emit("title", { message: "Hello world" }));

  // assert expectations
  expect(await findByText("Hello world")).toBeTruthy();
});
