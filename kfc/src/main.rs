use display::{to_exable, to_js, to_kfc, to_lambda};
use kfc_lambda::*;
use parser::{build_kfc, tokenize, KfcToken};

pub fn main() {
    let kfc = || build_kfc(&vec![
        KfcToken::Call,
        KfcToken::Call,
        KfcToken::Call,
        KfcToken::Call,
        KfcToken::Func,
        KfcToken::Arg(1),
        KfcToken::Func,
        KfcToken::Arg(1),
        KfcToken::Func,
        KfcToken::Arg(1),
        KfcToken::Func,
        KfcToken::Arg(1),
        KfcToken::Func,
        KfcToken::Arg(1),
    ]);
    let a = [
        kfc(),
        apply(kfc()).0,
    ];
    for i in a {
        println!("{}", to_js(i));
    }
}
