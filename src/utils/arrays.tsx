import { Fragment, ReactNode } from 'react';

export const keyed = (arr: ReactNode[]) =>
  arr.map((e, i) => <Fragment key={i}>{e}</Fragment>);

export const pickRandom = <T,>(arr: T[]) =>
  arr[Math.floor(Math.random() * arr.length)];

export const transpose = (rows: string[]): string[] => {
  if (rows.length === 0) {
    return rows;
  }

  const ret: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _c of rows[0]) {
    ret.push('');
  }

  rows.forEach((row) => {
    for (let c = 0; c < row.length; c++) {
      ret[c] += row[c];
    }
  });

  return ret;
};
