import React, { FC, useEffect, useRef, FormEvent } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, option, ord } from 'fp-ts';
import { ordNumber } from 'fp-ts/lib/Ord';

import { Request, isSuccess } from 'api/request';
import { AsyncData } from 'ui/AsyncData/AsyncData';
import { Message } from 'ui/Message/Message';
import { pick, useField } from 'shared/utils';
import { User, Chat } from 'shared/types';

import './ChatLayout.scss';

type MessageType = {
  text: string;
  timestamp: number;
  user_id: number;
  chat_id: number;
};

type ChatData = {
  user: User;
  chatUsers: User[];
  messages: MessageType[];
};

type ChatLayoutProps = {
  chatInfo: Chat;
  chatData: Request<ChatData>;
  sendMessage: (message: MessageType, room: string) => void;
  joinRoom: (room: string) => void;
};

export const ChatLayout: FC<ChatLayoutProps> = props => {
  const { chatInfo, chatData, sendMessage, joinRoom } = props;
  const [message, onMessage] = useField('');
  const scrollToRef = useRef<HTMLDivElement>(null);
  const scrollTo = () => {
    scrollToRef.current && scrollToRef.current.scrollIntoView();
  };

  useEffect(() => {
    if (isSuccess(chatData)) {
      joinRoom(chatInfo.name);
    }
  }, [chatData]);

  useEffect(scrollTo, [chatData]);

  const renderSuccess = (data: ChatData) => {
    const { user, chatUsers, messages } = data;

    const getAvatar = (userID: number) =>
      pipe(
        chatUsers,
        array.findFirst(user => user.id === userID),
        option.fold(() => '', pick('avatar')),
      );
    const sortedMessages = pipe(
      messages,
      array.sort(
        ord.contramap((message: MessageType) => message.timestamp)(ordNumber),
      ),
    );
    const renderedMessages = sortedMessages.map(
      ({ text, timestamp, user_id }) => (
        <Message
          key={`${user_id} ${timestamp}`}
          text={text}
          timestamp={timestamp}
          avatar={getAvatar(user_id)}
          isYours={user.id === user_id}
        />
      ),
    );
    const usernames = chatUsers.map(pick('username')).join(', ');

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();

      sendMessage(
        {
          text: message,
          timestamp: new Date().getTime(),
          chat_id: chatInfo.id,
          user_id: user.id,
        },
        chatInfo.name,
      );
      onMessage.set('');
    };

    return (
      <div className="chat">
        <h3>Users: {usernames}</h3>
        <div className="chat__messages">
          {renderedMessages}
          <div ref={scrollToRef} />
        </div>
        <div className="chat__input-container">
          <form onSubmit={handleSubmit}>
            <input
              className="chat__input"
              value={message}
              onChange={onMessage.change}
              type="text"
              placeholder="Your message"
            />
          </form>
        </div>
      </div>
    );
  };

  return <AsyncData data={chatData} onSuccess={renderSuccess} />;
};
