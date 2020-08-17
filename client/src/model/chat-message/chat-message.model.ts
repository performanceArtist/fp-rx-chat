import { selector } from '@performance-artist/fp-ts-adt';
import { pipe } from 'fp-ts/lib/pipeable';
import { identity, flow } from 'fp-ts/lib/function';
import { withLatestFrom, tap } from 'rxjs/operators';
import { option } from 'fp-ts';
import { sequenceT } from 'fp-ts/lib/Apply';

import { chatModelKey } from '../chat/chat.model';
import { messageStoreKey } from 'store/message.store';
import { authModelKey } from 'model/auth/auth.model';
import {
  Input,
  createInput,
  InputEffect,
  createInputEffect,
} from 'shared/utils/rxjs';

type ChatMessageModel = {
  message: Input<string, string>;
  send: InputEffect<void>;
};
export const chatMesageModelKey = selector.key<ChatMessageModel>()(
  'chatMessageModel',
);

export const createChatMessageModel = pipe(
  selector.combine(chatModelKey, messageStoreKey, authModelKey),
  selector.map(
    ([chatModel, messageStore, authModel]) => (): ChatMessageModel => {
      const message = createInput<string>()(identity);

      const send = createInputEffect()(
        flow(
          withLatestFrom(
            chatModel.currentChat.out$,
            message.out$,
            authModel.user$,
          ),
          tap(([_, currentChat, message, user]) =>
            pipe(
              sequenceT(option.option)(
                currentChat,
                pipe(user, option.fromEither),
              ),
              option.map(([currentChat, user]) =>
                messageStore.sendMessage(
                  {
                    text: message,
                    timestamp: Date.now(),
                    chat_id: currentChat.id,
                    user_id: user.id,
                  },
                  currentChat.name,
                ),
              ),
            ),
          ),
        ),
      );

      return { message, send };
    },
  ),
);
