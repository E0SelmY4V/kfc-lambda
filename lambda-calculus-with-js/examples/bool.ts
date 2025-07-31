import {gl} from '..';
import {K} from './combinatory';

export const bTrue = K;
export const bFalse = gl(_ => y => y);
export const and = gl(a => b => a(b)(a));
export const or = gl(a => b => a(a)(b));
export const not = gl(a => a(bFalse)(bTrue));

