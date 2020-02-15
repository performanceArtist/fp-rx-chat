import React, { ComponentType } from 'react';
import { Observable, BehaviorSubject, Subscription, merge } from 'rxjs';
import { map } from 'rxjs/operators';

type Streams<T extends object> = {
  [key in keyof T]: Observable<T[key]>;
};

type Above<Type, Limit> = Limit extends Type
  ? Type
  : Type extends Limit ? Type : { 'Missing properties': Exclude<keyof Type, keyof Limit> };

type KeyofNever<T> = T extends never ? never : keyof T;

function withStreams<P extends object>(Component: ComponentType<P>) {
  return function<
    S extends Streams<Partial<P>> = never,
    D extends Partial<P> = never
  >(
    selector: (
      props$: Observable<P>,
    ) => {
      streams?: Above<S, Streams<P>>;
      defaultProps?: Above<D, P>;
    },
  ) {
    class WithStreams extends React.PureComponent<
      Omit<P, KeyofNever<S> | KeyofNever<D>>,
      Partial<P>
    > {
      private props$ = new BehaviorSubject(this.props);
      private selectorProps = selector(
        this.props$.asObservable() as Observable<P>,
      );
      private propsSubscription!: Subscription;

      componentDidMount() {
        const { streams } = this.selectorProps;
        if (!streams) {
          return;
        }

        const stateFields = Object.keys(streams).reduce((acc, key) => {
          return acc.concat(
            (streams as any)[key].pipe(map(value => ({ [key]: value }))),
          );
        }, [] as Observable<any>[]);
        const merged = merge(...stateFields);

        this.propsSubscription = merged.subscribe(this.setState.bind(this));
      }

      componentWillReceiveProps(props: P) {
        this.props$.next(props);
      }

      componentWillUnmount() {
        this.propsSubscription && this.propsSubscription.unsubscribe();
      }

      render() {
        const props = {
          ...this.selectorProps.defaultProps,
          ...this.props,
          ...this.state,
        };

        return <Component {...(props as P)} />;
      }
    }

    return WithStreams;
  };
}

export { withStreams };
