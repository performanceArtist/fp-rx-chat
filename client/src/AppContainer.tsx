import { ask } from 'fp-ts/lib/Reader';

import { combineReaders, withStreams } from 'utils';
import { ApiInstance } from 'deps';
import { pending } from 'api/request';
import { createUserModel } from 'models/user';

import { App } from './App';

export const AppContainer = combineReaders(
  ask<ApiInstance>(),
  App,
  ({ api }, App) => {
    return withStreams(App)(() => {
      const { authHandle, authCheck$ } = createUserModel({ api });

      return {
        defaultProps: {
          userData: pending(),
          checkAuth: authHandle
        },
        streams: {
          userData: authCheck$,
        },
      };
    });
  },
);
