import React from "react";
import { render, cleanup } from "@testing-library/react";
import { PusherProvider } from "../PusherProvider";
import { default as MockPusher } from "pusher-js";

beforeEach(() => {
  cleanup();
  jest.resetAllMocks();
});

jest.mock("pusher-js", () => {
  const { PusherMock } = require("pusher-js-mock");
  PusherMock.prototype.constructor = jest.fn();
  return PusherMock;
});

const config = {
  clientKey: "client-key",
  cluster: "ap4",
  children: "Test"
};
const authConfig = {
  auth: {
    params: {},
    headers: {}
  },
  authEndpoint: "endpoint"
};

describe("PusherProvider", () => {
  test("should render without error", () => {
    render(<PusherProvider clientKey="a" cluster="b" children="Test" />);
  });

  // https://pusher.com/docs/channels/using_channels/connection#disconnecting-from-channels
  // test("should re-render when auth params are supplied.", () => {
  //   const { container } = render(<PusherProvider {...config} />);
  //   render(<PusherProvider {...config} {...authConfig} />, { container });
  //   expect(MockPusher.prototype.constructor).toHaveBeenCalledTimes(1);
  // });

  // test("should not re-create instance if props are the same", () => {
  //   const { container } = render(<PusherProvider {...config} />);
  //   render(<PusherProvider {...config} />, { container });
  //   // expect(MockPusher.prototype.disconnect).toHaveBeenCalledTimes(1);
  // });

  // test("should not re-create instance if defer is present", () => {
  //   render(<PusherProvider {...config} defer={true} />);
  //   expect(MockPusher.prototype.disconnect).toHaveBeenCalledTimes(0);
  // });
});
