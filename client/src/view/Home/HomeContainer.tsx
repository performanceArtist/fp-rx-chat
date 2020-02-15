import { ask } from 'fp-ts/lib/Reader';

import { withStreams, combineReaders } from 'utils';
import { pending } from 'api/request';

import { Home } from './Home';
import { ChatModel } from 'models/chat';

const HomeContainer = combineReaders(
  ask<ChatModel>(),
  Home,
  (ChatModel, Home) => {
    return withStreams(Home)(() => {
      return {
        defaultProps: {
          chats: pending(),
          getChats: ChatModel.getChats
        },
        streams: {
          chats: ChatModel.chats$
        },
      };
    });
  },
);

export { HomeContainer };
