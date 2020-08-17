import React, { memo } from 'react';
import { selector } from '@performance-artist/fp-ts-adt';
import { pipe } from 'fp-ts/lib/pipeable';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Layout } from 'view/Layout/Layout';
import { ProfileContainer } from 'view/Profile/ProfileContainer';
import { HomeContainer } from 'view/Home/HomeContainer';

export const Authorized = pipe(
  selector.combine(Layout, HomeContainer, ProfileContainer),
  selector.map(([Layout, HomeContainer, ProfileContainer]) =>
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
  ),
);
