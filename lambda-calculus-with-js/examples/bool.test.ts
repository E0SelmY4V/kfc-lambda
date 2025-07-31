import t from 'tape';
import {test} from '..';
import {and, bTrue, bFalse, or, not} from './bool';

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

