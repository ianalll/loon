// frontend/src/hooks/useRefreshData.js
import { useQueryClient } from '@tanstack/react-query';

export const useRefreshData = () => {
  const queryClient = useQueryClient();

  // Очищает все кэши, связанные с товарами, размерами, коллекциями, заказами
  const refreshAll = () => {
    queryClient.invalidateQueries(['products']);
    queryClient.invalidateQueries(['all-product-sizes']);
    queryClient.invalidateQueries(['collections']);
    queryClient.invalidateQueries(['product-sizes']);
    queryClient.invalidateQueries(['cart']);
    queryClient.invalidateQueries(['favorites']);
    queryClient.invalidateQueries(['orders']);
    queryClient.invalidateQueries(['admin-orders']);
  };

  // Очищает только кэш товаров и размеров (после изменения размеров)
  const refreshProducts = () => {
    queryClient.invalidateQueries(['products']);
    queryClient.invalidateQueries(['all-product-sizes']);
    queryClient.invalidateQueries(['product-sizes']);
  };

  // Очищает кэш заказов (после изменения статуса)
  const refreshOrders = () => {
    queryClient.invalidateQueries(['orders']);
    queryClient.invalidateQueries(['admin-orders']);
  };

  // Очищает кэш коллекций
  const refreshCollections = () => {
    queryClient.invalidateQueries(['collections']);
    queryClient.invalidateQueries(['products']);
  };

  return { refreshAll, refreshProducts, refreshOrders, refreshCollections };
};