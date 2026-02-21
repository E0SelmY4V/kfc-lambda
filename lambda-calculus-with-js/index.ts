/**
 * 用 JS 来搞 Lambda 演算
 * @license GPL-2.0-or-later
 * @author E0SelmY4V
 */
declare module '.';

/**Lambda 表达式的类型 */
export interface Lambda {
	(x: Lambda): Lambda;
	/**此表达式的内部结构 */
	testTag?: Tested;
	/**此表达式当前的惰性求值函数 */
	recursing?: () => Lambda;
}

/**Lambda 结构的类型 */
export const enum SignTested {
	Func = 'func',
	Arg = 'arg',
	Call = 'call',
	Const = 'const',
}
/**Lambda 结构 */
export type Tested
	= TestedArg
	| TestedCall
	| TestedFunc
	| TestedConst;
/**函数定义结构 */
export class TestedFunc {
	/**结构类型 */
	readonly sign = SignTested.Func;
	/**参数 */
	readonly arg = new TestedArg();
	/**值表达式 */
	readonly value: Tested;
	/**@param lambda 待探明结构的 Lambda 函数 */
	constructor(lambda: Lambda) {
		this.value = test(lambda(getCatcher(this.arg)));
	}
	equal(n: Tested, ids: Record<symbol, symbol> = {}): boolean {
		if (n.sign !== this.sign) return false;
		ids[this.arg.id] = n.arg.id;
		return this.value.equal(n.value, ids);
	}
}
/**调用结构 */
export class TestedCall {
	/**结构类型 */
	readonly sign = SignTested.Call;
	/**
	 * @param caller 被调用的函数
	 * @param arg 用来调用的参数
	 */
	constructor(
		readonly caller: Tested,
		readonly arg: Tested,
	) { }
	equal(n: Tested, ids: Record<symbol, symbol> = {}): boolean {
		if (n.sign !== this.sign) return false;
		return this.caller.equal(n.caller, ids) && this.arg.equal(n.arg, ids);
	}
}
/**函数参数结构 */
export class TestedArg {
	/**结构类型 */
	readonly sign = SignTested.Arg;
	/**参数的标志 */
	readonly id = Symbol('some arg');
	equal(n: Tested, ids: Record<symbol, symbol> = {}): boolean {
		if (n.sign !== this.sign) return false;
		return ids[this.id] === n.id;
	}
}
/**自由标识符结构 */
export class TestedConst {
	/**结构类型 */
	readonly sign = SignTested.Const;
	/**自由标识符的标志 */
	readonly inner = Symbol('free identifier');
	/**再得到自己对应的 Lambda 表达式 */
	rebuild() {
		return getCatcher(this);
	}
	equal(n: Tested): boolean {
		if (n.sign !== this.sign) return false;
		return this.inner === n.inner;
	}
}

/**getLambda */
export function gl(lambda: Lambda): Lambda {
	return lambda;
}

/**
 * 获得调用探针
 * @param testTag 被调用者的结构
 * @returns 探针
 */
function getCatcher(testTag: Tested): Lambda {
	const catcher: Lambda = (n: Lambda) => getCatcher(
		new TestedCall(
			testTag,
			n.testTag ?? test(n),
		),
	);
	catcher.testTag = testTag;
	return catcher;
}
/**
 * 探明表达式的结构
 * @param lambda 未知 Lambda 表达式
 * @returns 探明得到的结构
 */
export function test(lambda: Lambda): Tested {
	lambda = solve(lambda);
	return lambda.testTag ?? new TestedFunc(lambda);
}

export * from './formatters';

/**
 * 得到一个惰性表达式
 * @param lastRecursing 要被惰性执行的函数
 * @returns 可以继续接受参数且不会立马求值的 Lambda 函数
 */
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
/**
 * Y 组合子
 *
 * 若传递给它一个函数作为参数，那这个函数的第一个参数总会是这个函数自己
 *
 * 惰性求值，用来实现递归
 */
export const yC = gl(p => {
	const n: Lambda = f => p(getRecursion(() => f(f)));
	return n(n);
});
/**递归配置 */
export const recursionConfig = {
	/**递归次数限制，超过就被认为是死循环 */
	max: 999999,
	/**实验性，如果为 true ，递归函数的最大参数数量不受栈空间影响 */
	boldlyReceiving: false,
};
/**
 * 对惰性函数求值，直到不再是惰性函数
 * @param n 惰性函数
 * @returns 作为求值结果的表达式
 */
export function solve(n: Lambda): Lambda {
	let i = 0;
	while (n.recursing) {
		n = n.recursing();
		if (i++ > recursionConfig.max) throw Error('Endless Recursion');
	}
	return n;
}

/**获得一个自由标识符 */
export function getFreeIdent() {
	return new TestedConst().rebuild();
}
/**获得无限个自由标识符 */
export function *getFreeIdents() {
	while (true) {
		yield getFreeIdent();
	}
}

