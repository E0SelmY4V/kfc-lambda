# 用 JS 来搞 Lambda 演算

JS 可以模拟 Lambda 演算，比如这样：


```js
const bTrue = x => _ => x;
const bFalse = _ => y => y;
const not = a => a(bFalse)(bTrue);

const a = not(bTrue); // 怎么能验证 a 是 _ => y => y ？

const n0 = f => x => x;
const n1 = f => x => f(x);
const n3 = f => x => f(f(f(x)));
const plus = a => b => f => x => a(f)(b(f)(x));
const multi = a => b => a(plus(b))(n0)
const pred = n => f => x => n(p => h => h(p(f)))(_ => x)(n => n0);
const is0 = n => n(_ => bFalse)(bTrue);

const temp = multi(n3) // 怎么能把这个结果转换为 Lambda 表达式？

const yCombinaton = p => (
    s => p(s(s))
)(
    s => p(s(s))
);
const factorial = yCombinaton (
	s => n => isZero(n)(
		n1
	)(
		multi(n)(s(pred(n)))
	)
);
const n6 = factorial(n3); // JS 是急切求值，怎么防止这段代码爆栈？
```

你可以看出来，这种模拟虽然能利用 JS 实现对 Lambda 表达式使用 beta 规约，但是会出现各种各样难以使用的问题。

如果你想要解决这些个问题，就请使用《用 JS 来搞 Lambda 演算》库吧！

## 方便定义 Lambda 函数

如果你使用的是 TypeScript ，那你随手一写的 Lambda 函数 `n => n` 会有警告：因为 `n` 是隐式的 `any` 类型，对吗？

但是，本库提供了一个类型 `Lambda` 和一个函数 `gl` 。
只要你声明了一个 Lambda 函数是 `Lambda` ，那不论它多复杂，都不会报错了！

```ts
import { Lambda, gl } from 'lambda-calculus-with-js';

const plus: Lambda = a => b => f => x => a(f)(b(f)(x));
const pred = gl(n => f => x => n(p => h => h(p(f)))(_ => x)(n => n0));
```

这两种方法都可以。

## 直观输出 Lambda 函数

不论你的 Lambda 函数写得有多么精妙，直接通过 `console.log` 输出，总是会得到 `[Function (anonymous)]` 这个恼人的字符串……想要知道它的内部结构需要多么费心费力啊！

但是如果你用了这个库，它提供了一个 `log` 函数和其他设施，你不仅可以看懂一个 Lmabda 表达式的内部，还可以用各种不同的格式看懂！

```ts
import { log, Log, Lambda } from 'lambda-calculus-with-js';

const plus: Lambda = a => b => f => x => a(f)(b(f)(x));
const n2: Lambda = f => x => f(f(x));

const a = plus(n2);

log(a, Log.Js);
// p1 => p2 => p3 => p2(p2(p1(p2)(p3)))

log(a, Log.Std);
// λp1.λp2.λp3.(p2 (p2 ((p1 p2) p3)))
```

## 惰性求值的 Y 组合子

JS 本质上是一个急切求值的语言，所以普通的 Y 组合子不能用，我们只能用 Z 组合子……？

没关系！
只要你使用本库，就可以获得一个叫 `yC` 的惰性求值 Y 组合子！

唯一的注意事项是不要有死循环，也就是说递归必须能在某个时候退出。
否则的话求值的过程是无限长的，就算是惰性求值也没法用 `log` 得知其内部了。

顺便一提 `yC` 自己也算死循环，不要直接 `log(yC)` 。

```ts
import { log, yC, Lambda } from 'lambda-calculus-with-js'

const plus: Lambda = a => b => f => x => a(f)(b(f)(x));
const multi: Lambda = a => b => a(plus(b))(n0);
const isZero: Lambda = n => n(_ => _ => y => y)(x => _ => x);
const factorial = yC(
	s => n => isZero(n)(
		n1
	)(
		multi(n)(s(pred(n)))
	)
);
const n4: Lambda = f => x => f(f(f(f(x))));
const n24 = factorial(n4);

log(n24);
// p1 => p2 => p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p1(p2))))))))))))))))))))))))
```

