import t from 'tape';
import {getLambdaEq} from '../test';
import {and, bFalse, bTrue, deBool, getBool, not, or} from './bool';

t('bool', t => {
	const eqL = getLambdaEq(t);

	eqL(and(bTrue)(bTrue), bTrue);
	eqL(and(bFalse)(bTrue), bFalse);
	eqL(and(bTrue)(bFalse), bFalse);
	eqL(and(bFalse)(bFalse), bFalse);

	eqL(or(bTrue)(bTrue), bTrue);
	eqL(or(bFalse)(bTrue), bTrue);
	eqL(or(bTrue)(bFalse), bTrue);
	eqL(or(bFalse)(bFalse), bFalse);

	eqL(not(bTrue), bFalse);
	eqL(not(bFalse), bTrue);

	eqL(getBool(true), bTrue);
	eqL(getBool(false), bFalse);

	t.equal(deBool(bTrue), true);
	t.equal(deBool(bFalse), false);

	t.end();
});

