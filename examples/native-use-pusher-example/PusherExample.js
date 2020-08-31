import React from "react";
import { Button, Text } from "react-native";
import { usePresenceChannel, useClientTrigger } from "./use-pusher/native";

export const PusherExample = () => {
  const { channel, ...rest } = usePresenceChannel("presence-my-channel");
  const trigger = useClientTrigger(channel);

  return (
    <>
      <Text>Hello</Text>
      <Button
        title="Trigger event"
        onPress={() => trigger("client-hello-world", {})}
      />
    </>
  );
};
