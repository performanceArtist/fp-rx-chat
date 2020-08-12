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

export type Initial = {
  type: 'initial';
};
export const initial: Initial = {
  type: 'initial',
};
export const isInitial = (data: any): data is Initial =>
  data.type === 'initial';

export type RequestResult<T> = Either<Error | Pending | Initial, T>;

export type Request<T> = Observable<RequestResult<T>>;
