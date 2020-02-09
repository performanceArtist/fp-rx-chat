import { switchMap } from 'rxjs/operators';
import { ask } from 'fp-ts/lib/Reader';

import { combineReaders, createHandler } from 'utils';
import { ApiInstance } from 'deps';

export const createUserModel = combineReaders(ask<ApiInstance>(), ({ api }) => {
  const [auth$, authHandle] = createHandler();
  const authCheck$ = auth$.pipe(switchMap(() => api.get('user')));

  return {
    authHandle,
    authCheck$
  };
});
