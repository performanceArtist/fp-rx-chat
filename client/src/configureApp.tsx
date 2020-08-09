import { createAuthModel } from 'models/auth';
import { createUserModel } from 'models/user';

import { createApi } from './api/api';
import { serverURL } from './config';
import { AppContainer } from './AppContainer';

const api = createApi({
  baseURL: serverURL,
  defaults: { withCredentials: true },
})();
const authModel = createAuthModel({ api })();
const userModel = createUserModel({ api, authModel })();

export const Root = AppContainer({
  api,
  socketURL: serverURL,
  userModel,
  authModel,
});
