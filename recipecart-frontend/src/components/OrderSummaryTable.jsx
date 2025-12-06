import React from "react";
import "../assets/styles/OrderSummaryTable.css";
import Button from "./Button";
import { usePopup } from '../components/CustomPopup';

function OrderSummaryTable() {
  const { showPopup } = usePopup();

  return (
    <div className="order-summary-wrapper">

      <div className="table-container">

        {/* TABLE */}
        <table className="order-summary-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Sample Product</td>
              <td>₱100</td>
              <td>1</td>
              <td>₱100</td>
            </tr>

            <tr><td colSpan="4" className="empty-row"></td></tr>
            <tr><td colSpan="4" className="empty-row"></td></tr>
            <tr><td colSpan="4" className="empty-row"></td></tr>
            <tr><td colSpan="4" className="empty-row"></td></tr>
          </tbody>
        </table>

        {/* ORDER SUMMARY DETAILS (LEFT) */}
        <div className="order-summary-bottom">
          <div className="order-details">
            <h3>Order Summary</h3>
            <p><strong>Total Amount:</strong> ₱100</p>
            <p><strong>Reference Number:</strong> RC-00123</p>
            <p><strong>Date:</strong> 2025-01-01</p>
            <p><strong>Payment Method:</strong> Cash</p>
          </div>

          {/* COMPLETE ORDER BUTTON (RIGHT) */}
          <div className="complete-order-button">
            <Button onClick={() => showPopup('Order completed successfully!', 'success')}>
              Complete Order
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default OrderSummaryTable;
