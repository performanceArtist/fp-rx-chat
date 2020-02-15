import { switchMap, shareReplay } from 'rxjs/operators';
import { ask } from 'fp-ts/lib/Reader';
import * as t from 'io-ts';

import { combineReaders, createHandler } from 'utils';
import { ApiInstance } from 'deps';

export type UserModel = ReturnType<typeof createUserModel>;

const UserScheme = t.type({
  id: t.number,
  username: t.string,
  avatar: t.string,
});

export type User = t.TypeOf<typeof UserScheme>;
export type UserData = t.TypeOf<typeof UserScheme>;

export const createUserModel = combineReaders(ask<ApiInstance>(), ({ api }) => {
  const [userStart$, getUser] = createHandler();

  const user$ = userStart$.pipe(
    switchMap(() => api.get('user/me', { scheme: UserScheme })),
    shareReplay(1),
  );

  return {
    getUser,
    user$,
  };
});
