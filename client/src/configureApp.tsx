import { createAuthModel } from 'models/auth';
import { createUserModel } from 'models/user';

import { Api } from './api/api';
import { serverURL } from './config';
import { AppContainer } from './AppContainer';

const api = new Api(serverURL, { withCredentials: true });
const authModel = createAuthModel({ api })();
const userModel = createUserModel({ api, authModel })();

export const Root = AppContainer({
  api,
  socketURL: serverURL,
  userModel,
  authModel,
});
