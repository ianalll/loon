// АДМИН-ПАНЕЛЬ УПРАВЛЕНИЯ
import { useState, useEffect, useRef } from 'react';
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

const AdminContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #D0CBC4 0%, #957B69 100%);
  padding-top: 100px;
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

const HeaderButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const LeftButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const RightButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const CenterFilters = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
`;

const SearchInput = styled.input`
  padding: 0.6rem 1rem;
  border: 1px solid #5E524A;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.9);
  color: #5E524A;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.85rem;
  width: 200px;
  
  &::placeholder {
    color: rgba(94, 82, 74, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #5E524A;
  }
`;

const FilterSelect = styled.select`
  padding: 0.6rem 1rem;
  border: 1px solid #5E524A;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.9);
  color: #5E524A;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  min-width: 130px;
  
  &:focus {
    outline: none;
    border-color: #5E524A;
  }
`;

const AddButton = styled.button`
  background: #5E524A;
  color: #EDE7DE;
  border: none;
  border-radius: 30px;
  padding: 0.7rem 1.8rem;
  font-size: 0.9rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #6b5e55;
    transform: scale(1.02);
  }
`;

const OrdersButton = styled.button`
  background: #957B69;
  color: #EDE7DE;
  border: none;
  border-radius: 30px;
  padding: 0.7rem 1.5rem;
  font-size: 0.9rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #7a6353;
    transform: scale(1.02);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  padding: 0.8rem 2rem;
  background: ${props => props.active ? '#5E524A' : 'rgba(94, 82, 74, 0.3)'};
  color: ${props => props.active ? '#EDE7DE' : '#FFFFFF'};
  border: none;
  border-radius: 30px;
  font-size: 0.9rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 1px;
  
  &:hover {
    background: #5E524A;
    color: #EDE7DE;
  }
`;

const ProductsTable = styled.table`
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
  font-size: 1rem;
  letter-spacing: 1px;
`;

const Td = styled.td`
  padding: 0.8rem;
  border-bottom: 1px solid rgba(94, 82, 74, 0.1);
  color: #5E524A;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.95rem;
  font-weight: 100;
`;

const ActionButton = styled.button`
  background: transparent;
  color: ${props => props.$danger ? '#c62828' : props.$restore ? '#2e7d32' : '#5E524A'};
  border: 1px solid ${props => props.$danger ? '#c62828' : props.$restore ? '#2e7d32' : '#5E524A'};
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  margin: 0 0.2rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$danger ? '#c62828' : props.$restore ? '#2e7d32' : '#5E524A'};
    color: white;
    transform: scale(1.02);
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  background: ${props => {
    if (props.$new) return 'rgba(76, 175, 80, 0.2)';
    if (props.$promotion) return 'rgba(255, 152, 0, 0.2)';
    if (props.$inactive) return 'rgba(156, 39, 176, 0.2)';
    return 'rgba(94, 82, 74, 0.1)';
  }};
  color: ${props => {
    if (props.$new) return '#2e7d32';
    if (props.$promotion) return '#e65100';
    if (props.$inactive) return '#6a1b9a';
    return '#5E524A';
  }};
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  margin-right: 0.3rem;
  font-family: 'BlackerSans Pro', sans-serif;
`;

const StockBadge = styled.span`
  display: inline-block;
  background: ${props => props.$inStock ? 'rgba(76, 175, 80, 0.2)' : 'rgba(198, 40, 40, 0.2)'};
  color: ${props => props.$inStock ? '#2e7d32' : '#c62828'};
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
`;

const PhotoContainer = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PhotoStatus = styled.span`
  color: ${props => props.$hasPhoto ? '#2e7d32' : '#957B69'};
  font-size: 0.8rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Thumbnail = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
`;

// Единый компонент модального окна
const Modal = ({ isOpen, onClose, children, maxWidth = '500px' }) => {
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth }}>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

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
  background: rgba(236, 228, 217, 0.98);
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  margin-bottom: 1.5rem;
  text-align: center;
  letter-spacing: 2px;
`;

const ModalText = styled.p`
  font-size: 0.95rem;
  color: #5E524A;
  text-align: center;
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
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

const Select = styled.select`
  width: 100%;
  padding: 0.7rem 1rem;
  margin-bottom: 1rem;
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

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  color: #5E524A;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.9rem;
  font-weight: 100;
  cursor: pointer;
