import { Lambda } from '..';
import { K } from './combinatory';

export const bTrue = K;
export const bFalse: Lambda = _ => y => y;
export function getBool(n: boolean): Lambda {
	return n ? bTrue : bFalse;
}
export function deBool(n: Lambda): boolean {
	return n(true as any)(false as any) as any;
}
export const and: Lambda = a => b => a(b)(a);
export const or: Lambda = a => b => a(a)(b);
export const not: Lambda = a => a(bFalse)(bTrue);

