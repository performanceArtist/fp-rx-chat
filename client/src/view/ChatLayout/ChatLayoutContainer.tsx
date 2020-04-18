import { ask } from 'fp-ts/lib/Reader';
import { pipe } from 'fp-ts/lib/pipeable';

import { SocketClient } from 'api/sockets';
import { combineReaders, asyncMap, useObservable, withDefaults } from 'utils';
import { pending, combine } from 'api/request';
import { ChatModel } from 'models/chat';
import { MessageModel, SendMessageType } from 'models/message';
import { UserModel } from 'models/user';

import { Chat } from './ChatLayout';

type ChatContainerDeps = {
  userModel: UserModel;
  chatModel: ChatModel;
  messageModel: MessageModel;
  socketClient: SocketClient;
};

const ChatContainer = combineReaders(ask<ChatContainerDeps>(), deps =>
  withDefaults(Chat)(props => {
    const { userModel, chatModel, messageModel, socketClient } = deps;
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
    const socketMessages = useObservable(socketClient.messages$, []);

    return {
      chatData,
      socketMessages,
      sendMessage: (message: SendMessageType, room: string) =>
        socketClient.emit('send', { message, room }),
      joinRoom: socketClient.join,
    };
  }),
);

export { ChatContainer };
