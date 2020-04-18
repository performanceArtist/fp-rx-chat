import { shareReplay, switchMap } from 'rxjs/operators';
import { ask } from 'fp-ts/lib/Reader';
import * as t from 'io-ts';

import { combineReaders } from 'utils';
import { Api } from 'api/api';
import { pipe } from 'fp-ts/lib/pipeable';
import { AuthModel } from './auth';
import { RequestStream } from 'api/request';

const UserScheme = t.type({
  id: t.number,
  username: t.string,
  avatar: t.string,
});

export type User = t.TypeOf<typeof UserScheme>;
export type UserData = t.TypeOf<typeof UserScheme>;

type UserModelDeps = {
  api: Api;
  authModel: AuthModel;
};

export type UserModel = {
  user$: RequestStream<User>;
};

type CreateUserModel = () => UserModel;

export const createUserModel = combineReaders(
  ask<UserModelDeps>(),
  (deps): CreateUserModel => () => {
    const { api, authModel } = deps;
    const user$ = pipe(
      authModel.authStatus$,
      switchMap(() => api.get('user/me', { scheme: UserScheme })),
      shareReplay(1),
    );

    return {
      user$,
    };
  },
);
