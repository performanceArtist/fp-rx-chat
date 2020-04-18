import { Option, some, none } from 'fp-ts/lib/Option';
import { Either, left, right } from 'fp-ts/lib/Either';
import { sequenceT } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/lib/pipeable';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { array } from 'fp-ts/lib/Array';

import { request } from './instance';
import { Request, RequestStream } from './types';

export const toOption = <T>(request: Request<T>): Option<T> => {
  return request.type === 'success' ? some(request.data) : none;
};

export const toEither = <T>(request: Request<T>): Either<Error, T> => {
  if (request.type === 'success') {
    return right(request.data);
  }

  if (request.type === 'pending') {
    return left(new Error('Request in progress'));
  }

  return left(request.error);
};

export const sequenceTRequest = sequenceT(request);

interface CombineRequest {
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

export const combine: CombineRequest = (
  ...requests: RequestStream<any>[]
): RequestStream<any> =>
  pipe(combineLatest(...requests), map(array.sequence(request)));
