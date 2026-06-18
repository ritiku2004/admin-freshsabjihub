import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { useNotification } from '../context/NotificationContext'

export default function Layout({ shops }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { alertMessage, setAlertMessage, newOrderInfo, setNewOrderInfo } = useNotification();
  const navigate = useNavigate();

  const handleViewOrder = () => {
    if (newOrderInfo) {
      const { shopId, orderId } = newOrderInfo;
      // Close modal first
      setNewOrderInfo(null);
      // Navigate to order details
      navigate(`/shop/${shopId}/orders/${orderId}`);
    }
  };

  return (
    <div className="app-container">
      {/* Dynamic Push Notification Banner */}
      {alertMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#10B981',
          color: '#FFFFFF',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideIn 0.3s ease-out',
          minWidth: '280px'
        }}>
          <strong style={{ fontSize: '15px', fontWeight: 'bold' }}>{alertMessage.title}</strong>
          <span style={{ fontSize: '13px', marginTop: '4px', opacity: 0.9 }}>{alertMessage.body}</span>
          <button 
            onClick={() => setAlertMessage(null)} 
            style={{
              position: 'absolute',
              top: '4px',
              right: '8px',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* New Order Alert Modal Popup */}
      {newOrderInfo && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div className="glass-panel" style={{
            width: '90%',
            maxWidth: '450px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              margin: '0 auto 8px auto'
            }}>
              🛒
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                New Order Received!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Order <strong style={{ color: 'var(--accent-primary)' }}>{newOrderInfo.orderNumber}</strong> has been placed by <strong>{newOrderInfo.customerName || 'Customer'}</strong>.
              </p>
            </div>
            
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '1px solid #e2e8f0',
              marginTop: '8px'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Total Amount:</span>
              <strong style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
                ₹{parseFloat(newOrderInfo.amount).toFixed(2)}
              </strong>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button 
                onClick={() => setNewOrderInfo(null)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: '#f1f5f9',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                Dismiss
              </button>
              <button 
                onClick={handleViewOrder}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--accent-primary)',
                  color: 'white',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'background-color 0.2s'
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} 
        onClick={() => setIsSidebarOpen(false)}
      ></div>
      
      <Sidebar shops={shops} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="main-content">
        <Header shops={shops} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="page-content" onClick={() => { if(isSidebarOpen && window.innerWidth <= 768) setIsSidebarOpen(false) }}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
