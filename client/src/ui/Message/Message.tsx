import React, { FC } from 'react';

import { Avatar } from '../Avatar/Avatar';
import './Message.scss';

type MessageProps = {
  avatar: string;
  text: string;
  timestamp: number;
  isYours?: boolean;
};

export const Message: FC<MessageProps> = props => {
  const { avatar, text, isYours } = props;

  if (isYours) {
    return (
      <div className="message message_yours">
        <div className="message__content">{text}</div>
        <div className="message__avatar"><Avatar image={avatar} /></div>
      </div>
    );
  }

  return (
    <div className="message">
      <div className="message__avatar">
        <Avatar image={avatar} />
      </div>
      <div className="message__content">{text}</div>
    </div>
  );
};
