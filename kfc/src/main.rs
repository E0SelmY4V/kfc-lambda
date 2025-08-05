use kfc_lambda::*;
use parser::{build_kfc, tokenize, KfcToken};

pub fn main() {
    let kfc = build_kfc(&vec![
        KfcToken::Call,
        KfcToken::Func,
        KfcToken::Func,
        KfcToken::Call,
        KfcToken::Arg(2),
        KfcToken::Call,
        KfcToken::Arg(2),
        KfcToken::Call,
        KfcToken::Arg(2),
        KfcToken::Arg(1),
        KfcToken::Func,
        KfcToken::Arg(1),
    ]);
    print!("{:#?}", apply(kfc));
}
