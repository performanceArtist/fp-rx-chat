import { of, Observable } from 'rxjs';
import { ajax, AjaxRequest, AjaxError } from 'rxjs/ajax';
import { catchError, startWith } from 'rxjs/operators';
import { Type, TypeOf } from 'io-ts';
import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { observable } from 'fp-ts-rxjs';
import {
  pending,
  selector,
  RequestResult,
} from '@performance-artist/fp-ts-adt';

type RequestOptions<S extends Type<any> = never> = {
  query?: any;
  scheme?: S;
};

export type Request<T> = Observable<RequestResult<T>>;

export type Api = {
  get: <S extends Type<any>, R extends TypeOf<S> = unknown>(
    url: string,
    options?: RequestOptions<S>,
  ) => Request<R>;
  post: <S extends Type<any>, R extends TypeOf<S> = unknown>(
    url: string,
    options?: RequestOptions<S>,
  ) => Request<R>;
};
export const apiClientKey = selector.key<Api>()('apiClient');

export const createApiClient = pipe(
  selector.combine(
    selector.key<string>()('baseURL'),
    selector.key<AjaxRequest>()('defaults'),
  ),
  selector.map(([baseURL, defaults]) => (): Api => {
    const request = <S extends Type<any>>(
      url: string,
      options: AjaxRequest,
      scheme?: S,
    ) =>
      pipe(
        ajax({
          url: `${baseURL}${url}`,
          ...defaults,
          ...options,
        }),
        observable.map(({ response }) => {
          if (!scheme) {
            return either.right(response);
          }

          const decoded = scheme.decode(response);

          if (either.isLeft(decoded)) {
            console.error(decoded.left);
          }

          return pipe(
            decoded,
            either.mapLeft(errors => new Error(errors.toString())),
          );
        }),
        catchError((error: AjaxError) =>
          of(either.left(new Error(String(error.message)))),
        ),
        startWith(either.left(pending)),
      );

    const getQueryString = (query: any) => {
      return Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    };

    const withMethod = (method: 'POST' | 'GET') => <S extends Type<any>>(
      url: string,
      options?: RequestOptions<S>,
    ): Request<TypeOf<S>> => {
      if (!options) {
        return request(url, { method });
      }
      const { query, scheme } = options;
      const finalURL =
        method === 'GET' && query ? `${url}?${getQueryString(query)}` : url;

      return request(finalURL, { method, body: query }, scheme);
    };

    return { get: withMethod('GET'), post: withMethod('POST') };
  }),
);
