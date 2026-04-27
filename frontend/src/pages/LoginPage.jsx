// СТРАНИЦА ВХОДА И РЕГИСТРАЦИИ
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
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

const LoginContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #D0CBC4 0%, #957B69 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 100px 2rem 2rem 2rem;
`;

const FormCard = styled.div`
  max-width: 450px;
  width: 100%;
  background: rgba(236, 228, 217, 0.95);
  border-radius: 20px;
  padding: 2.5rem;
  animation: ${fadeIn} 0.6s ease-out;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  letter-spacing: 4px;
  color: #5E524A;
  text-align: center;
  margin-bottom: 2rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(94, 82, 74, 0.2);
`;

const Tab = styled.button`
  flex: 1;
  background: none;
  border: none;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: ${props => props.active ? '400' : '100'};
  font-family: 'BlackerSans Pro', sans-serif;
  color: ${props => props.active ? '#5E524A' : '#957B69'};
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: ${props => props.active ? '2px solid #5E524A' : 'none'};
  
  &:hover {
    color: #5E524A;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.8rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #5E524A;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled.input`
  padding: 0.9rem 1rem;
  border: 1px solid ${props => props.hasError ? '#c62828' : 'rgba(94, 82, 74, 0.3)'};
  border-radius: 12px;
  font-size: 1rem;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 100;
  background: white;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#c62828' : '#5E524A'};
    box-shadow: 0 0 0 2px ${props => props.hasError ? 'rgba(198, 40, 40, 0.1)' : 'rgba(94, 82, 74, 0.1)'};
  }
`;

const ErrorText = styled.span`
  font-size: 0.7rem;
  color: #c62828;
  margin-top: 0.2rem;
`;

const Button = styled.button`
  background: #5E524A;
  color: #EDE7DE;
  border: none;
  padding: 1rem;
  font-size: 0.9rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
  
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
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  border-radius: 10px;
  padding: 0.8rem;
  color: #c62828;
  font-size: 0.8rem;
  text-align: center;
`;

const SuccessMessage = styled.div`
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 10px;
  padding: 0.8rem;
  color: #2e7d32;
  font-size: 0.8rem;
  text-align: center;
