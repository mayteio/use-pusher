import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PusherProvider } from "./use-pusher/native";
import { PusherExample } from "./PusherExample";

export default function App() {
  return (
    <PusherProvider clientKey="a81d0dca2a1cb2710d16" cluster="ap4">
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
        <PusherExample />
      </View>
    </PusherProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
