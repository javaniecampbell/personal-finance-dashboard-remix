import { useState, useCallback } from 'react';
import { useNotification } from '~/components/ErrorNotification';

export const useApiCall = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { addNotification } = useNotification();

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      addNotification(`Error: ${err.message}`, 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, addNotification]);

  return { execute, data, loading, error };
};
