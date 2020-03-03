import { PusherProvider, __PusherContext } from "../PusherProvider";

import Pusher from "pusher-js";
import React from "react";
import { render } from "@testing-library/react";

jest.mock("pusher-js", () => jest.fn());

describe("<PusherProvider />", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should throw warnings when key or cluster isn't present", () => {
    jest.spyOn(console, "error");
    const { rerender } = render(
      <PusherProvider clientKey={undefined} cluster="ap4" />
    );
    expect(console.error).toHaveBeenCalledTimes(1);
    rerender(<PusherProvider clientKey="key" cluster={undefined} />);
    expect(console.error).toHaveBeenCalledTimes(2);
  });

  test("should create no client if defer is passed, value is passed, or config hasn't changed", () => {
    const { rerender } = render(
      <PusherProvider defer={true} clientKey="key" cluster="ap4" />
    );
    expect(Pusher.prototype.constructor).toHaveBeenCalledTimes(0);
    rerender(
      <PusherProvider
        value={{ client: undefined }}
        clientKey="key"
        cluster="ap4"
      />
    );
    expect(Pusher.prototype.constructor).toHaveBeenCalledTimes(0);
    rerender(
      <PusherProvider
        clientKey="key"
        cluster="ap4"
        enabledTransports={["wss"]}
      />
    );
    rerender(
      <PusherProvider
        clientKey="key"
        cluster="ap4"
        enabledTransports={["wss"]}
      />
    );
    expect(Pusher.prototype.constructor).toHaveBeenCalledTimes(1);
  });

  test("should create a new pusher client and pass that to context, along with the triggerEndpoint", () => {
    jest.spyOn(console, "log");
    render(
      <PusherProvider clientKey="key" cluster="ap4" triggerEndpoint="endpoint">
        <__PusherContext.Consumer>
          {(value) => {
            return <Logger value={value} />;
          }}
        </__PusherContext.Consumer>
      </PusherProvider>
    );
    expect(console.log).toHaveBeenCalledWith({
      client: {},
      triggerEndpoint: "endpoint"
    });
  });
});

const Logger = ({ value }) => {
  console.log(value);
  return null;
};
