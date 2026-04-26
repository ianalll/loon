// frontend/src/pages/CheckoutPage.jsx
// СТРАНИЦА ОФОРМЛЕНИЯ ЗАКАЗА
import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddressFields from '../components/AddressFields';

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

const CheckoutContainer = styled.div`
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

const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormCard = styled.div`
  background: rgba(236, 228, 217, 0.95);
  border-radius: 20px;
  padding: 1.8rem;
`;

const SummaryCard = styled.div`
  background: rgba(236, 228, 217, 0.95);
  border-radius: 20px;
  padding: 1.8rem;
  height: fit-content;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  letter-spacing: 2px;
  color: #5E524A;
  margin-bottom: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(94, 82, 74, 0.2);
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.8rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 0.3rem;
  letter-spacing: 1px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  border: 1px solid rgba(94, 82, 74, 0.3);
  border-radius: 12px;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.9rem;
  font-weight: 100;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #5E524A;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(94, 82, 74, 0.1);
`;

const OrderItemName = styled.span`
  color: #5E524A;
  font-size: 0.9rem;
`;

const OrderItemPrice = styled.span`
  color: #5E524A;
  font-size: 0.9rem;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
  margin-top: 1rem;
  border-top: 2px solid rgba(94, 82, 74, 0.2);
  font-weight: 400;
  font-size: 1.1rem;
  color: #5E524A;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #5E524A;
  color: #EDE7DE;
  border: none;
  border-radius: 30px;
  padding: 1rem;
  font-size: 1rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: #6b5e55;
    transform: scale(1.02);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: rgba(198, 40, 40, 0.1);
  border: 1px solid #c62828;
  border-radius: 10px;
  padding: 0.8rem;
  color: #c62828;
  font-size: 0.8rem;
  margin-bottom: 1rem;
`;

// РЕКВИЗИТЫ ДЛЯ ОПЛАТЫ
const PaymentSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(94, 82, 74, 0.2);
`;

const PaymentTitle = styled.h3`
  font-size: 1rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 0.8rem;
  letter-spacing: 1px;
`;

const PaymentDetails = styled.div`
  background: rgba(94, 82, 74, 0.05);
  border-radius: 12px;
  padding: 1rem;
  margin-top: 0.5rem;
`;

const PaymentRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  font-size: 0.85rem;
  color: #5E524A;
`;

const PaymentLabel = styled.span`
  font-weight: 100;
  color: #957B69;
`;

const PaymentValue = styled.span`
  font-weight: 300;
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

