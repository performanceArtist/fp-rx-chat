import { observableEither, observable } from 'fp-ts-rxjs';
import { sequenceT } from 'fp-ts/lib/Apply';
import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { selector } from '@performance-artist/fp-ts-adt';
import { useEffect } from 'react';

import { withProps, useInputEffect, useRequest } from 'shared/utils/react';
import { MessageType } from 'api/socket-client';
import { Request } from 'api/api-client';
import { ChatLayout } from './ChatLayout';
import { authModelKey } from 'model/auth/auth.model';
import { chatModelKey } from 'model/chat/chat.model';

export const ChatLayoutContainer = pipe(
  selector.combine(authModelKey, chatModelKey, ChatLayout),
  selector.map(([authModel, chatModel, ChatLayout]) =>
    withProps(ChatLayout)(() => {
      const join = useInputEffect(chatModel.join);
      useEffect(() => join(), []);

      const socketMessages$ = pipe(
        chatModel.messages$,
        observable.map(either.right),
      ) as Request<MessageType[]>;

      const messages$ = pipe(
        sequenceT(observableEither.observableEither)(
          socketMessages$,
          chatModel.storedMessages$,
        ),
        observableEither.map(([socketMessages, storedMessages]) =>
          storedMessages.concat(socketMessages),
        ),
      );

      const user = useRequest(authModel.user$);
      const chatUsers = useRequest(chatModel.users$);
      const messages = useRequest(messages$);

      return {
        user,
        chatUsers,
        messages,
      };
    }),
  ),
);
