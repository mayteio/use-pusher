import { renderHook } from "@testing-library/react-hooks";
import { act } from "react-dom/test-utils";
import React from "react";

import Pusher from "pusher-js";
import { PusherMock } from "pusher-js-mock";
import { __PusherContext } from "./core/PusherProvider";

/**
 * Flushes async promises in mocks
 */
export const actAndFlushPromises = async () =>
  await act(async () => await new Promise(setImmediate));

/**
 * Does a bit of setup for us so we don't have to repeat ourselves
 * @param hook the hook you want to render, i.e. () => useHook()
 * @param clientConfig the client config passed to PusherMock
 */
export async function renderHookWithProvider<T>(
  hook: () => T,
  clientConfig: Record<string, any> = {}
) {
  const client = new PusherMock("key", clientConfig) as unknown;
  const wrapper: React.FC = ({ children }) => (
    <__PusherContext.Provider value={{ client: client as Pusher }}>
      {children}
    </__PusherContext.Provider>
  );
  const result = renderHook(hook, { wrapper });
  await actAndFlushPromises();
  return result;
}

/**
 * Generates basic Pusher config with authorizer
 * @param id the id for the client
 * @param info the info object for the client
 */
export const makeAuthPusherConfig = (id: string = "my-id", info: any = {}) => ({
  authorizer: () => ({
    authorize: (
      socketId: string,
      callback: (errored: boolean, info: any) => void
    ) => callback(socketId === "errored", { id, info }),
  }),
});