const ModalButton = styled.button`
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

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const [formData, setFormData] = useState({
    recipient_name: '',
    recipient_phone: '',
    shipping_city: '',
    shipping_street: '',
    shipping_house: '',
    shipping_apartment: '',
    shipping_entrance: '',
    shipping_floor: '',
    shipping_postal_code: ''
  });
  
  // Данные для оплаты картой
  const [cardData, setCardData] = useState({
    card_number: '',
    card_holder: '',
    expiry_date: '',
    cvv: ''
  });
  
  useEffect(() => {
    checkAuthAndFetchCart();
    loadUserProfile(); // ← ДОБАВЛЕНО
  }, []);
  
  // Новая функция: загружаем данные из профиля
  const loadUserProfile = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData(prev => ({
        ...prev,
        recipient_name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        recipient_phone: user.phone || ''
      }));
    }
  };
  
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
      if (response.data.length === 0) {
        navigate('/cart');
        return;
      }
      setCart(response.data);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };
  
  const handleAddressUpdate = (updates) => {
    setFormData({ ...formData, ...updates });
    setError('');
  };
  
  const handleCardChange = (e) => {
    let value = e.target.value;
    const name = e.target.name;
    
    if (name === 'card_number') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.slice(0, 19);
    }
    
    if (name === 'expiry_date') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + (value.length > 2 ? '/' + value.slice(2, 4) : '');
      }
      if (value.length > 5) value = value.slice(0, 5);
    }
    
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    
    setCardData({ ...cardData, [name]: value });
  };
  
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };
  
  const validateForm = () => {
    if (!formData.recipient_name.trim()) {
      setError('Введите имя получателя');
      return false;
    }
    if (!formData.recipient_phone.trim()) {
      setError('Введите телефон получателя');
      return false;
    }
    if (!formData.shipping_city.trim()) {
      setError('Введите город');
      return false;
    }
    if (!formData.shipping_street.trim()) {
      setError('Введите улицу');
      return false;
    }
    if (!formData.shipping_house.trim()) {
      setError('Введите номер дома');
      return false;
    }
    
    const cardNumberClean = cardData.card_number.replace(/\s/g, '');
    if (cardNumberClean.length !== 16) {
      setError('Введите корректный номер карты (16 цифр)');
      return false;
    }
    if (!cardData.card_holder.trim()) {
      setError('Введите имя держателя карты');
      return false;
    }
    if (cardData.expiry_date.length !== 5) {
      setError('Введите корректную дату (ММ/ГГ)');
      return false;
    }
    if (cardData.cvv.length !== 3) {
      setError('Введите корректный CVV код (3 цифры)');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('http://localhost:5000/api/orders', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      setError(error.response?.data?.error || 'Ошибка при оформлении заказа');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    navigate('/profile');
  };
  
  if (loading) {
    return (
      <CheckoutContainer>
        <ContentWrapper>
          <div style={{ textAlign: 'center', color: 'white' }}>Загрузка...</div>
        </ContentWrapper>
      </CheckoutContainer>
    );
  }
  
  return (
    <>
      <CheckoutContainer>
        <ContentWrapper>
          <PageTitle>ОФОРМЛЕНИЕ ЗАКАЗА</PageTitle>
          
          <TwoColumns>
            {/* ЛЕВАЯ КОЛОНКА - ФОРМА */}
            <FormCard>
              <SectionTitle>Данные получателя</SectionTitle>
              
              {error && <ErrorMessage>{error}</ErrorMessage>}
              
              <form onSubmit={handleSubmit}>
                <InputGroup>
                  <Label>Имя получателя *</Label>
                  <Input
                    type="text"
                    name="recipient_name"
                    value={formData.recipient_name}
                    onChange={handleChange}
                    placeholder="Иванов Иван"
                  />
                </InputGroup>
                
                <InputGroup>
                  <Label>Телефон получателя *</Label>
                  <Input
                    type="tel"
                    name="recipient_phone"
                    value={formData.recipient_phone}
                    onChange={handleChange}
                    placeholder="+7 (999) 123-45-67"
                  />
                </InputGroup>
                
                <SectionTitle>Адрес доставки</SectionTitle>
                
                {/* КОМПОНЕНТ АДРЕСА С ПОДСКАЗКАМИ DADATA */}
                <AddressFields 
                  formData={formData} 
                  onChange={handleAddressUpdate} 
                />
                
                {/* ОПЛАТА БАНКОВСКОЙ КАРТОЙ */}
                <PaymentSection>
                  <PaymentTitle>Оплата банковской картой</PaymentTitle>
                  <PaymentDetails>
                    <PaymentRow>
                      <PaymentLabel>Номер карты:</PaymentLabel>
                      <PaymentValue>
                        <Input
                          type="text"
                          name="card_number"
                          value={cardData.card_number}
                          onChange={handleCardChange}
                          placeholder="1234 5678 9012 3456"
                          style={{ width: '100%', marginTop: '0.3rem' }}
                        />
                      </PaymentValue>
                    </PaymentRow>
                    <PaymentRow>
                      <PaymentLabel>Держатель карты:</PaymentLabel>
                      <PaymentValue>
                        <Input
                          type="text"
                          name="card_holder"
                          value={cardData.card_holder}
                          onChange={handleCardChange}
                          placeholder="IVAN IVANOV"
                          style={{ width: '100%', marginTop: '0.3rem' }}
                        />
                      </PaymentValue>
                    </PaymentRow>
                    <Row>
                      <PaymentRow style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <PaymentLabel>Срок действия:</PaymentLabel>
                        <PaymentValue>
                          <Input
                            type="text"
                            name="expiry_date"
                            value={cardData.expiry_date}
                            onChange={handleCardChange}
                            placeholder="ММ/ГГ"
                            style={{ width: '100px', marginTop: '0.3rem' }}
                          />
                        </PaymentValue>
                      </PaymentRow>
                      <PaymentRow style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <PaymentLabel>CVV код:</PaymentLabel>
                        <PaymentValue>
                          <Input
                            type="password"
                            name="cvv"
                            value={cardData.cvv}
                            onChange={handleCardChange}
                            placeholder="***"
                            style={{ width: '70px', marginTop: '0.3rem' }}
                            maxLength="3"
                          />
                        </PaymentValue>
                      </PaymentRow>
                    </Row>
                  </PaymentDetails>
                </PaymentSection>
                
                <SubmitButton type="submit" disabled={submitting}>
                  {submitting ? 'ОФОРМЛЕНИЕ...' : 'ПОДТВЕРДИТЬ ЗАКАЗ'}
                </SubmitButton>
              </form>
            </FormCard>
            
            {/* ПРАВАЯ КОЛОНКА - СУММАРИ */}
            <SummaryCard>
              <SectionTitle>Ваш заказ</SectionTitle>
              
              {cart.map(item => (
                <OrderItem key={item.id}>
                  <OrderItemName>
                    {item.name} (размер {item.size}) x {item.quantity}
                  </OrderItemName>
                  <OrderItemPrice>
                    {(item.price * item.quantity).toLocaleString()} ₽
                  </OrderItemPrice>
                </OrderItem>
              ))}
              
              <TotalRow>
                <span>Итого:</span>
                <span>{calculateTotal().toLocaleString()} ₽</span>
              </TotalRow>
              
              {/* РЕКВИЗИТЫ ДЛЯ ОПЛАТЫ */}
              <PaymentSection>
                <PaymentTitle>Реквизиты для оплаты</PaymentTitle>
                <PaymentDetails>
                  <PaymentRow>
                    <PaymentLabel>Получатель:</PaymentLabel>
                    <PaymentValue>ИП Иванова А.А.</PaymentValue>
                  </PaymentRow>
                  <PaymentRow>
                    <PaymentLabel>ИНН:</PaymentLabel>
                    <PaymentValue>123456789012</PaymentValue>
                  </PaymentRow>
                  <PaymentRow>
                    <PaymentLabel>Расчётный счёт:</PaymentLabel>
                    <PaymentValue>40817810000000000000</PaymentValue>
                  </PaymentRow>
                  <PaymentRow>
                    <PaymentLabel>Банк:</PaymentLabel>
                    <PaymentValue>АО "Т-Банк"</PaymentValue>
                  </PaymentRow>
                  <PaymentRow>
                    <PaymentLabel>БИК:</PaymentLabel>
                    <PaymentValue>044525974</PaymentValue>
                  </PaymentRow>
                  <PaymentRow>
                    <PaymentLabel>Корр. счёт:</PaymentLabel>
                    <PaymentValue>30101810400000000225</PaymentValue>
                  </PaymentRow>
                </PaymentDetails>
              </PaymentSection>
            </SummaryCard>
          </TwoColumns>
        </ContentWrapper>
      </CheckoutContainer>
      
      {/* МОДАЛЬНОЕ ОКНО УСПЕХА */}
      {showSuccessModal && (
        <ModalOverlay onClick={handleSuccessClose}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Заказ оформлен!</ModalTitle>
            <ModalText>Ваш заказ успешно оформлен. Вы можете отслеживать его в личном кабинете.</ModalText>
            <ModalButton onClick={handleSuccessClose}>OK</ModalButton>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default CheckoutPage;