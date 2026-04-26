// frontend/src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* Подключаем шрифт с правильными настройками */
  @font-face {
    font-family: 'BlackerSans Pro';
    src: url('/fonts/0_BlackerSansProVariableGX.ttf') format('truetype');
    font-weight: 100 900;  /* Разрешаем все варианты толщины */
    font-style: normal;
    font-display: swap;
  }
  
  @font-face {
    font-family: 'BlackerSans Pro';
    src: url('/fonts/1_BlackerSansProItVariableGX.ttf') format('truetype');
    font-weight: 100 900;
    font-style: italic;
    font-display: swap;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'BlackerSans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 100;  /* Самый тонкий для всего текста на сайте */
    background: #fafafa;
    color: #1a1a1a;
    line-height: 1.5;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;

export default GlobalStyles;