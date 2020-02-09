import { pending, Request } from './types';
import { sequenceTRequest } from './utils';

const a: Request<1> = pending();
const b: Request<2> = pending();
const c = sequenceTRequest(a, b);
console.log(c);
