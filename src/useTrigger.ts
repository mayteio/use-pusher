import { useCallback } from 'react';
import { usePusher } from './usePusher';
import invariant from 'invariant';
import { useChannel } from './useChannel';

/**
 * Hook to provide a trigger function that calls the server defined in `PusherProviderProps.triggerEndpoint` using `fetch`.
 * Any `auth?.headers` in the config object will be passed with the `fetch` call.
 *
 * @param channelName name of channel to call trigger on
 * @typeparam TData shape of the data you're sending with the event
 *
 * @example
 * ```typescript
 * const trigger = useTrigger<{message: string}>('my-channel');
 * trigger('my-event', {message: 'hello'});
 * ```
 */
export function useTrigger<TData = {}>(channelName: string) {
  const { client, triggerEndpoint } = usePusher();

  // you can't use this if you haven't supplied a triggerEndpoint.
  invariant(
    triggerEndpoint,
    'No trigger endpoint specified to <PusherProvider />. Cannot trigger an event.'
  );

  // subscribe to the channel we'll be triggering to.
  useChannel(channelName);

  // memoized trigger function to return
  const trigger = useCallback(
    (eventName: string, data?: TData) => {
      const fetchOptions: RequestInit = {
        method: 'POST',
        body: JSON.stringify({ channelName, eventName, data }),
      };

      if (client && client.current && client.current.config.auth) {
        fetchOptions.headers = client.current.config.auth.headers;
      } else {
        console.warn(
          'No auth parameters supplied to <PusherProvider />. Your events will be unauthenticated.'
        );
      }

      return fetch(triggerEndpoint, fetchOptions);
    },
    [client, triggerEndpoint, channelName]
  );

  return trigger;
}
