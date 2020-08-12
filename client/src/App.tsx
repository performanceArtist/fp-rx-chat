import React, { memo, createElement, useCallback } from 'react';
import { Route, Switch, HashRouter, Redirect } from 'react-router-dom';

import { combineReaders } from 'shared/utils';
import { User } from 'models/user';
import { RequestResult } from 'api/request';
import { Preloader } from 'ui/Preloader/Preloader';
import { LoginContainer } from 'view/Login/LoginContainer';
import { AuthorizedContainer } from 'view/Authorized/AuthorizedContainer';
import { AsyncDataRenderer } from 'ui/AsyncData/AsyncData';

type AppProps = {
  user: RequestResult<User>;
};

export const App = combineReaders(
  LoginContainer,
  AuthorizedContainer,
  (LoginContainer, AuthorizedContainer) =>
    memo<AppProps>(props => {
      const { user } = props;

      const renderPending = useCallback(() => <Preloader />, []);
      const renderError = useCallback(
        () => (
          <HashRouter>
            <Switch>
              <Route path="/login" component={LoginContainer} />
              <Redirect to="/login" />
            </Switch>
          </HashRouter>
        ),
        [],
      );
      const renderSuccess = useCallback(
        () => <HashRouter>{createElement(AuthorizedContainer())}</HashRouter>,
        [],
      );

      return (
        <AsyncDataRenderer
          data={user}
          onInitial={renderPending}
          onPending={renderPending}
          onError={renderError}
          onSuccess={renderSuccess}
        />
      );
    }),
);
