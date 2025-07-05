import React, { useEffect, useState } from 'react';

const Orders = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const userOrdersKey = `orders_${user.email}`;
    const saved = JSON.parse(localStorage.getItem(userOrdersKey)) || [];
    setOrders(saved);
  }, []);

  if (!orders.length) {
    return <div className="p-6 text-lg">No orders placed yet.</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>
      {orders.map(order => (
        <div key={order.id} className="border border-gray-300 rounded p-4 mb-4 bg-white shadow">
          <div className="flex justify-between mb-2 text-sm text-gray-600">
            <span>Order ID: <strong>{order.id}</strong></span>
            <span>Date: {order.date}</span>
          </div>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Payment Method:</strong> {order.payment}</p>
          <p><strong>Status:</strong> {order.status}</p>

          <div className="mt-3">
            <h4 className="font-semibold">Items:</h4>
            <ul className="ml-4 list-disc">
              {order.items.map(item => (
                <li key={item._id}>
                  {item.title} × {item.quantity} = ₹{item.quantity * item.price}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-2 text-right font-bold text-lg text-green-700">
            Total Paid: ₹{order.total}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
