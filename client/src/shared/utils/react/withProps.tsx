import React, { ComponentType } from 'react';

export const withProps = <T extends object>(C: ComponentType<T>) => <
  D extends Partial<T>
>(
  select: (rest: T) => D,
): ComponentType<Omit<T, keyof D>> => (props: any) => (
  <C {...select(props)} {...props} />
);
