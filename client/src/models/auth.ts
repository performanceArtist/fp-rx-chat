import { Observable, merge } from 'rxjs';
import { distinctUntilChanged, startWith } from 'rxjs/operators';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, reader } from 'fp-ts';
import { observable } from 'fp-ts-rxjs';

import { combineReaders, createHandler } from 'shared/utils';
import { Api } from 'api/api';

type AuthStatus = 'unknown' | 'login' | 'logout';
type LoginQuery = {
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
  reader.ask<AuthModelDeps>(),
  ({ api }): CreateAuthModel => () => {
    const [login$, loginHandle] = createHandler<LoginQuery>();
    const loginRequest$: Observable<AuthStatus> = pipe(
      login$,
      observable.chain(query => api.post('login', { query })),
      observable.map(
        either.fold(
          () => 'unknown',
          () => 'login',
        ),
      ),
    );

    const [logout$, logoutHandle] = createHandler();
    const logoutRequest$: Observable<AuthStatus> = pipe(
      logout$,
      observable.chain(() => api.post('logout')),
      observable.map(
        either.fold(
          () => 'unknown',
          () => 'logout',
        ),
      ),
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
