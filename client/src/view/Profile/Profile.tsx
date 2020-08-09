import React, { FC } from 'react';

import { AsyncData } from 'ui/AsyncData/AsyncData';
import { User } from 'shared/types';
import { RequestResult } from 'api/request';

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

  return <AsyncData data={user} onSuccess={renderSuccess} />;
};
