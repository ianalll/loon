// КОМПОНЕНТ ШАПКИ САЙТА
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// КОНТЕЙНЕР ВСЕЙ ШАПКИ
const HeaderContainer = styled.header`
  background: #5E524A;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  border-bottom: 1px solid #D0CBC4;
`;

// НАВИГАЦИОННОЕ МЕНЮ
const Nav = styled.nav`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

// ЛОГОТИП "LOON" (ЛЕВАЯ КНОПКА)
const Logo = styled(Link)`
  font-size: 2rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  letter-spacing: 2px;
  color: #EDE7DE;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
  }
`;

// КОНТЕЙНЕР ДЛЯ ЦЕНТРАЛЬНЫХ КНОПОК
const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

// ЦЕНТРАЛЬНЫЕ КНОПКИ
const NavLink = styled(Link)`
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #D0CBC4;
  transition: all 0.3s ease;
  cursor: pointer;
  padding: 0.6rem 1.2rem;
  border: 1px solid #D0CBC4;
  border-radius: 30px;
  background: transparent;
  text-decoration: none;
  
  &[data-active="true"] {
    color: #EDE7DE;
    border-color: #EDE7DE;
    background: rgba(208, 203, 196, 0.1);
  }
  
  &:hover {
    transform: scale(1.05);
    background: rgba(208, 203, 196, 0.1);
    color: #EDE7DE;
    border-color: #EDE7DE;
  }
`;

// ИМЯ ПОЛЬЗОВАТЕЛЯ (ПРАВАЯ КНОПКА)
const UserNameButton = styled(Link)`
  font-size: 2rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #EDE7DE;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    transform: scale(1.05);
    opacity: 0.9;
    color: #D0CBC4;
  }
`;

// КНОПКА "ВОЙТИ" (ПРАВАЯ КНОПКА, КОГДА НЕ АВТОРИЗОВАН)
const LoginButton = styled(Link)`
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #D0CBC4;
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  
  &:hover {
    transform: scale(1.05);
    opacity: 0.8;
    color: #EDE7DE;
  }
`;

// ОСНОВНАЯ ФУНКЦИЯ ШАПКИ
const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [location.pathname]);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };
  
  return (
    <HeaderContainer>
      <Nav>
        {/* ЛЕВАЯ КНОПКА - ЛОГОТИП */}
        <Logo to="/">LOON</Logo>

        {/* ЦЕНТРАЛЬНЫЕ КНОПКИ - НАВИГАЦИЯ */}
        <NavLinks>
          <NavLink 
            to="/novelties" 
            data-active={location.pathname === '/novelties'}
          >
            НОВИНКИ
          </NavLink>
          
          <NavLink 
            to="/collections" 
            data-active={location.pathname === '/collections'}
          >
            КОЛЛЕКЦИИ
          </NavLink>
          
          <NavLink 
            to="/promotions" 
            data-active={location.pathname === '/promotions'}
          >
            АКЦИИ
          </NavLink>
          
          <NavLink 
            to="/about" 
            data-active={location.pathname === '/about'}
          >
            О БРЕНДЕ
          </NavLink>
        </NavLinks>
        
        {/* ПРАВАЯ КНОПКА - ИМЯ ПОЛЬЗОВАТЕЛЯ ИЛИ ВОЙТИ */}
        {user ? (
          <UserNameButton to="/profile">
            {user.first_name || user.email?.split('@')[0] || 'ПРОФИЛЬ'}
          </UserNameButton>
        ) : (
          <LoginButton to="/login">ВОЙТИ</LoginButton>
        )}
      </Nav>
    </HeaderContainer>
  );
};

export default Header;