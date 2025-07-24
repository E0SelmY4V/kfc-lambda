import {gl, fI, yC, log, Log, solve} from '.';

export const I = gl(n => n);
export const K = gl(x => _ => x);
export const S = gl(x => y => z => x(z)(y(z)));

export const bTrue = K;
export const bFalse = gl(_ => y => y);
export const and = gl(a => b => a(b)(a));
export const or = gl(a => b => a(a)(b));
export const not = gl(a => a(bFalse)(bTrue));

export const plus = gl(a => b => F => X => a(F)(b(F)(X)));
export const multi = gl(a => b => a(plus(b))(n0));
export const succ = gl(a => F => X => a(F)(F(X)));
export const pred = gl(n => F => X => n(p => h => h(p(F)))(_ => X)(I));
export const minus = gl(a => b => b(pred)(a));
export const isZero = gl(n => n(and(bFalse))(bTrue));
export const le = gl(a => b => isZero(minus(a)(b)));
export const gt = gl(a => b => not(le(a)(b)));
export const ge = gl(a => b => le(b)(a));
export const ls = gl(a => b => not(ge(a)(b)))
export const eq = gl(a => b => and(le(a)(b))(le(b)(a)));
export const ne = gl(a => b => not(eq(a)(b)));
export const n0 = gl(_ => X => X);
export const n1 = gl(F => X => F(X));
export const n2 = gl(F => X => F(F(X)));
export const n8 = multi(n2)(multi(n2)(n2));

export const np1ParamsFn = gl(n => n(bTrue));
export const manyParamsFn = yC(s => _ => s);
// export const debugFn = gl(yC(s => x => (console.log(x), s)));

export const tuple = gl(a => b => T => T(a)(b));
export const former = bTrue;
export const latter = bFalse;

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

export const interpreter = yC(s => r => n => s(n(r)))(x => x(l0));
export const macroCall = gl(P => x => y => P(l => x(l)(y(l))));
export const macroFunc = gl(P => d => P(l => x => d(pushedTail(l)(x))));
export const macroArg = gl(n => P => P(l => indexed(l)(n)));

export const factorial = yC(s => n => isZero(n)(n1)(multi(n)(s(pred(n)))));

