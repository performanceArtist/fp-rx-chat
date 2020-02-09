import { ask } from 'fp-ts/lib/Reader';
import { filter, map, scan, take } from 'rxjs/operators';

import { message } from 'api/types/socket';
import { withStreams, combineReaders } from 'utils';

import { SocketInstance } from '../../deps';
import { SocketComponent } from './Socket';

const SocketComponentContainer = combineReaders(
  ask<SocketInstance>(),
  ({ socket }) => {
    const message$ = socket.data$.pipe(
      filter(message.is),
      map(({ message }) => message),
      scan((acc: string[], message) => acc.concat(message), []),
      take(5),
    );

    return withStreams(SocketComponent)(() => {
      const initialMessages: string[] = [];

      return {
        defaultProps: {
          messages: initialMessages
        },
        streams: {
          messages: message$,
        },
      };
    });
  },
);

export { SocketComponentContainer };
