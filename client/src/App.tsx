import React, { memo, useMemo, createElement } from 'react';
import { Route, Switch, HashRouter, Redirect } from 'react-router-dom';

import { combineReaders } from 'utils';
import { User } from 'models/user';
import { Request, isPending, isSuccess } from 'api/request';
import { Preloader } from 'ui/Preloader/Preloader';
import { LoginContainer } from 'view/Login/LoginContainer';
import { AuthorizedContainer } from 'view/Authorized/AuthorizedContainer';

type Props = {
  user: Request<User>;
};

const App = combineReaders(
  LoginContainer,
  AuthorizedContainer,
  (LoginContainer, AuthorizedContainer) =>
    memo<Props>(props => {
      const { user } = props;

      if (isPending(user)) {
        return <Preloader />;
      }

      const isAuthenticated = isSuccess(user);
      const routes = useMemo(
        () =>
          isAuthenticated ? (
            createElement(AuthorizedContainer())
          ) : (
            <Switch>
              <Route path="/login" component={LoginContainer} />
              <Redirect to="/login" />
            </Switch>
          ),
        [isAuthenticated],
      );

      return <HashRouter>{routes}</HashRouter>;
    }),
);

export { App };
