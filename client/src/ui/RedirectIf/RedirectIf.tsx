import React, { FC, ComponentType } from 'react';
import { Redirect, Route } from 'react-router';

export type RedirectIfProps = {
  redirect: string;
  to: string;
  shouldRedirect: boolean;
  component: ComponentType<any>;
};

export const RedirectIf: FC<RedirectIfProps> = props => {
  const { redirect, to, shouldRedirect, component } = props;

  return (
    <>
      <Route component={component} path={to} />
      {shouldRedirect && <Redirect to={redirect} />}
    </>
  );
};
