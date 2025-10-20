import React, { useState } from 'react'

const LoginPage = ({ onNavigate, onShowNotification }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      onShowNotification('Email dan password wajib diisi!', 'error');
      return;
    }

    // Simulasi login berhasil
    onShowNotification('Login berhasil!', 'success');

    // Navigasi ke dashboard setelah login sukses
    onNavigate('dashboard');
 };

  return (
    <div className="page-container">
      <div className="form-box">
        <h2 className="logo-text">
          <span className="text-red">Task</span>
          <span className="text-green">Flow</span>
        </h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Masuk</button>
        </form>

        {/* 🔵 Teks link daftar di sini */}
        <div className="account-link">
          <span>Belum punya akun?</span>
          <button
            onClick={() => onNavigate('register')}
            className="link-text"
          >
            Daftar di sini
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
