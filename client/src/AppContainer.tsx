import { ask } from 'fp-ts/lib/Reader';

import { combineReaders, withDefaults, useObservable } from 'utils';
import { pending } from 'api/request';
import { UserModel } from 'models/user';

import { App } from './App';

type AppContainerDeps = {
  userModel: UserModel;
};

export const AppContainer = combineReaders(
  ask<AppContainerDeps>(),
  App,
  (deps, App) =>
    withDefaults(App)(() => {
      const { userModel } = deps;
      const user = useObservable(userModel.user$, pending);

      return { user };
    }),
);
