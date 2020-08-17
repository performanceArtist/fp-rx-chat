import { createApiClient } from './api/api-client';
import { AppContainer } from './AppContainer';
import { createSocketClient } from 'api/socket-client';
import { createUserStore } from 'store/user.store';
import { createMessageStore } from 'store/message.store';
import { createChatStore } from 'store/chat.store';
import io from 'socket.io-client';

const serverURL = 'http://localhost:5000/';

const apiClient = createApiClient.run({
  baseURL: serverURL,
  defaults: { withCredentials: true },
})();

const socket = io(serverURL, { path: '/user/io' });
const socketClient = createSocketClient.run({
  socket: { on: socket.on.bind(socket), emit: socket.emit.bind(socket) },
})();

const userStore = createUserStore.run({ apiClient })();
const messageStore = createMessageStore.run({ apiClient, socketClient })();
const chatStore = createChatStore.run({ apiClient, socketClient })();

export const Root = AppContainer.run({
  userStore,
  messageStore,
  chatStore,
});
