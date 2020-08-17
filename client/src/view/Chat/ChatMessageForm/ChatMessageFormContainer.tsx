import { pipe } from 'fp-ts/lib/pipeable';
import {
  createChatMessageModel,
  chatMesageModelKey,
} from 'model/chat-message/chat-message.model';
import { selector } from '@performance-artist/fp-ts-adt';
import {
  withProps,
  useObservable,
  useInputEffect,
  resolve,
} from 'shared/utils/react';
import { ChatMessageForm } from './ChatMessageForm';
import { useMemo } from 'react';

const Container = pipe(
  chatMesageModelKey,
  selector.map(chatMessageModel =>
    withProps(ChatMessageForm)(() => {
      const message = useObservable(chatMessageModel.message.out$, '');
      const onSubmit = useInputEffect(chatMessageModel.send);

      return {
        message,
        onMessageChange: chatMessageModel.message.onInput,
        onSubmit,
      };
    }),
  ),
);

export const ChatMessageFormContainer = pipe(
  selector.combine(
    selector.defer(Container, 'chatMessageModel'),
    createChatMessageModel,
  ),
  selector.map(([Container, createChatMessageModel]) =>
    resolve(Container, () => {
      const chatMessageModel = useMemo(() => createChatMessageModel(), []);

      return { chatMessageModel };
    }),
  ),
);
