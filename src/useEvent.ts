import { useEffect } from 'react';
import invariant from 'invariant';
import { Channel, PresenceChannel } from 'pusher-js';

/**
 * Subscribes to a channel event and registers a callback.
 * @param channel Pusher channel to bind to
 * @param eventName Name of event to bind to
 * @param callback Callback to call on a new event
 */
export function useEvent<D>(
  channel: Channel | PresenceChannel | undefined,
  eventName: string,
  callback: (data?: D) => void,
  dependencies?: unknown[] | undefined
) {
  // error when required arguments aren't passed.
  invariant(eventName, 'Must supply eventName and callback to onEvent');
  invariant(callback, 'Must supply callback to onEvent');

  // deprecate dependencies
  useEffect(() => {
    if (dependencies) {
      console.warn(
        'The useEvent callback is no longer memoized - dependencies are deprecated and its up to you to memoize the callback if you want to.'
      );
    }
  }, [dependencies]);

  // bind and unbind events whenever the channel, eventName or callback changes.
  useEffect(() => {
    if (channel === undefined) {
      return;
    } else channel.bind(eventName, callback);
    return () => {
      channel.unbind(eventName, callback);
    };
  }, [channel, eventName, callback]);
}
