import { Lambda, yC } from '..';
import { getNumber, n0, pred, succ } from './number';
import { np1ParamsFn } from './struct';
import { deTuple, former, latter, tuple } from './tuple';

/**空数组 */
export const l0 = tuple(F => F)(n0);
/**方便地得到一个 Lambda 数组 */
export function getList(l: Lambda[]): Lambda {
	return tuple(F => l.reduce((p, n) => p(n), F))(getNumber(l.length));
}
function getReceiver(r: Lambda[]): Lambda {
	return n => {
		r.push(n);
		return getReceiver(r);
	};
}
/**把 Lambda 数组变回 js 数组 */
export function deList(l: Lambda): Lambda[] {
	const [f] = deTuple(l);
	const r: Lambda[] = [];
	f(getReceiver(r));
	return r;
}
/**头上添加了一个元素 `x` 的 `l` */
export const pushedHead: Lambda = l => x => tuple(F => l(former)(F(x)))(succ(l(latter)));
/**末尾添加了一个元素 `x` 的 `l` */
export const pushedTail: Lambda = l => x => tuple(F => l(former)(F)(x))(succ(l(latter)));
/**头上删除了一个元素的 `l` */
export const deletedHead: Lambda = l => tuple(F => l(former)(_ => F))(pred(l(latter)));
/**头上删除了 `n` 个元素的 `l` */
export const deletedHeadMany: Lambda = l => n => n(deletedHead)(l);
/**`l` 的头上 */
export const head: Lambda = l => l(former)(np1ParamsFn(pred(l(latter))));
/**`l` 的第 `n + 1` 个元素 */
export const indexed: Lambda = l => n => head(deletedHeadMany(l)(n));
const revedOne: Lambda = t => tuple(pushedHead(t(former))(head(t(latter))))(deletedHead(t(latter)));
/**反转的 `l` */
export const reversed: Lambda = l => l(latter)(revedOne)(tuple(l0)(l))(former);
/**`l` 的末尾 */
export const tail: Lambda = l => head(reversed(l));
/**末尾删除了一个元素的 `l` */
export const deletedTail: Lambda = l => reversed(deletedHead(reversed(l)));
/**末尾删除了 `n` 个元素的 `l` */
export const deletedTailMany: Lambda = l => n => reversed(deletedHeadMany(reversed(l))(n));
/**删除 `l` 的末尾直到 `f` 对末尾为真 */
export const deletedTailUntil: Lambda = f => yC(s => l => f(tail(l))(l)(s(deletedTail(l))));

