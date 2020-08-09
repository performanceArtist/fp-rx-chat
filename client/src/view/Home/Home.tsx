import React, { useState, memo } from 'react';

import { ChatTab } from 'ui/ChatTab/ChatTab';
import { AsyncData } from 'ui/AsyncData/AsyncData';
import { RequestResult } from 'api/request';
import { combineReaders } from 'shared/utils';
import { Chat } from 'shared/types';

import { ChatLayoutContainer } from '../ChatLayout/ChatLayoutContainer';
import './Home.scss';

type HomeProps = {
  chats: RequestResult<Chat[]>;
};

export const Home = combineReaders(ChatLayoutContainer, ChatLayoutContainer =>
  memo<HomeProps>(props => {
    const { chats } = props;
    const [currentChat, setCurrentChat] = useState<Chat>();

    const renderSuccess = (chats: Chat[]) => {
      return (
        <div className="home">
          <div className="home__navigation">
            {chats.map(chat => (
              <ChatTab
                name={chat.name}
                avatar={chat.avatar}
                onClick={() => setCurrentChat(chat)}
                key={chat.id}
              />
            ))}
          </div>
          <div className="home__content">
            {currentChat && <ChatLayoutContainer chatInfo={currentChat} />}
          </div>
        </div>
      );
    };

    return <AsyncData data={chats} onSuccess={renderSuccess} />;
  }),
);
