export interface Lambda {
	(x: Lambda): Lambda;
	testTag?: Tested;
	recursing?: () => Lambda;
}

export const enum SignTested {
	Func = 'func',
	Arg = 'arg',
	Call = 'call',
	Const = 'const',
}
export type Tested
	= TestedArg
	| TestedCall
	| TestedFunc
	| TestedConst;
export class TestedFunc {
	readonly sign = SignTested.Func;
	constructor(
		readonly arg: TestedArg,
		readonly value: Tested,
	) { }
}
export class TestedCall {
	readonly sign = SignTested.Call;
	constructor(
		readonly caller: Tested,
		readonly arg: Tested,
	) { }
}
export class TestedArg {
	readonly sign = SignTested.Arg;
	constructor(
		readonly id: number,
	) { }
}
export class TestedConst {
	readonly sign = SignTested.Const;
	constructor(
		readonly inner: number,
	) { }
}

/**getLambda */
export function gl(lambda: Lambda): Lambda {
	return lambda;
}

function getCatcher(
	argThis: number,
	argTotal: { id: number },
	testTag: Tested = new TestedArg(argThis),
): Lambda {
	const catcher: Lambda = (n: Lambda) => getCatcher(
		argThis,
		argTotal,
		new TestedCall(
			catcher.testTag!,
			n.testTag ?? test(n, argTotal),
		),
	);
	catcher.testTag = testTag;
	return catcher;
}
export function test(lambda: Lambda, argTotal = { id: 1 }): Tested {
	lambda = solve(lambda);
	return lambda.testTag ?? new TestedFunc(
		new TestedArg(argTotal.id),
		test(lambda(getCatcher(argTotal.id++, argTotal)), argTotal),
	);
}

export * from './formatters';

function getRecursion(lastRecursing: () => Lambda): Lambda {
	return n => {
		let recursing: () => Lambda;
		if (recursionConfig.boldlyReceiving) {
			const recursed = lastRecursing();
			recursing = () => recursed(n);
		} else {
			recursing = () => lastRecursing()(n);
		}
		const t0: Lambda = getRecursion(recursing);
		t0.recursing = recursing;
		return t0;
	};
}
/**Y Combinator */
export const yC = gl(p => {
	const n: Lambda = f => p(getRecursion(() => f(f)));
	return n(n);
});
export const recursionConfig = {
	/**递归次数限制，超过就被认为是死循环 */
	max: 999999,
	/**实验性，如果为 true ，递归函数的最大参数数量不受栈空间影响 */
	boldlyReceiving: false,
};
export function solve(n: Lambda): Lambda {
	let i = 0;
	while (n.recursing) {
		n = n.recursing();
		if (i++ > recursionConfig.max) throw Error('Endless Recursion');
	}
	return n;
}

/**free identifier */
export const fI = Array(999)
	.fill(0)
	.map((_, inner) => {
		const t: Lambda = n => n;
		t.testTag = new TestedConst(inner);
		return t;
	});

