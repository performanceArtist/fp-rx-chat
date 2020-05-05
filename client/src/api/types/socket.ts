import { MessageScheme } from 'models/message';
import { TypeOf } from 'io-ts';

export const channelToScheme = {
  message: MessageScheme,
};

export type ChannelToScheme = typeof channelToScheme;
export type SocketChannel = keyof ChannelToScheme;
export type SocketMessage = TypeOf<ChannelToScheme[SocketChannel]>
