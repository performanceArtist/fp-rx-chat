import { ChatModel } from 'models/chat';
import { combineReaders } from 'utils';
import { pending } from 'api/request';

import { Home } from './Home';
import { useObservable } from 'utils/hooks';
import { ask } from 'fp-ts/lib/Reader';
import { withDefaults } from 'utils/withDefaults';

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
