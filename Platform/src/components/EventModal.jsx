import React from 'react';
import { X } from 'lucide-react';

export default function EventModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#121824] text-white w-full max-w-xl rounded-2xl p-6 relative border border-slate-800 shadow-2xl">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-red-500 hover:text-red-400 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Judul & Detail Event */}
        <h2 className="text-xl font-bold tracking-wide mb-3 uppercase">
          NEO-RHYTHM MUSIC FESTIVAL 2026
        </h2>

        <div className="text-gray-300 text-sm space-y-1 mb-4 font-medium">
          <p className="uppercase tracking-wide font-semibold">SABTU, 24 OKTOBER 2026</p>
          <p>15.00-23.00 WIB</p>
          <p className="text-gray-400">Indonesia Convention Exhibition (ICE) BSD, Tangerang</p>
        </div>

        {/* Deskripsi */}
        <p className="text-gray-400 text-xs leading-relaxed mb-4">
          Rasakan pengalaman festival musik elektronik dan indie terbesar tahun ini! Neo-Rhythm Music Festival 2026 menghadirkan kombinasi visual panggung megah bertema futuristik dengan tata suara kelas dunia.
        </p>

        {/* Line Up */}
        <div className="text-xs text-gray-300 mb-4">
          <p className="font-semibold text-gray-400 mb-1">Line-Up Utama:</p>
          <p>• Reality Club • Feast • Weird Genius • Special Guest DJ</p>
        </div>

        {/* Syarat & Ketentuan */}
        <div className="text-xs text-gray-400 space-y-1 mb-8">
          <p className="font-semibold text-gray-300">Syarat & Ketentuan Singkat:</p>
          <p>1. Pengunjung wajib menunjukkan e-ticket dan kartu identitas resmi (KTP/SIM).</p>
          <p>2. Kategori usia 15 tahun ke atas.</p>
          <p>3. Dilarang membawa makanan, minuman dari luar, dan kamera profesional.</p>
        </div>

        {/* Footer Modal: Harga & Tombol */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Harga Tiket</p>
            <p className="text-base font-bold text-white">Rp.000.000</p>
          </div>
          <button
            onClick={() => alert('Pembelian tiket diproses!')}
            className="bg-[#0088ff] hover:bg-blue-600 text-white text-xs font-semibold px-6 py-2.5 rounded-full transition cursor-pointer"
          >
            Beli Tiket Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}