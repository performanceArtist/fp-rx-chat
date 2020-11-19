import { Behavior } from '@performance-artist/store';
import { useObservable } from './useObservable';

export const useBehavior = <T>(b: Behavior<T>) =>
  useObservable(b.value$, b.get());