`;

const LoginPage = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Ошибки валидации для формы входа
  const [loginErrors, setLoginErrors] = useState({
    email: '',
    password: ''
  });
  
  // Ошибки валидации для формы регистрации
  const [registerErrors, setRegisterErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  
  // Форма входа
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  // Форма регистрации
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  
  // Валидация email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Введите email';
    if (!emailRegex.test(email)) return 'Введите корректный email';
    return '';
  };
  
  // Валидация пароля
  const validatePassword = (password) => {
    if (!password) return 'Введите пароль';
    if (password.length < 6) return 'Пароль должен быть не менее 6 символов';
    return '';
  };
  
  // Валидация имени
  const validateName = (name, fieldName) => {
    if (!name.trim()) return `Введите ${fieldName}`;
    return '';
  };
  
  // Валидация телефона
  const validatePhone = (phone) => {
    if (phone && !/^[\d\s\+\(\)\-]{10,}$/.test(phone)) {
      return 'Введите корректный номер телефона';
    }
    return '';
  };
  
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
    setError('');
    
    // Валидация в реальном времени
    if (name === 'email') {
      setLoginErrors({ ...loginErrors, email: validateEmail(value) });
    }
    if (name === 'password') {
      setLoginErrors({ ...loginErrors, password: validatePassword(value) });
    }
  };
  
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
    setError('');
    setSuccess('');
    
    // Валидация в реальном времени
    const newErrors = { ...registerErrors };
    
    if (name === 'email') {
      newErrors.email = validateEmail(value);
    }
    if (name === 'password') {
      newErrors.password = validatePassword(value);
      // Проверяем подтверждение пароля, если оно уже заполнено
      if (registerData.confirmPassword) {
        newErrors.confirmPassword = value !== registerData.confirmPassword ? 'Пароли не совпадают' : '';
      }
    }
    if (name === 'confirmPassword') {
      newErrors.confirmPassword = value !== registerData.password ? 'Пароли не совпадают' : '';
    }
    if (name === 'first_name') {
      newErrors.first_name = validateName(value, 'имя');
    }
    if (name === 'last_name') {
      newErrors.last_name = validateName(value, 'фамилию');
    }
    if (name === 'phone') {
      newErrors.phone = validatePhone(value);
    }
    
    setRegisterErrors(newErrors);
  };
  
  const validateLoginForm = () => {
    const emailError = validateEmail(loginData.email);
    const passwordError = validatePassword(loginData.password);
    
    setLoginErrors({
      email: emailError,
      password: passwordError
    });
    
    return !emailError && !passwordError;
  };
  
  const validateRegisterForm = () => {
    const emailError = validateEmail(registerData.email);
    const passwordError = validatePassword(registerData.password);
    const confirmError = registerData.password !== registerData.confirmPassword ? 'Пароли не совпадают' : '';
    const firstNameError = validateName(registerData.first_name, 'имя');
    const lastNameError = validateName(registerData.last_name, 'фамилию');
    const phoneError = validatePhone(registerData.phone);
    
    setRegisterErrors({
      email: emailError,
      password: passwordError,
      confirmPassword: confirmError,
      first_name: firstNameError,
      last_name: lastNameError,
      phone: phoneError
    });
    
    return !emailError && !passwordError && !confirmError && !firstNameError && !lastNameError && !phoneError;
  };
  
  // email И password
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateLoginForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email: loginData.email,
        password: loginData.password
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (onLogin) {
        onLogin(response.data.user);
      }
      
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при входе');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        email: registerData.email,
        password: registerData.password,
        first_name: registerData.first_name,
        last_name: registerData.last_name,
        phone: registerData.phone
      });
      
      setSuccess('Регистрация успешна! Теперь вы можете войти');
      
      setRegisterData({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone: ''
      });
      
      setRegisterErrors({
        email: '',
        password: '',
        confirmPassword: '',
        first_name: '',
        last_name: '',
        phone: ''
      });
      
      setTimeout(() => {
        setActiveTab('login');
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <LoginContainer>
      <FormCard>
        <Title>LOON</Title>
        
        <Tabs>
          <Tab 
            active={activeTab === 'login'} 
            onClick={() => {
              setActiveTab('login');
              setError('');
              setSuccess('');
              setLoginErrors({ email: '', password: '' });
            }}
          >
            ВХОД
          </Tab>
          <Tab 
            active={activeTab === 'register'} 
            onClick={() => {
              setActiveTab('register');
              setError('');
              setSuccess('');
              setRegisterErrors({
                email: '',
                password: '',
                confirmPassword: '',
                first_name: '',
                last_name: '',
                phone: ''
              });
            }}
          >
            РЕГИСТРАЦИЯ
          </Tab>
        </Tabs>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}
        
        {activeTab === 'login' ? (
          <Form onSubmit={handleLogin}>
            <InputGroup>
              <Label>EMAIL</Label>
              <Input
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="example@mail.ru"
                hasError={loginErrors.email}
              />
              {loginErrors.email && <ErrorText>{loginErrors.email}</ErrorText>}
            </InputGroup>
            
            <InputGroup>
              <Label>ПАРОЛЬ</Label>
              <Input
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="••••••"
                hasError={loginErrors.password}
              />
              {loginErrors.password && <ErrorText>{loginErrors.password}</ErrorText>}
            </InputGroup>
            
            <Button type="submit" disabled={loading}>
              {loading ? 'ВХОД...' : 'ВОЙТИ'}
            </Button>
          </Form>
        ) : (
          <Form onSubmit={handleRegister}>
            <InputGroup>
              <Label>EMAIL</Label>
              <Input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="example@mail.ru"
                hasError={registerErrors.email}
              />
              {registerErrors.email && <ErrorText>{registerErrors.email}</ErrorText>}
            </InputGroup>
            
            <InputGroup>
              <Label>ИМЯ</Label>
              <Input
                type="text"
                name="first_name"
                value={registerData.first_name}
                onChange={handleRegisterChange}
                placeholder="Алина"
                hasError={registerErrors.first_name}
              />
              {registerErrors.first_name && <ErrorText>{registerErrors.first_name}</ErrorText>}
            </InputGroup>
            
            <InputGroup>
              <Label>ФАМИЛИЯ</Label>
              <Input
                type="text"
                name="last_name"
                value={registerData.last_name}
                onChange={handleRegisterChange}
                placeholder="Иванова"
                hasError={registerErrors.last_name}
              />
              {registerErrors.last_name && <ErrorText>{registerErrors.last_name}</ErrorText>}
            </InputGroup>
            
            <InputGroup>
              <Label>ТЕЛЕФОН</Label>
              <Input
                type="tel"
                name="phone"
                value={registerData.phone}
                onChange={handleRegisterChange}
                placeholder="+7 (999) 123-45-67"
                hasError={registerErrors.phone}
              />
              {registerErrors.phone && <ErrorText>{registerErrors.phone}</ErrorText>}
            </InputGroup>
            
            <InputGroup>
              <Label>ПАРОЛЬ</Label>
              <Input
                type="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterChange}
                placeholder="минимум 6 символов"
                hasError={registerErrors.password}
              />
              {registerErrors.password && <ErrorText>{registerErrors.password}</ErrorText>}
            </InputGroup>
            
            <InputGroup>
              <Label>ПОДТВЕРДИТЕ ПАРОЛЬ</Label>
              <Input
                type="password"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                placeholder="••••••"
                hasError={registerErrors.confirmPassword}
              />
              {registerErrors.confirmPassword && <ErrorText>{registerErrors.confirmPassword}</ErrorText>}
            </InputGroup>
            
            <Button type="submit" disabled={loading}>
              {loading ? 'РЕГИСТРАЦИЯ...' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
            </Button>
          </Form>
        )}
      </FormCard>
    </LoginContainer>
  );
};

export default LoginPage;