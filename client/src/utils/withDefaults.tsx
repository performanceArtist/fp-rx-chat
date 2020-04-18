import React, { ComponentType } from 'react';

export const withDefaults = <T extends object>(C: ComponentType<T>) => <
  D extends Partial<T>
>(
  defaults: (rest: T) => D,
): ComponentType<Omit<T, keyof D>> => (props: any) => (
  <C {...defaults(props)} {...props} />
);
