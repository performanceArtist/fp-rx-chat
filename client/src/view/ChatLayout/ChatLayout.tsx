import React, { useEffect, useRef } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import { array, option, ord } from 'fp-ts';
import { ordNumber } from 'fp-ts/lib/Ord';
import { RequestResult, selector } from '@performance-artist/fp-ts-adt';
import { pick } from '@performance-artist/fp-ts-adt/dist/utils';

import { RequestState } from 'ui/RequestState/RequestState';
import { Message } from 'ui/Message/Message';
import { User } from 'shared/types';
import './ChatLayout.scss';
import { ChatMessageFormContainer } from 'view/ChatMessageForm/ChatMessageFormContainer';

export type MessageType = {
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
  data: RequestResult<ChatData>;
};

export const ChatLayout = pipe(
  ChatMessageFormContainer,
  selector.map(ChatMessageFormContainer => (props: ChatLayoutProps) => {
    const { data } = props;
    const scrollToRef = useRef<HTMLDivElement>(null);
    const scrollTo = () => {
      scrollToRef.current && scrollToRef.current.scrollIntoView();
    };

    useEffect(scrollTo, [data]);

    const renderSuccess = (data: ChatData) => {
      const { user, chatUsers, messages } = data;

      const sortedMessages = pipe(
        messages,
        array.sort(
          ord.contramap((message: MessageType) => message.timestamp)(ordNumber),
        ),
      );

      const getAvatar = (userID: number) =>
        pipe(
          chatUsers,
          array.findFirst(user => user.id === userID),
          option.map(pick('avatar')),
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

      return (
        <div className="chat">
          <h3>Users: {usernames}</h3>
          <div className="chat__messages">
            {renderedMessages}
            <div ref={scrollToRef} />
          </div>
          <div className="chat__input-container">
            <ChatMessageFormContainer />
          </div>
        </div>
      );
    };

    return <RequestState data={data} onSuccess={renderSuccess} />;
  }),
);
