import React, { FC, useState, useEffect, useRef } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, option, ord } from 'fp-ts';
import { ordNumber } from 'fp-ts/lib/Ord';

import { Request, isSuccess } from 'api/request';
import { User } from 'models/user';
import { Chat } from 'models/chat';
import { MessageType, SendMessageType } from 'models/message';
import { AsyncData } from 'ui/AsyncData/AsyncData';
import { Message } from 'ui/Message/Message';
import { pick } from 'utils';

import './ChatLayout.scss';

type ChatData = {
  user: User;
  chatUsers: User[];
  messages: MessageType[];
};

type Props = {
  chatInfo: Chat;
  chatData: Request<ChatData>;
  socketMessages: MessageType[];
  sendMessage: (message: SendMessageType, room: string) => void;
  joinRoom: (room: string) => void;
};

const Chat: FC<Props> = props => {
  const { chatInfo, chatData, socketMessages, sendMessage, joinRoom } = props;
  const [message, setMessage] = useState<string>('');
  const scrollToRef = useRef<HTMLDivElement>(null);
  const scrollTo = () => {
    scrollToRef.current &&
      scrollToRef.current.scrollIntoView();
  };

  useEffect(() => {
    if (isSuccess(chatData)) {
      joinRoom(chatInfo.name);
      scrollTo();
    }
  }, [chatData]);

  useEffect(scrollTo, [socketMessages]);

  const renderSuccess = (data: ChatData) => {
    const { user, chatUsers, messages } = data;

    const getAvatar = (userID: number) =>
      pipe(
        chatUsers,
        array.findFirst(user => user.id === userID),
        option.fold(() => '', pick('avatar')),
      );
    const sortedMessages = pipe(
      messages.concat(socketMessages),
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

    const handleSubmit = (event: React.FormEvent) => {
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
      setMessage('');
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
              onChange={event => setMessage(event.target.value)}
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

export { Chat };