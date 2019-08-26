# use-pusher

> Easy as hooks that integrate with the [pusher-js](https://github.com/pusher/pusher-js) library.

[![NPM](https://img.shields.io/npm/v/use-pusher.svg)](https://www.npmjs.com/package/react-pusher-hooks) ![Typed](https://badgen.net/badge//types/Typescript?icon=typescript)

##### [API Reference/Docs](https://mayteio.github.io/use-pusher/)

## Install

```bash
yarn add use-pusher
```

## Hooks

- [`useChannel`](#usechannel)
- [`usePresenceChannel`](#usepresencechannel)
- [`useEvent`](#useevent)
- [`useTrigger`](#usetrigger)
- [`usePusher`](#usepusher)

## Usage

You must wrap your app with a `PusherProvider` and pass it config props for [`pusher-js`](https://github.com/pusher/pusher-js) initialisation.

```tsx
import React from "react";
import { PusherProvider } from "@city-dna/use-pusher";

const config = {
  // required config props
  clientKey: "client-key",
  cluster: "ap4",

  // optional if you'd like to trigger events. BYO endpoint.
  // see "Trigger Server" below for more info
  triggerEndpoint: "/pusher/trigger",

  // required for private/presence channels
  // also sends auth headers to trigger endpoint
  authEndpoint: "/pusher/auth",
  auth: {
    headers: { Authorization: "Bearer token" }
  }
};

// Wrap app in provider
const App = () => {
  <PusherProvider {...config}>
    <Example />
  </PusherProvider>;
};
```

## `useChannel`

Use this hook to subscribe to a channel.

```tsx
// returns channel instance.
const channel = useChannel("channel-name");
```

## `usePresenceChannel`

Augments a regular channel with member functionality.

```tsx
const Example = () => {
  const { members, myID } = usePresenceChannel('presence-awesome');

  return (
    <ul>
      {Object.entries(members)
        // filter self from members
        .filter([id] => id !== myID)
        // map them to a list
        .map([id, info] => (
          <li key={id}>{info.name}</li>
        ))
      }
    </ul>
  )
}
```

## `useEvent`

Bind to events on a channel with a callback.

```tsx
const Example = () => {
  const [message, setMessages] = useState();
  const channel = useChannel("channel-name");
  useEvent(
    channel,
    "message",
    ({ data }) => setMessages(messages => [...messages, data]),
    // optional dependencies array. Passed through to useCallback. Defaults to [].
    []
  );
};
```

## `useTrigger`

A helper function to create a **server triggered** event. BYO server (See [Trigger Server](#trigger-server) below). Pass in `triggerEndpoint` prop to `<PusherProvider />`. Any auth headers from `config.auth.headers` automatically get passed to the `fetch` call.

```tsx
import {useTrigger} from 'use-pusher';

const Example = () => {.
  const trigger = useTrigger();
  const handleClick = () =>
    trigger("channel-name", "event-name", "hello");

  return (
    <button onClick={handleClick}>Say Hello</button>
  )
}
```

## `usePusher`

Get access to the Pusher instance to do other things.

```tsx
import { usePusher } from "use-pusher";

const Example = () => {
  const { client } = usePusher();
  client.log("Look ma, logs!");

  return null;
};
```

## Trigger Server

In order to trigger an event, you'll have to create a simple lambda (or an express server if that's your thing). Below is a short lambda that can handle triggered events from `useTrigger`.

```tsx
import Pusher from "pusher";

const pusher = new Pusher({
  appId: "app-id",
  key: "client-key",
  secret: "mad-secret",
  cluster: "ap4"
});

export async function handler(event) {
  const { channelName, eventName, data } = JSON.parse(event.body);
  pusher.trigger(channelName, eventName, data);
  return { statusCode: 200 };
}
```

> _I don't want a server though_

I hear ya. If you're feeling audacious, you can use [client events](https://pusher.com/docs/channels/using_channels/events#triggering-client-events) to push directly from the client, though this isn't recommended (thus no hook):

```tsx
import { useChannel } from "use-pusher";

const Example = () => {
  const channel = useChannel("danger-zone");
  const handleClientEvent = () => {
    channel.trigger("Pew pew");
  };

  return <button onClick={handleClientEvent}>Fire</button>;
};
```

## Typescript

This project was built using typescript, so types are built-in. Yeeeew!

## Testing

Typed `PusherMock`, `PusherChannelMock` and `PusherPresenceChannelMock` utils are provided based on [`pusher-js-mock`](https://github.com/nikolalsvk/pusher-js-mock) (thanks mate 🙏). Use these to stub out the client and channels, with an additional `emit` method on the channel classes.

Testing emitted events with jest can be achieved using `jest.mock` and `react-testing-library` (or `enzyme`, though your tests should reflect what the user should see **NOT** how the component handles events internally):

```tsx
// Example.tsx
import React from "react";
import { useChannel, useEvent } from "use-pusher";

const Example = () => {
  const [title, setTitle] = useState();
  const channel = useChannel("my-channel");
  useEvent(channel, "title", ({ data }) => setTitle(data));

  return <span>{title}</span>;
};

// Example.test.tsx
import { render, act } from "@testing-library/react";
import { PusherMock, PusherChannelMock } from "use-pusher";

// mock out the result of the useChannel hook
const mockChannel = new PusherChannelMock();
jest.mock("use-pusher", () => ({
  ...require.requireActual("use-pusher"),
  useChannel: () => mockChannel
}));

test("should show a title when it receives a title event", async () => {
  // mock the client
  const client = { current: new PusherMock("client-key", { cluster: "ap4" }) };

  // render component and provider with a mocked context value
  const { findByText } = render(
    <PusherProvider clientKey="client-key" cluster="ap4" value={{ client }}>
      <Example />
    </PusherProvider>
  );

  // emit an event on the mocked channel
  act(() => mockChannel.emit("title", { data: "Hello world" }));

  // assert expectations
  expect(await findByText("Hello world")).toBeInTheDocument();
});
```

[Check out the example tests](https://github.com/mayteio/use-pusher/blob/master/src/__tests__/Example.tsx) for testing presence channels.

## Contributing

1. Clone the repository and run `yarn && yarn test:watch`
2. Get coding!

Please write tests (100% jest coverage) and types.

## License

MIT © [@mayteio](https://github.com/@mayteio)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
