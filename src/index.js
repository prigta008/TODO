import { StrictMode } from 'react';
import { render } from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
);
serviceWorkerRegistration.register();