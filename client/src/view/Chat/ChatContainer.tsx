import { either, option } from 'fp-ts';
import { selector, initial } from '@performance-artist/fp-ts-adt';
import { pipe } from 'fp-ts/lib/pipeable';
import { observable } from 'fp-ts-rxjs';
import { useMemo } from 'react';

import { chatStoreKey } from 'store/chat.store';
import { useObservable, withProps, resolve } from 'shared/utils/react';
import { Chat } from './Chat';
import { createChatModel, chatModelKey } from 'model/chat/chat.model';

const Container = pipe(
  selector.combine(chatStoreKey, chatModelKey, Chat),
  selector.map(([chatStore, chatModel, Chat]) =>
    withProps(Chat)(() => {
      const chats = useObservable(chatStore.chats$, either.left(initial));
      const isChatLayoutShown = useObservable(
        pipe(chatModel.currentChat.out$, observable.map(option.isSome)),
        false,
      );

      return {
        chats,
        onChatTabClick: chatModel.currentChat.onInput,
        isChatLayoutShown,
      };
    }),
  ),
);

export const ChatContainer = pipe(
  selector.combine(selector.defer(Container, 'chatModel'), createChatModel),
  selector.map(([Container, createChatModel]) =>
    resolve(Container, () => {
      const chatModel = useMemo(() => createChatModel(), []);

      return { chatModel };
    }),
  ),
);
