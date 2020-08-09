import { observableEither, observable } from 'fp-ts-rxjs';
import { sequenceS, sequenceT } from 'fp-ts/lib/Apply';
import { either, reader } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';

import { combineReaders, useObservable, withDefaults } from 'shared/utils';
import { pending, Request } from 'api/request';
import { ChatModel } from 'models/chat';
import { MessageModel, MessageType } from 'models/message';
import { UserModel } from 'models/user';

import { ChatLayout } from './ChatLayout';

type ChatContainerDeps = {
  userModel: UserModel;
  chatModel: ChatModel;
  messageModel: MessageModel;
};

export const ChatLayoutContainer = combineReaders(
  reader.ask<ChatContainerDeps>(),
  deps =>
    withDefaults(ChatLayout)(props => {
      const { userModel, chatModel, messageModel } = deps;
      const {
        chatInfo: { id: chatID },
      } = props;

      const socketMessages$ = pipe(
        messageModel.messages$,
        observable.map(either.right),
      ) as Request<MessageType>;
      const messages$ = pipe(
        sequenceT(observableEither.observableEither)(
          socketMessages$,
          messageModel.getMessagesByChat(chatID),
        ),
        observableEither.map(([socketMessages, storedMessages]) =>
          storedMessages.concat(socketMessages),
        ),
      );

      const chatData$ = sequenceS(observableEither.observableEither)({
        user: userModel.user$,
        chatUsers: chatModel.getUsersByChat(chatID),
        messages: messages$,
      });
      const chatData = useObservable(chatData$, either.left(pending));

      return {
        chatData,
        sendMessage: messageModel.sendMessage,
        joinRoom: chatModel.joinChat,
      };
    }),
);
