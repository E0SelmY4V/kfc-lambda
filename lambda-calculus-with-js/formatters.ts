import { toBb26 } from 'bb26';
import {
	Lambda,
	SignTested,
	test,
	Tested,
	TestedFunc,
} from '.';

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
	format(this: this, lambda: Tested | Lambda) {
		return this.chose('sign' in lambda ? lambda : test(lambda), ...this.initer());
	}
	log(this: this, lambda: Tested | Lambda) {
		console.log(this.format(lambda));
	}
}

export function chr(id: symbol, ids: symbol[], isCon: boolean) {
	if (isCon && !ids.includes(id)) ids.push(id);
	const chr = toBb26(ids.indexOf(id) + 1);
	return isCon ? chr : chr.toLowerCase();
}

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

export const [lambdaifier, stdLambdaifier] = [false, true].map(std => new Formatter<string, [symbols: Symbols]>(chose => ({
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
