import React, { useState } from 'react';

export type LoginQuery = {
  username: string;
  password: string;
};

type Props = {
  loginRequest: (user: LoginQuery) => void;
};

const useField = (setter: React.Dispatch<any>) => (event: React.FormEvent) => {
  const target = event.target as HTMLInputElement;
  setter(target.value);
};

const Login: React.FC<Props> = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        onChange={useField(setUsername)}
      />
      Password
      <input
        name="password"
        type="password"
        value={password}
        onChange={useField(setPassword)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export { Login };
