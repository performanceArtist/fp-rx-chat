import { of, Observable } from 'rxjs';
import { ajax, AjaxRequest, AjaxError } from 'rxjs/ajax';
import { catchError } from 'rxjs/operators';
import { Type, TypeOf } from 'io-ts';
import { isLeft, Either } from 'fp-ts/lib/Either';
import { either } from 'fp-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { observable } from 'fp-ts-rxjs';

import { Pending } from './request';

type ApiDeps = {
  baseURL: string;
  defaults: AjaxRequest;
};

type RequestOptions<S extends Type<any> = never> = {
  query?: any;
  scheme?: S;
};

export type Api = {
  get: <S extends Type<any>>(
    url: string,
    options?: RequestOptions<S>,
  ) => Observable<Either<Error | Pending, TypeOf<S>>>;
  post: <S extends Type<any>>(
    url: string,
    options?: RequestOptions<S>,
  ) => Observable<Either<Error | Pending, TypeOf<S>>>;
};

export const createApi = (e: ApiDeps) => (): Api => {
  const { baseURL, defaults } = e;

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

        if (isLeft(decoded)) {
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
    );

  const getQueryString = (query: any) => {
    return Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  };

  const withMethod = (method: 'POST' | 'GET') => <S extends Type<any>>(
    url: string,
    options?: RequestOptions<S>,
  ): Observable<Either<Error | Pending, TypeOf<S>>> => {
    if (!options) {
      return request(url, { method });
    }
    const { query, scheme } = options;
    const finalURL =
      method === 'GET' && query ? `${url}?${getQueryString(query)}` : url;

    return request(finalURL, { method, body: query }, scheme);
  };

  return { get: withMethod('GET'), post: withMethod('POST') };
};
