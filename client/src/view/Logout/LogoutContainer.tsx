import { ask } from 'fp-ts/lib/Reader';
import { switchMap } from 'rxjs/operators';

import { withStreams, combineReaders, createHandler } from 'utils';
import { ApiInstance } from 'deps';
import { pending } from 'api/request';

import { Logout } from './Logout';

const LogoutContainer = combineReaders(ask<ApiInstance>(), ({ api }) => {
  const [logout$, logoutHandle] = createHandler();
  const logoutRequest$ = logout$.pipe(
    switchMap(() => api.post('logout'))
  );

  return withStreams(Logout)(() => {
    return {
      defaultProps: {
        onLogout: logoutHandle,
        logoutStatus: pending()
      },
      streams: {
        logoutStatus: logoutRequest$
      },
    };
  });
});

export { LogoutContainer };
