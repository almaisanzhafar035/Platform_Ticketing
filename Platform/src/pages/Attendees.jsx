import React, { useState, useEffect } from 'react';
import { Search, Mail, Download, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { customFetch } from '../utils/customFetch';

export default function Attendees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventFilter, setEventFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // State data Attendees dari Database
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Attendees dari Backend Database
  const fetchAttendees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await customFetch('/admin/attendees');
      if (response.success) {
        const formatted = response.data.map(item => ({
          id: item.ticket_code || `TKN-${item.order_id}`,
          orderId: item.order_id,
          name: item.user_name || 'Anonymous',
          email: item.email || 'no-email@example.com',
          event: item.event_name || 'Unnamed Event',
          type: item.ticket_category || 'Regular',
          status: item.checkin_status || 'Pending'
        }));
        setAttendees(formatted);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, []);

  // Ambil daftar unik nama event untuk opsi dropdown filter
  const uniqueEvents = ['All', ...new Set(attendees.map(a => a.event))];

  // Send Email Handler
  const handleSendMessage = (name, email) => {
    const subject = encodeURIComponent("NexaEvent Information");
    const body = encodeURIComponent(`Hello ${name},\n\nHere is your ticket and event information...`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  // Toggle Check-In Status Handler (Memanggil API PUT ke Database)
  const handleStatusChange = async (row, newStatus) => {
    try {
      const targetId = row.orderId || row.id;
      const response = await customFetch(`/admin/attendees/${targetId}/checkin`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.success) {
        setAttendees(prev => prev.map(item => item.id === row.id ? { ...item, status: newStatus } : item));
      }
    } catch (err) {
      alert(`Gagal memperbarui status: ${err.message}`);
    }
  };

  // Filter Data
  const filteredAttendees = attendees.filter(item => {
    const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = eventFilter === 'All' || item.event === eventFilter;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    
    return matchesSearch && matchesEvent && matchesStatus;
  });

  // Export Data to CSV Handler
  const handleExportCSV = () => {
    if (filteredAttendees.length === 0) {
      alert("No data available to export!");
      return;
    }

    const headers = ["Ticket ID,Name,Email,Event,Type,Status"];
    const rows = filteredAttendees.map(a => 
      `"${a.id}","${a.name}","${a.email}","${a.event}","${a.type}","${a.status}"`
    );

    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendees_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset Filters Handler
  const handleResetFilters = () => {
    setSearchTerm('');
    setEventFilter('All');
    setStatusFilter('All');
    fetchAttendees(); 
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box', padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: '28px', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header Page */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>Attendees Management</h2>
          <p style={{ margin: '6px 0 0 0', color: '#64748b', fontSize: '14px' }}>Monitor attendance status and ticket holder details in real-time.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '10px 18px', 
            borderRadius: '10px', 
            border: '1px solid #cbd5e1', 
            backgroundColor: '#ffffff', 
            color: '#334155', 
            fontWeight: '600', 
            fontSize: '14px', 
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        <div style={cardStyle}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', letterSpacing: '0.5px' }}>TOTAL ATTENDEES</span>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '700', color: '#0f172a' }}>{attendees.length}</h3>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', letterSpacing: '0.5px' }}>CHECKED-IN</span>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '700', color: '#16a34a' }}>
            {attendees.filter(a => a.status === 'Checked-In').length}
          </h3>
        </div>
        <div style={cardStyle}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', letterSpacing: '0.5px' }}>PENDING CHECK-IN</span>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '700', color: '#d97706' }}>
            {attendees.filter(a => a.status === 'Pending').length}
          </h3>
        </div>
      </div>

      {/* Filter & Table Box */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        
        {/* Search & Select Filters */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', display: 'flex', alignItems: 'center' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search attendee name, email, or ticket ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '11px 14px 11px 2.6rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <select 
            value={eventFilter} 
            onChange={(e) => setEventFilter(e.target.value)}
            style={selectStyle}
          >
            {uniqueEvents.map((evt, idx) => (
              <option key={idx} value={evt}>{evt === 'All' ? 'All Events' : evt}</option>
            ))}
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            style={selectStyle}
          >
            <option value="All">All Status</option>
            <option value="Checked-In">Checked-In</option>
            <option value="Pending">Pending</option>
          </select>

          {(searchTerm || eventFilter !== 'All' || statusFilter !== 'All') && (
            <button 
              onClick={handleResetFilters}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '11px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#64748b', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}
            >
              <RefreshCw size={16} /> Reset
            </button>
          )}
        </div>

       {/* State Indicator */}
        {loading && <p style={{ color: '#64748b', padding: '12px 0' }}>Memuat data peserta dari database...</p>}
        {error && <p style={{ color: '#ef4444', padding: '12px 0' }}>Error: {error}</p>}

        {/* Table Data */}
        {!loading && !error && (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', backgroundColor: '#f8fafc' }}>
                    <th style={thStyle}>Ticket ID</th>
                    <th style={thStyle}>Attendee</th>
                    <th style={thStyle}>Event Name</th>
                    <th style={thStyle}>Type</th>
                    <th style={thStyle}>Status</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendees.length > 0 ? (
                    filteredAttendees.map((row) => (
                      <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ ...tdStyle, fontWeight: '600', color: '#0f172a' }}>{row.id}</td>
                        <td style={tdStyle}>
                          <div>
                            <p style={{ margin: 0, fontWeight: '600', color: '#0f172a' }}>{row.name}</p>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>{row.email}</span>
                          </div>
                        </td>
                        <td style={tdStyle}>{row.event}</td>
                        <td style={tdStyle}>
                          <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: '#eff6ff', fontSize: '13px', fontWeight: '500', color: '#2563eb' }}>
                            {row.type}
                          </span>
                        </td>
                        <td style={tdStyle}>
                          {row.status === 'Checked-In' ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', backgroundColor: '#dcfce7', color: '#15803d', fontSize: '12px', fontWeight: '600', border: '1px solid #a7f3d0' }}>
                              <CheckCircle size={14} /> Checked-In
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '20px', backgroundColor: '#fef3c7', color: '#b45309', fontSize: '12px', fontWeight: '600', border: '1px solid #fde68a' }}>
                              <Clock size={14} /> Pending
                            </span>
                          )}
                        </td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            
                            {/* Toggle Check-In / Cancel Button */}
                            {row.status === 'Pending' ? (
                              <button 
                                onClick={() => handleStatusChange(row, 'Checked-In')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '8px', border: 'none', backgroundColor: '#dcfce7', color: '#15803d', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                              >
                                <CheckCircle size={14} /> Check-In
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleStatusChange(row, 'Pending')}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: '8px', border: 'none', backgroundColor: '#fee2e2', color: '#b91c1c', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                              >
                                <XCircle size={14} /> Cancel
                              </button>
                            )}

                            {/* Interactive Email/Message Icon */}
                            <button 
                              onClick={() => handleSendMessage(row.name, row.email)}
                              title="Send Email to Attendee"
                              style={{ padding: '8px', borderRadius: '8px', border: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Mail size={16} />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>No attendee data matches your search/filter criteria.</td>
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

    </div>
  );
}



// Styling Objects
const cardStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
};

const selectStyle = {
  padding: '11px 14px',
  borderRadius: '10px',
  border: '1px solid #cbd5e1',
  fontSize: '14px',
  outline: 'none',
  backgroundColor: '#ffffff',
  cursor: 'pointer',
  color: '#334155'
};

const thStyle = {
  padding: '14px 16px',
  fontWeight: '600',
  fontSize: '13px'
};

const tdStyle = {
  padding: '16px',
  verticalAlign: 'middle',
  color: '#334155'
};