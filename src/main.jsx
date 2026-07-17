import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
<<<<<<< HEAD
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
=======
import Admin from './Admin.jsx'
import './index.css'

const isAdminPage = window.location.pathname.startsWith('/admin')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isAdminPage ? <Admin /> : <App />}
>>>>>>> cda789b876409e0cfc4bbd7d03c93bc27bca7df5
  </React.StrictMode>,
)
