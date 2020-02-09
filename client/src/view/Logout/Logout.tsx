import React, { FC, useEffect } from 'react';

import { Request, isSuccess } from 'api/request';

type Props = {
  onLogoutSuccess: () => void;
  logoutStatus: Request<any>;
  onLogout: () => void;
};

const Logout: FC<Props> = props => {
  const { logoutStatus, onLogout, onLogoutSuccess } = props;
  useEffect(() => {
    if (isSuccess(logoutStatus)) {
      onLogoutSuccess();
    }
  }, [logoutStatus]);

  return (
    <button type="button" onClick={() => onLogout()}>
      Log out
    </button>
  );
};

export { Logout };
