import { ask } from 'fp-ts/lib/Reader';

import { combineReaders, withStreams } from 'utils';
import { pending } from 'api/request';
import { UserModel } from 'models/user';
import { AuthModel } from 'models/auth';

import { App } from './App';

export const AppContainer = combineReaders(
  ask<UserModel>(),
  ask<AuthModel>(),
  App,
  (UserModel, AuthModel, App) => {
    return withStreams(App)(() => {
      return {
        defaultProps: {
          authStatus: 'unknown',
          user: pending(),
          getUser: UserModel.getUser,
        },
        streams: {
          authStatus: AuthModel.authStatus$,
          user: UserModel.user$,
        },
      };
    });
  },
);
