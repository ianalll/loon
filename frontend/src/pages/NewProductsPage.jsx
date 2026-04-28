// СТРАНИЦА НОВИНОК
import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
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

const NewProductsContainer = styled.div`
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
  color: #5E524A;
  text-align: center;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  font-size: 1.2rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  letter-spacing: 2px;
  color: #5E524A;
  text-align: center;
  margin-bottom: 2rem;
`;

// ПОИСК
const SearchSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 500px;
  padding: 0.8rem 1.5rem;
  border: 1px solid #5E524A;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.9);
  color: #5E524A;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.9rem;
  font-weight: 100;
  
  &::placeholder {
    color: rgba(94, 82, 74, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #5E524A;
    box-shadow: 0 0 0 2px rgba(94, 82, 74, 0.2);
  }
`;

// БЛОК ФИЛЬТРОВ
const FilterSection = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  background: rgba(236, 228, 217, 0.3);
  padding: 1.2rem;
  border-radius: 50px;
  backdrop-filter: blur(4px);
`;

const FilterSelect = styled.select`
  padding: 0.7rem 1.2rem;
  border: 1px solid #5E524A;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.9);
  color: #5E524A;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.85rem;
  font-weight: 100;
  cursor: pointer;
  min-width: 140px;
  
  option {
    background: white;
    color: #5E524A;
  }
  
  &:focus {
    outline: none;
    border-color: #5E524A;
    box-shadow: 0 0 0 2px rgba(94, 82, 74, 0.2);
  }
`;

const PriceGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.3rem 1.2rem;
  border-radius: 30px;
  border: 1px solid #5E524A;
`;

const PriceLabel = styled.span`
  color: #5E524A;
  font-size: 0.85rem;
  font-weight: 100;
`;

const PriceInput = styled.input`
  padding: 0.5rem 0.8rem;
  width: 100px;
  border: 1px solid rgba(94, 82, 74, 0.3);
  border-radius: 25px;
  background: white;
  color: #5E524A;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.85rem;
  font-weight: 100;
  text-align: center;
  
  &::placeholder {
    color: rgba(94, 82, 74, 0.4);
  }
  
  &:focus {
    outline: none;
    border-color: #5E524A;
  }
`;

const FilterButton = styled.button`
  padding: 0.7rem 1.5rem;
  border: 1px solid #5E524A;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.9);
  color: #5E524A;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.85rem;
  font-weight: 100;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5E524A;
    color: #EDE7DE;
    transform: scale(1.02);
  }
`;

const ResetButton = styled.button`
  padding: 0.7rem 1.5rem;
  border: 1px solid #c62828;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.9);
  color: #c62828;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.85rem;
  font-weight: 100;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #c62828;
    color: white;
    transform: scale(1.02);
  }
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

const EmptyMessage = styled.div`
  text-align: center;
  color: #FFFFFF;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 1.2rem;
  font-weight: 100;
  padding: 3rem;
`;

