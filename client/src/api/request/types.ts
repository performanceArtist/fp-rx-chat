import { Observable } from 'rxjs';

type Pending = {
  type: 'pending';
};

type Success<A> = {
  type: 'success';
  data: A;
};

type Failure = {
  type: 'failure';
  error: Error;
};

export type Request<D = unknown> = Pending | Success<D> | Failure;
export type RequestStream<D = unknown> = Observable<Request<D>>;

export const success: <A>(data: A) => Success<A> = data => ({
  type: 'success',
  data,
});

export const failure: (error: Error) => Failure = error => ({
  type: 'failure',
  error,
});

export const pending: Request<never> = {
  type: 'pending',
};

export const isSuccess = <T>(request: Request<T>): request is Success<T> =>
  request.type === 'success';
export const isFailure = <T>(request: Request<T>): request is Failure =>
  request.type === 'failure';
export const isPending = <T>(request: Request<T>): request is Pending =>
  request.type === 'pending';
