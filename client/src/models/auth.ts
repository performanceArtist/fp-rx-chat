import { Observable, merge } from 'rxjs';
import {
  switchMap,
  startWith,
  map,
  distinctUntilChanged,
} from 'rxjs/operators';
import { ask } from 'fp-ts/lib/Reader';
import { pipe } from 'fp-ts/lib/pipeable';

import { combineReaders, createHandler } from 'utils';
import { isSuccess } from 'api/request';
import { Api } from 'api/api';

export type AuthStatus = 'unknown' | 'login' | 'logout';
export type LoginQuery = {
  username: string;
  password: string;
};

export type AuthModel = {
  login: (query: LoginQuery) => void;
  logout: () => void;
  authStatus$: Observable<AuthStatus>;
};

type CreateAuthModel = () => AuthModel;

type AuthModelDeps = {
  api: Api;
};

export const createAuthModel = combineReaders(
  ask<AuthModelDeps>(),
  ({ api }): CreateAuthModel => () => {
    const [login$, loginHandle] = createHandler<LoginQuery>();
    const loginRequest$: Observable<AuthStatus> = pipe(
      login$,
      switchMap(query => api.post('login', { query })),
      map(request => (isSuccess(request) ? 'login' : 'unknown')),
    );

    const [logout$, logoutHandle] = createHandler();
    const logoutRequest$: Observable<AuthStatus> = pipe(
      logout$,
      switchMap(() => api.post('logout')),
      map(request => (isSuccess(request) ? 'logout' : 'unknown')),
    );

    const authStatus$: Observable<AuthStatus> = pipe(
      merge(loginRequest$, logoutRequest$),
      startWith('unknown' as const),
      distinctUntilChanged(),
    );

    return {
      login: loginHandle,
      logout: logoutHandle,
      authStatus$,
    };
  },
);
