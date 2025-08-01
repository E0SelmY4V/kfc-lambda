import t from 'tape';
import { fI, Lambda, test } from '..';
import { getLambdaEq } from '../test';
import { I } from './combinatory';
import {
	deletedHead,
	deletedMany,
	deletedTail,
	deList,
	getList,
	head,
	indexed,
	l0,
	pushedHead,
	pushedTail,
	reversed,
	tail,
} from './list';
import { deNumber, getNumber } from './number';
import { tuple } from './tuple';

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
	const rand = (n = 50) => Math.ceil(Math.random() * n);
	function randomList() {
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
			const n = rand(r.length - 1);
			const x = getNumber(n);
			eqL(fn(getList(r))(x), cm(r, x), info(fn, r) + ` ${n}`);
		}
	}
	t.end();
});

