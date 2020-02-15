import { createAuthModel } from 'models/auth';
import { createUserModel } from 'models/user';

import { Api } from './api/api';
import { serverURL } from './config';
import { AppContainer } from './AppContainer';
import { createChatModel } from 'models/chat';
import { createMessageModel } from 'models/message';

const api = new Api(serverURL, { withCredentials: true });
const userModel = createUserModel({ api });
const authModel = createAuthModel({ api });
const chatModel = createChatModel({ api });
const messageModel = createMessageModel({ api });

export const Root = AppContainer({
  ...userModel,
  ...authModel,
  ...chatModel,
  ...messageModel,
});
