import { useEffect, useMemo, useState } from 'react';
import { Observable } from 'rxjs';

export const useObservable = <A>(fa: Observable<A>, initial: A): A => {
  const [a, setA] = useState(initial);
  const subscription = useMemo(() => fa.subscribe(setA), []); // create subscription immediately
  useEffect(() => () => subscription.unsubscribe(), [subscription]);
  return a;
};
