import { shareReplay } from 'rxjs/operators';
import { reader } from 'fp-ts';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { observable } from 'fp-ts-rxjs';

import { combineReaders } from 'shared/utils';
import { Api } from 'api/api';
import { AuthModel } from './auth';
import { Request } from 'api/request';

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
  user$: Request<User>;
};

type CreateUserModel = () => UserModel;

export const createUserModel = combineReaders(
  reader.ask<UserModelDeps>(),
  (deps): CreateUserModel => () => {
    const { api, authModel } = deps;

    const user$ = pipe(
      authModel.authStatus$,
      observable.chain(() => api.get('user/me', { scheme: UserScheme })),
      shareReplay(1),
    );

    return {
      user$,
    };
  },
);
