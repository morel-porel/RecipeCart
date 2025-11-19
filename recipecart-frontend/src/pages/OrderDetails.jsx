import React from "react";
import "./OrderDetails.css";

// Update image paths as needed
import EggImg from "../assets/egg.png";
import SpinachImg from "../assets/spinach.png";
import BeefImg from "../assets/beef.png";
import HoneyImg from "../assets/honey.png";

const OrderDetails = ({ order }) => {
  const sampleOrder = {
    name: "Andre Policios",
    time: "11:54AM",
    date: "9/11/25",
    items: [
      { name: "Egg", qty: 2, img: EggImg },
      { name: "Spinach", qty: 3, img: SpinachImg },
    ],
    status: "Processing",
  };

  const details = order || sampleOrder;

  return (
    <div className="order-details-wrapper">
      <h2>Order Details</h2>
      <div className="order-details-row">
        {details.items.map((item, idx) => (
          <div key={idx} className="order-item">
            <img src={item.img} alt={item.name} className="order-item-img" />
            <div>{item.name} x{item.qty}</div>
          </div>
        ))}
        <div className="order-detail-listing">
          <div><strong>{details.name}</strong></div>
          <div>{details.time}</div>
          <div>{details.date}</div>
        </div>
      </div>
      <div className="order-status">
        <span>Status: <span className="order-status-bold">{details.status}</span></span>
      </div>
    </div>
  );
};

export default OrderDetails;