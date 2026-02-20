import { Lambda } from '..';
import { bTrue as former, bFalse as latter } from './bool';

/**二元组 */
export const tuple: Lambda = a => b => T => T(a)(b);
/**转换为 js 二元组 */
export function deTuple(t: Lambda): [Lambda, Lambda] {
	return [t(former), t(latter)];
}
export {
	/**前一个元素 */
	former,
	/**后一个元素 */
	latter,
};

