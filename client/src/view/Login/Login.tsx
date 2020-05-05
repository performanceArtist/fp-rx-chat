import React, { memo } from 'react';

import { useField } from 'shared/utils';

export type LoginQuery = {
  username: string;
  password: string;
};

type LoginProps = {
  loginRequest: (user: LoginQuery) => void;
};

export const Login = memo<LoginProps>(props => {
  const [username, onUsername] = useField('');
  const [password, onPassword] = useField('');
  const { loginRequest } = props;
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    loginRequest({ username, password });
  };

  return (
    <form onSubmit={onSubmit}>
      Username
      <input
        name="username"
        type="text"
        value={username}
        onChange={onUsername.change}
      />
      Password
      <input
        name="password"
        type="password"
        value={password}
        onChange={onPassword.change}
      />
      <button type="submit">Submit</button>
    </form>
  );
});
