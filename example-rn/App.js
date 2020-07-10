/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 */

import React from 'react';
import {SafeAreaView, View, Text} from 'react-native';
import styles from './styles';

const config = {
  // required config props
  clientKey: 'client-key',
  cluster: 'ap4',

  // optional if you'd like to trigger events. BYO endpoint.
  // see "Trigger Server" below for more info
  triggerEndpoint: '/pusher/trigger',

  // required for private/presence channels
  // also sends auth headers to trigger endpoint
  authEndpoint: '/pusher/auth',
  auth: {
    headers: {Authorization: 'Bearer token'},
  },
};

import {PusherProvider} from '@harelpls/use-pusher/react-native';

const App = () => {
  return (
    <PusherProvider {...config}>
      <Screen />
    </PusherProvider>
  );
};

const Screen = () => {
  return (
    <SafeAreaView>
      <View style={styles.body}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Pusher Example</Text>
          <Text style={styles.sectionDescription}>
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;
