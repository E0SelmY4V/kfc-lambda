export interface Lambda {
	(x: Lambda): Lambda;
	testTag?: Tested;
	recursing?: () => Lambda;
}

type FormatterMap<T, A extends any[]> = {
	[I in SignTested]: (this: FormatterMap<T, A>, tested: Tested & { sign: I }, ...args: A) => T;
};
export class Formatter<T, A extends any[] = []> {
	protected readonly map: FormatterMap<T, A>;
	protected readonly chose = (tested: Tested, ...args: A) => this.map[tested.sign](tested as any, ...args);
	constructor(
		mapFn: (chose: (tested: Tested, ...args: A) => T) => FormatterMap<T, A>,
		protected readonly initer: () => A,
	) {
		this.map = mapFn(this.chose);
	}
	format(this: this, tested: Tested) {
		return this.chose(tested, ...this.initer());
	}
}

export const rebuilder = new Formatter<Lambda, [ids: Record<number, Lambda>]>(chose => ({
	func: ({ value, arg: { id } }, ids) => n => chose(value, { ...ids, [id]: n }),
	call: ({ caller, arg }, ids) => chose(caller, ids)(chose(arg, ids)),
	arg: ({ id }, ids) => ids[id],
	const: ({ inner }) => fI[inner],
}), () => [{}]);

export const jsifier = new Formatter<string>(chose => ({
	func({ arg, value }) {
		return `${this.arg(arg)} => ${chose(value)}`;
	},
	call({ caller, arg }) {
		let callerStr = chose(caller);
		if (caller instanceof TestedFunc) callerStr = `(${callerStr})`;
		return `${callerStr}(${chose(arg)})`;
	},
	arg: ({ id }) => `p${id}`,
	const: ({ inner }) => `fI[${inner}]`,
}), () => []);

export const [lambdaifier, stdLambdaifier] = [false, true].map(std => new Formatter<string>(chose => ({
	func({ arg, value }) {
		return `λ${this.arg(arg)}.${chose(value)}`;
	},
	call({ caller, arg }) {
		const callerStr = chose(caller);
		const argStr = chose(arg);
		return std ? `(${callerStr} ${argStr})` : `((${callerStr}) (${argStr}))`;
	},
	arg: ({ id }) => `p${id}`,
	const: ({ inner }) => inner.toString(),
}), () => []));

interface Indenter {
	(context: string): string;
	next(): Indenter;
}
function getIndenter(indented = 0): Indenter {
	const space = '| '.repeat(indented);
	const indenter = (context: string) => `${space}${context}\n`;
	indenter.next = () => getIndenter(indented + 1);
	return indenter;
}
export const [kfcifier, numKfcifier] = [false, true].map(num => new Formatter<string, [
	indenter: Indenter,
	table: Record<number, number>,
	depth: number,
]>(chose => ({
	func: ({ value, arg: { id } }, indenter, table, depth) => [
		num ? indenter('func') : 'F',
		chose(value, indenter.next(), { ...table, [id]: depth }, depth + 1),
	].join(''),
	call: ({ caller, arg }, indenter, table, depth) => [
		num ? indenter('call') : 'C',
		chose(caller, indenter.next(), table, depth),
		chose(arg, indenter.next(), table, depth),
	].join(''),
	arg({ id }, indenter, table, depth) {
		const argDepth = depth - table[id];
		return num
			? indenter(argDepth.toString())
			: 'K'.repeat(argDepth) + 'F';
	},
	const: ({ inner }, indenter) => (num
		? indenter(inner.toString())
		: inner.toString()
	),
}), () => [getIndenter(), {}, 0]));

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

export function log(n: Lambda, formatter: Formatter<any, any[]> = jsifier) {
	console.log(formatter.format(test(n)));
}

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

