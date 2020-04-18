import * as t from 'io-ts';

import { MessageScheme } from 'models/message';

export type SocketMessage = t.TypeOf<typeof MessageScheme>;

export const socketMessage = t.taggedUnion('type', [MessageScheme, MessageScheme]);
