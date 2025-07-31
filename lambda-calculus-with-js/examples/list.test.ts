import t from 'tape';
import {fI, gl, test} from '..';
import {
	deletedHead,
	deletedTail,
	head,
	indexed,
	l1,
	l2,
	pushedHead,
	pushedTail,
	reversed,
} from './list';
import {n1, n2} from './number';

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

