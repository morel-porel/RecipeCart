import React, { useEffect } from "react";
import "./OrderDetails.css";

// update image imports to match filenames in src/assets
import EggImg from "../assets/egg.png";
import SpinachImg from "../assets/spinach.png";

const OrderDetails = ({ order }) => {
  useEffect(() => {
    console.log("OrderDetails mounted");
    return () => console.log("OrderDetails unmounted");
  }, []);

  // sample fallback data (replace with real props / state)
  const sampleOrder = {
    name: "Andre Policios",
    time: "11:54AM",
    date: "9/11/25",
    items: [
      { name: "Egg", qty: 2, img: EggImg },
      { name: "Spinach", qty: 3, img: SpinachImg }
    ],
    status: "Processing"
  };

  const details = order || sampleOrder;

  return (
    <div className="od-wrapper">
      <h2 className="od-title">Order Details</h2>

      <div className="od-row">
        <div className="od-items">
          {details.items.map((item, idx) => (
            <div key={idx} className="od-item">
              <img src={item.img} alt={item.name} className="od-item-img" />
              <div className="od-item-label">
                {item.name} x{item.qty}
              </div>
            </div>
          ))}
        </div>

        <div className="od-meta">
          <div className="od-customer">{details.name}</div>
          <div className="od-time">{details.time}</div>
          <div className="od-date">{details.date}</div>
        </div>
      </div>

      <div className="od-status-row">
        <span className="od-status-label">Status:</span>
        <span className="od-status-value">{details.status}</span>
      </div>
    </div>
  );
};

export default OrderDetails;

// Not integrated to website