// СТРАНИЦА ВСЕХ ЗАКАЗОВ
import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const OrdersContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #D0CBC4 0%, #957B69 100%);
  padding-top: 120px;
  padding-bottom: 80px;
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  letter-spacing: 4px;
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: transparent;
  border: 1px solid #EDE7DE;
  border-radius: 30px;
  padding: 0.5rem 1.5rem;
  font-size: 0.8rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  color: #EDE7DE;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #EDE7DE;
    color: #5E524A;
  }
`;

const OrderCard = styled.div`
  background: rgba(236, 228, 217, 0.95);
  border-radius: 20px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    background: rgba(236, 228, 217, 1);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding-bottom: 0.3rem;
  border-bottom: 1px solid rgba(94, 82, 74, 0.1);
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const OrderNumber = styled.h3`
  font-size: 1.1rem;
  font-weight: 400;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
`;

const OrderDate = styled.span`
  font-size: 0.8rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #957B69;
`;

const OrderStatus = styled.div`
  display: inline-block;
  background: ${props => {
    switch(props.status) {
      case 'shipped': return 'rgba(76, 175, 80, 0.2)';
      case 'processing': return 'rgba(255, 152, 0, 0.2)';
      case 'delivered': return 'rgba(33, 150, 243, 0.2)';
      case 'pending': return 'rgba(255, 152, 0, 0.2)';
      default: return 'rgba(94, 82, 74, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'shipped': return '#2e7d32';
      case 'processing': return '#e65100';
      case 'delivered': return '#1565c0';
      case 'pending': return '#e65100';
      default: return '#5E524A';
    }
  }};
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 300;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
  border-top: 1px solid rgba(94, 82, 74, 0.1);
  font-weight: 400;
  color: #5E524A;
  font-size: 0.9rem;
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background: rgba(236, 228, 217, 0.95);
  border-radius: 20px;
  
  p {
    color: #5E524A;
    font-family: 'BlackerSans Pro', sans-serif;
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

// МО ДЛЯ ПРОСМОТРА ЗАКАЗА
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 500px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 1rem;
  text-align: center;
`;

const ModalSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ModalSectionTitle = styled.h4`
  font-size: 1rem;
  font-weight: 400;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid rgba(94, 82, 74, 0.2);
  padding-bottom: 0.3rem;
`;

const ModalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  font-size: 0.9rem;
  color: #5E524A;
`;

const ModalItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(94, 82, 74, 0.1);
  font-size: 0.85rem;
`;

const CloseButton = styled.button`
  background: #5E524A;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.6rem 1.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    background: #6b5e55;
  }
`;

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Состояния для модального окна
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchOrderDetails = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrderItems(response.data.items || []);
    } catch (error) {
      console.error('Ошибка загрузки деталей заказа:', error);
    }
  };
  
  const openOrderModal = async (order) => {
    setSelectedOrder(order);
    await fetchOrderDetails(order.id);
    setShowOrderModal(true);
  };
  
  const getStatusText = (status) => {
  switch(status) {
    case 'pending': return 'Ожидает обработки';
    case 'processing': return 'Обрабатывается';
    case 'shipped': return 'В пути';
    case 'delivered': return 'Доставлен';
    case 'cancelled': return 'Отменён';
    case 'rejected': return 'Отклонён';
    default: return status;
  }
};
  
  if (loading) {
    return (
      <OrdersContainer>
        <ContentWrapper>
          <EmptyMessage>
            <p>Загрузка...</p>
          </EmptyMessage>
        </ContentWrapper>
      </OrdersContainer>
    );
  }
  
  return (
    <>
      <OrdersContainer>
        <ContentWrapper>
          <BackButton onClick={() => navigate('/profile')}>← Назад в профиль</BackButton>
          <PageTitle>ИСТОРИЯ ЗАКАЗОВ</PageTitle>
          
          {orders.length === 0 ? (
            <EmptyMessage>
              <p>У вас пока нет заказов</p>
              <BackButton onClick={() => navigate('/collections')}>Перейти к покупкам</BackButton>
            </EmptyMessage>
          ) : (
            orders.map((order) => (
              <OrderCard key={order.id} onClick={() => openOrderModal(order)}>
                <OrderHeader>
                  <OrderNumber>Заказ № {order.order_number}</OrderNumber>
                  <OrderDate>{new Date(order.created_at).toLocaleDateString('ru-RU')}</OrderDate>
                </OrderHeader>
                <OrderStatus status={order.status}>
                  {getStatusText(order.status)}
                </OrderStatus>
                <OrderTotal>
                  <span>Сумма заказа:</span>
                  <span>{order.total_amount.toLocaleString()} ₽</span>
                </OrderTotal>
              </OrderCard>
            ))
          )}
        </ContentWrapper>
      </OrdersContainer>
      
      {/* МО ПРОСМОТРА ЗАКАЗА */}
      {showOrderModal && selectedOrder && (
        <ModalOverlay onClick={() => setShowOrderModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Детали заказа</ModalTitle>
            <ModalTitle style={{ fontSize: '1rem', marginBottom: '1rem' }}>
              № {selectedOrder.order_number}
            </ModalTitle>
            
            <ModalSection>
              <ModalSectionTitle>Информация о заказе</ModalSectionTitle>
              <ModalRow>
                <span>Дата заказа:</span>
                <span>{new Date(selectedOrder.created_at).toLocaleDateString('ru-RU')}</span>
              </ModalRow>
              <ModalRow>
                <span>Статус:</span>
                <span style={{ color: selectedOrder.status === 'shipped' ? '#2e7d32' : '#e65100' }}>
                  {getStatusText(selectedOrder.status)}
                </span>
              </ModalRow>
              <ModalRow>
                <span>Сумма заказа:</span>
                <span>{selectedOrder.total_amount.toLocaleString()} ₽</span>
              </ModalRow>
            </ModalSection>
            
            <ModalSection>
              <ModalSectionTitle>Адрес доставки</ModalSectionTitle>
              <ModalRow>
                <span>Получатель:</span>
                <span>{selectedOrder.recipient_name || '—'}</span>
              </ModalRow>
              <ModalRow>
                <span>Телефон:</span>
                <span>{selectedOrder.recipient_phone || selectedOrder.delivery_phone || '—'}</span>
              </ModalRow>
              <ModalRow>
                <span>Адрес:</span>
                <span>{selectedOrder.delivery_address || '—'}</span>
              </ModalRow>
            </ModalSection>
            
            <ModalSection>
              <ModalSectionTitle>Товары в заказе</ModalSectionTitle>
              {orderItems.length === 0 ? (
                <ModalRow>Загрузка...</ModalRow>
              ) : (
                orderItems.map((item, idx) => (
                  <ModalItem key={idx}>
                    <span>{item.name} (размер {item.size}) x {item.quantity}</span>
                    <span>{(item.price_at_time * item.quantity).toLocaleString()} ₽</span>
                  </ModalItem>
                ))
              )}
            </ModalSection>
            
            <CloseButton onClick={() => setShowOrderModal(false)}>
              Закрыть
            </CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default OrdersPage;