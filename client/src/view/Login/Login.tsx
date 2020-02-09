import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { Request, isSuccess } from 'api/request';

export type LoginQuery = {
  username: string;
  password: string;
};

type Props = {
  loginRequest: (user: LoginQuery) => void;
  loginResult: Request;
  onLoginSuccess: () => void;
} & RouteComponentProps;

const useField = (setter: React.Dispatch<any>) => (event: React.FormEvent) => {
  const target = event.target as HTMLInputElement;
  setter(target.value);
};

const Login: React.FC<Props> = props => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { loginRequest, loginResult, onLoginSuccess } = props;
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    loginRequest({ username, password });
  };

  useEffect(() => {
    if (isSuccess(loginResult)) {
      onLoginSuccess();
    }
  }, [loginResult]);

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

const Loffin = withRouter(Login);

export { Loffin as Login };
