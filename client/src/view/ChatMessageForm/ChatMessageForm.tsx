import React, { memo, FormEvent } from 'react';

type ChatMessageFormProps = {
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: () => void;
};

export const ChatMessageForm = memo<ChatMessageFormProps>(props => {
  const { message, onMessageChange, onSubmit } = props;
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    onSubmit();
    /*
    sendMessage(
      {
        text: message,
        timestamp: new Date().getTime(),
        chat_id: chatInfo.id,
        user_id: user.id,
      },
      chatInfo.name,
    );*/
    onMessageChange('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="chat__input"
        value={message}
        onChange={e => onMessageChange(e.target.value)}
        type="text"
        placeholder="Your message"
      />
    </form>
  );
});
