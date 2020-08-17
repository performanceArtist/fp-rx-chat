import { BehaviorSubject, Observable } from 'rxjs';

export type IBehavior<T> = {
  out$: Observable<T>;
  set: (value: T) => void;
  get: () => T;
};
export const createBehavior = <S>(initial: S): IBehavior<S> => {
  const b = new BehaviorSubject<S>(initial);

  return {
    out$: b.asObservable(),
    set: b.next.bind(b),
    get: b.getValue,
  };
};
