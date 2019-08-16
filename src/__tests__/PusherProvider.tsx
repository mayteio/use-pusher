import React from "react";
import { render, cleanup } from "@testing-library/react";
import { PusherProvider } from "../PusherProvider";
import { default as MockPusher } from "pusher-js";

jest.mock("pusher-js", () => {
  const { PusherMock } = require("../mocks.ts");
  return {
    __esModule: true,
    default: jest.fn((clientKey, config) => new PusherMock(clientKey, config))
  };
});

const setup = (props: any = {}) =>
  render(<PusherProvider {...props}>Test</PusherProvider>);

const defaultProps = { clientKey: "client-key", cluster: "ap4" };

beforeEach(() => {
  jest.resetAllMocks();
  cleanup();
});

test("should initialise pusher when required props are passed", () => {
  setup(defaultProps);
  expect(MockPusher).toHaveBeenCalledTimes(1);
});

test("should re-initialise Pusher when auth parameters are provided", () => {
  const { container } = setup(defaultProps);
  const authProps = {
    authEndpoint: "auth-endpoint",
    auth: {
      headers: { Authorization: "Bearer token" }
    }
  };
  render(
    <PusherProvider {...defaultProps} {...authProps}>
      Test
    </PusherProvider>,
    { container }
  );

  expect(MockPusher).toHaveBeenCalledTimes(2);
});
