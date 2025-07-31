import t from 'tape';
import {Lambda, test} from '..';
import {getLambdaEq} from '../test';
import {getBool} from './bool';
import {
	deNumber,
	eq,
	factorial,
	ge,
	getNumber,
	gt,
	isZero,
	le,
	ls,
	minus,
	multi,
	ne,
	plus,
	pred,
	succ
} from './number';

const n1 = getNumber(1);
const n2 = getNumber(2);
const n8 = getNumber(8);

t('number', t => {
	const eqL = getLambdaEq(t);

	t.deepEqual(test(n1), test(f => x => f(x)));
	t.deepEqual(test(n2), test(f => x => f(f(x))));
	t.deepEqual(test(n8), test(f => x => f(f(f(f(f(f(f(f(x))))))))));

	function fact(n: number): number {
		return n === 0 ? 1 : n * fact(n - 1);
	}
	const sigTs: [Lambda, (n: number) => Lambda, string][] = [
		[isZero, (n) => getBool(n === 0), '0 =='],
		[succ, (n) => getNumber(n + 1), '1 +'],
		[pred, (n) => getNumber(n ? n - 1 : 0), '-1 +'],
		[factorial, n => getNumber(fact(n)), 'fact'],
	]
	const binTs: [Lambda, (a: number, b: number) => Lambda, string][] = [
		[plus, (a, b) => getNumber(a + b), '+'],
		[multi, (a, b) => getNumber(a * b), '*'],
		[minus, (a, b) => getNumber(a - b < 0 ? 0 : a - b), '-'],
		[le, (a, b) => getBool(a <= b), '<='],
		[gt, (a, b) => getBool(a > b), '>'],
		[ge, (a, b) => getBool(a >= b), '>='],
		[ls, (a, b) => getBool(a < b), '<'],
		[eq, (a, b) => getBool(a === b), '=='],
		[ne, (a, b) => getBool(a !== b), '!='],
	];
	const l = Array(10).fill(0).map((_, b) => b);
	for (const a of l) {
		t.equal(deNumber(getNumber(a)), a);
		for (const [fn, cm, msg] of sigTs) {
			if (a > 6 && fn === factorial) continue;
			eqL(fn(getNumber(a)), cm(a), `${msg} ${a}`);
		}
		for (const b of l) {
			for (const [fn, cm, msg] of binTs) {
				eqL(fn(getNumber(a))(getNumber(b)), cm(a, b), `${a} ${msg} ${b}`);
			}
		}
	}

	t.end();
});

