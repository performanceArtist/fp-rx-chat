import { pipe } from 'fp-ts/lib/pipeable';
import { selector } from '@performance-artist/fp-ts-adt';
import { sequenceS } from 'fp-ts/lib/Apply';
import { observable, observableEither } from 'fp-ts-rxjs';
import {
  withLatestFrom,
  shareReplay,
  distinctUntilChanged,
} from 'rxjs/operators';
import { flow, identity } from 'fp-ts/lib/function';
import { option, eq } from 'fp-ts';
import { Option } from 'fp-ts/lib/Option';

import {
  createInputEffect,
  InputEffect,
  createInput,
  Input,
  createBehavior,
  IBehavior,
} from 'shared/utils/rxjs';
import { userStoreKey, User } from 'store/user.store';
import { Request } from 'api/api-client';

type AuthStatus = Option<'login' | 'logout'>;

export type AuthModel = {
  username: Input<string, string>;
  password: Input<string, string>;
  login: InputEffect<void>;
  logout: InputEffect<void>;
  authStatus: IBehavior<AuthStatus>;
  user$: Request<User>;
};
export const authModelKey = selector.key<AuthModel>()('authModel');

export const createAuthModel = pipe(
  userStoreKey,
  selector.map(userStore => (): AuthModel => {
    const username = createInput<string>()(identity);
    const password = createInput<string>()(identity);
    const authStatus = createBehavior<AuthStatus>(option.none);

    const query$ = sequenceS(observable.observable)({
      username: username.out$,
      password: password.out$,
    });
    const login = createInputEffect()(
      flow(
        withLatestFrom(query$),
        observable.chain(([_, query]) => userStore.login(query)),
        observableEither.map(() => authStatus.set(option.some('login'))),
      ),
    );

    const logout = createInputEffect()(
      flow(
        observable.chain(userStore.logout),
        observableEither.map(() => authStatus.set(option.some('logout'))),
      ),
    );

    const user$ = pipe(
      authStatus.out$,
      distinctUntilChanged(option.getEq(eq.eqString).equals),
      observable.chain(userStore.getUser),
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
