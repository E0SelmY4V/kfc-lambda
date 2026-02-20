import { Lambda, yC } from '..';
import { indexed, l0, pushedTail } from './list';

/**解释器 */
export const interpreter = yC(s => r => n => s(n(r)))(x => x(l0));
/**构建一个调用 */
export const macroCall: Lambda = P => x => y => P(l => x(l)(y(l)));
/**构建一个函数定义 */
export const macroFunc: Lambda = P => d => P(l => x => d(pushedTail(l)(x)));
/**得到一个第 `n` 层的函数的参数 */
export const macroArg: Lambda = n => P => P(l => indexed(l)(n));

