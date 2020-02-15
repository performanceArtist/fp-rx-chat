import React, { FC, useEffect, useState } from 'react';
import { flow } from 'fp-ts/lib/function';

import { Request, isSuccess } from 'api/request';
import { User } from 'models/user';
import { MessageType, MessageQuery } from 'models/message';
import { AsyncData } from 'ui/AsyncData/AsyncData';
import { Message } from 'ui/Message/Message';

import './Chat.scss';

type Props = {
  id: number;
  user: Request<User>;
  getUsers: (id: number) => void;
  users: Request<User[]>;
  getMessages: (query: MessageQuery) => void;
  messages: Request<MessageType[]>;
};

const Chat: FC<Props> = props => {
  const { id, user, getUsers, users, getMessages, messages } = props;
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    getUsers(id);
  }, []);

  useEffect(() => {
    isSuccess(users) && getMessages({ chatID: id });
  }, [users]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    console.log('submit', message);
  }

  const renderSuccess = (users: User[]) => {
    const renderMessages = (messages: MessageType[]) => {
      const getUser = (userID: number) =>
        users.find(user => user.id === userID);
      const pickAvatar = (user: User | undefined) => (user ? user.avatar : '');
      const getAvatar = flow(getUser, pickAvatar);
      const checkYours = isSuccess(user)
        ? (userID: number) => user.data.id === userID
        : () => false;

      return (
        <>
          {messages.map(({ id, text, timestamp, user_id }) => (
            <Message
              key={id}
              text={text}
              timestamp={timestamp}
              avatar={getAvatar(user_id)}
              isYours={checkYours(user_id)}
            />
          ))}
        </>
      );
    };

    const chatUsers = users.map(({ username }) => username);
    return (
      <div className="chat">
        <h3>Users: {chatUsers.join(', ')}</h3>
        <div className="chat__messages">
          <AsyncData data={messages} onSuccess={renderMessages} />
        </div>
        <div className="chat__input-container">
          <form onSubmit={handleSubmit}>
            <input
              className="chat__input"
              value={message}
              onChange={event => setMessage(event.target.value)}
              type="text"
              placeholder="Your message"
            />
          </form>
        </div>
      </div>
    );
  };
  return <AsyncData data={users} onSuccess={renderSuccess} />;
};

export { Chat };
