import { Router, Request, Response } from 'express';
import { Server } from 'http';
import { map, mapLeft } from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/pipeable';

import { startSocketIO } from '../../middleware/io';
import { withUserScheme } from '../../model/entities/user';

export const UserRouter = Router();

export const userInit = (server: Server) => {
  return (req: Request, res: Response) => {
    if (!req.user) {
      return res.sendStatus(500);
    }

    pipe(
      withUserScheme.selectOne({ uid: req.user.uid }),
      map(user => {
        startSocketIO(server);
        res.json(user);
      }),
      mapLeft(() => res.sendStatus(500)),
    )();
  };
};
