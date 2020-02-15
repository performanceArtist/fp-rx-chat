import React, { FC } from 'react';

type Props = {
  onLogout: () => void;
};

const Logout: FC<Props> = props => {
  const { onLogout } = props;

  return (
    <button type="button" onClick={onLogout}>
      Log out
    </button>
  );
};

export { Logout };
