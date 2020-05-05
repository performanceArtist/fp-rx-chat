import React, { memo } from 'react';

import { combineReaders } from 'shared/utils';
import { LogoutContainer } from 'view/Logout/LogoutContainer';

import './Layout.scss';

export const Layout = combineReaders(LogoutContainer, Logout =>
  memo(props => {
    const { children } = props;

    return (
      <div className="layout">
        <header>
          <Logout />
        </header>
        <h1>KEK POK</h1>
        {children}
      </div>
    );
  }),
);
