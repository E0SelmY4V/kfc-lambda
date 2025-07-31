import {gl} from '..';

export const I = gl(n => n);
export const K = gl(x => _ => x);
export const S = gl(x => y => z => x(z)(y(z)));

