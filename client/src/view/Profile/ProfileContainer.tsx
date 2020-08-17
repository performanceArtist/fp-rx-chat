import { either } from 'fp-ts';
import { selector, initial } from '@performance-artist/fp-ts-adt';
import { pipe } from 'fp-ts/lib/pipeable';

import { withProps, useObservable } from 'shared/utils/react';
import { Profile } from './Profile';
import { authModelKey } from 'model/auth/auth.model';

export const ProfileContainer = pipe(
  authModelKey,
  selector.map(authModel =>
    withProps(Profile)(() => {
      const user = useObservable(authModel.user$, either.left(initial));

      return { user };
    }),
  ),
);
