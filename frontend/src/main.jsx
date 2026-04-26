import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';

// Создаём клиент с настройками
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 минут данные считаются свежими
      gcTime: 10 * 60 * 1000,   // 10 минут хранятся в кэше
      refetchOnWindowFocus: false, // Не перезапрашивать при фокусе окна
      retry: 1,                  // 1 повтор при ошибке
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);