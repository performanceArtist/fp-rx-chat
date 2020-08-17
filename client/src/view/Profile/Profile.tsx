import React, { FC } from 'react';
import { RequestResult } from '@performance-artist/fp-ts-adt';

import { RequestState } from 'shared/ui/RequestState/RequestState';
import { User } from 'shared/types';

type ProfileProps = {
  user: RequestResult<User>;
};

const renderSuccess = (user: User) => {
  const { username, avatar } = user;

  return (
    <div className="profile">
      <h2>Profile</h2>
      <div>Username: {username}</div>
      <img src={avatar} />
    </div>
  );
};

export const Profile: FC<ProfileProps> = props => {
  const { user } = props;

  return <RequestState data={user} onSuccess={renderSuccess} />;
};
