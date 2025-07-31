import t from 'tape';
import {fI, gl, Lambda, test} from '..';
import {
	deletedHead,
	deletedMany,
	deletedTail,
	deList,
	head,
	indexed,
	l0,
	pushedHead,
	pushedTail,
	reversed,
	tail,
} from './list';
import {getLambdaEq} from '../test';
import {getList} from './list';
import {deNumber, eq, getNumber} from './number';
import {tuple} from './tuple';
import {I} from './combinatory';

t('list', t => {
	const eqL = getLambdaEq(t);

	eqL(getList([]), l0);
	eqL(getList([fI[1], fI[2], fI[3]]), tuple(F => F(fI[1])(fI[2])(fI[3]))(getNumber(3)));
	eqL(getList([I, pushedHead, deletedTail]), tuple(F => F(I)(pushedHead)(deletedTail))(getNumber(3)));

	t.deepEqual(deList(getList([fI[1], fI[3], fI[5]])), [fI[1], fI[3], fI[5]]);

	const sigTs: [Lambda, (l: Lambda[]) => Lambda][] = [
		[deletedHead, l => getList(l.slice(1))],
		[head, l => l[0]],
		[reversed, l => getList(l.slice().reverse())],
		[tail, l => l[l.length - 1]],
		[deletedTail, l => getList(l.slice(0, -1))],
	];
	const binTs: [Lambda, (l: Lambda[], x: Lambda) => Lambda][] = [
		[pushedHead, (l, x) => getList([x, ...l])],
		[pushedTail, (l, x) => getList([...l, x])],
		[deletedMany, (l, n) => getList(l.slice(deNumber(n)))],
		[indexed, (l, i) => l[deNumber(i)]],
	];
	function randomList() {
		const rand = () => Math.ceil(Math.random() * 50);
		const len = rand() + 1;
		const r = [];
		for (let i = 0; i < len; i++) {
			r.push(fI[rand()]);
		}
		return r;
	}
	const info = (fn: Lambda, r: Lambda[]) => `${fn.name} with ${r.map(n => test(n).toLambda(true))}`;
	for (let i = 0; i < 50; i++) {
		const r = randomList();
		for (const [fn, cm] of sigTs) {
			eqL(fn(getList(r)), cm(r), info(fn, r));
		}
		for (const [fn, cm] of binTs) {
			eqL(fn(getList(r))(fI[200]), cm(r, fI[200]), info(fn, r));
		}
	}
	t.end();
});

