import {Lambda, yC} from '..';
import {getNumber, n0, pred, succ} from './number';
import {np1ParamsFn} from './struct';
import {deTuple, former, latter, tuple} from './tuple';

export const l0 = tuple(F => F)(n0);
export function getList(l: Lambda[]): Lambda {
	return tuple(F => l.reduce((p, n) => p(n), F))(getNumber(l.length));
}
function getReceiver(r: Lambda[]): Lambda {
	return n => {
		r.push(n);
		return getReceiver(r);
	}
}
export function deList(l: Lambda): Lambda[] {
	const [f] = deTuple(l);
	const r: Lambda[] = [];
	f(getReceiver(r));
	return r;
}
export const pushedHead: Lambda = l => x => tuple(F => l(former)(F(x)))(succ(l(latter)));
export const pushedTail: Lambda = l => x => tuple(F => l(former)(F)(x))(succ(l(latter)));
export const deletedHead: Lambda = l => tuple(F => l(former)(_ => F))(pred(l(latter)));
export const deletedMany: Lambda = l => n => n(deletedHead)(l);
export const head: Lambda = l => l(former)(np1ParamsFn(pred(l(latter))));
export const indexed: Lambda = l => n => head(deletedMany(l)(n));
const revedOne: Lambda = t => tuple(pushedHead(t(former))(head(t(latter))))(deletedHead(t(latter)));
export const reversed: Lambda = l => l(latter)(revedOne)(tuple(l0)(l))(former);
export const tail: Lambda = l => head(reversed(l));
export const deletedTail: Lambda = l => reversed(deletedHead(reversed(l)));
export const deletedTailUntil = yC(s => l => f => f(tail(l))(l)(s(deletedTail(l))(f)));

