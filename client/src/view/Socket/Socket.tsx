import React from 'react';

type Props = {
  messages: string[];
};

export const SocketComponent: React.FC<Props> = props => {
  const { messages } = props;

  return (
    <div>
      <h2>Socket messages:</h2>
      {messages.map(message => (
        <div>{message}</div>
      ))}
    </div>
  );
};
