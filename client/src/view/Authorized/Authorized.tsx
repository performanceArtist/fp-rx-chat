import React, { memo } from 'react';
import { selector } from '@performance-artist/fp-ts-adt';
import { pipe } from 'fp-ts/lib/pipeable';
import { Switch, Route, Redirect } from 'react-router-dom';

import { Layout } from './Layout/Layout';
import { ProfileContainer } from 'view/Profile/ProfileContainer';
import { ChatContainer } from 'view/Chat/ChatContainer';

export const Authorized = pipe(
  selector.combine(Layout, ChatContainer, ProfileContainer),
  selector.map(([Layout, ChatContainer, ProfileContainer]) =>
    memo(() => (
      <Layout>
        <Switch>
          <Route exact path="/" component={ChatContainer} />
          <Route path="/profile" component={ProfileContainer} />
          <Redirect to="/" />
        </Switch>
      </Layout>
    )),
  ),
);
