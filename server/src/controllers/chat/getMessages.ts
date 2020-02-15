import * as t from 'io-ts';

import {
  withMessageScheme
} from '../../model/entities';

const required = t.type({
  chatID: t.number
});

const optional = t.partial({
  offset: t.number,
  limit: t.number
});

export const MessageQueryScheme = t.intersection([required, optional]);

export type MessageQuery = t.TypeOf<typeof MessageQueryScheme>;

export const getMessages = (query: MessageQuery) => {
  const { chatID } = query;

  return withMessageScheme.select({ chat_id: parseInt(chatID, 10) });
};
