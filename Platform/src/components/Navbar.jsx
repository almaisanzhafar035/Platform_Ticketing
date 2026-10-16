import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cek status login saat komponen dimuat
  useEffect(() => {
    const user = localStorage.getItem('userLoggedIn') || localStorage.getItem('token');
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('Berhasil keluar!');
    navigate('/');
  };

  return (
    <header className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 p-4 md:px-8">
      <div className="flex items-center gap-6">
        {/* Logo NEXA EVENT */}
        <Link to="/" className="text-xl font-bold tracking-wider text-purple-400 cursor-pointer">
          NEXA <span className="text-purple-500">EVENT</span>
        </Link>

        {/* Dropdown Lokasi */}
        <select className="bg-white text-gray-800 text-sm font-semibold py-1.5 px-3 rounded-md outline-none cursor-pointer">
          <option>Jakarta</option>
          <option>Bandung</option>
          <option>Surabaya</option>
          <option>Bali</option>
        </select>
      </div>

      {/* Input Pencarian */}
      <div className="flex-1 max-w-xl relative hidden md:block">
        <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Cari event, konser, atau venue..."
          className="w-full bg-white text-gray-800 text-sm pl-9 pr-4 py-1.5 rounded-md focus:outline-none"
        />
      </div>

      {/* Tombol Masuk / Keluar Dinamis */}
      {isLoggedIn ? (
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-5 py-1.5 rounded-md transition inline-block text-center cursor-pointer"
        >
          Keluar
        </button>
      ) : (
        <Link 
          to="/login" 
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-1.5 rounded-md transition inline-block text-center"
        >
          Masuk
        </Link>
      )}
    </header>
  );
}