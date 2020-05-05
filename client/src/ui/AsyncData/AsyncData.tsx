import React from 'react';
import { Request, isPending, isFailure } from 'api/request';

import { Preloader } from '../Preloader/Preloader';

type AsyncDataProps<T> = {
  data: Request<T>;
  onSuccess: (result: T) => JSX.Element;
  onError?: () => JSX.Element;
};

export function AsyncData<T>(props: AsyncDataProps<T>) {
  const { data, onSuccess, onError } = props;

  if (isPending(data)) {
    return <Preloader />;
  }

  if (isFailure(data)) {
    if (onError) {
      return onError();
    }

    return <h2>{data.error.toString()}</h2>;
  }

  return onSuccess(data.data);
}
