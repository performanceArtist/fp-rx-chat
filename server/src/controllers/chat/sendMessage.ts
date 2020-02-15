import {
  withMessageScheme,
  Message
} from '../../model/entities';

export const sendMessage = (message: Message) => {
  return withMessageScheme.insert(message);
};
