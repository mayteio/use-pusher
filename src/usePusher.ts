import { useContext, useEffect } from 'react';
import { __PusherContext } from './PusherProvider';
import { PusherContextValues } from './types';

/**
 * Provides access to the pusher client instance.
 *
 * @returns a `MutableRefObject<Pusher|undefined>`. The instance is held by a `useRef()` hook.
 * @example
 * ```javscript
 * const { client } = usePusher();
 * client.current.subscribe('my-channel');
 * ```
 */
export function usePusher() {
  const context = useContext<PusherContextValues>(__PusherContext);
  useEffect(() => {
    if (!context) console.warn(NOT_IN_CONTEXT_WARNING);
  }, [context]);
  return context;
}

export const NOT_IN_CONTEXT_WARNING =
  'No Pusher context. Did you forget to wrap your app in a <PusherProvider />?';
