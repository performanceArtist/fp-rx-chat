import { reader } from 'fp-ts';

import { AuthModel } from 'models/auth';
import { combineReaders, withDefaults } from 'shared/utils';

import { Login } from './Login';

type LoginContainerDeps = {
  authModel: AuthModel;
};

export const LoginContainer = combineReaders(
  reader.ask<LoginContainerDeps>(),
  deps => {
    const { authModel } = deps;

    return withDefaults(Login)(() => ({ loginRequest: authModel.login }));
  },
);
