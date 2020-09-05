import React from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import { selector, RequestResult } from '@performance-artist/fp-ts-adt';

import { ChatTab } from './ChatTab/ChatTab';
import { withData } from 'shared/utils/react';
import { ChatLayoutContainer } from './ChatLayout/ChatLayoutContainer';
import './Chat.scss';

type Chat = {
  id: number;
  name: string;
  description: string;
  avatar: string;
};

export type ChatProps = {
  chats: RequestResult<Chat[]>;
  onChatTabClick: (chatID: number) => void;
  isChatLayoutShown: boolean;
};

export const Chat = pipe(
  ChatLayoutContainer,
  selector.map(ChatLayoutContainer =>
    withData<ChatProps>()(['chats'], (data, props) => {
      const { chats } = data;
      const { onChatTabClick, isChatLayoutShown } = props;

      return (
        <div className="chat">
          <div className="chat__navigation">
            {chats.map(chat => (
              <ChatTab
                name={chat.name}
                avatar={chat.avatar}
                onClick={() => onChatTabClick(chat.id)}
                key={chat.id}
              />
            ))}
          </div>
          <div className="chat__content">
            {isChatLayoutShown && <ChatLayoutContainer />}
          </div>
        </div>
      );
    }),
  ),
);
