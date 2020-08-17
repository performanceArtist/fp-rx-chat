import { pipe } from 'fp-ts/lib/pipeable';
import { selector } from '@performance-artist/fp-ts-adt';

import { Login } from './Login';
import { authModelKey } from 'model/auth/auth.model';
import { useInputEffect, withProps, useObservable } from 'shared/utils/react';

export const LoginContainer = pipe(
  authModelKey,
  selector.map(authModel =>
    withProps(Login)(() => {
      const username = useObservable(authModel.username.out$, '');
      const password = useObservable(authModel.password.out$, '');
      const onSubmit = useInputEffect(authModel.login);

      return {
        username,
        onUsernameChange: authModel.username.onInput,
        password,
        onPasswordChange: authModel.password.onInput,
        onSubmit,
      };
    }),
  ),
);
