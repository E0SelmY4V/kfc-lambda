import { Lambda } from '..';

export const I: Lambda = n => n;
export const K: Lambda = x => _ => x;
export const S: Lambda = x => y => z => x(z)(y(z));

