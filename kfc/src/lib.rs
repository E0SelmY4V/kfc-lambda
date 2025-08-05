use std::{cell::RefCell, rc::Rc};

pub mod parser;

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

