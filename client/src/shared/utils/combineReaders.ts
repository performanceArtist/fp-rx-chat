import { Reader, reader, chain } from 'fp-ts/lib/Reader';
import { sequenceT } from 'fp-ts/lib/Apply';
import { pipe } from 'fp-ts/lib/pipeable';

interface CombineReaders {
  <A, RA, R>(a: Reader<A, RA>, project: (a: RA) => R): Reader<A, R>;
  <A, RA, B, RB, R>(
    a: Reader<A, RA>,
    b: Reader<B, RB>,
    project: (a: RA, b: RB) => R,
  ): Reader<A & B, R>;
  <A, RA, B, RB, C, RC, R>(
    a: Reader<A, RA>,
    b: Reader<B, RB>,
    c: Reader<C, RC>,
    project: (a: RA, b: RB, c: RC) => R,
  ): Reader<A & B & C, R>;
  <A, RA, B, RB, C, RC, D, RD, R>(
    a: Reader<A, RA>,
    b: Reader<B, RB>,
    c: Reader<C, RC>,
    d: Reader<D, RD>,
    project: (a: RA, b: RB, c: RC, d: RD) => R,
  ): Reader<A & B & C & D, R>;
}

type Project = (...args: any[]) => any;

export const combineReaders: CombineReaders = (
  ...args: Array<Reader<any, any> | Project>
) => {
  const project = args[args.length - 1] as Project;
  const readers = args.slice(0, args.length - 1) as any;

  return pipe(
    sequenceT(reader)(...readers),
    chain((e: any) => () => project(...e)),
  );
};
