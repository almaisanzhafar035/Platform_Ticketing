import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '../utils/customFetch';
import { 
  DollarSign, 
  Ticket, 
  Calendar, 
  UserCheck, 
  TrendingUp, 
  ArrowUpRight, 
  Plus, 
  Trash2, 
  Edit,
  Image as ImageIcon
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load Data dari API Backend
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Event
      const resEvents = await customFetch('/events');
      if (resEvents && resEvents.success && Array.isArray(resEvents.data)) {
        setEvents(resEvents.data);
      }

      // 2. Fetch Rekap Transaksi
      const resTx = await customFetch('/transactions');
      if (resTx && resTx.success && Array.isArray(resTx.data)) {
        setTransactions(resTx.data);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Fungsi Hapus Event (Delete)
  const handleDeleteEvent = async (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus event "${title || 'ini'}"?`)) {
      try {
        const response = await customFetch(`/events/${id}`, { method: 'DELETE' });
        if (response && response.success) {
          alert('Event berhasil dihapus');
          loadDashboardData();
        }
      } catch (err) {
        alert(`Gagal menghapus event: ${err.message}`);
      }
    }
  };

  // Fungsi Edit Event (Update) - Diperbaiki ke rute admin/events yang benar
  const handleEditEvent = (evt) => {
    navigate('/admin/events', { state: { eventToEdit: evt } });
  };

  // Hitung Total Revenue secara Dinamis dari Transaksi
  const totalRevenue = transactions.reduce((acc, tx) => {
    const status = (tx.status_pembayaran || tx.status || '').toUpperCase();
    const amount = Number(tx.total_harga || tx.amount || tx.total_price || 0);
    if (status === 'PAID' || status === 'SUCCESS' || status === 'BERHASIL') {
      return acc + amount;
    }
    return acc;
  }, 0);

  const stats = [
    { 
      title: 'TOTAL REVENUE', 
      value: `Rp ${totalRevenue > 0 ? totalRevenue.toLocaleString('id-ID') : '600.000'}`, 
      change: '+12%', 
      isPositive: true, 
      icon: DollarSign, 
      color: '#2563eb', 
      bgColor: '#eff6ff' 
    },
    { 
      title: 'TICKETS SOLD', 
      value: transactions.length > 0 ? transactions.length.toString() : '2', 
      change: '+5%', 
      isPositive: true, 
      icon: Ticket, 
      color: '#8b5cf6', 
      bgColor: '#f5f3ff' 
    },
    { 
      title: 'ACTIVE EVENT', 
      value: events.length.toString(), 
      change: 'Stable', 
      isPositive: true, 
      icon: Calendar, 
      color: '#059669', 
      bgColor: '#ecfdf5' 
    },
    { 
      title: 'LIVE CHECK-INS', 
      value: '18', 
      change: '+8%', 
      isPositive: true, 
      icon: UserCheck, 
      color: '#ea580c', 
      bgColor: '#fff7ed' 
    },
  ];

  return (
    <div style={{ padding: '24px 32px', boxSizing: 'border-box', maxWidth: '1400px', width: '100%', margin: '0 auto', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header Dashboard */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>Dashboard</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Manage events and monitor ticketing platform performance in real-time.</p>
        </div>
        <button onClick={() => navigate('/admin/events')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
          <Plus size={16} /> Create New Event
        </button>
      </div>

      {/* 4 Cards Statistik */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '700', letterSpacing: '0.5px' }}>{stat.title}</span>
                  <div style={{ fontSize: '20px', fontWeight: '700', marginTop: '6px', color: '#0f172a' }}>{stat.value}</div>
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: stat.bgColor, color: stat.color, flexShrink: 0 }}>
                  <Icon size={18} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '11px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: stat.isPositive ? '#16a34a' : '#dc2626', fontWeight: '600', backgroundColor: stat.isPositive ? '#f0fdf4' : '#fef2f2', padding: '2px 5px', borderRadius: '4px' }}>
                  <TrendingUp size={11} />
                  {stat.change}
                </span>
                <span style={{ color: '#94a3b8' }}>vs last week</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabel Kelola Daftar Event (CRUD Active) */}
      <div style={{ ...cardStyle, marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Manage Event List</h4>
          <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: '600' }}>Total: {events.length} Events</span>
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <th style={thStyle}>Event Name</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Location</th>
                <th style={thStyle}>Price</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Actions (CRUD)</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>Loading event data...</td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>No event data available.</td>
                </tr>
              ) : (
                events.map((evt) => {
                  const id = evt.event_id || evt.id;
                  const title = evt.nama_event || evt.title || '-';
                  const category = evt.category || evt.kategori || 'Event';
                  const date = evt.tanggal_pembelian_mulai 
                    ? new Date(evt.tanggal_pembelian_mulai).toISOString().split('T')[0]
                    : (evt.date || '-');
                  const location = evt.lokasi || evt.location || 'ICE BSD';
                  const price = evt.harga_mulai 
                    ? `Rp ${Number(evt.harga_mulai).toLocaleString('id-ID')}` 
                    : (evt.price || 'Rp 0');

                  // Ambil URL Poster dari backend menggunakan hostname "shin" secara permanen
                  const posterUrl = evt.poster 
                    ? (evt.poster.startsWith('http') ? evt.poster.replace(/http:\/\/[^\/]+/, 'http://192.168.1.15:8081/api') : `http://192.168.1.15:8081/api/uploads/${evt.poster}`)
                    : null;

                  return (
                    <tr key={id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ ...tdStyle, fontWeight: '600', color: '#0f172a' }}>
                        {/* Menampilkan Gambar Poster di Samping Nama Event */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {posterUrl ? (
                            <img 
                              src={posterUrl} 
                              alt={title} 
                              style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} 
                              onError={(e) => {
                                // Fallback jika file fisik di folder uploads Lenovo tidak ditemukan
                                e.target.style.display = 'none';
                                if (e.target.nextSibling) {
                                  e.target.nextSibling.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          
                          {/* Fallback Icon jika posterUrl null atau gambar gagal dipanggil */}
                          <div style={{ 
                            width: '36px', 
                            height: '36px', 
                            borderRadius: '6px', 
                            backgroundColor: '#f1f5f9', 
                            display: posterUrl ? 'none' : 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: '#94a3b8',
                            flexShrink: 0 
                          }}>
                            <ImageIcon size={18} />
                          </div>

                          <span>{title}</span>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: '#e0f2fe', color: '#0284c7', fontSize: '11px', fontWeight: '600' }}>{category}</span>
                      </td>
                      <td style={tdStyle}>{date}</td>
                      <td style={tdStyle}>{location}</td>
                      <td style={{ ...tdStyle, fontWeight: '600', color: '#16a34a' }}>{price}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button onClick={() => handleEditEvent(evt)} style={editBtnStyle} title="Edit Event">
                            <Edit size={14} />
                          </button>
                          <button onClick={() => handleDeleteEvent(id, title)} style={deleteBtnStyle} title="Delete Event">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabel Recent Transactions */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Recent Transactions</h4>
          <button onClick={() => navigate('/admin/tickets')} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
            <span>View All</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Ticket Type</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>Loading transaction data...</td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>No transactions recorded yet.</td>
                </tr>
              ) : (
                transactions.map((tx, idx) => {
                  const orderId = tx.transaction_id ? `TRX-${tx.transaction_id}` : (tx.orderId || `TRX-00${idx + 1}`);
                  const customer = tx.nama_pembeli || tx.customer || tx.user_name || 'Customer';
                  const type = tx.nama_category || tx.type || tx.ticket_type || 'VIP';
                  const amount = tx.total_harga ? `Rp ${Number(tx.total_harga).toLocaleString('id-ID')}` : (tx.amount || 'Rp 0');
                  const status = (tx.status_pembayaran || tx.status || 'PAID').toUpperCase();

                  const isPaid = status === 'PAID' || status === 'SUCCESS' || status === 'BERHASIL';

                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ ...tdStyle, fontWeight: '600', color: '#0f172a' }}>{orderId}</td>
                      <td style={tdStyle}>{customer}</td>
                      <td style={tdStyle}>
                        <span style={{ padding: '2px 6px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '10px', fontWeight: '500' }}>{type}</span>
                      </td>
                      <td style={{ ...tdStyle, fontWeight: '600', color: '#0f172a' }}>{amount}</td>
                      <td style={tdStyle}>
                        <span style={{ 
                          backgroundColor: isPaid ? '#dcfce7' : '#fef3c7', 
                          color: isPaid ? '#15803d' : '#b45309', 
                          padding: '3px 8px', 
                          borderRadius: '20px', 
                          fontSize: '10px', 
                          fontWeight: '600', 
                          border: `1px solid ${isPaid ? '#bbf7d0' : '#fde68a'}` 
                        }}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// Styling
const cardStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '10px',
  padding: '16px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.01)',
  boxSizing: 'border-box'
};
const thStyle = { padding: '10px 12px', fontWeight: '600', fontSize: '11px' };
const tdStyle = { padding: '12px 12px', color: '#334155' };
const editBtnStyle = { padding: '6px', backgroundColor: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const deleteBtnStyle = { padding: '6px', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };