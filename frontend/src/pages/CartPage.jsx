// СТРАНИЦА КОРЗИНЫ
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

const CartContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #D0CBC4 0%, #957B69 100%);
  padding-top: 120px;
  padding-bottom: 80px;
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  letter-spacing: 6px;
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 2rem;
`;

const CartTable = styled.table`
  width: 100%;
  background: rgba(236, 228, 217, 0.95);
  border-radius: 20px;
  overflow: hidden;
  border-collapse: collapse;
  margin-bottom: 2rem;
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
  padding: 1rem;
  border-bottom: 1px solid rgba(94, 82, 74, 0.1);
  color: #5E524A;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.9rem;
  font-weight: 100;
  vertical-align: middle;
`;

const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 10px;
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 0.3rem;
  border: 1px solid rgba(94, 82, 74, 0.3);
  border-radius: 10px;
  text-align: center;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #5E524A;
  }
`;

const RemoveButton = styled.button`
  background: transparent;
  color: #c62828;
  border: 1px solid #c62828;
  border-radius: 20px;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.7rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: #c62828;
    color: white;
  }
`;

const SummaryCard = styled.div`
  background: rgba(236, 228, 217, 0.95);
  border-radius: 20px;
  padding: 1.5rem;
  margin-top: 1rem;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(94, 82, 74, 0.1);
  
  &:last-child {
    border-bottom: none;
    font-weight: 400;
    font-size: 1.1rem;
    color: #5E524A;
  }
`;

const SummaryLabel = styled.span`
  color: #957B69;
`;

const SummaryValue = styled.span`
  color: #5E524A;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: #5E524A;
  color: #EDE7DE;
  border: none;
  border-radius: 30px;
  padding: 0.7rem 1.5rem;
  font-size: 0.9rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #6b5e55;
    transform: scale(1.02);
  }
`;

const ContinueButton = styled.button`
  background: transparent;
  color: #5E524A;
  border: 1px solid #5E524A;
  border-radius: 30px;
  padding: 0.7rem 1.5rem;
  font-size: 0.9rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5E524A;
    color: #EDE7DE;
    transform: scale(1.02);
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 3rem;
  background: rgba(236, 228, 217, 0.95);
  border-radius: 20px;
  
  p {
    color: #5E524A;
    font-family: 'BlackerSans Pro', sans-serif;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
`;

// МОДАЛЬНОЕ ОКНО
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

const InfoModal = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  width: 350px;
  max-width: 90%;
  text-align: center;
`;

const InfoTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 1rem;
`;

const InfoText = styled.p`
  font-size: 0.9rem;
  color: #5E524A;
  margin-bottom: 1.5rem;
`;

