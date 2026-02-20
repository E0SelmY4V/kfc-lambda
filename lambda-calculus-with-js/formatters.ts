/**
 * Lambda 表达式格式化相关
 * @license GPL-2.0-or-later
 * @author E0SelmY4V
 */
declare module './formatters';

import { toBb26 } from 'bb26';
import {
	Lambda,
	SignTested,
	test,
	Tested,
	TestedFunc,
} from '.';

/**格式化器的格式化函数 */
export type FormatterMap<T, A extends any[]> = {
	[I in SignTested]: (this: FormatterMap<T, A>, tested: Tested & { sign: I }, ...args: A) => T;
};
/**
 * 格式化器
 * @template T 格式化后的类型
 * @template A 格式化函数需要的额外参数
 */
export class Formatter<T, A extends any[] = []> {
	/**各个结构的格式化函数 */
	protected readonly map: FormatterMap<T, A>;
	/**可以自动判断结构的格式化函数 */
	protected readonly chose = (tested: Tested, ...args: A) => this.map[tested.sign](tested as any, ...args);
	/**
	 * @param mapFn 各个结构的格式化函数，第一个参数是可以自动判断结构的格式化函数
	 * @param initer 额外参数的初始化器
	 */
	constructor(
		mapFn: (chose: (tested: Tested, ...args: A) => T) => FormatterMap<T, A>,
		protected readonly initer: () => A,
	) {
		this.map = mapFn(this.chose);
	}
	/**进行格式化 */
	format(this: this, lambda: Tested | Lambda) {
		return this.chose('sign' in lambda ? lambda : test(lambda), ...this.initer());
	}
	/**输出格式化后的东西 */
	log(this: this, lambda: Tested | Lambda) {
		console.log(this.format(lambda));
	}
}

/**
 * 方便地把符号在符号表里的索引转化成 A-Z 或者 a-z 字母
 * @param id 符号
 * @param ids 符号表
 * @param isCon 是否是自由标识符
 * @returns 字母，自由标识符大写，普通参数小写
 */
export function chr(id: symbol, ids: symbol[], isCon: boolean) {
	if (isCon && !ids.includes(id)) ids.push(id);
	const chr = toBb26(ids.indexOf(id) + 1);
	return isCon ? chr : chr.toLowerCase();
}

/**把已知结构的 Lambda 表达式重新变回 Lambda 表达式 */
export const rebuilder = new Formatter<Lambda, [ids: Record<symbol, Lambda>]>(chose => ({
	func: ({ value, arg: { id } }, ids) => n => chose(value, { ...ids, [id]: n }),
	call: ({ caller, arg }, ids) => chose(caller, ids)(chose(arg, ids)),
	arg: ({ id }, ids) => ids[id],
	const: con => con.rebuild(),
}), () => [{}]);

class Symbols {
	readonly ids: symbol[] = [];
	readonly cons: symbol[] = [];
}

/**输出为 js 的 Lambda 表达式 */
export const jsifier = new Formatter<string, [symbols: Symbols]>(chose => ({
	func({ arg, value }, symbols) {
		symbols.ids.push(arg.id);
		return `${this.arg(arg, symbols)} => ${chose(value, symbols)}`;
	},
	call({ caller, arg }, symbols) {
		let callerStr = chose(caller, symbols);
		if (caller instanceof TestedFunc) callerStr = `(${callerStr})`;
		return `${callerStr}(${chose(arg, symbols)})`;
	},
	arg: ({ id }, { ids }) => chr(id, ids, false),
	const: ({ inner }, { cons }) => chr(inner, cons, true),
}), () => [new Symbols()]);

const [lambdaifier, stdLambdaifier] = [false, true].map(std => new Formatter<string, [symbols: Symbols]>(chose => ({
	func({ arg, value }, symbols) {
		symbols.ids.push(arg.id);
		return `λ${this.arg(arg, symbols)}.${chose(value, symbols)}`;
	},
	call({ caller, arg }, symbols) {
		const callerStr = chose(caller, symbols);
		const argStr = chose(arg, symbols);
		return std ? `(${callerStr} ${argStr})` : `((${callerStr}) (${argStr}))`;
	},
	arg: ({ id }, { ids }) => chr(id, ids, false),
	const: ({ inner }, { cons }) => chr(inner, cons, true),
}), () => [new Symbols()]));

/**缩进器 */
interface Indenter {
	/**
	 * @param context 要被缩进的文本
	 * @returns 缩进后的文本
	 */
	(context: string): string;
	/**提升一个缩进等级 */
	next(): Indenter;
}
/**
 * 获得缩进器
 * @param indented 初始缩进等级
 */
function getIndenter(indented = 0): Indenter {
	const space = '| '.repeat(indented);
	const indenter = (context: string) => `${space}${context}\n`;
	indenter.next = () => getIndenter(indented + 1);
	return indenter;
}
const [kfcifier, numKfcifier] = [false, true].map(num => new Formatter<string, [
	indenter: Indenter,
	symbols: { ids: Record<symbol, number>; cons: symbol[] },
	depth: number,
]>(chose => ({
	func: ({ value, arg: { id } }, indenter, { ids, cons }, depth) => [
		num ? indenter('func') : 'F',
		chose(value, indenter.next(), { ids: { ...ids, [id]: depth }, cons }, depth + 1),
	].join(''),
	call: ({ caller, arg }, indenter, symbols, depth) => [
		num ? indenter('call') : 'C',
		chose(caller, indenter.next(), symbols, depth),
		chose(arg, indenter.next(), symbols, depth),
	].join(''),
	arg({ id }, indenter, { ids }, depth) {
		const argDepth = depth - ids[id];
		return num
			? indenter(argDepth.toString())
			: 'K'.repeat(argDepth) + 'F';
	},
	const: ({ inner }, indenter, { cons }) => (num
		? indenter
		: (n: string) => n
	)(chr(inner, cons, true)),
}), () => [getIndenter(), { ids: {}, cons: [] }, 0]));

export {
	/**以 KFC 语言形式格式化 */
	kfcifier,
	/**以大部分网站能执行的 Lambda 演算形式格式化 */
	lambdaifier,
	/**以更易读的 KFC 语言形式格式化 */
	numKfcifier,
	/**以标准 Lambda 演算的形式格式化 */
	stdLambdaifier,
};

