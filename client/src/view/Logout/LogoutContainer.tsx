import { ask } from 'fp-ts/lib/Reader';

import { combineReaders, withDefaults } from 'utils';
import { AuthModel } from 'models/auth';

import { Logout } from './Logout';

type LogoutDeps = {
  authModel: AuthModel;
};

export const LogoutContainer = combineReaders(ask<LogoutDeps>(), deps => {
  const { authModel } = deps;

  return withDefaults(Logout)(() => ({ onLogout: authModel.logout }));
});

