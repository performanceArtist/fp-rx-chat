import { chain } from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';

import {
  withUserToChatScheme,
  UserToChat,
  withUserScheme,
} from '../../model/entities';

export const getUsers = (chatID: number) => {
  const getUsers = (userToChat: UserToChat[]) =>
    withUserScheme.select({
      id: userToChat.map(userToChat => userToChat.user_id),
    });

  return pipe(
    withUserToChatScheme.select({ chat_id: chatID }),
    chain(getUsers),
  );
};
