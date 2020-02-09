import * as t from 'io-ts';

import { makeWithSQL } from '../db/dbi';

export const UserScheme = t.type({
  id: t.number,
  uid: t.string,
  username: t.string,
  email: t.string,
  password: t.string,
});

export type User = t.TypeOf<typeof UserScheme>;

export const withUserScheme = makeWithSQL(UserScheme, 'user');

export const comparePasswords = (candidate: string, actual: string) => candidate === actual;
