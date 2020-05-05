import { ask } from 'fp-ts/lib/Reader';

import { AuthModel } from 'models/auth';
import { combineReaders, withDefaults } from 'shared/utils';

import { Login } from './Login';

type LoginContainerDeps = {
  authModel: AuthModel;
};

export const LoginContainer = combineReaders(ask<LoginContainerDeps>(), deps => {
  const { authModel } = deps;

  return withDefaults(Login)(() => ({ loginRequest: authModel.login }));
});
