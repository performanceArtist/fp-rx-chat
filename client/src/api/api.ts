import { of } from 'rxjs';
import { ajax, AjaxRequest, AjaxError } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { Type, TypeOf } from 'io-ts';
import { isLeft } from 'fp-ts/lib/Either';

import { RequestData, failure, success } from './request';

type RequestOptions<S extends Type<any> = never> = {
  query?: any;
  scheme?: S;
};

const getQueryString = (query: any) => {
  return Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
};

class Api {
  constructor(private baseURL: string, private defaults?: AjaxRequest) {}

  public request<S extends Type<any>>(
    url: string,
    options: AjaxRequest,
    scheme?: S,
  ) {
    return ajax({
      url: `${this.baseURL}${url}`,
      ...this.defaults,
      ...options,
    }).pipe(
      map(({ response }) => {
        if (!scheme) {
          return success(response);
        }

        const data = scheme.decode(response);

        if (isLeft(data)) {
          console.error(data.left);
        }

        return isLeft(data)
          ? failure(new Error(data.left.toString()))
          : success(data.right);
      }),
      catchError((error: AjaxError) =>
        of(failure(new Error(String(error.message)))),
      ),
    );
  }

  private withMethod = (method: 'POST' | 'GET') => <
    S extends Type<any>
  >(
    url: string,
    options?: RequestOptions<S>,
  ): RequestData<TypeOf<S>> => {
    if (!options) {
      return this.request(url, { method });
    }

    const { query, scheme } = options;
    const finalURL =
      method === 'GET' && query ? `${url}?${getQueryString(query)}` : url;

    return this.request(finalURL, { method, body: query }, scheme);
  };

  public get = this.withMethod('GET');
  public post = this.withMethod('POST');
}

export { Api };
