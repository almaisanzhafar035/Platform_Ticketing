import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  DollarSign, 
  Layers, 
  Search, 
  Plus, 
  Edit, 
  Trash2,
  X 
} from 'lucide-react';
import { customFetch } from '../utils/customFetch';

export default function Tickets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // State untuk data API Database
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    eventName: '',
    category: '',
    price: 0,
    quota: 100,
    status: 'Active'
  });

  // Fetch data tiket dari backend database
  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await customFetch('/events/tickets/admin');
      if (response.success) {
        // Format ulang response agar sesuai dengan key yang digunakan UI
        const formatted = response.data.map(item => ({
          id: item.ticket_id,
          eventName: item.event_name,
          category: item.category,
          price: Number(item.price) || 0,
          sold: Number(item.sold) || 0,
          quota: Number(item.quota) || 0,
          status: Number(item.sold) >= Number(item.quota) ? 'Sold Out' : 'Active'
        }));
        setTickets(formatted);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Open Modal Create/Edit
  const handleOpenModal = (ticket = null) => {
    if (ticket) {
      setEditingId(ticket.id);
      setFormData({
        eventName: ticket.eventName,
        category: ticket.category,
        price: ticket.price,
        quota: ticket.quota,
        status: ticket.status
      });
    } else {
      setEditingId(null);
      setFormData({ eventName: '', category: '', price: 0, quota: 0, status: 'Active' });
    }
    setIsModalOpen(true);
  };

  // Delete Handler (Memanggil API Delete)
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ticket tier?')) {
      try {
        const response = await customFetch(`/events/tickets/${id}`, {
          method: 'DELETE'
        });

        if (response.success) {
          fetchTickets();
        }
      } catch (err) {
        alert(`Gagal menghapus tiket: ${err.message}`);
      }
    }
  };

  // Submit Handler (Memanggil API Put/Post)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // API Update Tiket
        const response = await customFetch(`/events/tickets/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify({
            nama_category: formData.category,
            harga: formData.price,
            stok: formData.quota
          })
        });

        if (response.success) {
          fetchTickets();
        }
      } else {
        // API Create Tiket
        const response = await customFetch('/events/tickets', {
          method: 'POST',
          body: JSON.stringify({
            event_id: 1, // Disesuaikan ID event terkait
            nama_category: formData.category,
            harga: formData.price,
            stok: formData.quota
          })
        });

        if (response.success) {
          fetchTickets();
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(`Gagal menyimpan data: ${err.message}`);
    }
  };

  // Filter Data
  const filteredTickets = tickets.filter(t => {
    const matchesSearch = (t.eventName || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (t.category || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Reset Filters Handler (View All & Refresh Data)
  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
  };

  // Calculate Dynamic Stats
  const totalSold = tickets.reduce((acc, curr) => acc + Number(curr.sold || 0), 0);
  const totalRevenue = tickets.reduce((acc, curr) => acc + (Number(curr.sold || 0) * Number(curr.price || 0)), 0);
  const activeTiers = tickets.filter(t => t.status === 'Active').length;

  const stats = [
    { title: 'Total Sold', value: totalSold.toLocaleString('en-US'), icon: Ticket, color: '#2563eb', bgColor: '#eff6ff' },
    { title: 'Total Revenue', value: `IDR ${(totalRevenue / 1000000).toFixed(1)}M`, icon: DollarSign, color: '#059669', bgColor: '#ecfdf5' },
    { title: 'Active Tiers', value: `${activeTiers} Tiers`, icon: Layers, color: '#8b5cf6', bgColor: '#f5f3ff' },
  ];

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box', padding: '28px 36px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Ticket Management</h2>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '6px 0 0 0' }}>Manage ticket lists, quota, and pricing for each event.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '10px 20px', 
            backgroundColor: '#2563eb', 
            color: '#ffffff', 
            border: 'none', 
            borderRadius: '10px', 
            fontWeight: '600', 
            cursor: 'pointer', 
            fontSize: '14px',
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
          }}
        >
          <Plus size={18} />
          <span>Create Ticket Tier</span>
        </button>
      </div>

      {/* Top 3 Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.title}</span>
                  <div style={{ fontSize: '24px', fontWeight: '700', marginTop: '8px', color: '#0f172a' }}>{stat.value}</div>
                </div>
                <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: stat.bgColor, color: stat.color }}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Section */}
      <div style={{ ...cardStyle, padding: '24px' }}>
        
        {/* Search & Filter Controls */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', color: '#94a3b8' }} />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ticket category or event..." 
              style={{ ...inputStyle, width: '100%', paddingLeft: '2.6rem' }} 
            />
          </div>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ ...inputStyle, width: '180px', cursor: 'pointer' }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Sold Out">Sold Out</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        {/* State Loading & Error */}
        {loading && <p style={{ color: '#64748b', padding: '12px 0' }}>Memuat data tiket dari database...</p>}
        {error && <p style={{ color: '#ef4444', padding: '12px 0' }}>Error: {error}</p>}

        {/* Tickets Table */}
        {!loading && !error && (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    <th style={thStyle}>Event Name</th>
                    <th style={thStyle}>Category</th>
                    <th style={thStyle}>Price</th>
                    <th style={thStyle}>Sold / Quota</th>
                    <th style={thStyle}>Status</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.length > 0 ? (
                    filteredTickets.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ ...tdStyle, fontWeight: '600', color: '#0f172a' }}>{item.eventName}</td>
                        <td style={tdStyle}>
                          <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '13px', fontWeight: '500' }}>
                            {item.category}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, fontWeight: '600', color: '#0f172a' }}>IDR {Number(item.price).toLocaleString('en-US')}</td>
                        <td style={tdStyle}>{item.sold}/{item.quota}</td>
                        <td style={tdStyle}>
                          <span style={statusBadgeStyle(item.status)}>
                            {item.status}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <button 
                              onClick={() => handleOpenModal(item)}
                              style={actionButtonStyle('#2563eb', '#eff6ff')}
                              title="Edit Ticket"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              style={actionButtonStyle('#ef4444', '#fef2f2')}
                              title="Delete Ticket"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                        No tickets found in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Tombol View All di Bagian Kanan Bawah */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button 
                onClick={handleResetFilters}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#2563eb', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  cursor: 'pointer',
                  padding: '6px 12px'
                }}
              >
                View All
              </button>
            </div>
          </>
        )}

      </div>

      {/* Modal Add / Edit Ticket */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>
                {editingId ? 'Edit Ticket Tier' : 'Create New Ticket Tier'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Event Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Jakarta Music Fest 2026"
                  value={formData.eventName} 
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  style={inputStyle} 
                />
              </div>

              <div>
                <label style={labelStyle}>Category Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. VIP Pass, Early Bird" 
                  value={formData.category} 
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={inputStyle} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Price (IDR)</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    style={inputStyle} 
                  />
                </div>
                <div>
                  <label style={labelStyle}>Quota</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.quota} 
                    onChange={(e) => setFormData({ ...formData, quota: Number(e.target.value) })}
                    style={inputStyle} 
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Status</label>
                <select 
                  value={formData.status} 
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Active">Active</option>
                  <option value="Sold Out">Sold Out</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Save Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Inline Styles
const cardStyle = { 
  backgroundColor: '#ffffff', 
  borderRadius: '16px', 
  padding: '24px', 
  border: '1px solid #e2e8f0', 
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)' 
};

const inputStyle = { 
  width: '100%', 
  padding: '11px 14px', 
  border: '1px solid #cbd5e1', 
  borderRadius: '10px', 
  fontSize: '14px', 
  outline: 'none', 
  boxSizing: 'border-box',
  backgroundColor: '#ffffff',
  color: '#334155'
};

const labelStyle = { 
  display: 'block', 
  fontSize: '13px', 
  fontWeight: '600', 
  color: '#475569', 
  marginBottom: '6px' 
};

const thStyle = { padding: '14px 16px', fontWeight: '600', fontSize: '13px' };
const tdStyle = { padding: '16px', color: '#334155' };

const actionButtonStyle = (color, bgColor) => ({
  padding: '8px',
  border: 'none',
  borderRadius: '8px',
  backgroundColor: bgColor,
  color: color,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const statusBadgeStyle = (status) => {
  let color = '#059669';
  let bgColor = '#d1fae5';
  let borderColor = '#a7f3d0';

  if (status === 'Sold Out') {
    color = '#dc2626';
    bgColor = '#fef2f2';
    borderColor = '#fecaca';
  } else if (status === 'Draft') {
    color = '#d97706';
    bgColor = '#fffbeb';
    borderColor = '#fde68a';
  }

  return {
    backgroundColor: bgColor,
    color: color,
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    border: `1px solid ${borderColor}`,
    display: 'inline-block'
  };
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.4)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  padding: '28px',
  width: '100%',
  maxWidth: '460px',
  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
};