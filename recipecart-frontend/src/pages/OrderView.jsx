import React, { useEffect, useMemo, useState } from "react";
import "./OrderView.css";

/*
  OrderView page based on the 2nd screenshot (detailed order view).
  - Uses placeholder image URLs so it renders immediately in a sandbox or without local assets.
  - Replace imageUrl values with local imports (e.g. import EggImg from "../assets/egg.png")
    or with public/ path (process.env.PUBLIC_URL + '/assets/egg.png') if you have images.
  - This component manages simple quantity state for each line item and computes totals.
  - Logs mount/unmount and user actions to the console for easy verification.
*/

const defaultItems = [
  {
    id: "egg",
    title: "Eggs",
    price: 15,
    qty: 2,
    unit: "pc",
    imageUrl: "https://via.placeholder.com/96?text=Egg",
  },
  {
    id: "honey",
    title: "Honey",
    price: 200,
    qty: 1,
    unit: "jar",
    imageUrl: "https://via.placeholder.com/96?text=Honey",
  },
];

export default function OrderView({ order = null }) {
  useEffect(() => {
    console.log("OrderView mounted");
    return () => console.log("OrderView unmounted");
  }, []);

  // If the caller passed an `order` object, use it; otherwise use the sample data.
  const initialOrder = order || {
    customer: "Andre Policios",
    time: "11:54AM",
    date: "2025-09-11",
    status: "Reserved - Pay in Store",
    ref: "987654321",
    paymentMethod: "On-site",
    items: defaultItems,
  };

  const [items, setItems] = useState(initialOrder.items);

  const changeQty = (id, delta) => {
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(0, (it.qty || 0) + delta) } : it
      )
    );
    console.log(`OrderView: changeQty ${id} ${delta}`);
  };

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + (it.price || 0) * (it.qty || 0), 0),
    [items]
  );

  const handleComplete = () => {
    console.log("OrderView: Complete Order clicked", { subtotal, items });
    alert("Complete Order clicked (see console for details)");
  };

  return (
    <div className="ov-page">
      <div className="ov-header">
        <div className="ov-customer">{initialOrder.customer}</div>
        <div className="ov-time">{initialOrder.time}</div>
        <div className="ov-date-link">{new Date(initialOrder.date).toLocaleDateString()}</div>
        <div className="ov-status">{initialOrder.status}</div>
      </div>

      <hr className="ov-divider" />

      <div className="ov-items">
        {items.map((it) => (
          <div className="ov-item-row" key={it.id} data-item-id={it.id}>
            <div className="ov-item-left">
              <div className="ov-thumb-wrap">
                <img src={it.imageUrl} alt={it.title} className="ov-thumb" />
              </div>
              <div className="ov-item-meta">
                <div className="ov-item-title">{it.title}</div>
                <div className="ov-item-sub">info...</div>
              </div>
            </div>

            <div className="ov-item-price">₱{it.price}</div>

            <div className="ov-item-qty">
              <button
                className="ov-qty-btn"
                onClick={() => changeQty(it.id, -1)}
                aria-label={`Decrease ${it.title}`}
              >
                −
              </button>
              <div className="ov-qty-value">{it.qty}</div>
              <button
                className="ov-qty-btn"
                onClick={() => changeQty(it.id, +1)}
                aria-label={`Increase ${it.title}`}
              >
                +
              </button>
            </div>

            <div className="ov-item-total">₱{(it.price * (it.qty || 0)).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <hr className="ov-divider" />

      <div className="ov-summary">
        <div className="ov-summary-left">
          <div className="ov-summary-row">
            <div>Total Amount:</div>
            <div className="ov-summary-value">₱{subtotal.toFixed(2)}</div>
          </div>
          <div className="ov-summary-row">
            <div>Ref. no.:</div>
            <div className="ov-summary-value">{initialOrder.ref}</div>
          </div>
          <div className="ov-summary-row">
            <div>Date:</div>
            <div className="ov-summary-value">{new Date(initialOrder.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div className="ov-summary-row">
            <div>Payment Method:</div>
            <div className="ov-summary-value">{initialOrder.paymentMethod}</div>
          </div>
        </div>

        <div className="ov-summary-right">
          <button className="ov-complete-btn" onClick={handleComplete}>
            Complete Order
          </button>
        </div>
      </div>
    </div>
  );
}