import { ask } from 'fp-ts/lib/Reader';

import { withStreams, combineReaders } from 'utils';
import { pending } from 'api/request';
import { ChatModel } from 'models/chat';
import { MessageModel } from 'models/message';
import { UserModel } from 'models/user';

import { Chat } from './Chat';

const ChatContainer = combineReaders(
  ask<UserModel>(),
  ask<ChatModel>(),
  ask<MessageModel>(),
  (UserModel, ChatModel, MessageModel) => {
    return withStreams(Chat)(() => {
      return {
        defaultProps: {
          getUsers: ChatModel.getUsers,
          users: pending(),
          getMessages: MessageModel.getMessages,
          messages: pending(),
        },
        streams: {
          user: UserModel.user$,
          users: ChatModel.users$,
          messages: MessageModel.messages$,
        },
      };
    });
  },
);

export { ChatContainer };
