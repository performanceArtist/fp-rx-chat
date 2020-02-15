import { ask } from 'fp-ts/lib/Reader';

import { UserModel } from 'models/user';
import { withStreams, combineReaders } from 'utils';

import { Profile } from './Profile';
import { pending } from 'api/request';

const ProfileContainer = combineReaders(ask<UserModel>(), UserModel => {
  return withStreams(Profile)(() => {
    return {
      defaultProps: {
        user: pending()
      },
      streams: {
        user: UserModel.user$
      }
    };
  });
});

export { ProfileContainer };
