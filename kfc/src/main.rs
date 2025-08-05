use kfc_lambda::*;

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
    // print!("{:#?}", kfc);
    print!("{:#?}", apply(kfc));
}
