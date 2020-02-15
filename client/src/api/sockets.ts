import { isRight } from 'fp-ts/lib/Either';

import { Socket } from './sockets/core';
import { SocketIOInterface } from './sockets/adapters/io';
import { createHandler } from '../utils';
import { socketMessage, SocketMessage } from './types/socket';

export function createSocketClient(url: string) {
  const [data$, handleMessage] = createHandler<SocketMessage>();
  const socket = new Socket<SocketMessage, 'message'>();
  const io = new SocketIOInterface<SocketMessage, 'message'>(url);

  socket.init(io);
  socket.subscribe('message', data => {
    const message = socketMessage.decode(data);

    if (isRight(message)) {
      handleMessage(message.right);
    } else {
      console.log('Unknown message:', message.left);
    }
  });

  return {
    data$,
  };
}

export type SocketClient = ReturnType<typeof createSocketClient>;
