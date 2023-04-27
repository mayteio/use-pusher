# `@harelpls/use-pusher`

> Easy as [React hooks](https://reactjs.org/docs/hooks-intro.html) that integrate with the [`pusher-js`](https://github.com/pusher/pusher-js) library.

[![NPM](https://img.shields.io/npm/v/@harelpls/use-pusher.svg)](https://www.npmjs.com/package/@harelpls/use-pusher) ![Typed](https://badgen.net/badge//types/Typescript?icon=typescript)

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Install](#install)
- [Hooks](#hooks)
- [Usage](#usage)
- [`useChannel`](#usechannel)
- [`usePresenceChannel`](#usepresencechannel)
- [`useEvent`](#useevent)
- [`useTrigger`](#usetrigger)
- [`usePusher`](#usepusher)
- [Trigger Server](#trigger-server)
- [`useClientTrigger`](#useclienttrigger)
- [Typescript](#typescript)
- [Testing](#testing)
- [React Native](#react-native)
- [Contributing](#contributing)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## [API Reference/Docs](https://use-pusher-docs.netlify.com/)

## Install

```bash
yarn add @harelpls/use-pusher
```

## Hooks

- [`useChannel`](#usechannel)
- [`usePresenceChannel`](#usepresencechannel)
- [`useEvent`](#useevent)
- [`useTrigger`](#usetrigger)
- [`useClientTrigger`](#useclienttrigger)
- [`usePusher`](#usepusher)

## Usage

You must wrap your app with a `PusherProvider` and pass it config props for [`pusher-js`](https://github.com/pusher/pusher-js) initialisation.

```typescript
import React from "react";
import { PusherProvider } from "@harelpls/use-pusher";

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
    headers: { Authorization: "Bearer token" },
  },
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

```typescript
// returns channel instance.
const channel = useChannel("channel-name");
```

## `usePresenceChannel`

Augments a regular channel with member functionality.

```typescript
const Example = () => {
  const { members, myID } = usePresenceChannel('presence-awesome');

  return (
    <ul>
      {Object.entries(members)
        // filter self from members
        .filter(([id]) => id !== myID)
        // map them to a list
        .map(([id, info]) => (
          <li key={id}>{info.name}</li>
        ))
      }
    </ul>
  )
}
```

## `useEvent`

Bind to events on a channel with a callback.

```typescript
const Example = () => {
  const [message, setMessages] = useState();
  const channel = useChannel("channel-name");
  useEvent(channel, "message", ({ data }) =>
    setMessages((messages) => [...messages, data])
  );
};
```

_Note_: This will bind and unbind to the event on each render. You may want to memoise your callback with `useCallback` before passing it in if you notice performance issues.

## `useTrigger`

A helper function to create a **server triggered** event. BYO server (See [Trigger Server](#trigger-server) below). Pass in `triggerEndpoint` prop to `<PusherProvider />`. Any auth headers from `config.auth.headers` automatically get passed to the `fetch` call.

```typescript
import { useTrigger } from '@harelpls/use-pusher';

const Example = () => {
  const trigger = useTrigger("channel-name");
  const handleClick = () =>
    trigger("event-name", "hello");

  return (
    <button onClick={handleClick}>Say Hello</button>
  )
}
```

## `usePusher`

Get access to the Pusher instance to do other things.

```typescript
import { usePusher } from "@harelpls/use-pusher";

const Example = () => {
  const { client } = usePusher();
  client.log("Look ma, logs!");

  return null;
};
```

## Trigger Server

In order to trigger an event, you'll have to create a simple lambda (or an express server if that's your thing). Below is a short lambda that can handle triggered events from `useTrigger`.

```typescript
import Pusher from "pusher";

const pusher = new Pusher({
  appId: "app-id",
  key: "client-key",
  secret: "mad-secret",
  cluster: "ap4",
});

export async function handler(event) {
  const { channelName, eventName, data } = JSON.parse(event.body);
  pusher.trigger(channelName, eventName, data);
  return { statusCode: 200 };
}
```

## `useClientTrigger`

> _I don't want a server though_

I hear ya. If you're feeling audacious, you can use [client events](https://pusher.com/docs/channels/using_channels/events#triggering-client-events) to push directly from the client:

```typescript
import { useChannel, useClientTrigger } from "@harelpls/use-pusher";

const Example = () => {
  const channel = useChannel("presence-ca");
  const trigger = useClientTrigger(channel);
  const handleClientEvent = () => {
    trigger("Pew pew");
  };

  return <button onClick={handleClientEvent}>Fire</button>;
};
```

## Typescript

This project was built using typescript, so types are built-in. Yeeeew!

## Testing

I've teamed up with [@nikolalsvk](https://github.com/nikolalsvk) on [`pusher-js-mock`](https://github.com/nikolalsvk/pusher-js-mock) to bring y'all a great pusher mock.

Testing emitted events with jest can be achieved using `jest.mock` and `@testing-library/react` (or `enzyme`, though your tests should reflect what the user should see **NOT** how the component handles events internally):

```typescript
// Example.tsx
import React from "react";
import { useChannel, useEvent } from "@harelpls/use-pusher";

const Example = () => {
  const [title, setTitle] = useState();
  const channel = useChannel("my-channel");
  useEvent(channel, "title", ({ data }) => setTitle(data));

  return <span>{title}</span>;
};

// Example.test.tsx
import { render, act } from "@testing-library/react";
import { PusherMock, PusherChannelMock } from "pusher-js-mock";

// mock out the result of the useChannel hook
const mockChannel = new PusherChannelMock();
jest.mock("@harelpls/use-pusher", () => ({
  ...require.requireActual("@harelpls/use-pusher"),
  useChannel: () => mockChannel,
}));

test("should show a title when it receives a title event", async () => {
  // mock the client
  const client = new PusherMock("client-key", { cluster: "ap4" });

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

## React Native

This package comes with React Native support. Import your `PusherProvider` from `@harelpls/use-pusher/react-native` instead of the default `@harelpls/use-pusher`. All exports are re-exported from there.

Ensure you add the netinfo package to your project too: [`@react-native-community/netinfo`](https://github.com/react-native-community/react-native-netinfo).

```ts
import { PusherProvider, useChannel } from "@harelpls/use-pusher/react-native";
```

## Contributing

1. Clone the repository and run `yarn && yarn test:watch`
2. Get coding!

Please write tests (100% jest coverage) and types.

## License

MIT © [@mayteio](https://github.com/@mayteio)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
