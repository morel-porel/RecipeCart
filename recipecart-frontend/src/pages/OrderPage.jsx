import React from "react";
import MainNavbar from "../components/MainNavbar";
import OrderSummaryTable from "../components/OrderSummaryTable";
import "../assets/styles/OrderPage.css";

function OrderPage() {
  return (
    <div className="order-page">
      {/* Navbar */}
      <MainNavbar />

      {/* Centered table */}
      <div className="order-page-content">
        <OrderSummaryTable />
      </div>
    </div>
  );
}

export default OrderPage;
