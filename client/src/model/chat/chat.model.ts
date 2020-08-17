import { pipe } from 'fp-ts/lib/pipeable';
import { selector } from '@performance-artist/fp-ts-adt';
import { Option } from 'fp-ts/lib/Option';
import { option, array, either } from 'fp-ts';
import { flow } from 'fp-ts/lib/function';
import { withLatestFrom, tap, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { observable, observableEither } from 'fp-ts-rxjs';

import {
  createInput,
  Input,
  InputEffect,
  createInputEffect,
} from 'shared/utils/rxjs';
import { chatStoreKey } from 'store/chat.store';
import { messageStoreKey } from 'store/message.store';
import { MessageType } from 'api/socket-client';
import { Request } from 'api/api-client';
import { User } from 'shared/types';

type Chat = {
  id: number;
  name: string;
  description: string;
  avatar: string;
};

type ChatModel = {
  currentChat: Input<number, Option<Chat>>;
  messages$: Observable<MessageType[]>;
  storedMessages$: Request<MessageType[]>;
  users$: Request<User[]>;
  join: InputEffect<void>;
};
export const chatModelKey = selector.key<ChatModel>()('chatModel');

export const createChatModel = pipe(
  selector.combine(chatStoreKey, messageStoreKey),
  selector.map(([chatStore, messageStore]) => (): ChatModel => {
    const currentChat = createInput<number>()(
      flow(
        withLatestFrom(chatStore.chats$),
        observable.map(([chatId, chats]) =>
          pipe(
            chats,
            option.fromEither,
            option.chain(array.findFirst(chat => chat.id === chatId)),
          ),
        ),
        shareReplay(1),
      ),
    );

    const messages$ = pipe(
      messageStore.messages$,
      withLatestFrom(currentChat.out$),
      observable.map(([messages, currentChat]) =>
        pipe(
          currentChat,
          option.map(currentChat =>
            pipe(
              messages,
              array.filter(message => message.chat_id === currentChat.id),
            ),
          ),
          option.getOrElse(() => [] as MessageType[]),
        ),
      ),
    );

    const storedMessages$ = pipe(
      currentChat.out$,
      observable.map(either.fromOption(() => new Error('No chat selected'))),
      observableEither.chain(currentChat =>
        messageStore.getMessagesByChat(currentChat.id),
      ),
    );

    const users$ = pipe(
      currentChat.out$,
      observable.map(either.fromOption(() => new Error('No chat selected'))),
      observableEither.chain(currentChat =>
        chatStore.getUsersByChat(currentChat.id),
      ),
    );

    const join = createInputEffect()(
      flow(
        withLatestFrom(currentChat.out$),
        tap(([_, currentChat]) =>
          pipe(
            currentChat,
            option.map(currentChat => chatStore.joinChat(currentChat.name)),
          ),
        ),
      ),
    );

    return { currentChat, messages$, storedMessages$, users$, join };
  }),
);
