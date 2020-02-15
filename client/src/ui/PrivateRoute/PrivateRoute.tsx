import React, { ComponentType } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

type PrivateRouteProps = {
  component: ComponentType<any>;
} & RouteProps;

export const makePrivateRoute = (hasAuthenticated: boolean, redirect: string) => {
  const PrivateRoute: React.FC<PrivateRouteProps> = ({
    component: Component,
    ...rest
  }) => (
    <Route
      {...rest}
      render={props =>
        hasAuthenticated ? <Component {...props} /> : <Redirect to={redirect} />
      }
    />
  );

  return PrivateRoute;
}
