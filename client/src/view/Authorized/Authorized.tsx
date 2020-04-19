import React, { memo } from 'react';
import { Switch, Route, Redirect } from 'react-router';

import { combineReaders } from 'utils';
import { HomeContainer } from 'view/Home/HomeContainer';
import { ProfileContainer } from 'view/Profile/ProfileContainer';
import { Layout } from 'view/Layout/Layout';

const pages = combineReaders(
  HomeContainer,
  ProfileContainer,
  (...pages) => pages,
);

export const Authorized = combineReaders(
  Layout,
  pages,
  (Layout, [HomeContainer, ProfileContainer]) =>
    memo(() => {
      return (
        <Layout>
          <Switch>
            <Route exact path="/" component={HomeContainer} />
            <Route path="/profile" component={ProfileContainer} />
            <Redirect to="/" />
          </Switch>
        </Layout>
      );
    }),
);
