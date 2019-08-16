import { useContext } from "react";
import { __PusherContext } from "./PusherProvider";
import { PusherContextValues } from "./types";

/**
 * Provides access to the pusher client
 *
 * @example
 * const {client} = usePusher();
 * client.subscribe('my-channel');
 */
export function usePusher() {
  return useContext<PusherContextValues>(__PusherContext);
}
