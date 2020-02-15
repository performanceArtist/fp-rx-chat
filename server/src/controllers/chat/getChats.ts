import { chain } from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';

import {
  withUserToChatScheme,
  UserToChat,
  withChatScheme,
} from '../../model/entities';

export const getChats = (userID: number) => {
  const getChats = (userToChat: UserToChat[]) =>
    withChatScheme.select({
      id: userToChat.map(userToChat => userToChat.chat_id),
    });

  return pipe(
    withUserToChatScheme.select({ user_id: userID }),
    chain(getChats),
  );
};
