import { useQuery } from '@tanstack/react-query';
import api from '../api';

// Хук для получения всех товаров
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => api.get('/products').then(res => res.data),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};

// Хук для получения новинок
export const useNewProducts = () => {
  return useQuery({
    queryKey: ['products', 'new'],
    queryFn: () => api.get('/products').then(res => res.data.filter(p => p.is_new === true)),
    staleTime: 5 * 60 * 1000,
  });
};

// Хук для получения акционных товаров
export const usePromotionProducts = () => {
  return useQuery({
    queryKey: ['products', 'promotions'],
    queryFn: () => api.get('/products').then(res => res.data.filter(p => p.is_promotion === true)),
    staleTime: 5 * 60 * 1000,
  });
};

// Хук для получения всех коллекций
export const useCollections = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: () => api.get('/collections').then(res => res.data),
    staleTime: 10 * 60 * 1000, // 10 минут
  });
};

// Хук для получения размеров конкретного товара
export const useProductSizes = (productId) => {
  return useQuery({
    queryKey: ['product-sizes', productId],
    queryFn: () => api.get(`/products/${productId}/sizes`).then(res => res.data),
    enabled: !!productId, // запрос выполнится только когда есть productId
    staleTime: 5 * 60 * 1000,
  });
};

// Хук для получения размеров всех товаров (для фильтра)
export const useAllProductSizes = (products) => {
  return useQuery({
    queryKey: ['all-product-sizes'],
    queryFn: async () => {
      const sizesMap = {};
      for (const product of products) {
        try {
          const res = await api.get(`/products/${product.id}/sizes`);
          sizesMap[product.id] = res.data;
        } catch (error) {
          sizesMap[product.id] = [];
        }
      }
      return sizesMap;
    },
    enabled: products.length > 0,
    staleTime: 5 * 60 * 1000,
  });
};