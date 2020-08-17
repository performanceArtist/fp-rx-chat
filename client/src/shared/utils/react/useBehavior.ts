import { IBehavior } from '../rxjs/createBehavior';
import { useState, useEffect } from 'react';

export const useBehavior = <T>(b: IBehavior<T>) => {
  const [value, setValue] = useState(b.get());

  useEffect(() => {
    const subscription = b.out$.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, []);

  return value;
};
