use crate::*;

#[derive(Clone, Copy, Debug)]
pub enum KfcToken {
    Call,
    Func,
    Arg(usize),
}

fn build_kfc_impl(
    tokens: &[KfcToken],
    funcs: &mut Vec<Option<RefedKfc>>,
    id_total: &mut usize,
) -> (RefedKfc, usize) {
    if let Some(&token) = tokens.first() {
        match token {
            KfcToken::Call => {
                funcs.push(None);
                let (caller, len_caller) = build_kfc_impl(&tokens[1..], funcs, id_total);
                let (arg, len_arg) = build_kfc_impl(&tokens[1 + len_caller..], funcs, id_total);
                (
                    new_refed_kfc(Kfc::Call(caller, arg)),
                    len_arg + len_caller + 1,
                )
            }
            KfcToken::Func => {
                let arg = new_refed_kfc(Kfc::Value(*id_total));
                *id_total += 1;
                funcs.push(Some(arg.clone()));
                let (expr, len) = build_kfc_impl(&tokens[1..], funcs, id_total);
                (new_refed_kfc(Kfc::Func(arg, expr)), len + 1)
            }
            KfcToken::Arg(num) => {
                let arg = funcs
                    .iter()
                    .filter(|x| x.is_some())
                    .rev()
                    .nth(num - 1)
                    .expect(&format!("No fn {num}"))
                    .as_ref()
                    .unwrap()
                    .clone();
                while let Some(Some(_)) = funcs.pop() {}
                (arg, 1)
            }
        }
    } else {
        panic!("No more syntax")
    }
}
pub fn build_kfc(tokens: &[KfcToken]) -> RefedKfc {
    build_kfc_impl(tokens, &mut Vec::new(), &mut 1).0
}

pub fn tokenize(code: &str) -> Vec<KfcToken> {
    let mut tokens = Vec::new();
    let mut num: usize = 0;
    for c in code.chars() {
        match c {
            'F' | 'f' => {
                if num != 0 {
                    tokens.push(KfcToken::Arg(num));
                    num = 0;
                } else {
                    tokens.push(KfcToken::Func);
                }
            }
            'C' | 'c' => tokens.push(KfcToken::Call),
            'K' | 'k' => {
                num += 1;
            }
            _ => panic!("Wrong Token"),
        }
    }
    tokens
}
