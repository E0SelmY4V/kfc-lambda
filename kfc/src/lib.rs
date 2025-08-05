use std::{cell::RefCell, rc::Rc};

pub mod display;
pub mod parser;

#[derive(Debug, Clone)]
pub enum Kfc {
    Call(RefedKfc, RefedKfc),
    Func(RefedKfc, RefedKfc),
    Value(usize),
}
type RefedKfc = Rc<RefCell<Kfc>>;

fn new_refed_kfc(kfc: Kfc) -> RefedKfc {
    Rc::new(RefCell::new(kfc))
}
pub fn apply(refed_kfc: RefedKfc) -> (RefedKfc, bool) {
    if let Kfc::Call(caller, arg) = &*refed_kfc.borrow() {
        let (n, b) = apply(caller.clone());
        if let Kfc::Func(values, expr) = &*(if b { &n } else { caller }).borrow() {
            values.replace(arg.borrow().clone());
            return (new_refed_kfc(expr.borrow().clone()), true);
        };
    }
    (refed_kfc, false)
}
