import { ask } from 'fp-ts/lib/Reader';

import { UserModel } from 'models/user';
import { combineReaders, withDefaults, useObservable } from 'utils';
import { pending } from 'api/request';

import { Profile } from './Profile';

type ProfileContainerDeps = {
  userModel: UserModel;
};

const ProfileContainer = combineReaders(ask<ProfileContainerDeps>(), deps => {
  const { userModel } = deps;

  return withDefaults(Profile)(() => {
    const user = useObservable(userModel.user$, pending);

    return { user };
  });
});

export { ProfileContainer };
