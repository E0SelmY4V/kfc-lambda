import { Lambda, yC } from '..';
import { and, bFalse, bTrue, deBool, bFalse as n0, not } from './bool';
import { I } from './combinatory';

export const plus: Lambda = a => b => F => X => a(F)(b(F)(X));
export const multi: Lambda = a => b => a(plus(b))(n0);
export const succ: Lambda = a => F => X => a(F)(F(X));
export const pred: Lambda = n => F => X => n(p => h => h(p(F)))(_ => X)(I);
export const minus: Lambda = a => b => b(pred)(a);
export const isZero: Lambda = n => n(_ => bFalse)(bTrue);
export const le: Lambda = a => b => isZero(minus(a)(b));
export const gt: Lambda = a => b => not(le(a)(b));
export const ge: Lambda = a => b => le(b)(a);
export const ls: Lambda = a => b => not(ge(a)(b));
export const eq: Lambda = a => b => and(le(a)(b))(le(b)(a));
export const ne: Lambda = a => b => not(eq(a)(b));
export { n0 };
export function getNumber(n: number): Lambda {
	return n === 0 ? n0 : succ(getNumber(n - 1));
}
export function deNumber(n: Lambda): number {
	let k = 0;
	while (!deBool(isZero(n))) {
		n = pred(n);
		k++;
	}
	return k;
}
export const factorial = yC(s => n => isZero(n)(getNumber(1))(multi(n)(s(pred(n)))));

