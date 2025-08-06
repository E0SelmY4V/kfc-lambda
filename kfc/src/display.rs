use std::collections::HashMap;

use crate::*;

fn to_kfc_impl(refed_kfc: RefedKfc, table: &mut HashMap<usize, usize>, depth: usize) -> String {
    match &*(*refed_kfc).borrow() {
        Kfc::Call(caller, arg) => format!("C{}{}", to_kfc_impl(caller.clone(), table, depth), to_kfc_impl(arg.clone(), table, depth)),
        Kfc::Func(arg, expr) => {
            if let Kfc::Value(num) = *(**arg).borrow() {
                table.insert(num, depth);
                format!("F{}", to_kfc_impl(expr.clone(), table, depth + 1))
            } else {
                panic!("func's arg is not arg")
            }
        }
        Kfc::Value(num) => "K".repeat(depth - table.get(num).expect("Not registered arg")) + "F",
    }
}
pub fn to_kfc(refed_kfc: RefedKfc) -> String {
    to_kfc_impl(refed_kfc, &mut HashMap::new(), 0)
}

pub trait Displayer {
    fn call(caller: String, arg: String) -> String;
    fn func(arg: String, expr: String) -> String;
    fn value(num: usize) -> String;
}
pub fn display<T: Displayer>(refed_kfc: RefedKfc) -> String {
    match &*(*refed_kfc).borrow() {
        Kfc::Call(caller, arg) => T::call(display::<T>(caller.clone()), display::<T>(arg.clone())),
        Kfc::Func(arg, expr) => T::func(display::<T>(arg.clone()), display::<T>(expr.clone())),
        Kfc::Value(num) => T::value(*num),
    }
}
macro_rules! dis_nt {
    (
        $struct: ident,
        $fn: ident,
        $call: expr, 
        $func: expr,
        $value: expr,
    ) => {
        struct $struct {}
        impl Displayer for $struct {
            fn call(caller: String, arg: String) -> String {
                $call(caller, arg)
            }
            fn func(arg: String, expr: String) -> String {
                $func(arg, expr)
            }
            fn value(num: usize) -> String {
                $value(num)
            }
        }
        pub fn $fn(refed_kfc: RefedKfc) -> String {
            display::<$struct>(refed_kfc)
        }
    };
}

dis_nt!(
    ToLambda, to_lambda,
    |caller, arg| format!("({caller} {arg})"),
    |arg, expr| format!("λ{arg}.{expr}"),
    |num| format!("p{num}"),
);
dis_nt!(
    ToExable, to_exable,
    |caller, arg| format!("(({caller}) ({arg}))"),
    |arg, expr| format!("λ{arg}.{expr}"),
    |num| format!("p{num}"),
);
dis_nt!(
    ToJs, to_js,
    |caller, arg| format!("({caller})({arg})"),
    |arg, expr| format!("{arg} => {expr}"),
    |num| format!("p{num}"),
);
