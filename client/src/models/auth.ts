import { Observable, merge } from 'rxjs';
import {
  switchMap,
  startWith,
  map
} from 'rxjs/operators';
import { ask } from 'fp-ts/lib/Reader';

import { combineReaders, createHandler } from 'utils';
import { ApiInstance } from 'deps';
import { isSuccess } from 'api/request';

export type AuthStatus = 'unknown' | 'login' | 'logout';
export type LoginQuery = {
  username: string;
  password: string;
};

export type AuthModel = ReturnType<typeof createAuthModel>;

export const createAuthModel = combineReaders(ask<ApiInstance>(), ({ api }) => {
  const [login$, loginHandle] = createHandler<LoginQuery>();
  const loginRequest$: Observable<AuthStatus> = login$.pipe(
    switchMap(user => api.post('login', { query: user })),
    map(request => (isSuccess(request) ? 'login' : 'unknown')),
  );

  const [logout$, logoutHandle] = createHandler();
  const logoutRequest$: Observable<AuthStatus> = logout$.pipe(
    switchMap(() => api.post('logout')),
    map(request => (isSuccess(request) ? 'logout' : 'unknown')),
  );

  const authStatus$: Observable<AuthStatus> = merge(
    loginRequest$,
    logoutRequest$,
  ).pipe(startWith('unknown'));

  return {
    login: loginHandle,
    logout: logoutHandle,
    authStatus$,
  };
});
