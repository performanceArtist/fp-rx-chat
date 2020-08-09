import * as t from 'io-ts';
import { shareReplay } from 'rxjs/operators';
import { reader } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { observableEither } from 'fp-ts-rxjs';

import { combineReaders, pick } from 'shared/utils';
import { Api } from 'api/api';
import { SocketClient } from 'api/sockets';
import { Request } from 'api/request';

import { User } from './user';

export const ChatScheme = t.type({
  id: t.number,
  name: t.string,
  description: t.string,
  avatar: t.string,
});

const ChatUserScheme = t.type({
  id: t.number,
  username: t.string,
  avatar: t.string,
});

const ChatUsersScheme = t.type({
  chatID: t.number,
  users: t.array(ChatUserScheme),
});

export type Chat = t.TypeOf<typeof ChatScheme>;
export type UsersByChat = t.TypeOf<typeof ChatUsersScheme>;

export type ChatModel = {
  chats$: Request<Chat[]>;
  getUsersByChat: (chatID: number) => Request<User[]>;
  joinChat: (room: string) => void;
};

type CreateChatModel = () => ChatModel;

type ChatModelDeps = {
  api: Api;
  socketClient: SocketClient;
};

export const createChatModel = combineReaders(
  reader.ask<ChatModelDeps>(),
  (deps): CreateChatModel => () => {
    const { api, socketClient } = deps;
    const chats$ = pipe(
      api.get('chat/all', { scheme: t.array(ChatScheme) }),
      shareReplay(1),
    );
    const getUsersByChat = (chatID: number) =>
      pipe(
        api.get('chat/users', { scheme: ChatUsersScheme, query: { chatID } }),
        observableEither.map(pick('users')),
        shareReplay(1),
      );

    return {
      chats$,
      getUsersByChat,
      joinChat: socketClient.join,
    };
  },
);
