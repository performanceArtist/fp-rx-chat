import { reader } from 'fp-ts';

import { combineReaders, withDefaults } from 'shared/utils';
import { AuthModel } from 'models/auth';

import { Logout } from './Logout';

type LogoutDeps = {
  authModel: AuthModel;
};

export const LogoutContainer = combineReaders(
  reader.ask<LogoutDeps>(),
  deps => {
    const { authModel } = deps;

    return withDefaults(Logout)(() => ({ onLogout: authModel.logout }));
  },
);
