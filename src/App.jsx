import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import RegistrasiPage from './pages/RegistrasiPage';
import './styles/app.css';


function App() {
  const [page, setPage] = useState('login');
  const [notification, setNotification] = useState(null);

  const handleNavigate = (targetPage) => setPage(targetPage);

  const handleShowNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="app-container">
      {/* Notifikasi sederhana */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Routing manual */}
      {page === 'login' && (
        <LoginPage
          onNavigate={handleNavigate}
          onShowNotification={handleShowNotification}
        />
      )}
      {page === 'register' && (
        <RegistrasiPage
          onNavigate={handleNavigate}
          onShowNotification={handleShowNotification}
        />
      )}
    </div>
  );
}

export default App; 