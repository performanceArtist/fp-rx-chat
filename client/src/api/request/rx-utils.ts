import { pipe } from 'fp-ts/lib/pipeable';
import { map } from 'rxjs/operators';
import { combineLatest, OperatorFunction } from 'rxjs';
import { array } from 'fp-ts/lib/Array';

import { mapRequest, Request, request } from 'api/request';

import { RequestStream } from './types';

interface Combine {
  <A, B>(a: RequestStream<A>, b: RequestStream<B>): RequestStream<[A, B]>;
  <A, B, C>(
    a: RequestStream<A>,
    b: RequestStream<B>,
    c: RequestStream<C>,
  ): RequestStream<[A, B, C]>;
  <A, B, C, D>(
    a: RequestStream<A>,
    b: RequestStream<B>,
    c: RequestStream<C>,
    d: RequestStream<D>,
  ): RequestStream<[A, B, C, D]>;
}

export const combine: Combine = (
  ...requests: RequestStream<any>[]
): RequestStream<any> =>
  pipe(combineLatest(...requests), map(array.sequence(request)));

export const asyncMap = <A, B>(
  f: (r: A) => B,
): OperatorFunction<Request<A>, Request<B>> => map(mapRequest(f));
