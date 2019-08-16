import { useRef } from "react";
import deepEqual from "dequal";

/**
 * Nice helper to deep compare memoize
 * @copyright Kent C. Dodds
 * @param value value to memoize
 */
export function useDeepCompareMemoize(value: any[]) {
  const ref = useRef<any>();

  if (!deepEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}
