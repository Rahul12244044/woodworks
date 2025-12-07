import { useState } from 'react';
import { ordersAPI } from '../lib/api';

export function useOrders() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await ordersAPI.createOrder(orderData);
      return { success: true, data };
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create order';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
}