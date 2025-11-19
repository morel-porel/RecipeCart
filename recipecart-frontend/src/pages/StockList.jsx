import React, { useEffect } from "react";
import "./StockList.css";

/*
  Sample StockList page based on your "Available Stocks" design.

  Notes:
  - This component uses placeholder image URLs so it will render without
    requiring local assets. Replace each item's `imageUrl` with a local import
    if you have images in src/assets (for example: import EggImg from "../assets/egg.png"
    and set imageUrl: EggImg).
  - To show this page in your app add a route (e.g. path="stocks" or "available-stocks")
    in your main.jsx router that renders this component as a child of your App layout.
*/

const sampleStocks = [
  {
    id: 1,
    name: "Arla Barista Milk",
    variant: "1L",
    qty: 20,
    imageUrl: "https://via.placeholder.com/220x220?text=Milk",
  },
  {
    id: 2,
    name: "Bounty Fresh Beef Steak",
    variant: "500g",
    qty: 10,
    imageUrl: "https://via.placeholder.com/220x140?text=Beef",
  },
  {
    id: 3,
    name: "Fresh Eggs",
    variant: "500g",
    qty: 0,
    imageUrl: "https://via.placeholder.com/220x160?text=Eggs",
  },
  {
    id: 4,
    name: "Langnese Pure Honey",
    variant: "125g",
    qty: 5,
    imageUrl: "https://via.placeholder.com/220x220?text=Honey",
  },
  {
    id: 5,
    name: "Cilantro",
    variant: "50g",
    qty: 5,
    imageUrl: "https://via.placeholder.com/220x220?text=Cilantro",
  },
  {
    id: 6,
    name: "Arla Cheddar Chunk",
    variant: "200g",
    qty: 5,
    imageUrl: "https://via.placeholder.com/220x220?text=Cheddar",
  },
];

export default function StockList({ stocks = sampleStocks }) {
  useEffect(() => {
    console.log("StockList mounted");
    return () => console.log("StockList unmounted");
  }, []);

  return (
    <div className="stocks-page">
      <div className="stocks-header">
        <h1>Available Stocks</h1>
        <div className="stocks-search">
          <input type="text" placeholder="Search" aria-label="Search stocks" />
          <button className="filter-btn" title="Filter">⎈</button>
        </div>
      </div>

      <hr className="stocks-divider" />

      <div className="stocks-grid">
        {stocks.map((item) => (
          <div key={item.id} className="stock-card" data-stock-id={item.id}>
            <div className={`stock-image-wrap ${item.qty === 0 ? "out" : ""}`}>
              <img src={item.imageUrl} alt={item.name} className="stock-image" />
            </div>

            <div className="stock-info">
              <div className={`stock-qty ${item.qty === 0 ? "oos" : ""}`}>
                {item.qty === 0 ? "Out-of-Stock" : `Stock: ${item.qty}`}
              </div>
              <div className="stock-name">{item.name}</div>
              <div className="stock-variant">{item.variant}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}