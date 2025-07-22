export interface Lambda {
	(x: Lambda): Lambda;
	testTag?: Tested;
	then?: () => Lambda;
}

export type Tested
	= TestedFunc
	| TestedCall
	| TestedArg
	| TestedConst
	;
enum TestedType {
	Call,
	Func,
	Arg,
	Const,
}
interface TestedFunc {
	readonly type: TestedType.Func;
	readonly arg: TestedArg;
	readonly value: Tested;
}
interface TestedCall {
	readonly type: TestedType.Call;
	readonly arg: Tested;
	readonly caller: Tested;
}
interface TestedArg {
	readonly type: TestedType.Arg;
	readonly id: number;
}
interface TestedConst {
	readonly type: TestedType.Const;
	readonly inner: number;
}

/**getLambda */
export function gl(lambda: Lambda): Lambda {
	return lambda;
}

function testWrapArg(numNow: number): TestedArg {
	return {type: TestedType.Arg, id: numNow};
}
function getCatcher(
	argThis: number,
	argTotal: {n: number},
	testTag: Tested = testWrapArg(argThis),
): Lambda {
	const catcher: Lambda = (n: Lambda) => getCatcher(
		argThis,
		argTotal,
		{
			type: TestedType.Call,
			caller: catcher.testTag!,
			arg: n.testTag ? n.testTag : test(n, argTotal),
		},
	);
	catcher.testTag = testTag;
	return catcher;
}
export function test(lambda: Lambda, argTotal = {n: 1}): Tested {
	return lambda.testTag || {
		type: TestedType.Func,
		arg: testWrapArg(argTotal.n),
		value: test(lambda(getCatcher(argTotal.n++, argTotal)), argTotal),
	};
}

export function testedToJs(tested: Tested) {
	switch (tested.type) {
		case TestedType.Call:
			let caller = testedToJs(tested.caller);
			if (tested.caller.type === TestedType.Func) caller = `(${caller})`;
			return `${caller}(${testedToJs(tested.arg)})`;
		case TestedType.Func:
			return `p${tested.arg.id} => ${testedToJs(tested.value)}`;
		case TestedType.Arg:
			return `p${tested.id}`;
		case TestedType.Const:
			return `tl[${tested.inner}]`;
	}
}
export function testedToLambda(tested: Tested, std: boolean) {
	switch (tested.type) {
		case TestedType.Call:
			const [caller, arg] = [tested.caller, tested.arg].map(n => testedToLambda(n, std));
			return std ? `(${caller} ${arg})` : `((${caller}) (${arg}))`;
		case TestedType.Func:
			return `λp${tested.arg.id}.${testedToLambda(tested.value, std)}`;
		case TestedType.Arg:
			return `p${tested.id}`;
		case TestedType.Const:
			return tested.inner;
	}
}
export function testJs(lambda: Lambda) {
	return testedToJs(test(solve(lambda)));
}
export function testLambda(lambda: Lambda, std: boolean) {
	return testedToLambda(test(solve(lambda)), std);
}
export enum Log {
	Std,
	Js,
	Exable,
}
export function log(n: Lambda, level: Log = Log.Js) {
	switch (level) {
		case Log.Exable:
			console.log(testLambda(n, false));
			break;
		case Log.Js:
			console.log(testJs(n));
			break;
		case Log.Std:
			console.log(testLambda(n, true));
			break;
	}
}

export function lambdaEq(a: Lambda, b: Lambda) {
	return testJs(a) === testJs(b);
}

function getThenable(lastThen: () => Lambda): Lambda {
	return n => {
		const then = () => lastThen()(n);
		const t0: Lambda = getThenable(then);
		t0.then = then;
		return t0;
	}
}
export const yC = gl(p => {
	const yCed: Lambda = f => p(getThenable(() => f(f)));
	return yCed(yCed);
});
export function solve(n: Lambda): Lambda {
	while (n.then) n = n.then();
	return n;
}

export const tl = Array(999)
	.fill(0)
	.map((_, inner) => {
		return {testTag: {type: TestedType.Const, inner}} as Lambda
	});

