import {Test} from "tape";
import {Lambda, test} from ".";

export function getLambdaEq(t: Test) {
	return (a: Lambda, b: Lambda, msg?: string) => {
		t.deepEqual(test(a), test(b), msg);
	}
}

import './examples/bool.test';
import './examples/list.test';
import './examples/number.test';

