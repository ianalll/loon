// frontend/src/pages/HomePage.jsx
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const slowZoom = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(1.1);
  }
`;

// Анимации для плавания букв
const float1 = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const float2 = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

const float3 = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const float4 = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-7px); }
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -10%;
    left: -10%;
    width: 120%;
    height: 120%;
    background-image: url('/images/hero-bg.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    animation: ${slowZoom} 20s ease-in-out infinite alternate;
    z-index: 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 2rem;
  animation: ${fadeIn} 1.2s ease-out;
  color: white;
`;

const FloatingLetters = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0rem;
`;

const Letter = styled.span`
  font-size: 13rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  color: #EDE7DE;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  display: inline-block;
  animation: ${props => {
    switch(props.$index) {
      case 0: return float1;
      case 1: return float2;
      case 2: return float3;
      case 3: return float4;
      default: return float1;
    }
  }} 3s ease-in-out infinite;
  
  @media (max-width: 768px) {
    font-size: 4rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1rem;
  font-weight: 100;
  font-family: 'BlackerSans Pro', sans-serif;
  letter-spacing: 8px;
  margin-bottom: 1rem;
  color: #EDE7DE;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    font-size: 0.75rem;
    letter-spacing: 4px;
  }
`;

const CtaButton = styled.button`
  background: #EDE7DE;
  color: #5E524A;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'BlackerSans Pro', sans-serif;
  font-weight: 300;
  border-radius: 30px;
  
  &:hover {
    background: #D0CBC4;
    color: #5E524A;
    transform: scale(1.05);
    letter-spacing: 4px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  }
`;

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <HeroSection>
      <HeroContent>
        <FloatingLetters>
          <Letter $index={0}>L</Letter>
          <Letter $index={1}>O</Letter>
          <Letter $index={2}>O</Letter>
          <Letter $index={3}>N</Letter>
        </FloatingLetters>
        <HeroSubtitle>тишина в гардеробе</HeroSubtitle>
        <CtaButton onClick={() => navigate('/collections')}>Смотреть коллекцию</CtaButton>
      </HeroContent>
    </HeroSection>
  );
};

export default HomePage;