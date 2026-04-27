// АДМИН-УПРАВЛЕНИЕ ЗАКАЗАМИ
import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useRefreshData } from '../hooks/useRefreshData';

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

const AdminOrdersContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #D0CBC4 0%, #957B69 100%);
  padding-top: 120px;
  padding-bottom: 80px;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const Title = styled.h1`
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

const OrdersTable = styled.table`
  width: 100%;
  background: rgba(236, 228, 217, 0.95);
  border-radius: 20px;
  overflow: hidden;
  border-collapse: collapse;
`;

const Th = styled.th`
  padding: 1rem;
  text-align: left;
  background: #5E524A;
  color: #EDE7DE;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.9rem;
  letter-spacing: 1px;
`;

const Td = styled.td`
  padding: 0.8rem;
  border-bottom: 1px solid rgba(94, 82, 74, 0.1);
  color: #5E524A;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.9rem;
  font-weight: 100;
`;

const StatusBadge = styled.span`
  display: inline-block;
  background: ${props => {
    switch(props.status) {
      case 'pending': return 'rgba(255, 152, 0, 0.2)';
      case 'processing': return 'rgba(33, 150, 243, 0.2)';
      case 'shipped': return 'rgba(76, 175, 80, 0.2)';
      case 'delivered': return 'rgba(76, 175, 80, 0.2)';
      case 'cancelled': return 'rgba(198, 40, 40, 0.2)';
      case 'rejected': return 'rgba(198, 40, 40, 0.2)';
      default: return 'rgba(94, 82, 74, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'pending': return '#e65100';
      case 'processing': return '#1565c0';
      case 'shipped': return '#2e7d32';
      case 'delivered': return '#2e7d32';
      case 'cancelled': return '#c62828';
      case 'rejected': return '#c62828';
      default: return '#5E524A';
    }
  }};
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 300;
`;

const ActionButton = styled.button`
  background: transparent;
  color: ${props => props.$danger ? '#c62828' : props.$success ? '#2e7d32' : '#5E524A'};
  border: 1px solid ${props => props.$danger ? '#c62828' : props.$success ? '#2e7d32' : '#5E524A'};
  border-radius: 20px;
  padding: 0.3rem 0.8rem;
  margin: 0 0.2rem;
  cursor: pointer;
  font-size: 0.7rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$danger ? '#c62828' : props.$success ? '#2e7d32' : '#5E524A'};
    color: white;
    transform: scale(1.02);
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #5E524A;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 1rem;
  font-weight: 100;
  padding: 2rem;
`;

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
  width: 400px;
  max-width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  font-size: 0.9rem;
  color: #5E524A;
  margin-bottom: 1.5rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ModalConfirmButton = styled.button`
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

