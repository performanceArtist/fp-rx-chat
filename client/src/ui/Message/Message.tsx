import React, { FC } from 'react';
import { Option } from 'fp-ts/lib/Option';
import { option } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';

import { Avatar } from '../Avatar/Avatar';
import './Message.scss';

type MessageProps = {
  avatar: Option<string>;
  text: string;
  timestamp: number;
  isYours?: boolean;
};

export const Message: FC<MessageProps> = props => {
  const { avatar, text, isYours } = props;

  const imageUrl = pipe(
    avatar,
    option.getOrElse(() => ''),
  );

  if (isYours) {
    return (
      <div className="message message_yours">
        <div className="message__content">{text}</div>
        <div className="message__avatar">
          <Avatar image={imageUrl} />
        </div>
      </div>
    );
  }

  return (
    <div className="message">
      <div className="message__avatar">
        <Avatar image={imageUrl} />
      </div>
      <div className="message__content">{text}</div>
    </div>
  );
};
