import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiEye, FiClock, FiCheck, FiTruck, FiX } from 'react-icons/fi'
import api from '../api'

export default function Orders({ shops }) {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  
  const activeShop = shops.find(s => s.id === parseInt(shopId));

  useEffect(() => {
    if (activeShop) {
      fetchOrders();
    }
  }, [activeShop]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders', { params: { shopId: activeShop.id } });
      if (data.success) setOrders(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending Payment': return '#f59e0b'; // Amber / Orange
      case 'Placed': return '#f59e0b';
      case 'Processing': return 'var(--accent-warning)';
      case 'Shipped': return '#8b5cf6';
      case 'Delivered': return 'var(--accent-success)';
      case 'Cancelled': return 'var(--accent-danger)';
      default: return 'var(--text-secondary)';
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Pending Payment': return <FiClock />;
      case 'Placed': return <FiClock />;
      case 'Processing': return <FiClock />;
      case 'Shipped': return <FiTruck />;
      case 'Delivered': return <FiCheck />;
      case 'Cancelled': return <FiX />;
      default: return null;
    }
  }

  return (
    <div className="page-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '8px' }}>Orders</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage recent orders for <strong>{activeShop ? activeShop.name : '...'}</strong></p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{order.order_number}</td>
                  <td>{order.first_name} {order.last_name}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td style={{ fontWeight: 600 }}>₹{parseFloat(order.total_amount).toFixed(2)}</td>
                  <td>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      backgroundColor: `${getStatusColor(order.status).startsWith('var') ? getStatusColor(order.status).replace(')', ', 0.1)').replace('var(', 'rgba(') : `${getStatusColor(order.status)}15`}`,
                      color: getStatusColor(order.status)
                    }}>
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn" 
                      onClick={() => navigate(`/shop/${shopId}/orders/${order.id}`)}
                      style={{ padding: '6px 12px', border: '1px solid #cbd5e1', color: 'var(--text-primary)' }}
                    >
                      <FiEye style={{ marginRight: '6px' }} /> View
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
                    No orders found for this shop.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