const InfoCloseButton = styled.button`
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

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // МО
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [infoTitle, setInfoTitle] = useState('');
  const [infoText, setInfoText] = useState('');
  
  useEffect(() => {
    checkAuthAndFetchCart();
  }, []);
  
  const checkAuthAndFetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    await fetchCart();
  };
  
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
      showInfoMessage('Ошибка', 'Не удалось загрузить корзину');
    } finally {
      setLoading(false);
    }
  };
  
  const showConfirmMessage = (title, text, onConfirm) => {
    setConfirmTitle(title);
    setConfirmText(text);
    setConfirmAction(() => onConfirm);
    setShowConfirmModal(true);
  };
  
  const showInfoMessage = (title, text) => {
    setInfoTitle(title);
    setInfoText(text);
    setShowInfoModal(true);
  };
  
  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setShowConfirmModal(false);
    setConfirmAction(null);
  };
  
  const updateQuantity = async (cartId, productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(cartId);
      return;
    }
    
    setUpdating(true);
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/cart/${cartId}`, 
        { quantity: newQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (error) {
      console.error('Ошибка обновления:', error);
      showInfoMessage('Ошибка', 'Ошибка при обновлении количества');
    } finally {
      setUpdating(false);
    }
  };
  
  const removeFromCart = async (cartId) => {
    showConfirmMessage('Удалить товар', 'Вы уверены, что хотите удалить этот товар из корзины?', async () => {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/cart/${cartId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchCart();
        showInfoMessage('Успешно', 'Товар удалён из корзины');
      } catch (error) {
        console.error('Ошибка удаления:', error);
        showInfoMessage('Ошибка', 'Ошибка при удалении товара');
      }
    });
  };
  
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  if (loading) {
    return (
      <CartContainer>
        <ContentWrapper>
          <EmptyCart>
            <p>Загрузка...</p>
          </EmptyCart>
        </ContentWrapper>
      </CartContainer>
    );
  }
  
  if (cart.length === 0) {
    return (
      <CartContainer>
        <ContentWrapper>
          <EmptyCart>
            <p>Ваша корзина пуста</p>
            <ContinueButton onClick={() => navigate('/collections')}>
              Продолжить покупки
            </ContinueButton>
          </EmptyCart>
        </ContentWrapper>
      </CartContainer>
    );
  }
  
  return (
    <>
      <CartContainer>
        <ContentWrapper>
          <PageTitle>КОРЗИНА</PageTitle>
          
          <CartTable>
            <thead>
              <tr>
                <Th>Товар</Th>
                <Th>Название</Th>
                <Th>Размер</Th>
                <Th>Цена</Th>
                <Th>Количество</Th>
                <Th>Сумма</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <Td>
                    <ProductImage src={item.image_url || '/images/placeholder.jpg'} alt={item.name} />
                  </Td>
                  <Td>{item.name}</Td>
                  <Td>{item.size || '—'}</Td>
                  <Td>{item.price.toLocaleString()} ₽</Td>
                  <Td>
                    <QuantityInput 
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, item.product_id, parseInt(e.target.value) || 1)}
                      disabled={updating}
                    />
                  </Td>
                  <Td>{(item.price * item.quantity).toLocaleString()} ₽</Td>
                  <Td>
                    <RemoveButton onClick={() => removeFromCart(item.id)}>
                      Удалить
                    </RemoveButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </CartTable>
          
          <SummaryCard>
            <SummaryRow>
              <SummaryLabel>Товаров в корзине:</SummaryLabel>
              <SummaryValue>{cart.reduce((sum, item) => sum + item.quantity, 0)} шт.</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Общая сумма:</SummaryLabel>
              <SummaryValue>{calculateTotal().toLocaleString()} ₽</SummaryValue>
            </SummaryRow>
            
            <ButtonGroup>
              <ContinueButton onClick={() => navigate('/collections')}>
                Продолжить покупки
              </ContinueButton>
              <ActionButton onClick={() => navigate('/checkout')}>
                Оформить заказ
              </ActionButton>
            </ButtonGroup>
          </SummaryCard>
        </ContentWrapper>
      </CartContainer>
      
      {/* МО ПОДТВЕРЖДЕНИЯ */}
      {showConfirmModal && (
        <ModalOverlay onClick={() => setShowConfirmModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>{confirmTitle}</ModalTitle>
            <ModalText>{confirmText}</ModalText>
            <ModalButtons>
              <ModalConfirmButton onClick={handleConfirm}>Да</ModalConfirmButton>
              <ModalCancelButton onClick={() => setShowConfirmModal(false)}>Отмена</ModalCancelButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* МО ИНФОРМАЦИИ */}
      {showInfoModal && (
        <ModalOverlay onClick={() => setShowInfoModal(false)}>
          <InfoModal onClick={e => e.stopPropagation()}>
            <InfoTitle>{infoTitle}</InfoTitle>
            <InfoText>{infoText}</InfoText>
            <InfoCloseButton onClick={() => setShowInfoModal(false)}>OK</InfoCloseButton>
          </InfoModal>
        </ModalOverlay>
      )}
    </>
  );
};

export default CartPage;