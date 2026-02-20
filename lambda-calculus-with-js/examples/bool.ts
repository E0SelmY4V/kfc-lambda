import { Lambda } from '..';
import { K } from './combinatory';

/**布尔真 */
export const bTrue = K;
/**布尔假 */
export const bFalse: Lambda = _ => y => y;
/**得到 Lambda 布尔 */
export function getBool(n: boolean): Lambda {
	return n ? bTrue : bFalse;
}
/**转换回 js 的布尔量 */
export function deBool(n: Lambda): boolean {
	return n(true as any)(false as any) as any;
}
/**与 */
export const and: Lambda = a => b => a(b)(a);
/**或 */
export const or: Lambda = a => b => a(a)(b);
/**非 */
export const not: Lambda = a => a(bFalse)(bTrue);

