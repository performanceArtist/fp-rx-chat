import React, { useState, memo } from 'react';

import { ChatTab } from 'ui/ChatTab/ChatTab';
import { AsyncData } from 'ui/AsyncData/AsyncData';
import { Request } from 'api/request';
import { Chat } from 'models/chat';
import { combineReaders } from 'utils';

import { ChatContainer } from '../ChatLayout/ChatLayoutContainer';
import './Home.scss';

type Props = {
  chats: Request<Chat[]>;
};

export const Home = combineReaders(ChatContainer, ChatContainer =>
  memo<Props>(props => {
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
            {currentChat && <ChatContainer chatInfo={currentChat} />}
          </div>
        </div>
      );
    };

    return <AsyncData data={chats} onSuccess={renderSuccess} />;
  }),
);