`;

const ModalButton = styled.button`
  background: #5E524A;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 0.6rem 1.5rem;
  margin: 0 0.5rem;
  cursor: pointer;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.9rem;
  font-weight: 100;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #6b5e55;
    transform: scale(1.02);
  }
`;

const ModalButtonCancel = styled.button`
  background: transparent;
  border: 1px solid #5E524A;
  color: #5E524A;
  border-radius: 30px;
  padding: 0.6rem 1.5rem;
  margin: 0 0.5rem;
  cursor: pointer;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.9rem;
  font-weight: 100;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(94, 82, 74, 0.1);
    transform: scale(1.02);
  }
`;

const EmptyMessage = styled.div`
  text-align: center;
  color: #5E524A;
  font-family: 'BlackerSans Pro', sans-serif;
  font-size: 0.95rem;
  font-weight: 100;
  padding: 2rem;
`;

const ImageUploadArea = styled.div`
  border: 2px dashed rgba(94, 82, 74, 0.3);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #5E524A;
    background: rgba(94, 82, 74, 0.05);
  }
`;

const ImagePreview = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  text-align: center;
  
  img {
    max-width: 100%;
    max-height: 150px;
    border-radius: 8px;
  }
`;

const RemoveImageButton = styled.button`
  background: #c62828;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.2rem 0.5rem;
  font-size: 0.7rem;
  cursor: pointer;
  margin-top: 0.5rem;
  
  &:hover {
    opacity: 0.8;
  }
`;

// Компонент фото-модалки
const PhotoModal = ({ isOpen, imageUrl, onClose }) => {
  if (!isOpen || !imageUrl) return null;
  
  return (
    <PhotoModalOverlay onClick={onClose}>
      <PhotoModalContent onClick={e => e.stopPropagation()}>
        <CloseButtonPhoto onClick={onClose}>✕</CloseButtonPhoto>
        <FullImage src={imageUrl} alt="Просмотр" />
      </PhotoModalContent>
    </PhotoModalOverlay>
  );
};

const PhotoModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  cursor: pointer;
`;

const PhotoModalContent = styled.div`
  position: relative;
  max-width: 90%;
  max-height: 90%;
  cursor: default;
`;

const FullImage = styled.img`
  max-width: 100%;
  max-height: 85vh;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
