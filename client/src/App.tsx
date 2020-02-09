import React, { useEffect, useState } from 'react';
import { Route, Switch, HashRouter, Redirect } from 'react-router-dom';

import { Request, isPending, isSuccess } from 'api/request';

import { PrivateRoute } from 'ui/PrivateRoute/PrivateRoute';
import { Preloader } from 'ui/Preloader/Preloader';
import { LoginContainer } from './view/Login/LoginContainer';
import { LogoutContainer } from './view/Logout/LogoutContainer';
import { combineReaders } from 'utils';

type User = any;

type Props = {
  checkAuth: () => void;
  userData: Request<User>;
};

type LoginStatus = 'unknown' | 'login' | 'logout';

const App = combineReaders(LoginContainer, LogoutContainer, (Login, Logout) => {
  return (props: Props) => {
    const { checkAuth, userData } = props;
    const [loginStatusChanged, setLoginStatusChanged] = useState<LoginStatus>(
      'unknown',
    );

    useEffect(() => {
      checkAuth();
    }, [loginStatusChanged]);

    if (isPending(userData)) {
      return <Preloader />;
    }

    const routes = (
      <Switch>
        <PrivateRoute
          exact
          isAuthenticated={isSuccess(userData)}
          path="/"
          component={() => (
            <div>
              <h2>Profile</h2>
              <Logout onLogoutSuccess={() => setLoginStatusChanged('logout')} />
            </div>
          )}
        />
        <PrivateRoute
          isAuthenticated={isSuccess(userData)}
          path="/chat"
          component={() => <h2>Chat</h2>}
        />
        {isSuccess(userData) && <Redirect to="/" />}
        <Route
          path="/login"
          component={() => (
            <Login
              onLoginSuccess={() => {
                setLoginStatusChanged('login');
              }}
            />
          )}
        />
        <Route path="*" component={() => <h2>404</h2>} />
      </Switch>
    );

    return <HashRouter>{routes}</HashRouter>;
  };
});

export { App };
