import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { selector, initial } from '@performance-artist/fp-ts-adt';
import { useMemo } from 'react';

import { withProps, useObservable, resolve } from 'shared/utils/react';
import { App } from './App';
import { authModelKey, createAuthModel } from 'model/auth/auth.model';

const Container = pipe(
  selector.combine(authModelKey, App),
  selector.map(([authModel, App]) =>
    withProps(App)(() => {
      const user = useObservable(authModel.user$, either.left(initial));

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
