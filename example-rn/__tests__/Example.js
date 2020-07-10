// Example.tsx
import React from 'react';
import {
  PusherProvider,
  useChannel,
  useEvent,
  useState,
} from '@harelpls/use-pusher/react-native';

import {View, Text} from 'react-native';

// Example.test.tsx
import {render, act} from 'react-native-testing-library';
import {PusherMock, PusherChannelMock} from 'pusher-js-mock';

const Example = () => {
  const [title, setTitle] = useState();
  const channel = useChannel('my-channel');
  useEvent(channel, 'title', ({data}) => setTitle(data));

  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
};

// mock out NetInfo
// https://github.com/react-native-community/react-native-netinfo#errors-while-running-jest-tests
import mockRNCNetInfo from '@react-native-community/netinfo/jest/netinfo-mock.js';
jest.mock('@react-native-community/netinfo', () => mockRNCNetInfo);

// mock out the result of the useChannel hook
const mockChannel = new PusherChannelMock();
jest.mock('@harelpls/use-pusher', () => ({
  ...require.requireActual('@harelpls/use-pusher'),
  useChannel: () => mockChannel,
}));

test('should show a title when it receives a title event', async () => {
  // mock the client
  const client = new PusherMock('client-key', {cluster: 'ap4'});

  // render component and provider with a mocked context value
  const {findByText} = render(
    <PusherProvider clientKey="client-key" cluster="ap4" value={{client}}>
      <Example />
    </PusherProvider>,
  );

  // emit an event on the mocked channel
  act(() => mockChannel.emit('title', {data: 'Hello world'}));

  // assert expectations
  expect(await findByText('Hello world')).toBeInTheDocument();
});
