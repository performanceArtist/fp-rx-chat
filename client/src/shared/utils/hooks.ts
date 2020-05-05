import { useEffect, useMemo, useState, useCallback } from 'react';
import { Observable } from 'rxjs';

export const useObservable = <A>(fa: Observable<A>, initial: A): A => {
  const [value, setValue] = useState(initial);
  const subscription = useMemo(() => fa.subscribe(setValue), []);
  useEffect(() => () => subscription.unsubscribe(), [subscription]);
  return value;
};

export const useField = <T extends string | number>(initial: T) => {
  const [value, set] = useState(initial);
  const onChange = useCallback((event: React.FormEvent) => {
    const target = event.target as HTMLInputElement;
    const newValue =
      typeof initial === 'number' ? parseFloat(target.value) : target.value;
    set(newValue as T);
  }, []);

  return [
    value,
    {
      set,
      change: onChange,
    },
  ] as const;
};