import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import NotFound from './components/NotFound.jsx';
import './styles/tokens.css';
import './styles/base.css';
import './styles/texture.css';
import './styles/sections.css';
import './styles/mockups.css';
import './styles/contact.css';

// One-page site: only the root path is real. Anything else gets the 404 page.
const isHome = ['/', '/index.html'].includes(window.location.pathname);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isHome ? <App /> : <NotFound />}
  </StrictMode>
);
