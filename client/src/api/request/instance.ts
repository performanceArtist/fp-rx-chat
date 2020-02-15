import { Functor1 } from 'fp-ts/lib/Functor';
import { Monad1 } from 'fp-ts/lib/Monad';
import { Request, isSuccess, success, pending } from './types';

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    Request: Request<A>;
  }
}

const URI = 'Request';
type URI = typeof URI;

export const mapRequest = <A, B>(f: (a: A) => B) => (request: Request<A>): Request<B> => {
  return isSuccess(request) ? success(f(request.data)) : request;
}

export const request: Functor1<URI> & Monad1<URI> = {
  URI,
  map: (request, f) => {
    return isSuccess(request) ? success(f(request.data)) : request;
  },
  of: () => pending(),
  ap: (fab, fa) => {
    if (isSuccess(fab) && isSuccess(fa)) {
      return success(fab.data(fa.data));
    } else {
      return fa as Request<any>;
    }
  },
  chain: (fa, f) => {
    if (isSuccess(fa)) {
      return f(fa.data);
    } else {
      return fa;
    }
  },
};
