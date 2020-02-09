import { Api } from '../api/api';
import { SocketClient } from '../api/sockets';

export type I18n = {
  lan: 'en' | 'ru';
};

export type User = {
  username: string;
};

export type ApiInstance = {
  api: Api;
};

export type SocketInstance = {
  socket: SocketClient;
};
