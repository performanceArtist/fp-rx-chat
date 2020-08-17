import { InputEffect } from '../rxjs/createInput';
import { useEffect } from 'react';

export const useInputEffect = <I>(effect: InputEffect<I>) => {
  useEffect(() => {
    const subscription = effect.out$.subscribe();
    return () => subscription.unsubscribe();
  }, []);

  return effect.onInput;
};
