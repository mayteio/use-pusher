import { renderHook } from "@testing-library/react-hooks";
import Pusher from "pusher-js";
import React from "react";

import { __PusherContext } from "../core/PusherProvider";
import { NOT_IN_CONTEXT_WARNING, usePusher } from "../core/usePusher";

describe("usePusher()", () => {
  test("should warn when outside provider", () => {
    jest.spyOn(console, "warn");
    renderHook(() => usePusher());
    expect(console.warn).toHaveBeenCalledWith(NOT_IN_CONTEXT_WARNING);
  });

  test("should return context values of PusherProvider", () => {
    const client = {} as Pusher;
    const wrapper: React.FC = ({ children }) => (
      <__PusherContext.Provider value={{ client }}>
        {children}
      </__PusherContext.Provider>
    );
    const { result } = renderHook(() => usePusher(), { wrapper });
    expect(result.current.client).toBe(client);
  });
});
