import { ask } from 'fp-ts/lib/Reader';

import { combineReaders, implode } from 'utils';
import { createMessageModel } from 'models/message';
import { createChatModel } from 'models/chat';
import { Api } from 'api/api';
import { createSocketClient } from 'api/sockets';

import { Authorized } from './Authorized';

type AuthorizedContainerDeps = {
  api: Api;
  socketURL: string;
};

export const AuthorizedContainer = combineReaders(
  ask<AuthorizedContainerDeps>(),
  implode(Authorized, 'chatModel', 'messageModel'),
  (deps, Authorized) => () => {
    const { api, socketURL } = deps;
    const socketClient = createSocketClient(socketURL);
    const chatModel = createChatModel({ api, socketClient })();
    const messageModel = createMessageModel({ api, socketClient })();

    return Authorized({ chatModel, messageModel });
  },
);
