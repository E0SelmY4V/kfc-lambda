import t from 'tape';
import { Lambda, jsifier, stdLambdaifier, yC } from '..';
import { bFalse } from './bool';

t('readme', t => {
	const plus: Lambda = a => b => f => x => a(f)(b(f)(x));
	const n2: Lambda = f => x => f(f(x));
	const a = plus(n2);

	t.equal(
		jsifier.format(a),
		'a => b => c => b(b(a(b)(c)))',
	);
	t.equal(
		stdLambdaifier.format(a),
		'λa.λb.λc.(b (b ((a b) c)))',
	);

	const n1: Lambda = f => x => f(x);
	const multi: Lambda = a => b => a(plus(b))(bFalse);
	const isZero: Lambda = n => n(_ => _ => y => y)(x => _ => x);
	const pred: Lambda = n => F => X => n(p => h => h(p(F)))(_ => X)(n => n);
	const factorial = yC(
		s => n => isZero(n)(
			n1,
		)(
			multi(n)(s(pred(n))),
		),
	);
	const n4: Lambda = f => x => f(f(f(f(x))));
	const n24 = factorial(n4);
	t.equal(
		jsifier.format(n24),
		'a => b => a(a(a(a(a(a(a(a(a(a(a(a(a(a(a(a(a(a(a(a(a(a(a(a(b))))))))))))))))))))))))',
	);

	t.end();
});

