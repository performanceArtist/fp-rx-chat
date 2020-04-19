import React from 'react';

import { useField } from 'utils';

export type LoginQuery = {
  username: string;
  password: string;
};

type Props = {
  loginRequest: (user: LoginQuery) => void;
};

const Login: React.FC<Props> = props => {
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
};

export { Login };
