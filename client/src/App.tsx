import React, { useEffect, memo } from 'react';
import { Route, Switch, HashRouter, Redirect } from 'react-router-dom';

import { combineReaders } from 'utils';
import { User } from 'models/user';
import { AuthStatus } from 'models/auth';
import { Request, isPending, isSuccess } from 'api/request';
import { makePrivateRoute } from 'ui/PrivateRoute/PrivateRoute';
import { Preloader } from 'ui/Preloader/Preloader';

import { Layout } from './view/Layout/Layout';
import { LoginContainer } from './view/Login/LoginContainer';
import { HomeContainer } from './view/Home/HomeContainer';
import { ProfileContainer } from './view/Profile/ProfileContainer';

type Props = {
  authStatus: AuthStatus;
  getUser: () => void;
  user: Request<User>;
};

const App = combineReaders(
  LoginContainer,
  Layout,
  HomeContainer,
  ProfileContainer,
  (Login, Layout, Home, Profile) => {
    return memo((props: Props) => {
      const { getUser, user, authStatus } = props;

      useEffect(() => {
        getUser();
      }, [authStatus]);

      if (isPending(user)) {
        return <Preloader />;
      }

      const hasAuthenticated = isSuccess(user);
      const PrivateRoute = makePrivateRoute(hasAuthenticated, '/login');
      const routes = (
        <Switch>
          <PrivateRoute
            exact
            path="/"
            component={() => (
              <Layout>
                <Home />
              </Layout>
            )}
          />
          <PrivateRoute
            path="/profile"
            component={Profile}
          />
          {hasAuthenticated && <Redirect to="/" />}
          <Route path="/login" component={Login} />
          <Route path="*" component={() => <h2>404</h2>} />
        </Switch>
      );

      return <HashRouter>{routes}</HashRouter>;
    });
  },
);

export { App };
