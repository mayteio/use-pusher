import { Config } from "pusher-js";

export class ChannelMock {
  binding: any = {
    eventType: undefined,
    onEvent: undefined
  };
  emit = jest.fn((eventName: string, data: any) => {
    if (
      this.binding.onEvent !== undefined &&
      this.binding.eventType === eventName
    ) {
      this.binding.onEvent(data);
    }
  });
  bind = jest.fn((eventName: string, onEvent: any) => {
    this.binding.onEvent = onEvent;
    this.binding.eventType = eventName;
  });
  unbind = jest.fn(() => {
    this.binding.onEvent = undefined;
    this.binding.eventType = undefined;
  });
}

export class PusherMock {
  clientKey: undefined | string;
  config: undefined | Config;

  constructor(clientKey: string, config: Config) {
    this.config = config;
    this.clientKey = clientKey;
  }

  subscribe = jest.fn(() => new ChannelMock());
  unsubscribe = jest.fn();

  disconnect = jest.fn();
}
