import { createHandler } from './createHandler';
import { Observable } from 'rxjs';

export type Input<I = void, R = void> = {
  out$: Observable<R>;
  onInput: I extends void ? () => void : (input: I) => void;
};
export const createInput = <I = void>() => <R>(
  f: (input$: Observable<I>) => Observable<R>,
): Input<I, R> => {
  const [value$, onInput] = createHandler<I>();

  return { out$: f(value$), onInput: onInput as any };
};

export type InputEffect<I = void> = {
  out$: Observable<unknown>;
  onInput: I extends void ? () => void : (input: I) => void;
};
export const createInputEffect = <I = void>() => <R>(
  f: (input$: Observable<I>) => Observable<R>,
): InputEffect<I> => createInput<I>()(f);