`;

const CloseButtonPhoto = styled.button`
  position: absolute;
  top: -40px;
  right: -40px;
  background: #5E524A;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: #c62828;
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    top: -35px;
    right: -5px;
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }
`;

// МО
const InfoModal = ({ isOpen, title, text, type = 'info', onClose }) => {
  if (!isOpen) return null;
  
  const getButtonColor = () => {
    switch(type) {
      case 'success': return '#2e7d32';
      case 'error': return '#c62828';
      default: return '#5E524A';
    }
  };
  
  return (
    <ModalOverlay onClick={onClose} style={{ zIndex: 1500 }}>
      <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <ModalTitle>{title}</ModalTitle>
        <ModalText>{text}</ModalText>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ModalButton onClick={onClose} style={{ background: getButtonColor() }}>OK</ModalButton>
        </div>
      </ModalContent>
    </ModalOverlay>
  );
};

const AdminPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refreshProducts, refreshCollections } = useRefreshData();
  
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  
  //  для поиска и фильтров
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  //  модальные окна
  const [activeModal, setActiveModal] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCollection, setEditingCollection] = useState(null);
  const [productSizes, setProductSizes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  
  // Сообщения для окна размеров
  const [sizeMessage, setSizeMessage] = useState('');
  const [sizeMessageType, setSizeMessageType] = useState('success');
  
  // Данные для модальных окон
  const [confirmData, setConfirmData] = useState({ title: '', text: '', onConfirm: null });
  const [infoData, setInfoData] = useState({ title: '', text: '', type: 'info', callback: null });
  
  const fileInputRef = useRef(null);
  const [newSize, setNewSize] = useState('');
  const [newSizeQuantity, setNewSizeQuantity] = useState(0);
  const [formData, setFormData] = useState({
    name: '', category: '', price: '', color: '', 
    description: '', image_url: '', is_new: false, 
    is_promotion: false, collection_id: '', is_active: true
  });
  const [collectionFormData, setCollectionFormData] = useState({ name: '', description: '' });
  
  // управления мо
  const openModal = (modalName) => setActiveModal(modalName);
  const closeModal = () => setActiveModal(null);
  
  // Показать сообщение
  const showInfoMessage = (title, text, type = 'info', callback = null) => {
    setInfoData({ title, text, type, callback });
    openModal('info');
  };
  
  // Показать подтверждение
  const showConfirmMessage = (title, text, onConfirm) => {
    setConfirmData({ title, text, onConfirm: () => {
      closeModal();
      onConfirm();
    }});
    openModal('confirm');
  };
  
  useEffect(() => {
    checkAdminAndFetch();
    fetchCollections();
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
    
    await fetchProducts();
  };
  
  const fetchProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/admin/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Ошибка:', error);
      showInfoMessage('Ошибка', 'Не удалось загрузить товары', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCollections = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/collections', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCollections(response.data);
    } catch (error) {
      console.error('Ошибка загрузки коллекций:', error);
      showInfoMessage('Ошибка', 'Не удалось загрузить коллекции', 'error');
    }
  };
  
  const fetchProductSizes = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${productId}/sizes`);
      setProductSizes(response.data);
    } catch (error) {
      console.error('Ошибка загрузки размеров:', error);
    }
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    setUploadMessage('');
    const formDataFile = new FormData();
    formDataFile.append('image', file);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/admin/upload', formDataFile, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setFormData({...formData, image_url: response.data.imageUrl});
        setUploadMessage('Фото загружено');
        setTimeout(() => setUploadMessage(''), 2000);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setUploadMessage('Ошибка загрузки');
      setTimeout(() => setUploadMessage(''), 2000);
    } finally {
      setUploading(false);
    }
  };
  
  const removeImage = () => {
    setFormData({...formData, image_url: ''});
  };
  
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category: product.category || '',
      price: product.price || '',
      color: product.color || '',
      description: product.description || '',
      image_url: product.image_url || '',
      is_new: product.is_new || false,
      is_promotion: product.is_promotion || false,
      collection_id: product.collection_id || '',
      is_active: product.is_active !== false
    });
    openModal('product');
  };
  
  const handleSoftDelete = async (id) => {
    showConfirmMessage('Скрыть товар', 'Вы уверены, что хотите скрыть этот товар? Его можно будет восстановить.', async () => {
      const token = localStorage.getItem('token');
      try {
        await axios.put(`http://localhost:5000/api/admin/products/${id}/hide`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchProducts();
        refreshProducts();
        showInfoMessage('Успешно', 'Товар скрыт', 'success');
      } catch (error) {
        console.error('Ошибка:', error);
        showInfoMessage('Ошибка', 'Ошибка при скрытии товара', 'error');
      }
    });
  };
  
  const handleRestore = async (id) => {
    showConfirmMessage('Восстановить товар', 'Вы уверены, что хотите восстановить этот товар?', async () => {
      const token = localStorage.getItem('token');
      try {
        await axios.put(`http://localhost:5000/api/admin/products/${id}/restore`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchProducts();
        refreshProducts();
        showInfoMessage('Успешно', 'Товар восстановлен', 'success');
      } catch (error) {
        console.error('Ошибка:', error);
        showInfoMessage('Ошибка', 'Ошибка при восстановлении товара', 'error');
      }
    });
  };
  
  const handleHardDelete = async (id) => {
    showConfirmMessage('Удалить навсегда', 'Вы уверены, что хотите удалить этот товар навсегда? Это действие нельзя отменить!', async () => {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchProducts();
        refreshProducts();
        showInfoMessage('Успешно', 'Товар удалён навсегда', 'success');
      } catch (error) {
        console.error('Ошибка:', error);
        showInfoMessage('Ошибка', 'Ошибка при удалении товара', 'error');
      }
    });
  };
  
  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    try {
      if (editingProduct) {
        await axios.put(`http://localhost:5000/api/admin/products/${editingProduct.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        closeModal();
        setEditingProduct(null);
        resetForm();
        showInfoMessage('Успешно', 'Товар изменён', 'success');
      } else {
        await axios.post('http://localhost:5000/api/admin/products', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        closeModal();
        setEditingProduct(null);
        resetForm();
        showInfoMessage('Успешно', 'Товар добавлен', 'success');
      }
      await fetchProducts();
      refreshProducts();
    } catch (error) {
      console.error('Ошибка:', error);
      showInfoMessage('Ошибка', 'Ошибка при сохранении', 'error');
    }
  };
  
  const handleAddSize = async () => {
    if (!newSize) {
      setSizeMessage('Введите размер');
      setSizeMessageType('error');
      setTimeout(() => setSizeMessage(''), 2000);
      return;
    }
    
    const token = localStorage.getItem('token');
    try {
      await axios.post(`http://localhost:5000/api/admin/products/${editingProduct.id}/sizes`, 
        { size: newSize, quantity: newSizeQuantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchProductSizes(editingProduct.id);
      await fetchProducts();
      setNewSize('');
      setNewSizeQuantity(0);
      refreshProducts();
      
      setSizeMessage('Размер добавлен');
      setSizeMessageType('success');
      setTimeout(() => setSizeMessage(''), 2000);
    } catch (error) {
      console.error('Ошибка:', error);
      setSizeMessage('Ошибка при добавлении размера');
      setSizeMessageType('error');
      setTimeout(() => setSizeMessage(''), 2000);
    }
  };
  
  const handleDeleteSize = async (size) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${editingProduct.id}/sizes/${size}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProductSizes(editingProduct.id);
      await fetchProducts();
      refreshProducts();
      
      setSizeMessage('Размер удалён');
      setSizeMessageType('success');
      setTimeout(() => setSizeMessage(''), 2000);
    } catch (error) {
      console.error('Ошибка:', error);
      setSizeMessage('Ошибка при удалении размера');
      setSizeMessageType('error');
      setTimeout(() => setSizeMessage(''), 2000);
    }
  };
  
  const handleUpdateSizeQuantity = async (size, quantity) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/admin/products/${editingProduct.id}/sizes/${size}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchProductSizes(editingProduct.id);
      await fetchProducts();
      refreshProducts();
      
      setSizeMessage('Количество обновлено');
      setSizeMessageType('success');
      setTimeout(() => setSizeMessage(''), 2000);
    } catch (error) {
      console.error('Ошибка:', error);
      setSizeMessage('Ошибка при обновлении');
      setSizeMessageType('error');
      setTimeout(() => setSizeMessage(''), 2000);
    }
  };
  
  const handleSaveCollection = async () => {
    const token = localStorage.getItem('token');
    try {
      if (editingCollection) {
        await axios.put(`http://localhost:5000/api/admin/collections/${editingCollection.id}`, collectionFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        closeModal();
        setEditingCollection(null);
        setCollectionFormData({ name: '', description: '' });
        showInfoMessage('Успешно', 'Коллекция изменена', 'success');
      } else {
        await axios.post('http://localhost:5000/api/admin/collections', collectionFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        closeModal();
        setEditingCollection(null);
        setCollectionFormData({ name: '', description: '' });
        showInfoMessage('Успешно', 'Коллекция добавлена', 'success');
      }
      await fetchCollections();
      await fetchProducts();
      refreshCollections();
    } catch (error) {
      console.error('Ошибка:', error);
      showInfoMessage('Ошибка', error.response?.data?.error || 'Ошибка при сохранении коллекции', 'error');
    }
  };
  
  const handleDeleteCollection = async (id, name) => {
    showConfirmMessage('Удалить коллекцию', `Вы уверены, что хотите удалить коллекцию "${name}"? Товары в этой коллекции останутся без коллекции.`, async () => {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/admin/collections/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        await fetchCollections();
        await fetchProducts();
        refreshCollections();
        showInfoMessage('Успешно', 'Коллекция удалена', 'success');
      } catch (error) {
        console.error('Ошибка:', error);
        showInfoMessage('Ошибка', 'Ошибка при удалении коллекции', 'error');
      }
    });
  };
  
  const resetForm = () => {
    setFormData({
      name: '', category: '', price: '', color: '', 
      description: '', image_url: '', is_new: false, 
      is_promotion: false, collection_id: '', is_active: true
    });
  };
  
  const openPhotoModal = (imageUrl) => {
    setSelectedPhoto(imageUrl);
    openModal('photo');
  };
  
  const toggleNewStatus = async (product, isNew) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/admin/products/${product.id}`, {...product, is_new: isNew}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProducts();
      refreshProducts();
      showInfoMessage('Успешно', isNew ? 'Метка NEW добавлена' : 'Метка NEW снята', 'success');
    } catch (error) {
      console.error('Ошибка:', error);
      showInfoMessage('Ошибка', 'Ошибка при изменении статуса', 'error');
    }
  };
  
  const togglePromotionStatus = async (product, isPromotion) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/admin/products/${product.id}`, {...product, is_promotion: isPromotion}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProducts();
      refreshProducts();
      showInfoMessage('Успешно', isPromotion ? 'Акция добавлена' : 'Акция снята', 'success');
    } catch (error) {
      console.error('Ошибка:', error);
      showInfoMessage('Ошибка', 'Ошибка при изменении статуса', 'error');
    }
  };
  
  // для фильтрации товаров
  const getFilteredProducts = () => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (stockFilter === 'inStock') {
      filtered = filtered.filter(p => p.in_stock === true);
    } else if (stockFilter === 'outOfStock') {
      filtered = filtered.filter(p => p.in_stock === false);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    
    return filtered;
  };
  
  const uniqueCategories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
  
  const categoryNames = {
    all: 'Все категории',
    костюм: 'Костюмы',
    платье: 'Платья',
    штаны: 'Штаны',
    жакет: 'Жакеты',
    блузка: 'Блузки',
    юбка: 'Юбки'
  };
  
  const activeProducts = getFilteredProducts().filter(p => p.is_active !== false);
  const inactiveProducts = products.filter(p => p.is_active === false);
  const newProducts = activeProducts.filter(p => p.is_new === true);
  const promotionProducts = activeProducts.filter(p => p.is_promotion === true);
  
  if (loading) {
    return (
      <AdminContainer>
        <ContentWrapper>
          <EmptyMessage>Загрузка...</EmptyMessage>
        </ContentWrapper>
      </AdminContainer>
    );
  }
  
  return (
    <AdminContainer>
      <ContentWrapper>
        <Title>Панель администратора</Title>
        
        <HeaderButtons>
          <LeftButtons>
            <AddButton onClick={() => { 
              setEditingProduct(null); 
              resetForm(); 
              openModal('product'); 
            }}>
              + Добавить товар
            </AddButton>
          </LeftButtons>
          
          <CenterFilters>
            <SearchInput
              type="text"
              placeholder="Поиск по названию..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FilterSelect value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
              <option value="all">Все товары</option>
              <option value="inStock">В наличии</option>
              <option value="outOfStock">Нет в наличии</option>
            </FilterSelect>
            <FilterSelect value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{categoryNames[cat] || cat}</option>
              ))}
            </FilterSelect>
          </CenterFilters>
          
          <RightButtons>
            <OrdersButton onClick={() => navigate('/admin/orders')}>
              Управление заказами
            </OrdersButton>
          </RightButtons>
        </HeaderButtons>
        
        <TabsContainer>
          <Tab active={activeTab === 'products'} onClick={() => setActiveTab('products')}>
            Товары ({activeProducts.length})
          </Tab>
          <Tab active={activeTab === 'inactive'} onClick={() => setActiveTab('inactive')}>
            Скрытые ({inactiveProducts.length})
          </Tab>
          <Tab active={activeTab === 'new'} onClick={() => setActiveTab('new')}>
            Новинки ({newProducts.length})
          </Tab>
          <Tab active={activeTab === 'promotions'} onClick={() => setActiveTab('promotions')}>
            Акции ({promotionProducts.length})
          </Tab>
          <Tab active={activeTab === 'collections'} onClick={() => setActiveTab('collections')}>
            Коллекции ({collections.length})
          </Tab>
        </TabsContainer>
        
        {/* ВКЛАДКА: ТОВАРЫ (активные) */}
        {activeTab === 'products' && (
          <>
            <ProductsTable>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Фото</Th>
                  <Th>Название</Th>
                  <Th>Категория</Th>
                  <Th>Цена</Th>
                  <Th>Коллекция</Th>
                  <Th>Наличие</Th>
                  <Th>Метки</Th>
                  <Th>Действия</Th>
                </tr>
              </thead>
              <tbody>
                {activeProducts.map(p => (
                  <tr key={p.id}>
                    <Td>{p.id}</Td>
                    <Td>
                      <PhotoContainer onClick={() => p.image_url && openPhotoModal(p.image_url)}>
                        {p.image_url ? (
                          <>
                            <Thumbnail src={p.image_url} alt={p.name} />
                            <PhotoStatus $hasPhoto>Есть фото</PhotoStatus>
                          </>
                        ) : (
                          <PhotoStatus $hasPhoto={false}>Нет фото</PhotoStatus>
                        )}
                      </PhotoContainer>
                    </Td>
                    <Td>{p.name}</Td>
                    <Td>{p.category}</Td>
                    <Td>{p.price.toLocaleString()} ₽</Td>
                    <Td>{p.collection_name || '—'}</Td>
                    <Td>
                      <StockBadge $inStock={p.in_stock}>
                        {p.in_stock ? 'В наличии' : 'Нет в наличии'}
                      </StockBadge>
                    </Td>
                    <Td>
                      {p.is_new && <StatusBadge $new>NEW</StatusBadge>}
                      {p.is_promotion && <StatusBadge $promotion>АКЦИЯ</StatusBadge>}
                    </Td>
                    <Td>
                      <ActionButton onClick={() => handleEdit(p)}>Изменить</ActionButton>
                      <ActionButton onClick={() => {
                        setEditingProduct(p);
                        fetchProductSizes(p.id);
                        openModal('sizes');
                      }}>Размеры</ActionButton>
                      <ActionButton $danger onClick={() => handleSoftDelete(p.id)}>Скрыть</ActionButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </ProductsTable>
            
            {activeProducts.length === 0 && <EmptyMessage>Активные товары не найдены</EmptyMessage>}
          </>
        )}
        
        {/* ВКЛАДКА: СКРЫТЫЕ ТОВАРЫ */}
        {activeTab === 'inactive' && (
          <>
            <ProductsTable>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Фото</Th>
                  <Th>Название</Th>
                  <Th>Категория</Th>
                  <Th>Цена</Th>
                  <Th>Коллекция</Th>
                  <Th>Действия</Th>
                </tr>
              </thead>
              <tbody>
                {inactiveProducts.map(p => (
                  <tr key={p.id} style={{ opacity: 0.7, background: 'rgba(0,0,0,0.03)' }}>
                    <Td>{p.id}</Td>
                    <Td>
                      <PhotoContainer onClick={() => p.image_url && openPhotoModal(p.image_url)}>
                        {p.image_url ? (
                          <>
                            <Thumbnail src={p.image_url} alt={p.name} />
                            <PhotoStatus $hasPhoto>Есть фото</PhotoStatus>
                          </>
                        ) : (
                          <PhotoStatus $hasPhoto={false}>Нет фото</PhotoStatus>
                        )}
                      </PhotoContainer>
                    </Td>
                    <Td>{p.name}</Td>
                    <Td>{p.category}</Td>
                    <Td>{p.price.toLocaleString()} ₽</Td>
                    <Td>{p.collection_name || '—'}</Td>
                    <Td>
                      <ActionButton $restore onClick={() => handleRestore(p.id)}>Восстановить</ActionButton>
                      <ActionButton $danger onClick={() => handleHardDelete(p.id)}>Удалить навсегда</ActionButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </ProductsTable>
            {inactiveProducts.length === 0 && <EmptyMessage>Скрытых товаров нет</EmptyMessage>}
          </>
        )}
        
        {/* ВКЛАДКА: НОВИНКИ */}
        {activeTab === 'new' && (
          <>
            <ProductsTable>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Фото</Th>
                  <Th>Название</Th>
                  <Th>Категория</Th>
                  <Th>Цена</Th>
                  <Th>Коллекция</Th>
                  <Th>Действия</Th>
                </tr>
              </thead>
              <tbody>
                {newProducts.map(p => (
                  <tr key={p.id}>
                    <Td>{p.id}</Td>
                    <Td>
                      <PhotoContainer onClick={() => p.image_url && openPhotoModal(p.image_url)}>
                        {p.image_url ? (
                          <>
                            <Thumbnail src={p.image_url} alt={p.name} />
                            <PhotoStatus $hasPhoto>Есть фото</PhotoStatus>
                          </>
                        ) : (
                          <PhotoStatus $hasPhoto={false}>Нет фото</PhotoStatus>
                        )}
                      </PhotoContainer>
                    </Td>
                    <Td>{p.name}</Td>
                    <Td>{p.category}</Td>
                    <Td>{p.price.toLocaleString()} ₽</Td>
                    <Td>{p.collection_name || '—'}</Td>
                    <Td>
                      <ActionButton onClick={() => handleEdit(p)}>Изменить</ActionButton>
                      <ActionButton onClick={() => toggleNewStatus(p, false)}>Снять метку NEW</ActionButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </ProductsTable>
            {newProducts.length === 0 && <EmptyMessage>Новинок нет</EmptyMessage>}
          </>
        )}
        
        {/* ВКЛАДКА: АКЦИИ */}
        {activeTab === 'promotions' && (
          <>
            <ProductsTable>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Фото</Th>
                  <Th>Название</Th>
                  <Th>Категория</Th>
                  <Th>Цена</Th>
                  <Th>Коллекция</Th>
                  <Th>Действия</Th>
                </tr>
              </thead>
              <tbody>
                {promotionProducts.map(p => (
                  <tr key={p.id}>
                    <Td>{p.id}</Td>
                    <Td>
                      <PhotoContainer onClick={() => p.image_url && openPhotoModal(p.image_url)}>
                        {p.image_url ? (
                          <>
                            <Thumbnail src={p.image_url} alt={p.name} />
                            <PhotoStatus $hasPhoto>Есть фото</PhotoStatus>
                          </>
                        ) : (
                          <PhotoStatus $hasPhoto={false}>Нет фото</PhotoStatus>
                        )}
                      </PhotoContainer>
                    </Td>
                    <Td>{p.name}</Td>
                    <Td>{p.category}</Td>
                    <Td>{p.price.toLocaleString()} ₽</Td>
                    <Td>{p.collection_name || '—'}</Td>
                    <Td>
                      <ActionButton onClick={() => handleEdit(p)}>Изменить</ActionButton>
                      <ActionButton onClick={() => togglePromotionStatus(p, false)}>Снять метку АКЦИЯ</ActionButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </ProductsTable>
            {promotionProducts.length === 0 && <EmptyMessage>Товаров со скидкой нет</EmptyMessage>}
          </>
        )}
        
        {/* ВКЛАДКА: КОЛЛЕКЦИИ */}
        {activeTab === 'collections' && (
          <>
            <HeaderButtons>
              <LeftButtons>
                <AddButton onClick={() => { 
                  setEditingCollection(null); 
                  setCollectionFormData({ name: '', description: '' }); 
                  openModal('collection'); 
                }}>
                  + Добавить коллекцию
                </AddButton>
              </LeftButtons>
              <RightButtons />
            </HeaderButtons>
            
            <ProductsTable>
              <thead>
                <tr>
                  <Th>ID</Th>
                  <Th>Название коллекции</Th>
                  <Th>Описание</Th>
                  <Th>Количество товаров</Th>
                  <Th>Действия</Th>
                </tr>
              </thead>
              <tbody>
                {collections.map(col => (
                  <tr key={col.id}>
                    <Td>{col.id}</Td>
                    <Td>{col.name}</Td>
                    <Td>{col.description || '—'}</Td>
                    <Td>{products.filter(p => p.collection_id === col.id).length}</Td>
                    <Td>
                      <ActionButton onClick={() => {
                        setEditingCollection(col);
                        setCollectionFormData({ name: col.name, description: col.description || '' });
                        openModal('collection');
                      }}>Изменить</ActionButton>
                      <ActionButton $danger onClick={() => handleDeleteCollection(col.id, col.name)}>Удалить</ActionButton>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </ProductsTable>
            {collections.length === 0 && <EmptyMessage>Коллекции не найдены</EmptyMessage>}
          </>
        )}
      </ContentWrapper>
      
      {/* МОДАЛЬНЫЕ ОКНА */}
      
      <PhotoModal 
        isOpen={activeModal === 'photo'} 
        imageUrl={selectedPhoto} 
        onClose={closeModal} 
      />
      
      <InfoModal 
        isOpen={activeModal === 'info'}
        title={infoData.title}
        text={infoData.text}
        type={infoData.type}
        onClose={() => {
          closeModal();
          if (infoData.callback) infoData.callback();
        }}
      />
      
      <Modal isOpen={activeModal === 'confirm'} onClose={closeModal} maxWidth="450px">
        <ModalTitle>{confirmData.title}</ModalTitle>
        <ModalText>{confirmData.text}</ModalText>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <ModalButton onClick={confirmData.onConfirm}>Да</ModalButton>
          <ModalButtonCancel onClick={closeModal}>Отмена</ModalButtonCancel>
        </div>
      </Modal>
      
      {/* МО РЕДАКТИРОВАНИЯ/ДОБАВЛЕНИЯ ТОВАРА */}
      <Modal isOpen={activeModal === 'product'} onClose={closeModal}>
        <ModalTitle>{editingProduct ? 'Редактирование товара' : 'Новый товар'}</ModalTitle>
        
        <Input 
          placeholder="Название" 
          value={formData.name} 
          onChange={e => setFormData({...formData, name: e.target.value})} 
        />
        <Input 
          placeholder="Категория" 
          value={formData.category} 
          onChange={e => setFormData({...formData, category: e.target.value})} 
        />
        <Input 
          placeholder="Цена" 
          type="number" 
          value={formData.price} 
          onChange={e => setFormData({...formData, price: e.target.value})} 
        />
        <Input 
          placeholder="Цвет" 
          value={formData.color} 
          onChange={e => setFormData({...formData, color: e.target.value})} 
        />
        <Input 
          placeholder="Описание" 
          value={formData.description} 
          onChange={e => setFormData({...formData, description: e.target.value})} 
        />
        
        <Select 
          value={formData.collection_id || ''} 
          onChange={e => setFormData({...formData, collection_id: e.target.value || null})}
        >
          <option value="">— Без коллекции —</option>
          {collections.map(col => (
            <option key={col.id} value={col.id}>{col.name}</option>
          ))}
        </Select>
        
        {uploadMessage && (
          <div style={{ color: 'green', textAlign: 'center', marginBottom: '0.5rem' }}>
            {uploadMessage}
          </div>
        )}
        
        <ImageUploadArea onClick={() => fileInputRef.current.click()}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          {uploading ? 'Загрузка...' : 'Нажмите для загрузки фото'}
        </ImageUploadArea>
        
        {formData.image_url && (
          <ImagePreview>
            <img src={formData.image_url} alt="Preview" />
            <RemoveImageButton onClick={removeImage}>Удалить фото</RemoveImageButton>
          </ImagePreview>
        )}
        
        <Label>
          <input 
            type="checkbox" 
            checked={formData.is_new} 
            onChange={e => setFormData({...formData, is_new: e.target.checked})} 
          />
          Новинка (отметка NEW)
        </Label>
        
        <Label>
          <input 
            type="checkbox" 
            checked={formData.is_promotion} 
            onChange={e => setFormData({...formData, is_promotion: e.target.checked})} 
          />
          Участвует в акции
        </Label>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <ModalButton onClick={handleSubmit}>Сохранить</ModalButton>
          <ModalButtonCancel onClick={closeModal}>Отмена</ModalButtonCancel>
        </div>
      </Modal>
      
      {/* МОДАЛЬНОЕ ОКНО УПРАВЛЕНИЯ РАЗМЕРАМИ */}
      <Modal isOpen={activeModal === 'sizes'} onClose={closeModal}>
        <ModalTitle>Размеры товара: {editingProduct?.name}</ModalTitle>
        
        {/* СООБЩЕНИЕ О РЕЗУЛЬТАТЕ */}
        {sizeMessage && (
          <div style={{ 
            color: sizeMessageType === 'success' ? '#2e7d32' : '#c62828', 
            textAlign: 'center', 
            marginBottom: '1rem',
            padding: '0.5rem',
            background: sizeMessageType === 'success' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(198, 40, 40, 0.1)',
            borderRadius: '10px'
          }}>
            {sizeMessage}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <Input 
            placeholder="Размер (S, M, L, XL)"
            value={newSize}
            onChange={(e) => setNewSize(e.target.value.toUpperCase())}
            style={{ flex: 1 }}
          />
          <Input 
            type="number"
            placeholder="Кол-во"
            value={newSizeQuantity}
            onChange={(e) => setNewSizeQuantity(parseInt(e.target.value) || 0)}
            style={{ width: '100px' }}
          />
          <ModalButton onClick={handleAddSize}>+ Добавить</ModalButton>
        </div>
        
        {productSizes.length === 0 ? (
          <EmptyMessage>Размеры не добавлены</EmptyMessage>
        ) : (
          <ProductsTable>
            <thead>
              <tr>
                <Th>Размер</Th>
                <Th>Количество</Th>
                <Th>Действия</Th>
              </tr>
            </thead>
            <tbody>
              {productSizes.map(ps => (
                <tr key={ps.size}>
                  <Td>{ps.size}</Td>
                  <Td>
                    <Input 
                      type="number"
                      value={ps.quantity}
                      onChange={(e) => handleUpdateSizeQuantity(ps.size, parseInt(e.target.value) || 0)}
                      style={{ width: '80px', margin: 0 }}
                    />
                  </Td>
                  <Td>
                    <ActionButton $danger onClick={() => handleDeleteSize(ps.size)}>Удалить</ActionButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </ProductsTable>
        )}
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <ModalButton onClick={closeModal}>Закрыть</ModalButton>
        </div>
      </Modal>
      

    </AdminContainer>
  );
};

export default AdminPage;