import { useState, useEffect } from "react";
import ToastMsg from "../Toast_Message/ToastMsg";

// storing key for local storage
const STORAGE_KEY = "cart";

function Modal({ cartObj = [], onClose }) {
  // defining the required states
  const [cart, setCart] = useState(cartObj);
  const [toast, setToast] = useState(null);

  // setting the cart state on update
  useEffect(() => {
    setCart(cartObj);
  }, [cartObj]);

  // calculating total price
  const totalFor = (item) => Number(item.price) * Number(item.quantity);

  // function updating the cart state after quantity is changed inside the cart
  // delta is basically frequency of change (how much ?)
  // it stands as shortform of item
  const handleQty = (id, delta) => {
    setCart((prev) => {
      const next = prev.map((it) =>
        it.id === id
          ? { ...it, quantity: Math.max(1, Number(it.quantity) + delta) }
          : it
      );

      // printing the updated state
      console.log("cart updated:", next);

      // storing updated state in local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // basically operation to perform for checkout
  /* enclosing code in try catch block as 
   communicating with backend through api
   so more chances of error is there */

  const checkOut = async (listPIdsQtys) => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listPIdsQtys),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || `Checkout failed: ${resp.status}`);
      }
      const data = await resp.json();
      console.log(data);

      // displaying success toast message
      setToast({ id: Date.now(), opType: "success", msg: "Order placed! Please check Browser Console for Success message and Backend Terminal for Cart data" });

      // clearning local storage
      localStorage.removeItem(STORAGE_KEY);

      // setting cart state as empty
      setCart([]);

      // optional - corner case
      
      // refreshing the page after 10 secs 
      // for fresh shopping after clearning local storage
      // setTimeout(() => {
      //   window.location.reload();
      // }, 10000);

    } catch (e) {
      console.error(e);
      alert(e.message || "Something went wrong during checkout.");
    }
  };

  // function to call after clicking checkout button
  const onCheckoutClick = () => {
    const order = cart.map(({ id, quantity }) => ({ id, quantity }));
    checkOut({ order });
  };

  // flag for checking empty cart
  const cartIsEmpty = cart.length === 0;

  // rendering modal component
  return (
    <>
      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex={-1}
        aria-labelledby="cartModalLabel"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="cartModalLabel">
                Shopping Cart
              </h1>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cartIsEmpty ? (
                    <tr>
                      <td colSpan={4} className="text-center">
                        Your cart is empty.
                      </td>
                    </tr>
                  ) : (
                    cart.map((c) => (
                      <tr key={c.id}>
                        <td>{c.name}</td>
                        <td>{c.price} Rs.</td>
                        <td>
                          <div className="d-inline-flex align-items-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleQty(c.id, -1)}
                              disabled={Number(c.quantity) <= 1}
                              aria-label={`Decrease quantity of ${c.name}`}
                              title="Decrease"
                            >
                              −
                            </button>
                            <span className="mx-2">{c.quantity}</span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleQty(c.id, +1)}
                              aria-label={`Increase quantity of ${c.name}`}
                              title="Increase"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>{totalFor(c)} Rs.</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-danger" onClick={onClose}>
                Close
              </button>
              <button
                type="button"
                className="btn btn-success"
                disabled={cartIsEmpty}
                onClick={onCheckoutClick}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      <div className="modal-backdrop fade show" />

      {/* Render toast if set */}
      {toast && <ToastMsg key={toast.id} opType={toast.opType} msg={toast.msg} />}
    </>
  );
}

export default Modal;
