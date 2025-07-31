import {Lambda, yC} from '..';
import {bTrue} from './bool';

export const np1ParamsFn: Lambda = n => n(bTrue);
export const manyParamsFn = yC(s => _ => s);

