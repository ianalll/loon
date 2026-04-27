// СТРАНИЦА "О БРЕНДЕ"
import styled, { keyframes } from 'styled-components';

// Анимация плавного появления
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// ОСНОВНОЙ КОНТЕЙНЕР СТРАНИЦЫ (ГРАДИЕНТ ФОН)
const AboutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #D0CBC4 0%, #957B69 100%);
  padding-top: 100px;
  padding-bottom: 80px;
`;

// КОНТЕЙНЕР ДЛЯ КОНТЕНТА (КВАДРАТНАЯ РАМКА С ЗАКРУГЛЕНИЕМ)
const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem;
  background: rgba(236, 228, 217, 0.2);
  border-radius: 20px;
  animation: ${fadeIn} 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 0 1rem;
    border-radius: 15px;
  }
`;

// ЗАГОЛОВОК "О БРЕНДЕ"
const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  letter-spacing: 6px;
  color: #5E524A;
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeInUp} 0.6s ease-out;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    letter-spacing: 4px;
  }
`;

// ТЕКСТОВЫЙ БЛОК
const TextBlock = styled.div`
  margin-bottom: 4rem;
  animation: ${fadeInUp} 0.6s ease-out 0.2s both;
`;

const Description = styled.p`
  font-size: 1.3rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  line-height: 1.8;
  color: #5E524A;
  text-align: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

// РАЗДЕЛИТЕЛЬНАЯ ЛИНИЯ
const Divider = styled.hr`
  border: none;
  border-top: 1px solid rgba(94, 82, 74, 0.3);
  margin: 3rem 0;
  width: 100%;
`;

// КОНТАКТНЫЙ БЛОК
const ContactBlock = styled.div`
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out 0.4s both;
`;

const ContactTitle = styled.h3`
  font-size: 2rem;
  font-weight: 400;
  font-family: 'BlackerSans Pro', sans-serif;
  letter-spacing: 2px;
  color: #5E524A;
  margin-bottom: 2rem;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

// КОНТЕЙНЕР ДЛЯ КНОПОК ТЕЛЕФОНА И ПОЧТЫ
const ContactButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

// СТИЛЬ ДЛЯ КАЖДОЙ КНОПКИ
const ContactItem = styled.div`
  display: inline-block;
  padding: 0.8rem 2rem;
  background: #5E524A;              /* залитл цветом обводки */
  border: 1.5px solid #5E524A;      /* Обводка */
  border-radius: 15px;              /* Закругленные углы */
  color: #D0CBC4;                   /* Цвет текста */
  font-size: 1.5rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: #6b5e55;            /* Чуть светлее при наведении */
    transform: scale(1.02);
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.6rem 1.2rem;
    border-radius: 12px;
  }
`;

const AboutPage = () => {
  return (
    <AboutContainer>
      <ContentWrapper>
        <PageTitle>О БРЕНДЕ</PageTitle>
        
        <TextBlock>
          <Description>
            LOON – ЭТО ПРО ТИШИНУ В ГАРДЕРОБЕ.
          </Description>
          <Description>
            МЫ СОЗДАЁМ ОДЕЖДУ, КОТОРАЯ НЕ ТРЕБУЕТ ВНИМАНИЯ. ОНА ПРОСТО СУЩЕСТВУЕТ РЯДОМ С ВАМИ – СПОКОЙНО, ЧЕСТНО, ГОДАМИ.
          </Description>
          <Description>
            НАТУРАЛЬНЫЕ МАТЕРИАЛЫ. ВЫВЕРЕННЫЕ СИЛУЭТЫ. МИНИМУМ ДЕТАЛЕЙ. НИЧЕГО ЛИШНЕГО. ТОЛЬКО ТО, ЧТО ДЕЙСТВИТЕЛЬНО НУЖНО В ЖИЗНИ.
          </Description>
          <Description>
            КАЖДАЯ ВЕЩЬ LOON СДЕЛАНА ТАК, ЧТОБЫ ЧЕРЕЗ ПЯТЬ-ДЕСЯТЬ ЛЕТ ВЫГЛЯДЕТЬ ТАК ЖЕ, КАК В ПЕРВЫЙ ДЕНЬ. БЕЗ СУЕТЫ. БЕЗ СЕЗОННЫХ ТРЕНДОВ. ПРОСТО ХОРОШО СДЕЛАННАЯ ОДЕЖДА.
          </Description>
        </TextBlock>
        
        <Divider />
        
        <ContactBlock>
          <ContactTitle>СВЯЖИТЕСЬ С НАМИ</ContactTitle>
          <ContactButtons>
            <ContactItem>ТЕЛ. 8 905 341 97 15</ContactItem>
                          <a href="https://mail.ru" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
               <ContactItem>ПОЧТА LOON.SHOP@MAIL.RU</ContactItem>
              </a>
           </ContactButtons>
        </ContactBlock>
      </ContentWrapper>
    </AboutContainer>
  );
};

export default AboutPage;