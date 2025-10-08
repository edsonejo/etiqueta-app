// src/main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // <--- ESTA LINHA IMPORTA SEU CÓDIGO!
import './index.css' // Importa o CSS ajustado no Passo 4

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> 
  </React.StrictMode>,
)