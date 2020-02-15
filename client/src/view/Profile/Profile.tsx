import React, { FC } from 'react';

import { User } from 'models/user';
import { Request } from 'api/request';
import { AsyncData } from 'ui/AsyncData/AsyncData';

type Props = {
  user: Request<User>
};

const Profile: FC<Props> = props => {
  const { user } = props;

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

  return <AsyncData data={user} onSuccess={renderSuccess} />;
}

export { Profile };
