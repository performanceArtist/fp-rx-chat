import React, { useState, useEffect } from 'react';

import { ChatTab } from 'ui/ChatTab/ChatTab';
import { AsyncData } from 'ui/AsyncData/AsyncData';
import { Request } from 'api/request';
import { Chat } from 'models/chat';
import { combineReaders } from 'utils';

import { ChatContainer } from '../Chat/ChatContainer';
import './Home.scss';

type Props = {
  getChats: () => void;
  chats: Request<Chat[]>;
};

const Home = combineReaders(ChatContainer, Chat => {
  return (props: Props) => {
    const { chats, getChats } = props;
    const [currentChat, setCurrentChat] = useState<number>();
    useEffect(() => {
      getChats();
    }, []);

    const renderSuccess = (chats: Chat[]) => {
      return (
        <div className="home">
          <div className="home__navigation">
            {chats.map(({ id, name, avatar }) => (
              <ChatTab
                name={name}
                avatar={avatar}
                onClick={() => setCurrentChat(id)}
                key={id}
              />
            ))}
          </div>
          <div className="home__content">{currentChat && <Chat id={currentChat} />}</div>
        </div>
      );
    };

    return <AsyncData data={chats} onSuccess={renderSuccess} />;
  };
});

export { Home };
