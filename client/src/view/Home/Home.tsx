import React, { memo } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import { selector, RequestResult } from '@performance-artist/fp-ts-adt';

import { ChatTab } from 'ui/ChatTab/ChatTab';
import { RequestState } from 'ui/RequestState/RequestState';
import { ChatLayoutContainer } from '../ChatLayout/ChatLayoutContainer';
import './Home.scss';

type Chat = {
  id: number;
  name: string;
  description: string;
  avatar: string;
};

export type HomeProps = {
  chats: RequestResult<Chat[]>;
  onChatTabClick: (chatID: number) => void;
  isChatLayoutShown: boolean;
};

export const Home = pipe(
  ChatLayoutContainer,
  selector.map(ChatLayoutContainer =>
    memo<HomeProps>(props => {
      const { chats, onChatTabClick, isChatLayoutShown } = props;

      const renderSuccess = (chats: Chat[]) => (
        <div className="home">
          <div className="home__navigation">
            {chats.map(chat => (
              <ChatTab
                name={chat.name}
                avatar={chat.avatar}
                onClick={() => onChatTabClick(chat.id)}
                key={chat.id}
              />
            ))}
          </div>
          <div className="home__content">
            {isChatLayoutShown && <ChatLayoutContainer />}
          </div>
        </div>
      );

      return <RequestState data={chats} onSuccess={renderSuccess} />;
    }),
  ),
);
