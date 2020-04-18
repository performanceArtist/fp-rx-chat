import { Monad1 } from 'fp-ts/lib/Monad';
import { Request, isSuccess, success } from './types';

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    Request: Request<A>;
  }
}

const URI = 'Request';
type URI = typeof URI;

export const mapRequest = <A, B>(f: (a: A) => B) => (
  request: Request<A>,
): Request<B> => {
  return isSuccess(request) ? success(f(request.data)) : request;
};

export const request: Monad1<URI> = {
  URI,
  map: (request, f) =>
    isSuccess(request) ? success(f(request.data)) : request,
  of: success,
  ap: (fab, fa) => {
    if (isSuccess(fab) && isSuccess(fa)) {
      return success(fab.data(fa.data));
    } else {
      return fa as Request<any>;
    }
  },
  chain: (fa, f) => (isSuccess(fa) ? f(fa.data) : fa),
};
