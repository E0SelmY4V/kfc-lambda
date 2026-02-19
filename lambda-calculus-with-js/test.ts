import { Test } from 'tape';
import { jsifier, Lambda } from '.';

export function getLambdaEq(t: Test) {
	return (a: Lambda, b: Lambda, msg?: string) => {
		t.deepEqual(jsifier.format(a), jsifier.format(b), msg);
	};
}

import './examples/bool.test';
import './examples/list.test';
import './examples/number.test';
import './examples/readme.test';

