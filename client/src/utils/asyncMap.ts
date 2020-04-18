import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

import { mapRequest, Request } from 'api/request';

export const asyncMap = <A, B>(
  f: (r: A) => B,
): OperatorFunction<Request<A>, Request<B>> => map(mapRequest(f));
