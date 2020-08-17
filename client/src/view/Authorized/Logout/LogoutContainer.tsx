import { selector } from '@performance-artist/fp-ts-adt';
import { pipe } from 'fp-ts/lib/pipeable';

import { withProps, useInputEffect } from 'shared/utils/react';
import { authModelKey } from 'model/auth/auth.model';
import { Logout } from './Logout';

export const LogoutContainer = pipe(
  authModelKey,
  selector.map(authModel =>
    withProps(Logout)(() => {
      const onLogout = useInputEffect(authModel.logout);

      return { onLogout };
    }),
  ),
);
