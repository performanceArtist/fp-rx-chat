import React, { FC } from 'react';

import { combineReaders } from 'utils';
import { LogoutContainer } from 'view/Logout/LogoutContainer';

import './Layout.scss';

type Props = {};

const Layout = combineReaders(LogoutContainer, Logout => {
  const Component: FC<Props> = props => {
    const { children } = props;

    return (
      <div className="layout">
        <header>
          <Logout />
        </header>
        <h1>OK BOOMER</h1>
        {children}
      </div>
    );
  };

  return Component;
});

export { Layout };
