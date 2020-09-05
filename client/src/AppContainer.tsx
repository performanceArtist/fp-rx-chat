import { pipe } from 'fp-ts/lib/pipeable';
import { selector } from '@performance-artist/fp-ts-adt';
import { useMemo } from 'react';

import { withProps, resolve, useRequest } from 'shared/utils/react';
import { App } from './App';
import { authModelKey, createAuthModel } from 'model/auth/auth.model';

const Container = pipe(
  selector.combine(authModelKey, App),
  selector.map(([authModel, App]) =>
    withProps(App)(() => {
      const user = useRequest(authModel.user$);

      return { user };
    }),
  ),
);

export const AppContainer = pipe(
  selector.combine(selector.defer(Container, 'authModel'), createAuthModel),
  selector.map(([Container, createAuthModel]) =>
    resolve(Container, () => {
      const authModel = useMemo(() => createAuthModel(), []);

      return { authModel };
    }),
  ),
);
