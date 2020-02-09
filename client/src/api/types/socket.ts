import * as t from 'io-ts';

export const message = t.type({
  type: t.literal('message'),
  message: t.string,
});

export type SocketMessage = t.TypeOf<typeof message>;

export const socketMessage: t.Tagged<
  'type',
  SocketMessage,
  unknown
> = t.taggedUnion('type', [message, message]);
