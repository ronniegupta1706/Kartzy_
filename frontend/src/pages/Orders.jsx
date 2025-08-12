import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [cancelReason, setCancelReason] = useState({});
  const [reviewInputs, setReviewInputs] = useState({}); // { orderId: { rating, comment } }
  const [submittingReview, setSubmittingReview] = useState({}); // { orderId: bool }

  const cancelOptions = [
    'Ordered by mistake',
    'Found a better price',
    'Product not needed anymore',
    'Delay in delivery',
    'Changed my mind'
  ];

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
      toast.error("Please login to view orders");
      navigate('/login');
      return;
    }
    setUser(userInfo);
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5001/api/orders/myorders', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
      setOrders(data);
    } catch (err) {
      toast.error(err.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchOrders();
  }, [user]);

  const cancelOrder = async (id) => {
    if (!cancelReason[id]) {
      toast.error('Please select a reason before cancelling.');
      return;
    }
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${id}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ reason: cancelReason[id] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Order cancelled');
      fetchOrders();
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    }
  };

  // Review submit handler per order
  const submitReview = async (orderId) => {
    const { rating, comment } = reviewInputs[orderId] || {};
    if (!rating || !comment?.trim()) {
      toast.error('Please provide rating and comment to submit review.');
      return;
    }
    setSubmittingReview(prev => ({ ...prev, [orderId]: true }));
    try {
      const res = await fetch(`http://localhost:5001/api/reviews/${orderId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      toast.success('Review submitted successfully');
      // Clear review inputs for this order
      setReviewInputs(prev => ({ ...prev, [orderId]: { rating: 0, comment: '' } }));
      fetchOrders();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmittingReview(prev => ({ ...prev, [orderId]: false }));
    }
  };

  if (loading) return <div className="p-6 bg-yellow-50 min-h-screen">Loading...</div>;
  if (!orders.length) return <div className="p-6 bg-yellow-50 min-h-screen">No orders found.</div>;

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Orders</h2>
          <button
            onClick={fetchOrders}
            className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm"
          >
            🔁 Refresh Orders
          </button>
        </div>

        {orders.map(order => (
          <div key={order._id} className="border p-4 mb-4 bg-white shadow rounded">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Order ID: <strong>{order._id}</strong></span>
              <span>Date: {new Date(order.createdAt).toLocaleString()}</span>
            </div>

            <p><strong>Shipping:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>

            <p><strong>Status:</strong>{' '}
              <span className={`text-xs font-semibold px-2 py-1 rounded 
                ${order.isCancelled
                  ? 'bg-red-100 text-red-700'
                  : order.isDelivered
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-800'}`}>
                {order.isCancelled
                  ? 'Cancelled ❌'
                  : order.isDelivered
                    ? 'Delivered ✅'
                    : 'Pending 🕒'}
              </span>
            </p>

            <div className="mt-3">
              <h4 className="font-semibold mb-2">Items:</h4>
              <ul className="space-y-2">
                {order.orderItems.map(item => (
                  <li key={item.product} className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <span>{item.name} × {item.qty} = ₹{(item.qty * item.price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-2 text-right font-bold text-green-700">
              Total: ₹{order.totalPrice.toFixed(2)}
            </div>

            {/* Cancel order if not delivered or cancelled */}
            {!order.isDelivered && !order.isCancelled && (
              <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                <select
                  value={cancelReason[order._id] || ''}
                  onChange={e => setCancelReason({ ...cancelReason, [order._id]: e.target.value })}
                  className="border rounded px-3 py-1"
                >
                  <option value="">Select cancellation reason</option>
                  {cancelOptions.map((reason, i) => (
                    <option key={i} value={reason}>❗ {reason}</option>
                  ))}
                </select>
                <button
                  className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  onClick={() => cancelOrder(order._id)}
                >
                  Cancel Order
                </button>
              </div>
            )}

            {/* Review form - only if delivered and not cancelled and no existing review */}
            {order.isDelivered && !order.isCancelled && !order.review && (
              <div className="mt-6 border-t pt-4">
                <h4 className="font-semibold mb-2">Leave a Review</h4>
                <div className="flex items-center space-x-3 mb-2">
                  <label className="font-medium">Rating:</label>
                  {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewInputs(prev => ({
                          ...prev,
                          [order._id]: {
                            ...prev[order._id],
                            rating: star
                          }
                        }))
                      }
                      className={`text-2xl cursor-pointer ${
                        reviewInputs[order._id]?.rating >= star
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      aria-label={`${star} star`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  rows={3}
                  placeholder="Write your review..."
                  value={reviewInputs[order._id]?.comment || ''}
                  onChange={e =>
                    setReviewInputs(prev => ({
                      ...prev,
                      [order._id]: {
                        ...prev[order._id],
                        comment: e.target.value
                      }
                    }))
                  }
                  className="w-full border rounded px-3 py-2 mb-2"
                />
                <button
                  onClick={() => submitReview(order._id)}
                  disabled={submittingReview[order._id]}
                  className={`px-4 py-2 rounded text-white ${
                    submittingReview[order._id] ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {submittingReview[order._id] ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            )}

            {/* Show existing review if any */}
            {order.review && (
              <div className="mt-6 border-t pt-4 bg-green-50 p-3 rounded">
                <h4 className="font-semibold mb-1">Your Review</h4>
                <div className="flex items-center space-x-2 mb-1">
                  <span>Rating:</span>
                  {[...Array(5)].map((_, idx) => (
                    <span key={idx} className={idx < order.review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                      ★
                    </span>
                  ))}
                </div>
                <p>{order.review.comment}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
