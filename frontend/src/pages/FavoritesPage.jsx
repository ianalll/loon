// СТРАНИЦА ИЗБРАННОГО
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

const FavoritesContainer = styled.div`
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

const PageTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  letter-spacing: 6px;
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.2rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  letter-spacing: 2px;
  color: #EDE7DE;
  text-align: center;
  margin-bottom: 2rem;
`;

// СЕТКА ТОВАРОВ
const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background: rgba(236, 228, 217, 0.95);
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.div`
  background: #D0CBC4;
  height: 350px;
  background-image: url(${props => props.$image || '/images/placeholder.jpg'});
  background-size: cover;
  background-position: center;
  position: relative;
`;

// СТИЛИ ДЛЯ ПОМЕТОК NEW И SELL
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
  padding: 1.2rem;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
`;

const ProductPrice = styled.p`
  font-size: 1rem;
  font-weight: 300;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 0.5rem;
`;

const ProductStock = styled.p`
  font-size: 0.8rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: ${props => props.$inStock ? '#2e7d32' : '#c62828'};
  margin-bottom: 0.5rem;
`;

const SizesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const SizeBadge = styled.span`
  display: inline-block;
  background: ${props => props.$inStock ? 'rgba(94, 82, 74, 0.1)' : 'rgba(198, 40, 40, 0.1)'};
  color: ${props => props.$inStock ? '#5E524A' : '#c62828'};
  border: 1px solid ${props => props.$inStock ? '#5E524A' : '#c62828'};
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  opacity: ${props => props.$inStock ? 1 : 0.5};
`;

const CollectionName = styled.p`
  font-size: 0.75rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #957B69;
  margin-bottom: 0.8rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
`;

const ActionButton = styled.button`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #5E524A;
  border-radius: 30px;
  background: transparent;
  color: #5E524A;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.7rem;
  font-weight: 100;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5E524A;
    color: #EDE7DE;
  }
`;

const RemoveButton = styled.button`
  background: transparent;
  color: #c62828;
  border: 1px solid #c62828;
  border-radius: 30px;
  padding: 0.5rem;
  font-size: 0.7rem;
  font-weight: 100;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  
  &:hover {
    background: #c62828;
    color: white;
  }
`;

const EmptyMessage = styled.div`
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

// МО ДЛЯ ВЫБОРА РАЗМЕРА
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
  width: 320px;
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

const ModalSizes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  justify-content: center;
  margin: 1.5rem 0;
