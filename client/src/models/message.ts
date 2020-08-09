import { scan, startWith } from 'rxjs/operators';
import { reader } from 'fp-ts';
import * as t from 'io-ts';
import { Observable } from 'rxjs';
import { pipe } from 'fp-ts/lib/pipeable';

import { combineReaders } from 'shared/utils';
import { Api } from 'api/api';
import { SocketClient } from 'api/sockets';
import { Request } from 'api/request';

export const MessageScheme = t.type({
  text: t.string,
  timestamp: t.number,
  user_id: t.number,
  chat_id: t.number,
});

export type MessageType = t.TypeOf<typeof MessageScheme>;

export type MessageQuery = {
  chatID: number;
  limit?: number;
  offset?: number;
};

type MessageModelDeps = {
  api: Api;
  socketClient: SocketClient;
};

export type MessageModel = {
  getMessagesByChat: (chatID: number) => Request<MessageType[]>;
  messages$: Observable<MessageType[]>;
  sendMessage: (message: MessageType, room: string) => void;
};

type CreateMessageModel = () => MessageModel;

export const createMessageModel = combineReaders(
  reader.ask<MessageModelDeps>(),
  (deps): CreateMessageModel => () => {
    const { api, socketClient } = deps;

    const messages$ = pipe(
      socketClient.subscribe('message'),
      scan<MessageType, MessageType[]>((acc, cur) => acc.concat(cur), []),
      startWith([]),
    );

    const getMessagesByChat = (chatID: number) =>
      api.get('chat/messages', {
        scheme: t.array(MessageScheme),
        query: { chatID },
      });

    const sendMessage = (message: MessageType, room: string) =>
      socketClient.emit('send', { message, room });

    return {
      getMessagesByChat,
      messages$,
      sendMessage,
    };
  },
);
