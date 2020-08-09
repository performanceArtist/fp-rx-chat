import { either, reader } from 'fp-ts';

import { UserModel } from 'models/user';
import { combineReaders, withDefaults, useObservable } from 'shared/utils';

import { Profile } from './Profile';
import { pending } from 'api/request';

type ProfileContainerDeps = {
  userModel: UserModel;
};

export const ProfileContainer = combineReaders(
  reader.ask<ProfileContainerDeps>(),
  deps => {
    const { userModel } = deps;

    return withDefaults(Profile)(() => {
      const user = useObservable(userModel.user$, either.left(pending));

      return { user };
    });
  },
);
