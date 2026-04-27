// СТРАНИЦА ПРОФИЛЯ ПОЛЬЗОВАТЕЛЯ
import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
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

const ProfileContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #D0CBC4 0%, #957B69 100%);
  padding-top: 95px;
  padding-bottom: 70px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.8rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.8rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Card = styled.div`
  background: rgba(236, 228, 217, 0.95);
  border-radius: 20px;
  padding: 1.8rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const CardTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  letter-spacing: 2px;
  color: #5E524A;
  margin-bottom: 1.3rem;
  border-bottom: 1px solid rgba(94, 82, 74, 0.2);
  padding-bottom: 0.5rem;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.85rem 0;
  border-bottom: 1px solid rgba(94, 82, 74, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.span`
  font-size: 1.1rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #957B69;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const InfoValue = styled.span`
  font-size: 1.2rem;
  font-weight: 300;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
`;

const EditInput = styled.input`
  font-size: 1.2rem;
  font-weight: 300;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  background: transparent;
  border: 1px solid rgba(94, 82, 74, 0.3);
  border-radius: 8px;
  padding: 0.2rem 0.5rem;
  width: 200px;
  text-align: right;
  
  &:focus {
    outline: none;
    border-color: #5E524A;
  }
`;

const EditButton = styled.button`
  background: transparent;
  border: 1px solid #5E524A;
  border-radius: 30px;
  padding: 0.7rem 1.8rem;
  font-size: 0.95rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  color: #5E524A;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.8rem;
  
  &:hover {
    background: #5E524A;
    color: #EDE7DE;
    transform: scale(1.02);
  }
`;

const EditActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: flex-end;
`;

const SaveButton = styled.button`
  background: #5E524A;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background: #36302c;
  }
`;

const CancelButton = styled.button`
  background: #d2b8a7;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background: #99867a;
  }
`;

const OrdersContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(94, 82, 74, 0.1);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #5E524A;
    border-radius: 10px;
  }
`;

const OrderCard = styled.div`
  background: rgba(222, 207, 191, 0.95);
  border-radius: 20px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    background: rgb(211, 202, 189);
  }
  
  &:last-child {
    margin-bottom: 0;
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
  font-size: 1rem;
  font-weight: 400;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
`;

const OrderDate = styled.span`
  font-size: 0.75rem;
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
      case 'cancelled': return 'rgba(198, 40, 40, 0.2)';
      default: return 'rgba(94, 82, 74, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'shipped': return '#2e7d32';
      case 'processing': return '#e65100';
      case 'delivered': return '#1565c0';
      case 'pending': return '#e65100';
      case 'cancelled': return '#c62828';
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
  padding-top: 0.4rem;
  margin-top: 0.3rem;
  border-top: 1px solid rgba(94, 82, 74, 0.1);
  font-weight: 400;
  color: #5E524A;
  font-size: 0.85rem;
`;

const ViewAllButton = styled.button`
  background: transparent;
  border: 1px solid #5E524A;
  border-radius: 30px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  color: #5E524A;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background: #5E524A;
    color: #EDE7DE;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-top: 1.8rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background: #5E524A;
  color: #EDE7DE;
  border: none;
  border-radius: 30px;
  padding: 0.7rem 1.5rem;
  font-size: 0.95rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #6b5e55;
    transform: scale(1.02);
  }
`;

const AdminButton = styled.button`
  background: #957B69;
  color: #EDE7DE;
  border: none;
  border-radius: 30px;
  padding: 0.7rem 1.5rem;
  font-size: 0.95rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #7a6353;
    transform: scale(1.02);
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid #c62828;
  color: #c62828;
  border-radius: 30px;
  padding: 0.7rem 1.5rem;
  font-size: 0.95rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #c62828;
    color: white;
    transform: scale(1.02);
  }
`;

const EmptyOrders = styled.div`
  text-align: center;
  padding: 1rem;
  color: #957B69;
  font-size: 0.9rem;
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

const CancelOrderButton = styled.button`
  width: 100%;
  background: transparent;
  color: #c62828;
  border: 1px solid #c62828;
  border-radius: 30px;
  padding: 0.6rem 1.5rem;
  font-size: 0.9rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: #c62828;
    color: white;
    transform: scale(1.02);
  }
`;

// МО ПОДТВЕРЖДЕНИЯ
const ConfirmModalOverlay = styled.div`
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

const ConfirmModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 350px;
  max-width: 90%;
  text-align: center;
`;

const ConfirmModalTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 1rem;
`;

const ConfirmModalText = styled.p`
  font-size: 0.9rem;
  color: #5E524A;
  margin-bottom: 1.5rem;
