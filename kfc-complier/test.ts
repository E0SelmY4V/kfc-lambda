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
import {lambdaEq, gl, tl} from './lambda';

t('bool', t => {
	t.ok(lambdaEq(and(bTrue)(bTrue), bTrue));
	t.ok(lambdaEq(and(bFalse)(bTrue), bFalse));
	t.ok(lambdaEq(and(bTrue)(bFalse), bFalse));
	t.ok(lambdaEq(and(bFalse)(bFalse), bFalse));

	t.ok(lambdaEq(or(bTrue)(bTrue), bTrue));
	t.ok(lambdaEq(or(bFalse)(bTrue), bTrue));
	t.ok(lambdaEq(or(bTrue)(bFalse), bTrue));
	t.ok(lambdaEq(or(bFalse)(bFalse), bFalse));

	t.ok(lambdaEq(not(bTrue), bFalse));
	t.ok(lambdaEq(not(bFalse), bTrue));

	t.end();
});

t('number', t => {
	t.ok(lambdaEq(plus(n8)(n2), plus(n2)(n8)));
	t.ok(lambdaEq(plus(n2)(n2), plus(n1)(plus(n2)(n1))));

	t.ok(lambdaEq(succ(n1), n2));
	t.ok(lambdaEq(plus(n8)(n1), succ(n8)));

	t.ok(lambdaEq(pred(n2), n1));
	t.ok(lambdaEq(pred(n8), plus(n2)(plus(n2)(plus(n2)(n1)))));

	t.ok(lambdaEq(isZero(n0), bTrue));
	t.ok(lambdaEq(isZero(n1), bFalse));
	t.ok(lambdaEq(isZero(n2), bFalse));
	t.ok(lambdaEq(isZero(n8), bFalse));

	const l = [0, 1, 2, 3];
	const j = [n0, n1, n2, n8];
	for (const a of l) {
		for (const b of l) {
			t.ok(lambdaEq(eq(j[a])(j[b]), a === b ? bTrue : bFalse));
			t.ok(lambdaEq(ne(j[a])(j[b]), a !== b ? bTrue : bFalse));
			t.ok(lambdaEq(gt(j[a])(j[b]), a > b ? bTrue : bFalse));
			t.ok(lambdaEq(ge(j[a])(j[b]), a >= b ? bTrue : bFalse));
			t.ok(lambdaEq(le(j[a])(j[b]), a <= b ? bTrue : bFalse));
			t.ok(lambdaEq(ls(j[a])(j[b]), a < b ? bTrue : bFalse));
		}
	}

	t.end();
});

t('list', t => {
	t.ok(lambdaEq(pushedHead(l1)(tl[3]), gl(T => T(F => F(tl[3])(tl[6]))(n2))));
	t.ok(lambdaEq(pushedTail(l1)(tl[3]), gl(T => T(F => F(tl[6])(tl[3]))(n2))));
	t.ok(lambdaEq(deletedTail(l2), gl(T => T(F => F(tl[7]))(n1))));
	t.ok(lambdaEq(deletedHead(l2), gl(T => T(F => F(tl[2]))(n1))));
	t.ok(lambdaEq(head(l2), tl[7]));
	t.ok(lambdaEq(indexed(l2)(n1), tl[2]));
	t.ok(lambdaEq(reversed(l2), gl(T => T(F => F(tl[2])(tl[7]))(n2))))

	t.end();
});