const ResultCount = styled.div`
  text-align: right;
  color: #EDE7DE;
  margin-bottom: 1rem;
  font-size: 0.9rem;
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

const NewProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [productSizes, setProductSizes] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Состояния для модального окна выбора размера
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductSizes, setSelectedProductSizes] = useState([]);
  const [chosenSize, setChosenSize] = useState('');
  
  // Состояния для информационных модальных окон
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoTitle, setInfoTitle] = useState('');
  const [infoText, setInfoText] = useState('');
  const [infoCallback, setInfoCallback] = useState(null);
  
  // Состояния фильтров
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  
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
    fetchData();
  }, []);
  
  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, selectedCollection, selectedSize, minPrice, maxPrice, products]);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, collectionsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/collections')
      ]);
      
      const newOnly = productsRes.data.filter(p => p.is_new === true);
      setProducts(newOnly);
      setFilteredProducts(newOnly);
      setCollections(collectionsRes.data);
      
      const sizesPromises = newOnly.map(product => 
        axios.get(`http://localhost:5000/api/products/${product.id}/sizes`).catch(() => ({ data: [] }))
      );
      const sizesResults = await Promise.all(sizesPromises);
      
      const sizesMap = {};
      newOnly.forEach((product, index) => {
        sizesMap[product.id] = sizesResults[index].data;
      });
      setProductSizes(sizesMap);
      
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      showInfoMessage('Ошибка', 'Не удалось загрузить товары');
    } finally {
      setLoading(false);
    }
  };
  
  const filterProducts = () => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (selectedCollection !== 'all') {
      filtered = filtered.filter(p => p.collection_id === parseInt(selectedCollection));
    }
    
    if (selectedSize !== 'all') {
      filtered = filtered.filter(p => {
        const sizes = productSizes[p.id] || [];
        return sizes.some(s => s.size === selectedSize && s.quantity > 0);
      });
    }
    
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(maxPrice));
    }
    
    setFilteredProducts(filtered);
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSelectedSize('all');
    setMinPrice('');
    setMaxPrice('');
  };
  
  const openSizeModal = (product) => {
    const sizes = productSizes[product.id] || [];
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
    if (!token) {
      showInfoMessage('Требуется авторизация', 'Войдите в аккаунт, чтобы добавить товар в корзину', () => {
        navigate('/login');
      });
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/cart', 
        { product_id: selectedProduct.id, quantity: 1, size: chosenSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showInfoMessage('Товар добавлен', `"${selectedProduct.name}" добавлен в корзину (размер ${chosenSize})`, () => {
        setShowSizeModal(false);
        setSelectedProduct(null);
        setChosenSize('');
      });
    } catch (error) {
      console.error('Ошибка:', error);
      showInfoMessage('Ошибка', 'Ошибка при добавлении в корзину');
    }
  };
  
  const addToFavorites = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      showInfoMessage('Требуется авторизация', 'Войдите в аккаунт, чтобы добавить товар в избранное', () => {
        navigate('/login');
      });
      return;
    }
    
    try {
      await axios.post('http://localhost:5000/api/favorites', 
        { product_id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showInfoMessage('Успешно', 'Товар добавлен в избранное');
    } catch (error) {
      console.error('Ошибка:', error);
      showInfoMessage('Ошибка', 'Ошибка при добавлении в избранное');
    }
  };
  
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
  
  const allSizes = new Set();
  Object.values(productSizes).forEach(sizes => {
    sizes.forEach(s => {
      if (s.quantity > 0) {
        allSizes.add(s.size);
      }
    });
  });
  const sizesList = ['all', ...Array.from(allSizes).sort()];
  
  const categoryNames = {
    all: 'Все категории',
    костюм: 'Костюмы',
    платье: 'Платья',
    штаны: 'Штаны',
    жакет: 'Жакеты',
    блузка: 'Блузки',
    юбка: 'Юбки'
  };
  
  if (loading) {
    return (
      <NewProductsContainer>
        <ContentWrapper>
          <EmptyMessage>Загрузка...</EmptyMessage>
        </ContentWrapper>
      </NewProductsContainer>
    );
  }
  
  return (
    <>
      <NewProductsContainer>
        <ContentWrapper>
          <PageTitle>НОВИНКИ</PageTitle>
          <Description>
            СВЕЖИЕ ПОСТУПЛЕНИЯ – СПОКОЙНЫЕ СИЛУЭТЫ
          </Description>
          
          <SearchSection>
            <SearchInput 
              type="text"
              placeholder="Поиск новинок..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchSection>
          
          <FilterSection>
            <FilterSelect 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {categoryNames[cat] || cat}
                </option>
              ))}
            </FilterSelect>
            
            <FilterSelect 
              value={selectedCollection} 
              onChange={(e) => setSelectedCollection(e.target.value)}
            >
              <option value="all">Все коллекции</option>
              {collections.map(col => (
                <option key={col.id} value={col.id}>{col.name}</option>
              ))}
            </FilterSelect>
            
            <FilterSelect 
              value={selectedSize} 
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="all">Все размеры</option>
              {sizesList.filter(s => s !== 'all').map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </FilterSelect>
            
            <PriceGroup>
              <PriceLabel>от</PriceLabel>
              <PriceInput 
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <PriceLabel>до</PriceLabel>
              <PriceInput 
                type="number"
                placeholder="999999"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
              <PriceLabel>₽</PriceLabel>
            </PriceGroup>
            
            <FilterButton onClick={filterProducts}>ПРИМЕНИТЬ</FilterButton>
            <ResetButton onClick={resetFilters}>СБРОСИТЬ</ResetButton>
          </FilterSection>
          
          {filteredProducts.length === 0 ? (
            <EmptyMessage>Новинок не найдено</EmptyMessage>
          ) : (
            <>
              <ResultCount>Найдено новинок: {filteredProducts.length}</ResultCount>
              <ProductsGrid>
                {filteredProducts.map(product => {
                  const sizes = productSizes[product.id] || [];
                  const hasStock = sizes.some(s => s.quantity > 0);
                  
                  return (
                    <ProductCard as={Link} to={`/product/${product.id}`}>
                      <ProductImage $image={product.image_url}>
                        <BadgeContainer>
                          <NewBadge>NEW</NewBadge>
                          {product.is_promotion && <SellBadge>SELL</SellBadge>}
                        </BadgeContainer>
                      </ProductImage>
                      <ProductInfo>
                        <ProductStock $inStock={hasStock}>
                          {hasStock ? 'В наличии' : 'Нет в наличии'}
                        </ProductStock>
                        <ProductName>{product.name}</ProductName>
                        <ProductPrice>{product.price.toLocaleString()} ₽</ProductPrice>
                        
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
                          Коллекция: {product.collection_name || '—'}
                        </CollectionName>
                        
                        <ButtonGroup>
                          <ActionButton onClick={() => addToFavorites(product.id)}>
                            В ИЗБРАННОЕ
                          </ActionButton>
                          <ActionButton onClick={() => openSizeModal(product)}>
                            В КОРЗИНУ
                          </ActionButton>
                        </ButtonGroup>
                      </ProductInfo>
                    </ProductCard>
                  );
                })}
              </ProductsGrid>
            </>
          )}
        </ContentWrapper>
      </NewProductsContainer>
      
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

export default NewProductsPage;