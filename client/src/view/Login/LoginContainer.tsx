import { ask } from 'fp-ts/lib/Reader';
import { switchMap } from 'rxjs/operators';

import { withStreams, combineReaders, createHandler } from 'utils';
import { ApiInstance } from 'deps';
import { pending } from 'api/request';

import { Login, LoginQuery } from './Login';

const LoginContainer = combineReaders(ask<ApiInstance>(), ({ api }) => {
  const [login$, loginHandle] = createHandler<LoginQuery>();
  const loginRequest$ = login$.pipe(
    switchMap(user => api.post('login', user))
  );

  return withStreams(Login)(() => {
    return {
      defaultProps: {
        loginRequest: loginHandle,
        loginResult: pending(),
      },
      streams: {
        loginResult: loginRequest$
      },
    };
  });
});

export { LoginContainer };