`;

const ModalSizeButton = styled.button`
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
  
  &:hover {
    background: #5E524A;
    color: #EDE7DE;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
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

// МО ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ
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

// МО ИНФОРМАЦИИ
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

const FavoritesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [favorites, setFavorites] = useState([]);
  const [productSizes, setProductSizes] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Состояния для модального окна выбора размера
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductSizes, setSelectedProductSizes] = useState([]);
  const [chosenSize, setChosenSize] = useState('');
  
  // Состояния для модального окна подтверждения
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmProductId, setConfirmProductId] = useState(null);
  
  // Состояния для информационных модальных окон
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoText, setInfoText] = useState('');
  const [infoCallback, setInfoCallback] = useState(null);
  
  // Автообновление избранного при возвращении на страницу
  useEffect(() => {
    const handleFocus = () => {
      queryClient.invalidateQueries(['favorites']);
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [queryClient]);
  
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
  
  const showConfirmMessage = (title, text, onConfirm, productId) => {
    setConfirmAction(() => onConfirm);
    setConfirmProductId(productId);
    setShowConfirmModal(true);
  };
  
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
    setConfirmProductId(null);
  };
  
  const checkAuthAndFetchFavorites = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    await fetchFavorites();
  };
  
  const fetchFavorites = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data);
      
      const sizesPromises = response.data.map(item => 
        axios.get(`http://localhost:5000/api/products/${item.product_id}/sizes`).catch(() => ({ data: [] }))
      );
      const sizesResults = await Promise.all(sizesPromises);
      
      const sizesMap = {};
      response.data.forEach((item, index) => {
        sizesMap[item.product_id] = sizesResults[index].data;
      });
      setProductSizes(sizesMap);
      
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
      showInfoMessage('Ошибка', 'Не удалось загрузить избранное');
    } finally {
      setLoading(false);
    }
  };
  
  const removeFromFavorites = async (productId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchFavorites();
      queryClient.invalidateQueries(['favorites']);
      showInfoMessage('Удалено', 'Товар удалён из избранного');
    } catch (error) {
      console.error('Ошибка удаления:', error);
      showInfoMessage('Ошибка', 'Ошибка при удалении из избранного');
    }
  };
  
  const openSizeModal = (product) => {
    const sizes = productSizes[product.product_id] || [];
    const availableSizes = sizes.filter(s => s.quantity > 0);
    
    if (availableSizes.length === 0) {
      showInfoMessage('Нет размеров', 'Нет доступных размеров для этого товара');
      return;
    }
    
    setSelectedProduct(product);
    setSelectedProductSizes(sizes);
    setChosenSize('');
    setShowSizeModal(true);
  };
  
  const addToCart = async () => {
    if (!chosenSize) {
      showInfoMessage('Выберите размер', 'Пожалуйста, выберите размер товара');
      return;
    }
    
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:5000/api/cart', 
        { product_id: selectedProduct.product_id, quantity: 1, size: chosenSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showInfoMessage('Товар добавлен', `"${selectedProduct.name}" добавлен в корзину (размер ${chosenSize})`, () => {
        setShowSizeModal(false);
        setSelectedProduct(null);
        setChosenSize('');
        queryClient.invalidateQueries(['cart']);
      });
    } catch (error) {
      console.error('Ошибка:', error);
      showInfoMessage('Ошибка', 'Ошибка при добавлении в корзину');
    }
  };
  
  useEffect(() => {
    checkAuthAndFetchFavorites();
  }, []);
  
  if (loading) {
    return (
      <FavoritesContainer>
        <ContentWrapper>
          <EmptyMessage>
            <p>Загрузка...</p>
          </EmptyMessage>
        </ContentWrapper>
      </FavoritesContainer>
    );
  }
  
  if (favorites.length === 0) {
    return (
      <FavoritesContainer>
        <ContentWrapper>
          <EmptyMessage>
            <p>Ваше избранное пусто</p>
            <ContinueButton onClick={() => navigate('/collections')}>
              Перейти к покупкам
            </ContinueButton>
          </EmptyMessage>
        </ContentWrapper>
      </FavoritesContainer>
    );
  }
  
  return (
    <>
      <FavoritesContainer>
        <ContentWrapper>
          <PageTitle>ИЗБРАННОЕ</PageTitle>
          <Description>
            ТОВАРЫ, КОТОРЫЕ ВАМ ПОНРАВИЛИСЬ
          </Description>
          
          <ProductsGrid>
            {favorites.map(item => {
              const sizes = productSizes[item.product_id] || [];
              const hasStock = sizes.some(s => s.quantity > 0);
              
              return (
                <ProductCard key={item.id}>
                  <ProductImage $image={item.image_url}>
                    <BadgeContainer>
                      {item.is_new && <NewBadge>NEW</NewBadge>}
                      {item.is_promotion && <SellBadge>SELL</SellBadge>}
                    </BadgeContainer>
                  </ProductImage>
                  <ProductInfo>
                    <ProductStock $inStock={hasStock}>
                      {hasStock ? 'В наличии' : 'Нет в наличии'}
                    </ProductStock>
                    <ProductName>{item.name}</ProductName>
                    <ProductPrice>{item.price.toLocaleString()} ₽</ProductPrice>
                    
                    {sizes.length > 0 && (
                      <SizesContainer>
                        {sizes.map(size => (
                          <SizeBadge key={size.size} $inStock={size.quantity > 0}>
                            {size.size} {size.quantity > 0 ? `(${size.quantity})` : ''}
                          </SizeBadge>
                        ))}
                      </SizesContainer>
                    )}
                    
                    <CollectionName>
                      Коллекция: {item.collection_name || '—'}
                    </CollectionName>
                    
                    <ButtonGroup>
                      <ActionButton onClick={() => openSizeModal(item)}>
                        В КОРЗИНУ
                      </ActionButton>
                      <RemoveButton onClick={() => showConfirmMessage('Удалить из избранного', `Вы уверены, что хотите удалить товар "${item.name}" из избранного?`, () => removeFromFavorites(item.product_id), item.product_id)}>
                        УДАЛИТЬ
                      </RemoveButton>
                    </ButtonGroup>
                  </ProductInfo>
                </ProductCard>
              );
            })}
          </ProductsGrid>
        </ContentWrapper>
      </FavoritesContainer>
      
      {/* МО ВЫБОРА РАЗМЕРА */}
      {showSizeModal && selectedProduct && (
        <ModalOverlay onClick={() => setShowSizeModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalTitle>Выберите размер</ModalTitle>
            <ModalTitle style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
              {selectedProduct.name}
            </ModalTitle>
            
            <ModalSizes>
              {selectedProductSizes.map(size => (
                <ModalSizeButton
                  key={size.size}
                  $selected={chosenSize === size.size}
                  onClick={() => size.quantity > 0 && setChosenSize(size.size)}
                  disabled={size.quantity === 0}
                >
                  {size.size} {size.quantity > 0 ? `(${size.quantity})` : '(нет)'}
                </ModalSizeButton>
              ))}
            </ModalSizes>
            
            <ModalButtons>
              <ModalConfirmButton onClick={addToCart}>
                Добавить в корзину
              </ModalConfirmButton>
              <ModalCancelButton onClick={() => setShowSizeModal(false)}>
                Отмена
              </ModalCancelButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* МО ПОДТВЕРЖДЕНИЯ УДАЛЕНИЯ */}
      {showConfirmModal && (
        <ConfirmModalOverlay onClick={closeConfirmModal}>
          <ConfirmModalContent onClick={e => e.stopPropagation()}>
            <ConfirmModalTitle>Подтверждение</ConfirmModalTitle>
            <ConfirmModalText>Вы уверены, что хотите удалить этот товар из избранного?</ConfirmModalText>
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

export default FavoritesPage;