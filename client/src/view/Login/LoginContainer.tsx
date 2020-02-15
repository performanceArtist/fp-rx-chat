import { ask } from 'fp-ts/lib/Reader';

import { AuthModel } from 'models/auth';
import { withStreams, combineReaders } from 'utils';

import { Login } from './Login';

const LoginContainer = combineReaders(ask<AuthModel>(), AuthModel => {
  return withStreams(Login)(() => {
    return {
      defaultProps: {
        loginRequest: AuthModel.login,
      }
    };
  });
});

export { LoginContainer };
