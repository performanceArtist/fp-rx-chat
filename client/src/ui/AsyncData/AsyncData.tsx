import React from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';

import { withDefaults } from 'shared/utils';
import { RequestResult, isPending, isInitial } from 'api/request';

import { Preloader } from '../Preloader/Preloader';

type AsyncDataProps<T> = {
  data: RequestResult<T>;
  onInitial: () => JSX.Element;
  onSuccess: (result: T) => JSX.Element;
  onPending: () => JSX.Element;
  onError: (error: Error) => JSX.Element;
};

export function AsyncDataRenderer<T>(props: AsyncDataProps<T>) {
  const { data, onSuccess, onError, onPending, onInitial } = props;

  return pipe(
    data,
    either.fold(left => {
      if (isPending(left)) {
        return onPending();
      } else if (isInitial(left)) {
        return onInitial();
      } else {
        return onError(left);
      }
    }, onSuccess),
  );
}

export const AsyncData = withDefaults(AsyncDataRenderer)(() => ({
  onError: (error: Error) => <h2>{error.toString()}</h2>,
  onPending: () => <Preloader />,
  onInitial: () => <Preloader />,
}));
