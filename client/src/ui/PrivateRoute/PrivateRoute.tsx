import React, { ComponentType } from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

type PrivateRouteProps = {
  component: ComponentType<any>;
  isAuthenticated: boolean;
} & RouteProps;

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  component: Component,
  isAuthenticated,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
    }
  />
);
