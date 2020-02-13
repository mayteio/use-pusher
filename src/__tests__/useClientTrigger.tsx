import { renderHook } from '@testing-library/react-hooks';
import { PusherPresenceChannelMock } from '../mocks';
import { useClientTrigger } from '../useClientTrigger';
import { PresenceChannel } from 'pusher-js';

describe('<useClientTrigger />', () => {
  test('should ', () => {
    const mockChannel = (new PusherPresenceChannelMock() as unknown) as PresenceChannel<unknown>;
    renderHook(() => useClientTrigger(mockChannel));
  });
});
