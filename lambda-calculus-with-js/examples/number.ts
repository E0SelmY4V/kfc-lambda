import {gl, yC} from '..';
import {I} from './combinatory';
import {and, bFalse, bTrue, not} from './bool';

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
export const factorial = yC(s => n => isZero(n)(n1)(multi(n)(s(pred(n)))));