`;

const ConfirmModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ConfirmModalButton = styled.button`
  background: #5E524A;
  color: #EDE7DE;
  border: none;
  border-radius: 30px;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background: #6b5e55;
  }
`;

const ConfirmModalCancelButton = styled.button`
  background: transparent;
  color: #c62828;
  border: 1px solid #c62828;
  border-radius: 30px;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background: #c62828;
    color: white;
  }
`;

// МОДАЛЬНОЕ ОКНО ИНФОРМАЦИИ
const InfoModalOverlay = styled.div`
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

const InfoModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 350px;
  max-width: 90%;
  text-align: center;
`;

const InfoModalTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 1rem;
`;

const InfoModalText = styled.p`
  font-size: 0.9rem;
  color: #5E524A;
  margin-bottom: 1.5rem;
`;

const InfoModalButton = styled.button`
  background: #5E524A;
  color: #EDE7DE;
  border: none;
  border-radius: 30px;
  padding: 0.5rem 1.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover {
    background: #6b5e55;
  }
`;

const ProfilePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  
  // Состояния для модальных окон
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmText, setConfirmText] = useState('');
  
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoText, setInfoText] = useState('');
  const [infoCallback, setInfoCallback] = useState(null);
  
  // Автообновление заказов при возвращении на страницу
  useEffect(() => {
    const handleFocus = () => {
      queryClient.invalidateQueries(['orders']);
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [queryClient]);
  
  const showConfirmMessage = (title, text, onConfirm) => {
    setConfirmTitle(title);
    setConfirmText(text);
    setConfirmAction(() => onConfirm);
    setShowConfirmModal(true);
  };
  
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };
  
  const showInfoMessage = (title, text, callback = null) => {
    setInfoTitle(title);
    setInfoText(text);
    setInfoCallback(() => callback);
    setShowInfoModal(true);
  };
  
  const closeInfoModal = () => {
    setShowInfoModal(false);
    if (infoCallback) {
      infoCallback();
    }
    setInfoCallback(null);
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setEditFirstName(parsedUser.first_name || '');
    setEditLastName(parsedUser.last_name || '');
    fetchOrders(token);
  }, [navigate]);
  
  const fetchOrders = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      showInfoMessage('Ошибка', 'Не удалось загрузить заказы');
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
  
  const handleCancelOrder = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/orders/${selectedOrder.id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showInfoMessage('Заказ отменён', 'Заказ успешно отменён', () => {
        setShowOrderModal(false);
        fetchOrders(token);
        queryClient.invalidateQueries(['orders']);
      });
    } catch (error) {
      console.error('Ошибка отмены заказа:', error);
      showInfoMessage('Ошибка', error.response?.data?.error || 'Ошибка при отмене заказа');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const handleEditClick = () => {
    setEditFirstName(user?.first_name || '');
    setEditLastName(user?.last_name || '');
    setIsEditing(true);
  };
  
  const handleSaveEdit = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put('http://localhost:5000/api/user/profile', 
        { first_name: editFirstName, last_name: editLastName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedUser = { ...user, first_name: editFirstName, last_name: editLastName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      showInfoMessage('Успешно', 'Данные успешно обновлены');
    } catch (error) {
      console.error('Ошибка обновления:', error);
      showInfoMessage('Ошибка', 'Ошибка при обновлении данных');
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFirstName(user?.first_name || '');
    setEditLastName(user?.last_name || '');
  };
  
  const getStatusText = (status) => {
    switch(status) {
      case 'shipped': return 'В пути';
      case 'processing': return 'Обрабатывается';
      case 'delivered': return 'Доставлен';
      case 'pending': return 'Ожидает обработки';
      case 'cancelled': return 'Отменён';
      case 'rejected': return 'Отклонён';
      default: return status;
    }
  };
  
  if (loading) {
    return (
      <ProfileContainer>
        <ContentWrapper>
          <Card style={{ textAlign: 'center' }}>Загрузка...</Card>
        </ContentWrapper>
      </ProfileContainer>
    );
  }
  
  const recentOrders = orders.slice(0, 3);
  const hasMoreOrders = orders.length > 3;
  
  return (
    <>
      <ProfileContainer>
        <ContentWrapper>
          <TwoColumns>
            <Card>
              <CardTitle>Мои данные</CardTitle>
              
              <InfoRow>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>{user?.email}</InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>Имя</InfoLabel>
                {isEditing ? (
                  <EditInput 
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                  />
                ) : (
                  <InfoValue>{user?.first_name || '—'}</InfoValue>
                )}
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>Фамилия</InfoLabel>
                {isEditing ? (
                  <EditInput 
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                  />
                ) : (
                  <InfoValue>{user?.last_name || '—'}</InfoValue>
                )}
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>Телефон</InfoLabel>
                <InfoValue>{user?.phone || 'Не указан'}</InfoValue>
              </InfoRow>

              <InfoRow>
                <InfoLabel>Дата регистрации</InfoLabel>
                <InfoValue>
                  {user?.created_at 
                    ? new Date(user.created_at).toLocaleDateString('ru-RU') 
                    : 'Не указана'}
                </InfoValue>
              </InfoRow>
              
              <InfoRow>
                <InfoLabel>Роль</InfoLabel>
                <InfoValue>{user?.role === 'admin' ? 'Администратор' : 'Пользователь'}</InfoValue>
              </InfoRow>
              
              {isEditing ? (
                <EditActions>
                  <SaveButton onClick={handleSaveEdit}>Сохранить</SaveButton>
                  <CancelButton onClick={handleCancelEdit}>Отмена</CancelButton>
                </EditActions>
              ) : (
                <EditButton onClick={handleEditClick}>Редактировать</EditButton>
              )}
            </Card>
            
            <Card>
              <CardTitle>Последние заказы</CardTitle>
              
              <OrdersContainer>
                {recentOrders.length === 0 ? (
                  <EmptyOrders>У вас пока нет заказов</EmptyOrders>
                ) : (
                  recentOrders.map((order) => (
                    <OrderCard key={order.id} onClick={() => openOrderModal(order)}>
                      <OrderHeader>
                        <OrderNumber>Заказ № {order.order_number}</OrderNumber>
                        <OrderDate>{new Date(order.created_at).toLocaleDateString('ru-RU')}</OrderDate>
                      </OrderHeader>
                      <OrderStatus status={order.status}>
                        {getStatusText(order.status)}
                      </OrderStatus>
                      <OrderTotal>
                        <span>Сумма:</span>
                        <span>{order.total_amount.toLocaleString()} ₽</span>
                      </OrderTotal>
                    </OrderCard>
                  ))
                )}
              </OrdersContainer>
              
              {hasMoreOrders && (
                <ViewAllButton onClick={() => navigate('/orders')}>
                  Смотреть все заказы →
                </ViewAllButton>
              )}
            </Card>
          </TwoColumns>
          
          <ButtonGroup>
            <ActionButton onClick={() => navigate('/cart')}>Корзина</ActionButton>
            <ActionButton onClick={() => navigate('/favorites')}>Избранное</ActionButton>
            
            {user?.role === 'admin' && (
              <AdminButton onClick={() => navigate('/admin')}>
                Панель администратора
              </AdminButton>
            )}
            
            <LogoutButton onClick={handleLogout}>Выйти</LogoutButton>
          </ButtonGroup>
        </ContentWrapper>
      </ProfileContainer>
      
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
                <span style={{ 
                  color: selectedOrder.status === 'shipped' ? '#2e7d32' : 
                         selectedOrder.status === 'cancelled' ? '#c62828' : '#e65100' 
                }}>
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
            
            {selectedOrder?.status === 'pending' && (
              <CancelOrderButton onClick={() => showConfirmMessage('Отменить заказ', 'Вы уверены, что хотите отменить этот заказ?', handleCancelOrder)}>
                Отменить заказ
              </CancelOrderButton>
            )}
            
            <CloseButton onClick={() => setShowOrderModal(false)}>
              Закрыть
            </CloseButton>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* МО ПОДТВЕРЖДЕНИЯ */}
      {showConfirmModal && (
        <ConfirmModalOverlay onClick={closeConfirmModal}>
          <ConfirmModalContent onClick={e => e.stopPropagation()}>
            <ConfirmModalTitle>{confirmTitle}</ConfirmModalTitle>
            <ConfirmModalText>{confirmText}</ConfirmModalText>
            <ConfirmModalButtons>
              <ConfirmModalButton onClick={() => {
                if (confirmAction) confirmAction();
                closeConfirmModal();
              }}>Да</ConfirmModalButton>
              <ConfirmModalCancelButton onClick={closeConfirmModal}>Отмена</ConfirmModalCancelButton>
            </ConfirmModalButtons>
          </ConfirmModalContent>
        </ConfirmModalOverlay>
      )}
      
      {/* МО ИНФОРМАЦИИ */}
      {showInfoModal && (
        <InfoModalOverlay onClick={closeInfoModal}>
          <InfoModalContent onClick={e => e.stopPropagation()}>
            <InfoModalTitle>{infoTitle}</InfoModalTitle>
            <InfoModalText>{infoText}</InfoModalText>
            <InfoModalButton onClick={closeInfoModal}>OK</InfoModalButton>
          </InfoModalContent>
        </InfoModalOverlay>
      )}
    </>
  );
};

export default ProfilePage;