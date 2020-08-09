import { isRight } from 'fp-ts/lib/Either';
import { Observable } from 'rxjs';
import { TypeOf } from 'io-ts';

import { createHandler } from 'shared/utils';

import { Socket } from './sockets/core';
import { SocketIOInterface } from './sockets/adapters/io';
import {
  channelToScheme,
  SocketChannel,
  SocketMessage,
  ChannelToScheme,
} from './types/socket';

export type SocketClient = {
  join: (room: string) => void;
  subscribe: <T extends SocketChannel>(
    channel: T,
  ) => Observable<TypeOf<ChannelToScheme[T]>>;
  emit: (what: string, data: any) => void;
};

export const createSocketClient = (url: string) => (): SocketClient => {
  const socket = new Socket<SocketMessage, 'message'>();
  const io = new SocketIOInterface<SocketMessage, 'message'>(url);
  socket.init(io);

  const subscribe = (channel: SocketChannel) => {
    const [data$, handleMessage] = createHandler<SocketMessage>();
    const scheme = channelToScheme[channel];

    socket.subscribe('message', data => {
      const message = scheme.decode(data);

      if (isRight(message)) {
        handleMessage(message.right);
      } else {
        console.log('Unknown message:', message.left);
      }
    });

    return data$;
  };

  const join = (room: string) => {
    io.emit('subscribe', room);
  };

  return {
    subscribe,
    join,
    emit: io.emit,
  };
};
