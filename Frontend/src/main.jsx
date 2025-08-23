import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'

import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import { store } from './Redux/store.js';

const persistor=persistStore(store);

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
  </BrowserRouter>
)
