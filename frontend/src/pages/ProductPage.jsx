// frontend/src/pages/ProductPage.jsx
// СТРАНИЦА ТОВАРА
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styled, { keyframes } from 'styled-components';
import api from '../api';

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

const ProductContainer = styled.div`
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

const ProductCard = styled.div`
  background: rgba(236, 228, 217, 0.95);
  border-radius: 20px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImage = styled.div`
  background-image: url(${props => props.$image || '/images/placeholder.jpg'});
  background-size: cover;
  background-position: center;
  min-height: 500px;
  position: relative;
  
  @media (max-width: 768px) {
    min-height: 300px;
  }
`;

const BadgeContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 0.5rem;
  z-index: 1;
`;

const NewBadge = styled.span`
  background: #000000;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const SellBadge = styled.span`
  background: #eb7e7e;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const ProductInfo = styled.div`
  padding: 2rem;
`;

const ProductName = styled.h1`
  font-size: 2rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 0.5rem;
  letter-spacing: 2px;
`;

const ProductCategory = styled.p`
  font-size: 1rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #957B69;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ProductPrice = styled.p`
  font-size: 1.8rem;
  font-weight: 300;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 1rem;
`;

const ProductColor = styled.p`
  font-size: 1rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 1rem;
`;

const ProductDescription = styled.p`
  font-size: 1rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const CollectionName = styled.p`
  font-size: 0.9rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #957B69;
  margin-bottom: 1rem;
`;

const SizesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
`;

const SizeButton = styled.button`
  background: ${props => props.$selected ? '#5E524A' : 'transparent'};
  color: ${props => props.$selected ? '#EDE7DE' : '#5E524A'};
  border: 1px solid #5E524A;
  border-radius: 30px;
  padding: 0.5rem 1.2rem;
  font-size: 0.9rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: #5E524A;
    color: #EDE7DE;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const StockStatus = styled.p`
  font-size: 0.9rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: ${props => props.$inStock ? '#2e7d32' : '#c62828'};
  margin-bottom: 1rem;
`;

const AddToCartButton = styled.button`
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

const FavoriteButton = styled.button`
  width: 100%;
  background: transparent;
  color: #5E524A;
  border: 1px solid #5E524A;
  border-radius: 30px;
  padding: 1rem;
  font-size: 1rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    background: #5E524A;
    color: #EDE7DE;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: #FFFFFF;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 1.2rem;
  font-weight: 100;
  padding: 3rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: #c62828;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 1.2rem;
  font-weight: 100;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
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

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chosenSize, setChosenSize] = useState('');
  const [productSizes, setProductSizes] = useState([]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoText, setInfoText] = useState('');
  const [infoCallback, setInfoCallback] = useState(null);
  
  // Получаем данные о товаре
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`).then(res => res.data),
    enabled: !!id,
  });
  
  // Получаем размеры товара
  const { data: sizes = [] } = useQuery({
    queryKey: ['product-sizes', id],
    queryFn: () => api.get(`/products/${id}/sizes`).then(res => res.data),
    enabled: !!id,
  });
  
  useEffect(() => {
    if (sizes.length > 0) {
      setProductSizes(sizes);
    }
  }, [sizes]);
  
  const showInfoMessage = (title, text, callback = null) => {
    setInfoTitle(title);
    setInfoText(text);
    setInfoCallback(() => callback);
    setShowInfoModal(true);
  };
  
  const closeInfoModal = () => {
    setShowInfoModal(false);
    if (infoCallback) infoCallback();
    setInfoCallback(null);
  };
  
  const hasStock = productSizes.some(s => s.quantity > 0);
  
  const addToCart = async () => {
    if (!chosenSize) {
      showInfoMessage('Выберите размер', 'Пожалуйста, выберите размер товара');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      showInfoMessage('Требуется авторизация', 'Войдите в аккаунт, чтобы добавить товар в корзину', () => {
        navigate('/login');
      });
      return;
    }
    
    try {
      await api.post('/cart', { 
        product_id: parseInt(id), 
        quantity: 1, 
        size: chosenSize 
      });
      showInfoMessage('Товар добавлен', `"${product?.name}" добавлен в корзину (размер ${chosenSize})`);
    } catch (error) {
      console.error('Ошибка:', error);
      showInfoMessage('Ошибка', 'Ошибка при добавлении в корзину');
    }
  };
  
  const addToFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      showInfoMessage('Требуется авторизация', 'Войдите в аккаунт, чтобы добавить товар в избранное', () => {
        navigate('/login');
      });
      return;
    }
    
    try {
      await api.post('/favorites', { product_id: parseInt(id) });
      showInfoMessage('Успешно', 'Товар добавлен в избранное');
    } catch (error) {
      console.error('Ошибка:', error);
      showInfoMessage('Ошибка', 'Ошибка при добавлении в избранное');
    }
  };
  
  if (isLoading) {
    return (
      <ProductContainer>
        <ContentWrapper>
          <LoadingMessage>Загрузка...</LoadingMessage>
        </ContentWrapper>
      </ProductContainer>
    );
  }
  
  if (error || !product) {
    return (
      <ProductContainer>
        <ContentWrapper>
          <ErrorMessage>Товар не найден</ErrorMessage>
          <BackButton onClick={() => navigate(-1)}>← Назад</BackButton>
        </ContentWrapper>
      </ProductContainer>
    );
  }
  
  return (
    <>
      <ProductContainer>
        <ContentWrapper>
          <BackButton onClick={() => navigate(-1)}>← Назад</BackButton>
          
          <ProductCard>
            <ProductImage $image={product.image_url}>
              <BadgeContainer>
                {product.is_new && <NewBadge>NEW</NewBadge>}
                {product.is_promotion && <SellBadge>SELL</SellBadge>}
              </BadgeContainer>
            </ProductImage>
            
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductCategory>{product.category}</ProductCategory>
              <ProductPrice>{product.price.toLocaleString()} ₽</ProductPrice>
              <ProductColor>Цвет: {product.color || 'Не указан'}</ProductColor>
              <CollectionName>Коллекция: {product.collection_name || '—'}</CollectionName>
              <ProductDescription>{product.description || 'Описание отсутствует'}</ProductDescription>
              
              <StockStatus $inStock={hasStock}>
                {hasStock ? 'В наличии' : 'Нет в наличии'}
              </StockStatus>
              
              {productSizes.length > 0 && (
                <SizesContainer>
                  {productSizes.map(size => (
                    <SizeButton
                      key={size.size}
                      $selected={chosenSize === size.size}
                      onClick={() => size.quantity > 0 && setChosenSize(size.size)}
                      disabled={size.quantity === 0}
                    >
                      {size.size} {size.quantity > 0 ? `(${size.quantity})` : '(нет)'}
                    </SizeButton>
                  ))}
                </SizesContainer>
              )}
              
              <AddToCartButton onClick={addToCart} disabled={!hasStock}>
                В КОРЗИНУ
              </AddToCartButton>
              
              <FavoriteButton onClick={addToFavorites}>
                ♡ В ИЗБРАННОЕ
              </FavoriteButton>
            </ProductInfo>
          </ProductCard>
        </ContentWrapper>
      </ProductContainer>
      
      {/* МОДАЛЬНОЕ ОКНО ИНФОРМАЦИИ */}
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

export default ProductPage;