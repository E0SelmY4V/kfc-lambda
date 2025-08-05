use std::{cell::RefCell, rc::Rc};

pub mod parser;
pub mod display;

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
pub fn apply(refed_kfc: RefedKfc) -> Option<RefedKfc> {
    if let Kfc::Call(caller, arg) = &*refed_kfc.borrow() {
        if let Kfc::Func(values, expr) = &*caller.borrow() {
            values.replace(arg.borrow().clone());
            return Some(new_refed_kfc(expr.borrow().clone()));
        }
    }
    None
}
