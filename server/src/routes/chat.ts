import { Router } from 'express';
import { bimap } from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';
import { array } from 'fp-ts';
import { flow } from 'fp-ts/lib/function';

import { pick } from 'utils';
import {
  getUsersByChat,
  getChatsByUser,
  getMessages,
  saveMessage,
} from 'controllers/chat';

export const ChatRouter = Router();

ChatRouter.get('/all', (req, res) => {
  pipe(
    getChatsByUser(req.user!.id),
    bimap(
      () => res.sendStatus(500),
      chats => res.json(chats),
    ),
  )();
});

ChatRouter.get('/users', (req, res) => {
  const chatID = parseInt(req.query.chatID, 10);

  if (Number.isNaN(chatID)) {
    return res.status(500).send('No chat id');
  }

  pipe(
    getUsersByChat(chatID),
    bimap(
      () => res.sendStatus(500),
      flow(array.map(pick('id', 'username', 'avatar')), users =>
        res.json({ chatID, users }),
      ),
    ),
  )();
});

ChatRouter.get('/messages', (req, res) => {
  const chatID = parseInt(req.query.chatID, 10);

  if (Number.isNaN(chatID)) {
    return res.status(500).send('No chat id');
  }

  pipe(
    getMessages(chatID),
    bimap(
      () => res.sendStatus(500),
      messages => res.json(messages),
    ),
  )();
});

ChatRouter.post('/send/:room', (req, res) => {
  const { room } = req.params;
  const { message } = req.body;

  pipe(
    saveMessage(message),
    bimap(
      () => res.sendStatus(500),
      () => {
        req.io.sockets.in(room).emit('message', { room, message });
        res.sendStatus(200);
      },
    ),
  )();
});
