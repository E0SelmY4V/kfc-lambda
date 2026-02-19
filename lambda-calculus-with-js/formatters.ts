import {
	fI,
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
