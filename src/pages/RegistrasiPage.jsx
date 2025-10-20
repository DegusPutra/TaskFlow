import React, { useState } from 'react'

const RegistrasiPage = ({ onNavigate, onShowNotification }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validasi sederhana
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      onShowNotification('Semua kolom wajib diisi!', 'error')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      onShowNotification('Password tidak cocok!', 'error')
      return
    }

    // Simulasi sukses
    onShowNotification('Registrasi berhasil! Silakan login.', 'success')
    setTimeout(() => onNavigate('login'), 1200)
  }

  return (
    <div className="page-container">
      <div className="form-box">
        {/* Logo */}
        <h2 className="logo-text">
          <span className="text-red">Task</span>
          <span className="text-green">Flow</span>
        </h2>

        <form onSubmit={handleSubmit}>
          <label>Nama Lengkap</label>
          <input
            type="text"
            name="name"
            placeholder="Masukkan nama lengkap"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Alamat Email</label>
          <input
            type="email"
            name="email"
            placeholder="Masukkan email kamu"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Masukkan password"
            value={formData.password}
            onChange={handleChange}
          />

          <label>Konfirmasi Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Ulangi password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit">Daftar</button>
        </form>

        {/* Link ke halaman login */}
        <div className="account-link">
          <span>Sudah punya akun?</span>
          <button
            className="link-text"
            onClick={() => onNavigate('login')}
          >
            Login di sini
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegistrasiPage
