import { Selector } from '@performance-artist/fp-ts-adt';
import { ComponentType, memo, createElement } from 'react';

export const resolve = <E, A, P extends A>(
  component: Selector<E, ComponentType<P>>,
  create: (input: A) => E,
) =>
  memo((props: P) => {
    const deps = create(props);
    const resolved = component.run(deps);

    return createElement(resolved, props);
  });
