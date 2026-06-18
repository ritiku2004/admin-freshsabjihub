import { createContext, useContext, useState, useEffect } from 'react';
import { requestForToken, onMessageListener } from '../services/firebaseClient';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [newOrderInfo, setNewOrderInfo] = useState(null); // { orderId, shopId }
  const [shopBadgeCounts, setShopBadgeCounts] = useState({}); // { shopId: count }

  useEffect(() => {
    // Request permission and register token
    requestForToken();

    // Listen to foreground notifications
    let isSubscribed = true;
    const listen = async () => {
      while (isSubscribed) {
        try {
          const payload = await onMessageListener();
          if (payload && isSubscribed) {
            handleIncomingNotification(payload);
          }
        } catch (err) {
          console.error('Notification context listener err:', err);
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    };
    listen();

    // Local Test Fallback Event (allows simulating new orders easily from browser console)
    const handleLocalSimulate = (event) => {
      if (isSubscribed && event.detail) {
        console.log('Simulating local notification payload:', event.detail);
        handleIncomingNotification(event.detail);
      }
    };
    window.addEventListener('simulate-fcm-notification', handleLocalSimulate);

    return () => {
      isSubscribed = false;
      window.removeEventListener('simulate-fcm-notification', handleLocalSimulate);
    };
  }, []);

  const handleIncomingNotification = async (payload) => {
    const title = payload.notification?.title || 'Notification';
    const body = payload.notification?.body || '';
    const orderId = payload.data?.orderId || null;
    const type = payload.data?.type || 'new_order';

    // Show Toast Alert
    setAlertMessage({ title, body });
    setTimeout(() => setAlertMessage(null), 6000);

    // If it's a new order notification, we fetch details (specifically shopId)
    if (type === 'new_order' && orderId) {
      try {
        // Fetch order details from Admin API to get the correct shopId
        const response = await fetch(`http://localhost:3000/api/v1/admin/orders/${orderId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
          }
        });
        const resData = await response.json();
        if (resData.success && resData.data) {
          const orderObj = resData.data;
          const targetShopId = orderObj.shop_id;

          // Update badge count for this shop
          setShopBadgeCounts(prev => ({
            ...prev,
            [targetShopId]: (prev[targetShopId] || 0) + 1
          }));

          // Trigger new order Modal popup
          setNewOrderInfo({
            orderId,
            shopId: targetShopId,
            orderNumber: orderObj.order_number || `#${orderId}`,
            customerName: `${orderObj.first_name || ''} ${orderObj.last_name || ''}`,
            amount: orderObj.total_amount
          });
        }
      } catch (err) {
        console.error('Failed to resolve shopId for new order:', err);
      }
    }
  };

  const clearBadgeForShop = (shopId) => {
    setShopBadgeCounts(prev => ({
      ...prev,
      [shopId]: 0
    }));
  };

  return (
    <NotificationContext.Provider value={{
      alertMessage,
      setAlertMessage,
      newOrderInfo,
      setNewOrderInfo,
      shopBadgeCounts,
      clearBadgeForShop
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
