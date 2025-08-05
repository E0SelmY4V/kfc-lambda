export interface Lambda {
	(x: Lambda): Lambda;
	testTag?: Tested;
	recursing?: () => Lambda;
}

type StrArr = string | StrArr[];
export abstract class Tested {
	abstract rebuild(this: this, ids?: Record<number, Lambda>): Lambda;
	abstract toJs(this: this): string;
	abstract toLambda(this: this, std: boolean): string;
	abstract kfcify(
		this: this,
		num: boolean,
		indenter: Indenter,
		table: Record<number, number>,
		depth: number,
	): StrArr;
	toKfc(this: this, num: boolean): string {
		const arr: string[] = [this.kfcify(num, getIndenter(), {}, 0) as any].flat(Infinity);
		return arr.join('');
	}
}
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
export class TestedFunc extends Tested {
	constructor(
		readonly arg: TestedArg,
		readonly value: Tested,
	) { super(); }
	rebuild(this: this, ids: Record<number, Lambda> = {}): Lambda {
		return n => this.value.rebuild({ ...ids, [this.arg.id]: n });
	}
	toJs(this: this): string {
		return `p${this.arg.id} => ${this.value.toJs()}`;
	}
	toLambda(this: this, std: boolean): string {
		return `λp${this.arg.id}.${this.value.toLambda(std)}`;
	}
	kfcify(
		this: this,
		num: boolean,
		indenter: Indenter,
		table: Record<number, number>,
		depth: number,
	): StrArr {
		return [
			num ? indenter('func') : 'F',
			this.value.kfcify(num, indenter.next(), { ...table, [this.arg.id]: depth }, depth + 1),
		];
	}
}
export class TestedCall extends Tested {
	constructor(
		readonly caller: Tested,
		readonly arg: Tested,
	) { super(); }
	rebuild(ids: Record<number, Lambda> = {}): Lambda {
		return this.caller.rebuild(ids)(this.arg.rebuild(ids));
	}
	toJs(this: this): string {
		let caller = this.caller.toJs();
		if (this.caller instanceof TestedFunc) caller = `(${caller})`;
		return `${caller}(${this.arg.toJs()})`;
	}
	toLambda(this: this, std: boolean): string {
		const caller = this.caller.toLambda(std);
		const arg = this.arg.toLambda(std);
		return std ? `(${caller} ${arg})` : `((${caller}) (${arg}))`;
	}
	kfcify(
		this: this,
		num: boolean,
		indenter = getIndenter(),
		table: Record<number, number> = {},
		depth = 0,
	): StrArr {
		return [
			num ? indenter('call') : 'C',
			this.caller.kfcify(num, indenter.next(), table, depth),
			this.arg.kfcify(num, indenter.next(), table, depth),
		];
	}
}
export class TestedArg extends Tested {
	constructor(
		readonly id: number,
	) { super(); }
	rebuild(ids: Record<number, Lambda> = {}): Lambda {
		return ids[this.id];
	}
	toJs(this: this): string {
		return `p${this.id}`;
	}
	toLambda(this: this, _: boolean): string {
		return `p${this.id}`;
	}
	kfcify(
		this: this,
		num: boolean,
		indenter = getIndenter(),
		table: Record<number, number> = {},
		depth = 0,
	): StrArr {
		const argDepth = depth - table[this.id];
		return num
			? indenter(argDepth.toString())
			: 'K'.repeat(argDepth) + 'F';
	}
}
export class TestedConst extends Tested {
	constructor(
		readonly inner: number,
	) { super(); }
	rebuild(_?: Record<number, Lambda>): Lambda {
		return fI[this.inner];
	}
	toJs(this: this): string {
		return `fI[${this.inner}]`;
	}
	toLambda(this: this, _: boolean): string {
		return this.inner.toString();
	}
	kfcify(this: this, num: boolean, indenter = getIndenter()): StrArr {
		return num
			? indenter(this.inner.toString())
			: this.inner.toString();
	}
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

export enum Log {
	/**普通 Lambda 表达式 */
	Std = 0,
	/**JavaScript 代码 */
	Js,
	/**大部分 Lambda 演算网站可以正确识别的形式 */
	Exable,
	/**KFC 语言 */
	Kfc,
	/**使用数字的易懂的 KFC 语言 */
	KfcNum,
}
const logMap: readonly ((t: Tested) => string)[] = [
	t => t.toLambda(true),
	t => t.toJs(),
	t => t.toLambda(false),
	t => t.toKfc(false),
	t => t.toKfc(true),
];
export function log(n: Lambda, level: Log = Log.Js) {
	console.log(logMap[level](test(n)));
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