const ModalCancelButton = styled.button`
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

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshOrders, refreshProducts } = useRefreshData();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalText, setModalText] = useState('');
  
  useEffect(() => {
    checkAdminAndFetch();
  }, []);
  
  const checkAdminAndFetch = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userData);
    if (user.role !== 'admin') {
      navigate('/profile');
      return;
    }
    
    await fetchOrders();
  };
  
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const showConfirmModal = (action, orderId, title, text) => {
    setModalAction(action);
    setSelectedOrderId(orderId);
    setModalTitle(title);
    setModalText(text);
    setShowModal(true);
  };
  
  const handleConfirmAction = async () => {
    const token = localStorage.getItem('token');
    try {
      let response;
      switch (modalAction) {
        case 'accept':
          response = await axios.put(`http://localhost:5000/api/admin/orders/${selectedOrderId}/accept`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
        case 'reject':
          response = await axios.put(`http://localhost:5000/api/admin/orders/${selectedOrderId}/reject`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
        case 'ship':
          response = await axios.put(`http://localhost:5000/api/admin/orders/${selectedOrderId}/ship`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
        case 'deliver':
          response = await axios.put(`http://localhost:5000/api/admin/orders/${selectedOrderId}/deliver`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
        case 'cancel':
          response = await axios.put(`http://localhost:5000/api/admin/orders/${selectedOrderId}/cancel`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
        case 'delete':
          response = await axios.delete(`http://localhost:5000/api/admin/orders/${selectedOrderId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          break;
        default:
          return;
      }
      
      if (response.data?.success || response.status === 200) {
        await fetchOrders();

        refreshOrders();
        refreshProducts();
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert(error.response?.data?.error || 'Ошибка при выполнении действия');
    } finally {
      setShowModal(false);
      setModalAction(null);
      setSelectedOrderId(null);
    }
  };
  
  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Ожидает обработки';
      case 'processing': return 'В обработке';
      case 'shipped': return 'Отправлен';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменён';
      case 'rejected': return 'Отклонён';
      default: return status;
    }
  };
  
  if (loading) {
    return (
      <AdminOrdersContainer>
        <ContentWrapper>
          <EmptyMessage>Загрузка...</EmptyMessage>
        </ContentWrapper>
      </AdminOrdersContainer>
    );
  }
  
  return (
    <>
      <AdminOrdersContainer>
        <ContentWrapper>
          <BackButton onClick={() => navigate('/admin')}>← Назад в админ-панель</BackButton>
          <Title>Управление заказами</Title>
          
          {orders.length === 0 ? (
            <EmptyMessage>Заказов пока нет</EmptyMessage>
          ) : (
            <OrdersTable>
              <thead>
                <tr>
                  <Th>№ заказа</Th>
                  <Th>Покупатель</Th>
                  <Th>Сумма</Th>
                  <Th>Дата</Th>
                  <Th>Статус</Th>
                  <Th>Действия</Th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <Td>{order.order_number}</Td>
                    <Td>{order.first_name || order.email}</Td>
                    <Td>{order.total_amount.toLocaleString()} ₽</Td>
                    <Td>{new Date(order.created_at).toLocaleDateString('ru-RU')}</Td>
                    <Td>
                      <StatusBadge status={order.status}>
                        {getStatusText(order.status)}
                      </StatusBadge>
                    </Td>
                    <Td>
                      {/* Статус: Ожидает обработки */}
                      {order.status === 'pending' && (
                        <>
                          <ActionButton $success onClick={() => showConfirmModal('accept', order.id, 'Принять заказ', `Вы уверены, что хотите принять заказ №${order.order_number}?`)}>
                            Принять
                          </ActionButton>
                            <ActionButton $danger onClick={() => showConfirmModal('cancel', order.id, 'Отменить заказ', `Вы уверены, что хотите отменить заказ №${order.order_number}?`)}>
                            Отменить
                          </ActionButton>
                        </>
                      )}
                      
                      {/* Статус: В обработке */}
                      {order.status === 'processing' && (
                        <>
                          <ActionButton $success onClick={() => showConfirmModal('ship', order.id, 'Отправить заказ', `Вы уверены, что хотите отправить заказ №${order.order_number}?`)}>
                            Отправить
                          </ActionButton>
                          <ActionButton $danger onClick={() => showConfirmModal('cancel', order.id, 'Отменить заказ', `Вы уверены, что хотите отменить заказ №${order.order_number}?`)}>
                            Отменить
                          </ActionButton>
                        </>
                      )}
                      
                      {/* Статус: Отправлен */}
                      {order.status === 'shipped' && (
                        <>
                          <ActionButton $success onClick={() => showConfirmModal('deliver', order.id, 'Доставить заказ', `Вы уверены, что хотите подтвердить доставку заказа №${order.order_number}?`)}>
                            Доставить
                          </ActionButton>
                          <ActionButton $danger onClick={() => showConfirmModal('cancel', order.id, 'Отменить заказ', `Вы уверены, что хотите отменить заказ №${order.order_number}?`)}>
                            Отменить
                          </ActionButton>
                        </>
                      )}
                      
                      {/* Статус: Отменён или Отклонён и показываем кнопку Удалить */}
                      {(order.status === 'cancelled' || order.status === 'rejected') && (
                        <ActionButton $danger onClick={() => showConfirmModal('delete', order.id, 'Удалить заказ', `Вы уверены, что хотите УДАЛИТЬ заказ №${order.order_number}? Это действие нельзя отменить!`)}>
                          Удалить
                        </ActionButton>
                      )}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </OrdersTable>
          )}
        </ContentWrapper>
      </AdminOrdersContainer>
      
      {/* МОДАЛЬНОЕ ОКНО ПОДТВЕРЖДЕНИЯ */}
      {showModal && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>{modalTitle}</ModalTitle>
            <ModalText>{modalText}</ModalText>
            <ModalButtons>
              <ModalConfirmButton onClick={handleConfirmAction}>
                Да
              </ModalConfirmButton>
              <ModalCancelButton onClick={() => setShowModal(false)}>
                Отмена
              </ModalCancelButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default AdminOrdersPage;