import { ask } from 'fp-ts/lib/Reader';

import { withStreams, combineReaders } from 'utils';
import { AuthModel } from 'models/auth';

import { Logout } from './Logout';

const LogoutContainer = combineReaders(ask<AuthModel>(), AuthModel => {
  return withStreams(Logout)(() => {
    return {
      defaultProps: {
        onLogout: AuthModel.logout,
      },
    };
  });
});

export { LogoutContainer };
