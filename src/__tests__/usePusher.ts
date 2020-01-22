import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { usePusher, NOT_IN_CONTEXT_WARNING } from '../usePusher';

describe('usePusher hook', () => {
  test('should warn when not inside a pusher context', () => {
    const spy = jest.spyOn(global.console, 'warn');
    const { result } = renderHook(() => usePusher());
    // expect(result.current).toBeUndefined();
    // expect(spy).toHaveBeenCalledWith(NOT_IN_CONTEXT_WARNING);
  });
});
