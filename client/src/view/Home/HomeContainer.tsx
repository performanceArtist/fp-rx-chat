import { ask } from 'fp-ts/lib/Reader';

import { ChatModel } from 'models/chat';
import { combineReaders } from 'shared/utils';
import { pending } from 'api/request';
import { useObservable, withDefaults } from 'shared/utils';

import { Home } from './Home';

type HomeDeps = {
  chatModel: ChatModel;
};

export const HomeContainer = combineReaders(ask<HomeDeps>(), Home, (deps, Home) => {
  return withDefaults(Home)(() => {
    const { chatModel } = deps;
    const chats = useObservable(chatModel.chats$, pending);

    return { chats };
  });
});
