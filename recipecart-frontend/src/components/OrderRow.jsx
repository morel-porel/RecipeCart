import React from 'react';

const OrderRow = ({ order, onViewDetails, onCancel }) => {
  return (
    <tr style={{ textAlign: 'center' }}>
      <td>{order.id}</td>
      <td>{order.date}</td>
      <td>₱{order.totalAmount}</td>
      <td style={{ color: order.status === 'Completed' ? 'green' : 'orange' }}>
        {order.status}
      </td>
      <td>{order.paymentType}</td>
      <td>
        <button onClick={() => onViewDetails(order)}>View Details</button>
        <button onClick={() => onCancel(order.id)} style={{ marginLeft: '8px' }}>
          Cancel
        </button>
      </td>
    </tr>
  );
};

export default OrderRow;
