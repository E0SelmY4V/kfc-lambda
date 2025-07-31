import {Lambda} from '..';
import {bTrue as former, bFalse as latter} from './bool';

export const tuple: Lambda = a => b => T => T(a)(b);
export function deTuple(t: Lambda): [Lambda, Lambda] {
	return [t(former), t(latter)];
}
export {former, latter};

