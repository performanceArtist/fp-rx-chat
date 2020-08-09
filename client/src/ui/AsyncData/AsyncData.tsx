import React from 'react';
import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';

import { withDefaults } from 'shared/utils';
import { RequestResult, isPending } from 'api/request';

import { Preloader } from '../Preloader/Preloader';

type AsyncDataProps<T> = {
  data: RequestResult<T>;
  onSuccess: (result: T) => JSX.Element;
  onPending: () => JSX.Element;
  onError: (error: Error) => JSX.Element;
};

export function AsyncDataRenderer<T>(props: AsyncDataProps<T>) {
  const { data, onSuccess, onError, onPending } = props;

  return pipe(
    data,
    either.fold(
      left => (isPending(left) ? onPending() : onError(left)),
      onSuccess,
    ),
  );
}

export const AsyncData = withDefaults(AsyncDataRenderer)(() => ({
  onError: (error: Error) => <h2>{error.toString()}</h2>,
  onPending: () => <Preloader />,
}));
