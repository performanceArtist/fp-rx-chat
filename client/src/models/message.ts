import { shareReplay } from 'rxjs/operators';
import { ask } from 'fp-ts/lib/Reader';
import * as t from 'io-ts';

import { combineReaders } from 'utils';
import { Api } from 'api/api';
import { RequestStream } from 'api/request';
import { pipe } from 'fp-ts/lib/pipeable';

export const MessageScheme = t.type({
  text: t.string,
  timestamp: t.number,
  user_id: t.number,
  chat_id: t.number,
});

export type MessageType = t.TypeOf<typeof MessageScheme>;
export type SendMessageType = Omit<MessageType, 'id'>;

export type MessageQuery = {
  chatID: number;
  limit?: number;
  offset?: number;
};

type MessageModelDeps = {
  api: Api;
};

export type MessageModel = {
  getMessagesByChat: (chatID: number) => RequestStream<MessageType[]>;
};

type CreateMessageModel = () => MessageModel;

export const createMessageModel = combineReaders(
  ask<MessageModelDeps>(),
  (deps): CreateMessageModel => () => {
    const { api } = deps;
    const getMessagesByChat = (chatID: number) =>
      pipe(
        api.get('chat/messages', {
          scheme: t.array(MessageScheme),
          query: { chatID },
        }),
        shareReplay(1),
      );

    return {
      getMessagesByChat,
    };
  },
);
