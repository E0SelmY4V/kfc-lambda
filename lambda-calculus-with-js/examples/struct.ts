import { Lambda, yC } from '..';
import { bTrue } from './bool';

/**得到一个拥有 `n + 1` 个参数的函数 */
export const np1ParamsFn: Lambda = n => n(bTrue);
/**一个拥有无穷多参数的函数 */
export const manyParamsFn = yC(s => _ => s);

