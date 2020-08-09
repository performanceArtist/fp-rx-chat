import { Either } from 'fp-ts/lib/Either';
import { Observable } from 'rxjs';

export type Pending = {
  type: 'pending';
};

export const pending: Pending = {
  type: 'pending',
};
export const isPending = (data: any): data is Pending =>
  data.type === 'pending';

export type Request<T> = Observable<Either<Error | Pending, T>>;

export type RequestResult<T> = Either<Error | Pending, T>;
