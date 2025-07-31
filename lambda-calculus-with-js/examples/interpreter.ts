import {Lambda, yC} from '..';
import {indexed, l0, pushedTail} from './list';

export const interpreter = yC(s => r => n => s(n(r)))(x => x(l0));
export const macroCall: Lambda = P => x => y => P(l => x(l)(y(l)));
export const macroFunc: Lambda = P => d => P(l => x => d(pushedTail(l)(x)));
export const macroArg: Lambda = n => P => P(l => indexed(l)(n));

