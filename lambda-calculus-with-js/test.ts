import { Test } from 'tape';
import { isEqual, Lambda } from '.';

export function getLambdaEq(t: Test) {
	return (a: Lambda, b: Lambda, msg?: string) => {
		t.ok(isEqual(a, b), msg);
	};
}

import './examples/bool.test';
import './examples/list.test';
import './examples/number.test';
import './examples/readme.test';

