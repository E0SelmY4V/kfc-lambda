import {fI, gl, yC} from '..';
import {n0, n1, n2, n8, pred, succ} from './number';
import {np1ParamsFn} from './struct';
import {former, latter, tuple} from './tuple';

export const l0 = tuple(F => F)(n0);
export const l1 = tuple(F => F(fI[6]))(n1);
export const l2 = tuple(F => F(fI[7])(fI[2]))(n2);
export const l8 = tuple(F => F(fI[1])(fI[2])(fI[5])(fI[3])(fI[99])(fI[10])(fI[31])(fI[34]))(n8);
export const pushedHead = gl(l => x => tuple(F => l(former)(F(x)))(succ(l(latter))));
export const pushedTail = gl(l => x => tuple(F => l(former)(F)(x))(succ(l(latter))));
export const deletedHead = gl(l => tuple(F => l(former)(_ => F))(pred(l(latter))));
export const deletedMany = gl(l => n => n(deletedHead)(l));
export const head = gl(l => l(former)(np1ParamsFn(pred(l(latter)))));
export const indexed = gl(l => n => head(deletedMany(l)(n)));
export const revedOne = gl(t => tuple(pushedHead(t(former))(head(t(latter))))(deletedHead(t(latter))));
export const reversed = gl(l => l(latter)(revedOne)(tuple(l0)(l))(former));
export const tail = gl(l => head(reversed(l)));
export const deletedTail = gl(l => reversed(deletedHead(reversed(l))));
export const deletedTailUntil = yC(s => l => f => f(tail(l))(l)(s(deletedTail(l))(f)));

