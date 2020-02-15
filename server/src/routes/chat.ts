import { Router } from 'express';
import { map, mapLeft } from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';

import { getUsers, getChats, getMessages } from '../controllers/chat';

export const ChatRouter = Router();

ChatRouter.get('/all', (req, res) => {
  if (!req.user) {
    return res.sendStatus(500);
  }

  const userID = parseInt(req.user.id, 10);

  pipe(
    getChats(userID),
    map(chats => res.json(chats)),
    mapLeft(() => res.sendStatus(500)),
  )();
});

ChatRouter.get('/users', (req, res) => {
  const chatID = parseInt(req.query.chatID, 10);

  if (Number.isNaN(chatID)) {
    return res.status(500).send('No chat id');
  }

  pipe(
    getUsers(chatID),
    map(users =>
      res.json({
        chatID,
        users: users.map(({ id, username, avatar }) => ({
          id,
          username,
          avatar,
        })),
      }),
    ),
    mapLeft(() => res.sendStatus(500)),
  )();
});

ChatRouter.get('/messages', (req, res) => {
  pipe(
    getMessages(req.query),
    map(messages => res.json(messages)),
    mapLeft(() => res.sendStatus(500)),
  )();
});
