import React, { memo } from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import { selector } from '@performance-artist/fp-ts-adt';

import { LogoutContainer } from 'view/Logout/LogoutContainer';
import './Layout.scss';

export const Layout = pipe(
  LogoutContainer,
  selector.map(LogoutContainer =>
    memo(props => {
      const { children } = props;

      return (
        <div className="layout">
          <header>
            <LogoutContainer />
          </header>
          <h1>KEK POK</h1>
          {children}
        </div>
      );
    }),
  ),
);
