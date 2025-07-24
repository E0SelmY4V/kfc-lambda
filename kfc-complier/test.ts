import t from 'tape';
import {
	and,
	bFalse,
	bTrue,
	deletedHead,
	deletedTail,
	eq,
	ge,
	gt,
	head,
	indexed,
	isZero,
	l1,
	l2,
	le,
	ls,
	n0,
	n1,
	n2,
	n8,
	ne,
	not,
	or,
	plus,
	pred,
	pushedHead,
	pushedTail,
	reversed,
	succ,
} from './defines';
import {gl, fI, test} from './lambda';

t('bool', t => {
	t.deepEqual(and(bTrue)(bTrue), bTrue);
	t.deepEqual(test(and(bFalse)(bTrue)), test(bFalse));
	t.deepEqual(test(and(bTrue)(bFalse)), test(bFalse));
	t.deepEqual(test(and(bFalse)(bFalse)), test(bFalse));

	t.deepEqual(test(or(bTrue)(bTrue)), test(bTrue));
	t.deepEqual(test(or(bFalse)(bTrue)), test(bTrue));
	t.deepEqual(test(or(bTrue)(bFalse)), test(bTrue));
	t.deepEqual(test(or(bFalse)(bFalse)), test(bFalse));

	t.deepEqual(test(not(bTrue)), test(bFalse));
	t.deepEqual(test(not(bFalse)), test(bTrue));

	t.end();
});

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

t('list', t => {
	t.deepEqual(test(pushedHead(l1)(fI[3])), test(gl(T => T(F => F(fI[3])(fI[6]))(n2))));
	t.deepEqual(test(pushedTail(l1)(fI[3])), test(gl(T => T(F => F(fI[6])(fI[3]))(n2))));
	t.deepEqual(test(deletedTail(l2)), test(gl(T => T(F => F(fI[7]))(n1))));
	t.deepEqual(test(deletedHead(l2)), test(gl(T => T(F => F(fI[2]))(n1))));
	t.deepEqual(test(head(l2)), test(fI[7]));
	t.deepEqual(test(indexed(l2)(n1)), test(fI[2]));
	t.deepEqual(test(reversed(l2)), test(gl(T => T(F => F(fI[2])(fI[7]))(n2))));

	t.end();
});


