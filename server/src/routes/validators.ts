import { pipe } from 'fp-ts/lib/pipeable';
import { either } from 'fp-ts';
import { Either } from 'fp-ts/lib/Either';
import { flow, not } from 'fp-ts/lib/function';

import { pick } from 'utils';

const makeValidator = <T>(
  validate: (o: { [key: string]: string }) => Either<string, T>,
) => (o: { [key: string]: string }) => validate(o);

const notNaN = not(Number.isNaN);

const checkInt = (input: any) =>
  pipe(
    parseInt(input, 10),
    either.fromPredicate(notNaN, () => 'Expected a number'),
  );

export const chatID = makeValidator(
  flow(
    pick('chatID'),
    checkInt,
    either.mapLeft(e => `Invalid chat id: ${e}`),
  ),
);
