import { ask } from 'fp-ts/lib/Reader';
import { pipe } from 'fp-ts/lib/pipeable';

import { combineReaders, useObservable, withDefaults } from 'shared/utils';
import { pending, combine, asyncMap } from 'api/request';
import { ChatModel } from 'models/chat';
import { MessageModel } from 'models/message';
import { UserModel } from 'models/user';

import { ChatLayout } from './ChatLayout';

type ChatContainerDeps = {
  userModel: UserModel;
  chatModel: ChatModel;
  messageModel: MessageModel;
};

export const ChatLayoutContainer = combineReaders(ask<ChatContainerDeps>(), deps =>
  withDefaults(ChatLayout)(props => {
    const { userModel, chatModel, messageModel } = deps;
    const {
      chatInfo: { id: chatID },
    } = props;

    const chatData$ = pipe(
      combine(
        userModel.user$,
        chatModel.getUsersByChat(chatID),
        messageModel.getMessagesByChat(chatID),
      ),
      asyncMap(([user, chatUsers, messages]) => ({
        user,
        chatUsers,
        messages,
      })),
    );
    const chatData = useObservable(chatData$, pending);

    return {
      chatData,
      sendMessage: messageModel.sendMessage,
      joinRoom: chatModel.joinChat,
    };
  }),
);
