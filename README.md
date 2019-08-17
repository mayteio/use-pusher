# use-pusher

> Easy as hooks that integrate with the [pusher-js](https://github.com/pusher/pusher-js) library.

[![NPM](https://img.shields.io/npm/v/use-pusher.svg)](https://www.npmjs.com/package/react-pusher-hooks) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add use-pusher
```

##### [API Reference/Docs](https://mayteio.github.io/use-pusher/)

## Usage

You must wrap your app with a `PusherProvider` and pass it config props for [pusher-js](https://github.com/pusher/pusher-js) initialisation initialisation.

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

Use this hook to subscribe to channel events.

```tsx
const Example = () => {
  const [messages, setMessages] = React.useState([]);
  const onEvent = message => setMessages(m => [...m, message]);
  const channel = useChannel("channel-name", "event-name", onEvent);

  return messages.map(event => <p key={event.id}>{event.message}</p>);
};
```

## `useTrigger`

A helper function to create a **server triggered** event. BYO server (See [Trigger Server](#trigger-server) below). Pass in `triggerEndpoint` prop to `<PusherProvider />`. Any auth headers from config.auth.headers automatically get passed to the `fetch` call.

```tsx
import {useTrigger} from 'use-pusher`;

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

In order to trigger an event, you'll have to create a simple lambda (or an express server if that's your thing) that handles. Below is a short lambda that can handle your triggered events.

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

Though normally you'd want to add some sort of authentication here.

> _I don't want a server though_

I hear ya. If you're feeling audacious, you can use [client events](https://pusher.com/docs/channels/using_channels/events#triggering-client-events) to push directly from the client, though this isn't recommended because security (thus no hook):

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

## License

MIT © [@mayteio](https://github.com/@mayteio)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
