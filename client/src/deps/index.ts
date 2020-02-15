import { Api } from '../api/api';
import { SocketClient } from '../api/sockets';

export type ApiInstance = {
  api: Api;
};

export type SocketInstance = {
  socket: SocketClient;
};
