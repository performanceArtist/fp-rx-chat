import { Request } from 'api/api-client';
import { useObservable } from './useObservable';
import { either } from 'fp-ts';
import { initial } from '@performance-artist/fp-ts-adt';

export const useRequest = <T>(request$: Request<T>) =>
  useObservable(request$, either.left(initial));
