import { memo, createElement, ComponentType } from 'react';
import { RequestState } from 'shared/ui/RequestState/RequestState';
import { pipe } from 'fp-ts/lib/pipeable';
import { either, array } from 'fp-ts';
import { RequestResult } from '@performance-artist/fp-ts-adt';
import { sequenceS } from 'fp-ts/lib/Apply';
import { Expand } from '@performance-artist/fp-ts-adt/dist/utils';

type KeysOfType<A extends object, B> = {
  [K in keyof A]-?: A[K] extends B ? K : never;
}[keyof A];

export const makeWithData = <T>(
  renderer: ComponentType<{
    data: RequestResult<T>;
    onSuccess: (data: T) => JSX.Element;
  }>,
) => <P extends object>() => <K extends KeysOfType<P, RequestResult<any>>>(
  keys: K[],
  render: (
    data: {
      [key in K]: P[key] extends RequestResult<infer R> ? R : never;
    },
    props: Expand<Omit<P, K>>,
  ) => JSX.Element,
): ComponentType<P> =>
  memo(props => {
    const data = pipe(
      keys,
      array.reduce({} as any, (acc, key) => ({
        ...acc,
        [key]: props[key],
      })),
      sequenceS(either.either),
    ) as RequestResult<any>;

    return createElement(renderer, {
      data,
      onSuccess: (data: any) => render(data, props),
    });
  });

export const withData = makeWithData(RequestState);
