export interface Lambda {
	(x: Lambda): Lambda;
	testTag?: Tested;
	then?: () => Lambda;
}

export abstract class Tested {
	abstract toJs(): string;
	abstract toLambda(std: boolean): string;
}
export class TestedFunc extends Tested {
	constructor(
		readonly arg: TestedArg,
		readonly value: Tested,
	) {super();}
	toJs(this: this): string {
		return `p${this.arg.id} => ${this.value.toJs()}`;
	}
	toLambda(this: this, std: boolean): string {
		return `λp${this.arg.id}.${this.value.toLambda(std)}`;
	}
}
export class TestedCall extends Tested {
	constructor(
		readonly arg: Tested,
		readonly caller: Tested,
	) {super();}
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
}
export class TestedArg extends Tested {
	constructor(
		readonly id: number,
	) {super();}
	toJs(this: this): string {
		return `p${this.id}`;
	}
	toLambda(this: this, _: boolean): string {
		return `p${this.id}`;
	}
}
export class TestedConst extends Tested {
	constructor(
		readonly inner: number,
	) {super();}
	toJs(this: this): string {
		return `tl[${this.inner}]`;
	}
	toLambda(this: this, _: boolean): string {
		return this.inner.toString();
	}
}

/**getLambda */
export function gl(lambda: Lambda): Lambda {
	return lambda;
}

function getCatcher(
	argThis: number,
	argTotal: {n: number},
	testTag: Tested = new TestedArg(argThis),
): Lambda {
	const catcher: Lambda = (n: Lambda) => getCatcher(
		argThis,
		argTotal,
		new TestedCall(
			n.testTag ? n.testTag : test(n, argTotal),
			catcher.testTag!,
		),
	);
	catcher.testTag = testTag;
	return catcher;
}
export function test(lambda: Lambda, argTotal = {n: 1}): Tested {
	return lambda.testTag || new TestedFunc(
		new TestedArg(argTotal.n),
		test(solve(lambda)(getCatcher(argTotal.n++, argTotal)), argTotal),
	);
}

export enum Log {
	Std = 0,
	Js,
	Exable,
}
export function log(n: Lambda, level: Log = Log.Js) {
	const tested = test(n);
	console.log([
		() => tested.toLambda(true),
		() => tested.toJs(),
		() => tested.toLambda(false),
	][level]());
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
		const t: Lambda = n => n;
		t.testTag = new TestedConst(inner)
		return t;
	});

