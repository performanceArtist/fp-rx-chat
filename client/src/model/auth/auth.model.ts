import { pipe } from 'fp-ts/lib/pipeable';
import { selector } from '@performance-artist/fp-ts-adt';
import { sequenceS } from 'fp-ts/lib/Apply';
import { observable, observableEither } from 'fp-ts-rxjs';
import {
  withLatestFrom,
  shareReplay,
  distinctUntilChanged, switchMap
} from 'rxjs/operators';
import { flow, identity } from 'fp-ts/lib/function';
import { option, eq } from 'fp-ts';
import { Option } from 'fp-ts/lib/Option';

import {
  createInputEffect,
  InputEffect,
  createInput,
  Input,
} from 'shared/utils/rxjs';
import { userStoreKey, User } from 'store/user.store';
import { Request } from 'api/api-client';
import { Behavior, behavior } from '@performance-artist/store';

type AuthStatus = Option<'login' | 'logout'>;

export type AuthModel = {
  username: Input<string, string>;
  password: Input<string, string>;
  login: InputEffect<void>;
  logout: InputEffect<void>;
  authStatus: Behavior<AuthStatus>;
  user$: Request<User>;
};
export const authModelKey = selector.key<AuthModel>()('authModel');

export const createAuthModel = pipe(
  userStoreKey,
  selector.map(userStore => (): AuthModel => {
    const username = createInput<string>()(identity);
    const password = createInput<string>()(identity);
    const authStatus = behavior.of<AuthStatus>(option.none);

    const query$ = sequenceS(observable.observable)({
      username: username.out$,
      password: password.out$,
    });
    const login = createInputEffect()(
      flow(
        withLatestFrom(query$),
        switchMap(([_, query]) => userStore.login(query)),
        observableEither.map(() => authStatus.set(option.some('login'))),
      ),
    );

    const logout = createInputEffect()(
      flow(
        switchMap(userStore.logout),
        observableEither.map(() => authStatus.set(option.some('logout'))),
      ),
    );

    const user$ = pipe(
      authStatus.value$,
      distinctUntilChanged(option.getEq(eq.eqString).equals),
      switchMap(userStore.getUser),
      shareReplay(1),
    );

    return {
      username,
      password,
      login,
      logout,
      authStatus,
      user$,
    };
  }),
);
