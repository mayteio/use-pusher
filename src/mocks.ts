// Based off https://github.com/nikolalsvk/pusher-js-mock
import { Options } from 'pusher-js';

type CallbackSignature = (data: any, metadata?: any) => void;

class PusherChannelMock {
  /** Initialize PusherChannelMock with callbacks object. */
  callbacks: { [name: string]: CallbackSignature[] };
  name: string;
  constructor(name?: string) {
    this.callbacks = {};
    this.name = name || 'channel';
  }

  /**
   * Bind callback to an event name.
   * @param {String} name - name of the event.
   * @param {Function} callback - callback to be called on event.
   */
  bind(name: string, callback: CallbackSignature) {
    this.callbacks[name] = this.callbacks[name] || [];
    this.callbacks[name].push(callback);
  }

  /**
   * Unbind callback from an event name.
   * @param {String} name - name of the event.
   * @param {Function} callback - callback to be called on event.
   */
  unbind(name: string, callback: CallbackSignature) {
    this.callbacks[name] = (this.callbacks[name] || []).filter(cb => cb !== callback);
  }

  /**
   * Emit event with data.
   * @param {String} name - name of the event.
   * @param {*} data - data you want to pass in to callback function that gets * called.
   */
  emit(name: string, data?: any, metadata?: any) {
    const callbacks = this.callbacks[name];

    if (callbacks) {
      callbacks.forEach(cb => cb(data, metadata));
    }
  }

  trigger() {}
}

export { PusherChannelMock };

class PusherPresenceChannelMock extends PusherChannelMock {
  members: any;
  myID: any;
  constructor(name?: string) {
    super(name ? name : 'presence-');
    this.members = { members: {}, myID: '0a' };
  }
}

export { PusherPresenceChannelMock };

class PusherMock {
  key: string;
  config: Options;
  channels: { [name: string]: PusherChannelMock };
  /** Initialize PusherMock with empty channels object. */
  constructor(key: string, config: Options) {
    this.key = key;
    this.config = config;
    this.channels = {};
  }

  /**
   * Get channel by its name.
   * @param {String} name - name of the channel.
   * @returns {PusherChannelMock} PusherChannelMock object that represents channel
   */
  channel(name: string) {
    if (!this.channels[name]) {
      this.channels[name] = name.includes('presence-')
        ? new PusherPresenceChannelMock(name)
        : new PusherChannelMock(name);
    }

    return this.channels[name];
  }

  /**
   * Mock subscribing to a channel.
   * @param {String} name - name of the channel.
   * @returns {PusherChannelMock} PusherChannelMock object that represents channel
   */
  subscribe(name: string) {
    return this.channel(name);
  }

  /**
   * Unsubscribe from a mocked channel.
   * @param {String} name - name of the channel.
   */
  unsubscribe(name: string) {
    if (name in this.channels) {
      this.channels[name].callbacks = {};
      delete this.channels[name];
    }
  }

  disconnect() {}
}

export { PusherMock };
