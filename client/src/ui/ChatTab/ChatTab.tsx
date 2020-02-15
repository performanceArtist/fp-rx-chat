import React, { FC } from 'react';
import { Avatar } from '../Avatar/Avatar';

import './ChatTab.scss';

type Props = {
  name: string;
  avatar: string;
  onClick: () => void;
};

const ChatTab: FC<Props> = props => {
  const { name, avatar, onClick } = props;

  return (
    <div className="chat-tab" onClick={onClick}>
      <div className="chat-tab__avatar">
        <Avatar image={avatar} />
      </div>
      <h3>{name}</h3>
    </div>
  );
};

export { ChatTab };
