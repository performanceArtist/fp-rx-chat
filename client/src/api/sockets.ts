import { isRight } from 'fp-ts/lib/Either';
import { scan } from 'rxjs/operators';

import { Socket } from './sockets/core';
import { SocketIOInterface } from './sockets/adapters/io';
import { createHandler } from '../utils';
//import { socketMessage, SocketMessage } from './types/socket';
import { MessageScheme, MessageType } from 'models/message';

type SocketMessage = any;

export function createSocketClient(url: string) {
  const [data$, handleMessage] = createHandler<SocketMessage>();
  const socket = new Socket<SocketMessage, 'message'>();
  const io = new SocketIOInterface<SocketMessage, 'message'>(url);

  socket.init(io);
  socket.subscribe('message', data => {
    const message = MessageScheme.decode(data);

    if (isRight(message)) {
      handleMessage(message.right);
    } else {
      console.log('Unknown message:', message.left);
    }
  });

  const join = (room: string) => {
    io.emit('subscribe', room);
  };

  const emit = io.emit.bind(io);

  const messages$ = data$.pipe(
    scan<MessageType, MessageType[]>((acc, message) => acc.concat(message), []),
  );

  return {
    data$,
    subscribe: socket.subscribe,
    join,
    emit,
    messages$,
  };
}

export type SocketClient = ReturnType<typeof createSocketClient>;
