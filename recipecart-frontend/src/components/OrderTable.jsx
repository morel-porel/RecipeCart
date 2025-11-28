import React from 'react';
import OrderRow from './OrderRow';

const OrderTable = ({ orders, onViewDetails, onCancel }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>
        {orders.length ? (
          orders.map(order => (
            <OrderRow
              key={order.id}
              order={order}
              onViewDetails={onViewDetails}
              onCancel={onCancel}
            />
          ))
        ) : (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
              No orders found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default OrderTable;
