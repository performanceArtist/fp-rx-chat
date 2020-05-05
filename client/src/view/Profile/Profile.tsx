import React, { FC } from 'react';

import { User } from 'models/user';
import { Request } from 'api/request';
import { AsyncData } from 'ui/AsyncData/AsyncData';

type ProfileProps = {
  user: Request<User>;
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
