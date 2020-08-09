import { either, reader } from 'fp-ts';

import { combineReaders, withDefaults, useObservable } from 'shared/utils';
import { pending } from 'api/request';
import { UserModel } from 'models/user';

import { App } from './App';

type AppContainerDeps = {
  userModel: UserModel;
};

export const AppContainer = combineReaders(
  reader.ask<AppContainerDeps>(),
  App,
  (deps, App) =>
    withDefaults(App)(() => {
      const { userModel } = deps;
      const user = useObservable(userModel.user$, either.left(pending));

      return { user };
    }),
);
