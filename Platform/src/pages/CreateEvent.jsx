import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, Plus, Trash2, Link as LinkIcon, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { customFetch } from '../utils/customFetch';

export default function CreateEvent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Deteksi mode Edit atau Buat Baru dari navigasi Dashboard
  const eventToEdit = location.state?.eventToEdit || null;
  const isEditing = Boolean(eventToEdit);

  // Form States (Pastikan semua state ini ada)
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [banner, setBanner] = useState(null); // URL preview
  const [bannerFile, setBannerFile] = useState(null); // File asli untuk dikirim ke backend
  
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [locationValue, setLocationValue] = useState('');

  // State Tiket (Wajib ada agar setTickets tidak error)
  const [tickets, setTickets] = useState([
    { nama_kategori: 'VIP Pass', kuota: 100, harga: 250000 },
    { nama_kategori: 'Regular Pass', kuota: 300, harga: 100000 }
  ]);

  const [loading, setLoading] = useState(false);

useEffect(() => {
    console.log("Data mentah eventToEdit:", eventToEdit);
    
    if (isEditing && eventToEdit) {
      // 1. General Info
      setEventName(eventToEdit.nama_event || eventToEdit.title || eventToEdit.name || '');
      setDescription(eventToEdit.deskripsi || eventToEdit.description || '');

      // 2. Kategori (Mencakup semua kemungkinan nama kolom)
      const cat = eventToEdit.category || eventToEdit.kategori || eventToEdit.nama_kategori || eventToEdit.category_name || '';
      setCategory(cat);

      // 3. Tanggal
      const start = eventToEdit.tanggal_pembelian_mulai || eventToEdit.start_time || eventToEdit.start_date || '';
      const end = eventToEdit.tanggal_pembelian_selesai || eventToEdit.end_time || eventToEdit.end_date || '';
      setStartTime(start ? start.slice(0, 16) : '');
      setEndTime(end ? end.slice(0, 16) : '');

      // 4. Venue / Lokasi Address (Mencakup lokasi, alamat, venue)
      const loc = eventToEdit.lokasi || eventToEdit.venue_address || eventToEdit.location || eventToEdit.venue || eventToEdit.address || eventToEdit.alamat || '';
      setLocationValue(loc);
      if (loc.toLowerCase().includes('http') || loc.toLowerCase().includes('zoom') || loc.toLowerCase().includes('meet')) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }

      // 5. Banner / Poster
      const posterVal = eventToEdit.poster || eventToEdit.banner || eventToEdit.image || eventToEdit.thumbnail;
      if (posterVal) {
        const posterUrl = posterVal.startsWith('http') 
          ? posterVal 
          : `http://192.168.1.15:8081/api/uploads/${posterVal}`;
        setBanner(posterUrl);
      }

      // 6. Ticket Tiers (Cek berbagai variasi key tiket)
      const rawTickets = eventToEdit.tickets || eventToEdit.ticket_tiers || eventToEdit.ticketList || eventToEdit.daftar_tiket;
      if (rawTickets) {
        try {
          const parsedTickets = typeof rawTickets === 'string' 
            ? JSON.parse(rawTickets) 
            : rawTickets;
            
          if (Array.isArray(parsedTickets) && parsedTickets.length > 0) {
            const mappedTickets = parsedTickets.map(t => ({
              name: t.name || t.nama_kategori || t.ticket_name || t.tier_name || '',
              quantity: t.quantity || t.kuota || t.stok || t.qty || 0,
              price: t.price || t.harga || t.cost || 0
            }));
            setTickets(mappedTickets);
          }
        } catch (e) {
          console.error("Gagal memparsing data tiket:", e);
        }
      }
    }
  }, [isEditing, eventToEdit]);
  // Handler Dynamic Tickets
  const handleAddTicket = () => {
    setTickets([...tickets, { name: '', quantity: 0, price: 0 }]);
  };

  const handleRemoveTicket = (index) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...tickets];
    updatedTickets[index][field] = value;
    setTickets(updatedTickets);
  };

  // Handler Upload Banner
  const handleBannerUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file); // Simpan file fisik untuk FormData
      setBanner(URL.createObjectURL(file)); // Simpan preview
    }
  };

  // Actions
  const handleSaveDraft = async () => {
    if (!eventName) {
      alert('Please enter Event Name to save Draft!');
      return;
    }
    await sendEventToBackend(true);
  };

  const handlePublish = async (e) => {
    if (e) e.preventDefault();
    if (!eventName || !startTime || !locationValue) {
      alert('Please complete the main information (Event Name, Start Time, and Location/Link)!');
      return;
    }
    await sendEventToBackend(false);
  };

  // Fungsi Pengiriman Data ke Backend (Mendukung POST untuk Create & PUT untuk Edit)
  const sendEventToBackend = async (isDraft = false) => {
    setLoading(true);
    try {
      const lowestPrice = tickets.length > 0 ? Math.min(...tickets.map(t => Number(t.price) || 0)) : 0;

      const formData = new FormData();
      formData.append('nama_event', eventName);
      formData.append('category', category || 'Music');
      formData.append('deskripsi', description || '');
      formData.append('tanggal_pembelian_mulai', startTime);
      formData.append('tanggal_pembelian_selesai', endTime || startTime);
      formData.append('lokasi', locationValue);
      formData.append('harga_mulai', lowestPrice);
      formData.append('is_draft', isDraft ? '1' : '0');
      formData.append('tickets', JSON.stringify(tickets));

      if (bannerFile) {
        formData.append('poster', bannerFile);
      }

      let response;
      const eventId = eventToEdit?.event_id || eventToEdit?.id;

      if (isEditing) {
        // Mode UPDATE / EDIT (PUT Request)
        response = await customFetch(`/events/${eventId}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        // Mode CREATE / BUAT BARU (POST Request)
        response = await customFetch('/events', {
          method: 'POST',
          body: formData
        });
      }

      if (response && response.success) {
        alert(isEditing ? `Event "${eventName}" updated successfully!` : `Event "${eventName}" published successfully!`);
        navigate('/admin'); // Kembali ke Dashboard Admin
      } else {
        alert(response?.message || 'Gagal menyimpan event ke database.');
      }
    } catch (err) {
      console.error("Error submitting event:", err);
      alert(`Gagal terhubung ke backend: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => navigate(-1)} style={backBtnStyle}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', margin: 0 }}>
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
              {isEditing ? 'Modify the details below to update your event.' : 'Fill out the form below to create a new event.'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button"
            onClick={handleSaveDraft}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', color: '#334155', cursor: 'pointer', fontSize: '13px' }}
          >
            Save as Draft
          </button>
          <button 
            type="button"
            onClick={handlePublish}
            disabled={loading}
            style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
          >
            {loading ? 'Processing...' : (isEditing ? 'Update Event' : 'Publish Event')}
          </button>
        </div>
      </div>

      {/* Main Grid Form */}
      <form onSubmit={handlePublish} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        
        {/* Left Column: General Info */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>General Event Info</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div>
              <label style={labelStyle}>Event Name</label>
              <input 
                type="text" 
                placeholder="Enter your event name..." 
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                style={inputStyle} 
              />
            </div>

            <div>
              <label style={labelStyle}>Event Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                style={inputStyle}
              >
                <option value="">Select Category</option>
                <option value="Music">Music</option>
                <option value="Tech">Technology</option>
                <option value="Seminar">Seminar & Workshop</option>
                <option value="Business">Business</option>
                <option value="Art">Art & Culture</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea 
                rows="4" 
                placeholder="Write a brief event description..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ ...inputStyle, resize: 'none' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Event Banner / Image</label>
              <label style={{ 
                border: '2px dashed #cbd5e1', 
                borderRadius: '8px', 
                height: '120px', 
                backgroundColor: '#f8fafc', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#64748b', 
                fontSize: '13px',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {banner ? (
                  <img src={banner} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <>
                    <Upload size={24} style={{ marginBottom: '6px', color: '#94a3b8' }} />
                    <span>Click to upload event banner</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleBannerUpload} style={{ display: 'none' }} />
              </label>
            </div>

          </div>
        </div>

        {/* Right Column: Date, Location & Tickets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Card Date & Location */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Date & Location</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Start Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  style={inputStyle} 
                />
              </div>
              <div>
                <label style={labelStyle}>End Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  style={inputStyle} 
                />
              </div>
            </div>

            <label style={labelStyle}>Location Type</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}>
                <input type="radio" name="loc" checked={isOnline} onChange={() => setIsOnline(true)} /> Online Event
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', color: '#334155' }}>
                <input type="radio" name="loc" checked={!isOnline} onChange={() => setIsOnline(false)} /> Venue (Offline)
              </label>
            </div>

            <div>
              <label style={labelStyle}>{isOnline ? 'Streaming Link' : 'Venue Address'}</label>
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  placeholder={isOnline ? "Enter streaming link..." : "Enter venue address..."} 
                  value={locationValue}
                  onChange={(e) => setLocationValue(e.target.value)}
                  style={inputStyle} 
                />
              </div>
            </div>
          </div>

          {/* Card Ticket Tiers */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Ticket Tiers</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              {tickets.map((ticket, index) => (
                <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="text" 
                    placeholder="Ticket Name (VIP)" 
                    value={ticket.name}
                    onChange={(e) => handleTicketChange(index, 'name', e.target.value)}
                    style={inputStyle} 
                  />
                  <input 
                    type="text" 
                    placeholder="Quantity" 
                    value={ticket.quantity || ''}
                    onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                    style={inputStyle} 
                  />
                  <input 
                    type="text" 
                    placeholder="Price (IDR)" 
                    value={ticket.price || ''}
                    onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                    style={inputStyle} 
                  />
                  {tickets.length > 1 && (
                    <button 
                      type="button"
                      onClick={() => handleRemoveTicket(index)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button 
              type="button"
              onClick={handleAddTicket}
              style={{ width: '100%', padding: '10px', backgroundColor: '#f1f5f9', border: '1px dashed #cbd5e1', borderRadius: '8px', fontSize: '13px', fontWeight: '600', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            >
              <Plus size={16} /> Add Another Ticket Tier
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

// Inline Styles
const cardStyle = { 
  backgroundColor: '#ffffff', 
  borderRadius: '12px', 
  padding: '20px', 
  border: '1px solid #e2e8f0', 
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)' 
};

const labelStyle = { 
  display: 'block', 
  fontSize: '12px', 
  fontWeight: '600', 
  color: '#475569', 
  marginBottom: '6px' 
};

const inputStyle = { 
  width: '100%', 
  padding: '9px 12px', 
  border: '1px solid #cbd5e1', 
  borderRadius: '8px', 
  fontSize: '13px', 
  outline: 'none', 
  boxSizing: 'border-box',
  backgroundColor: '#ffffff',
  color: '#0f172a'
};

const backBtnStyle = { 
  background: '#ffffff', 
  border: '1px solid #e2e8f0', 
  borderRadius: '8px', 
  padding: '8px', 
  color: '#64748b', 
  cursor: 'pointer', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center' 
};