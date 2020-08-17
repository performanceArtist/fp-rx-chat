import { useEffect, useState } from 'react';
import { Observable } from 'rxjs';

export const useObservable = <A>(fa: Observable<A>, initial: A): A => {
  const [value, setValue] = useState(initial);

  useEffect(() => {
    const subscription = fa.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, []);

  return value;
};
