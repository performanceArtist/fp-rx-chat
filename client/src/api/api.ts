import { of } from 'rxjs';
import { ajax, AjaxRequest, AjaxError } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { RequestData, failure, success } from './request';

class Api {
  constructor(private baseURL: string, private defaults?: AjaxRequest) {}

  public request<D>(url: string, options?: AjaxRequest): RequestData<D> {
    return ajax({
      url: `${this.baseURL}${url}`,
      ...this.defaults,
      ...options,
    }).pipe(
      map(({ response }) => success(response)),
      catchError((error: AjaxError) =>
        of(failure(new Error(String(error.message)))),
      ),
    );
  }

  public get<D = any>(url: string, query?: any): RequestData<D> {
    return this.request(url, { method: 'GET', body: query });
  }

  public post<D = any>(url: string, query?: any): RequestData<D> {
    return this.request(url, { method: 'POST', body: query });
  }
}

export { Api };
