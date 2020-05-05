import React, { ComponentType, useMemo } from 'react';

export const withDefaults = <T extends object>(C: ComponentType<T>) => <
  D extends Partial<T>
>(
  defaults: (rest: T) => D,
  deps?: any[],
): ComponentType<Omit<T, keyof D>> => (props: any) => {
  const defaultProps = useMemo(() => defaults(props), deps);

  return <C {...defaultProps} {...props} />;
};
