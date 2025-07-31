import {gl, yC} from '..';
import {bTrue} from './bool';

export const np1ParamsFn = gl(n => n(bTrue));
export const manyParamsFn = yC(s => _ => s);

