import { Api } from './api/api';
import { serverURL } from './config';
import { AppContainer } from './AppContainer';

const api = new Api(serverURL, { withCredentials: true });

export const Root = AppContainer({ api });
