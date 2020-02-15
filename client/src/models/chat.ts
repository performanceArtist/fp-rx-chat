import * as t from 'io-ts';
import { switchMap, shareReplay } from 'rxjs/operators';
import { ask } from 'fp-ts/lib/Reader';
import { combineReaders, createHandler, asyncMap } from 'utils';
import { ApiInstance } from 'deps';

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

export type ChatModel = ReturnType<typeof createChatModel>;
export type Chat = t.TypeOf<typeof ChatScheme>;
export type UsersByChat = t.TypeOf<typeof ChatUsersScheme>;

export const createChatModel = combineReaders(ask<ApiInstance>(), ({ api }) => {
  const [chatsValue$, getChats] = createHandler();
  const chats$ = chatsValue$.pipe(
    switchMap(() =>
      api.get('chat/all', { scheme: t.array(ChatScheme) })
    ),
    shareReplay(1),
  );

  const [usersValue$, getUsers] = createHandler<number>();
  const users$ = usersValue$.pipe(
    switchMap(chatID =>
      api.get('chat/users', { scheme: ChatUsersScheme, query: { chatID } }),
    ),
    asyncMap(data => data.users),
    shareReplay(1),
  );

  return {
    getChats,
    chats$,
    getUsers,
    users$
  };
});

