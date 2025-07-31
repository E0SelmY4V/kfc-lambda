import t from 'tape';
import {test} from '..';
import {bFalse, bTrue} from './bool';
import {
	eq,
	ge,
	gt,
	isZero,
	le,
	ls,
	n0,
	n1,
	n2,
	n8,
	ne,
	plus,
	pred,
	succ,
} from './number';

t('number', t => {
	t.deepEqual(test(plus(n8)(n2)), test(plus(n2)(n8)));
	t.deepEqual(test(plus(n2)(n2)), test(plus(n1)(plus(n2)(n1))));

	t.deepEqual(test(succ(n1)), test(n2));
	t.deepEqual(test(plus(n8)(n1)), test(succ(n8)));

	t.deepEqual(test(pred(n2)), test(n1));
	t.deepEqual(test(pred(n8)), test(plus(n2)(plus(n2)(plus(n2)(n1)))));

	t.deepEqual(test(isZero(n0)), test(bTrue));
	t.deepEqual(test(isZero(n1)), test(bFalse));
	t.deepEqual(test(isZero(n2)), test(bFalse));
	t.deepEqual(test(isZero(n8)), test(bFalse));

	const l = [0, 1, 2, 3];
	const j = [n0, n1, n2, n8];
	for (const a of l) {
		for (const b of l) {
			t.deepEqual(test(eq(j[a])(j[b])), test(a === b ? bTrue : bFalse));
			t.deepEqual(test(ne(j[a])(j[b])), test(a !== b ? bTrue : bFalse));
			t.deepEqual(test(gt(j[a])(j[b])), test(a > b ? bTrue : bFalse));
			t.deepEqual(test(ge(j[a])(j[b])), test(a >= b ? bTrue : bFalse));
			t.deepEqual(test(le(j[a])(j[b])), test(a <= b ? bTrue : bFalse));
			t.deepEqual(test(ls(j[a])(j[b])), test(a < b ? bTrue : bFalse));
		}
	}

	t.end();
});

