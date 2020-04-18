import { combineReaders, implode } from 'utils';
import { ask } from 'fp-ts/lib/Reader';
import { Authorized } from './Authorized';
import { createMessageModel } from 'models/message';
import { createChatModel } from 'models/chat';
import { Api } from 'api/api';
import { createSocketClient } from 'api/sockets';

type AuthorizedContainerDeps = {
  api: Api;
  socketURL: string;
};

export const AuthorizedContainer = combineReaders(
  ask<AuthorizedContainerDeps>(),
  implode(Authorized, 'chatModel', 'messageModel', 'socketClient'),
  (deps, Authorized) => () => {
    const { api, socketURL } = deps;
    const chatModel = createChatModel({ api })();
    const messageModel = createMessageModel({ api })();
    const socketClient = createSocketClient(socketURL);

    return Authorized({ chatModel, messageModel, socketClient });
  },
);
