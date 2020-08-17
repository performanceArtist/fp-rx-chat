import { observableEither, observable } from 'fp-ts-rxjs';
import { sequenceS, sequenceT } from 'fp-ts/lib/Apply';
import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { selector, initial } from '@performance-artist/fp-ts-adt';
import { useEffect } from 'react';

import { useObservable, withProps, useInputEffect } from 'shared/utils/react';
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

      const chatData$ = sequenceS(observableEither.observableEither)({
        user: authModel.user$,
        chatUsers: chatModel.users$,
        messages: messages$,
      });
      const chatData = useObservable(chatData$, either.left(initial));

      return {
        data: chatData,
      };
    }),
  ),
);
