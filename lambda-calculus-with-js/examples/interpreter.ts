import { Lambda } from '..';
import { deletedHead, head, indexed, l0, pushedHead } from './list';
import { former, latter, tuple } from './tuple';

/**一步步构建的函数 */
const f: Lambda = t => tuple(head(t(latter))(t(former)))(deletedHead(t(latter)));
/**构建的初始状态 */
const r0: Lambda = l => tuple(x => x(l0))(l);
/**
 * 解释函数
 * @param l 数组形式的程序
 * @link https://www.cnblogs.com/QiFande/p/18984935
 */
export const interpreted: Lambda = l => l(latter)(f)(r0(l))(former);
/**调用指令 */
export const macroCall: Lambda = p => F => X => p(A => F(A)(X(A)));
/**函数指令 */
export const macroFunc: Lambda = p => E => p(A => a => E(pushedHead(A)(a)));
/**得到外面第 `n` 层函数的参数的指令 */
export const macroArg: Lambda = n => p => p(A => indexed(A)(n));

