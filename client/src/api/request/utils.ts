import { Option, some, none } from 'fp-ts/lib/Option';
import { Either, left, right } from 'fp-ts/lib/Either';
import { sequenceT } from 'fp-ts/lib/Apply';

import { request } from './instance';
import { Request } from './types';

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
