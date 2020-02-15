import { switchMap, shareReplay } from 'rxjs/operators';
import { ask } from 'fp-ts/lib/Reader';
import * as t from 'io-ts';

import { combineReaders, createHandler } from 'utils';
import { ApiInstance } from 'deps';

const MessageScheme = t.type({
  id: t.number,
  text: t.string,
  timestamp: t.number,
  user_id: t.number,
  chat_id: t.number,
});

export type MessageType = t.TypeOf<typeof MessageScheme>;

export type MessageQuery = {
  chatID: number;
  limit?: number;
  offset?: number;
}

export const createMessageModel = combineReaders(
  ask<ApiInstance>(),
  ({ api }) => {
    const [messagesValue$, getMessages] = createHandler<MessageQuery>();
    const messages$ = messagesValue$.pipe(
      switchMap(query =>
        api.get('chat/messages', { scheme: t.array(MessageScheme), query }),
      ),
      shareReplay(1),
    );

    return {
      getMessages,
      messages$,
    };
  },
);

export type MessageModel = ReturnType<typeof createMessageModel>;
