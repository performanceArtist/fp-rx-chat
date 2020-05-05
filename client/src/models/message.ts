import { shareReplay, map, startWith, scan } from 'rxjs/operators';
import { ask } from 'fp-ts/lib/Reader';
import * as t from 'io-ts';

import { combineReaders } from 'shared/utils';
import { Api } from 'api/api';
import { RequestStream, success, combine, asyncMap } from 'api/request';
import { pipe } from 'fp-ts/lib/pipeable';
import { SocketClient } from 'api/sockets';

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
  getMessagesByChat: (chatID: number) => RequestStream<MessageType[]>;
  sendMessage: (message: MessageType, room: string) => void;
};

type CreateMessageModel = () => MessageModel;

export const createMessageModel = combineReaders(
  ask<MessageModelDeps>(),
  (deps): CreateMessageModel => () => {
    const { api, socketClient } = deps;
    const message$ = socketClient.subscribe('message');
    const messages$ = pipe(
      message$,
      scan<MessageType, MessageType[]>((acc, cur) => acc.concat(cur), []),
    );
    const socketMessages$ = pipe(
      messages$,
      map(success),
      startWith(success([])),
    );

    const getStoredMessages = (chatID: number) =>
      api.get('chat/messages', {
        scheme: t.array(MessageScheme),
        query: { chatID },
      });

    const getMessagesByChat = (chatID: number) =>
      pipe(
        combine(getStoredMessages(chatID), socketMessages$),
        asyncMap(([messages, socketMessages]) =>
          messages.concat(socketMessages),
        ),
        shareReplay(1),
      );
    const sendMessage = (message: MessageType, room: string) =>
      socketClient.emit('send', { message, room });

    return {
      getMessagesByChat,
      sendMessage,
    };
  },
);
