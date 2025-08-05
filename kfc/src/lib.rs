use std::{cell::RefCell, rc::Rc};

#[derive(Debug)]
pub enum Kfc {
    Call(RefedKfc, RefedKfc),
    Func(RefedKfc, RefedKfc),
    Value(usize),
}
type RefedKfc = Rc<RefCell<Rc<Kfc>>>;

pub fn apply(refed_kfc: RefedKfc) -> RefedKfc {
    if let Kfc::Call(caller, arg) = &**refed_kfc.borrow() {
        if let Kfc::Func(values, expr) = &**caller.borrow() {
            values.replace(Rc::clone(&arg.borrow()));
            return Rc::new(RefCell::new(Rc::clone(&expr.borrow())));
        }
    }
    refed_kfc
}

#[derive(Clone, Copy, Debug)]
pub enum KfcToken {
    Call,
    Func,
    Arg(usize),
}
fn new_refed_kfc(kfc: Kfc) -> RefedKfc {
    Rc::new(RefCell::new(Rc::new(kfc)))
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
                while funcs.last().is_some_and(|x| x.is_some()) {
                    funcs.pop();
                }
                funcs.pop();
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
