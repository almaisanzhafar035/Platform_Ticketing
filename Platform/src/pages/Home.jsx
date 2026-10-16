import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customFetch } from '../utils/customFetch';
import {
  Home as HomeIcon,
  Compass,
  Ticket,
  Settings,
  LogOut,
  LogIn,
  Search,
  MapPin,
  Calendar,
  X,
  User,
  Lock,
  Bell,
  ShieldCheck,
  ChevronRight,
  Download,
  QrCode
} from 'lucide-react';

export default function Home() {
  const [activeMenu, setActiveMenu] = useState('Beranda');
  const [selectedCategory, setSelectedCategory] = useState('All Events');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // State untuk API Data
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('userLoggedIn') === 'true';
  });

  // Fungsi Fetch Data Event dari Backend Lenovo
  const fetchEvents = async (search = '', category = '') => {
    setLoading(true);
    setError(null);
    try {
      let endpoint = '/events?page=1&limit=10';
      if (search) endpoint += `&search=${encodeURIComponent(search)}`;
      if (category && category !== 'All Events') endpoint += `&category=${encodeURIComponent(category)}`;

      const response = await customFetch(endpoint);
      if (response.success) {
        setEvents(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger Fetch saat Komponen Pertama Dimuat & saat Filter Kategori Berubah
  useEffect(() => {
    fetchEvents(searchQuery, selectedCategory);
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEvents(searchQuery, selectedCategory);
  };

  const handleAuthAction = () => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    } else {
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      setIsLoggedIn(false);
      navigate('/login', { replace: true });
    }
  };

  return (
    <div style={layoutContainerStyle}>
      {/* SIDEBAR NAVIGATION */}
      <aside style={sidebarStyle}>
        <div style={{ marginBottom: '24px', paddingLeft: '8px' }}>
          <h2 style={logoStyle}>NEXA <span style={{ color: '#a78bfa' }}>EVENT</span></h2>
        </div>

        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: '700', marginBottom: '10px', paddingLeft: '8px', letterSpacing: '0.5px' }}>
          Main Menu
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => setActiveMenu('Beranda')}
            style={activeMenu === 'Beranda' ? activeNavBtnStyle : navBtnStyle}
          >
            <HomeIcon size={18} /> Home
          </button>
          <button
            onClick={() => setActiveMenu('Jelajahi Event')}
            style={activeMenu === 'Jelajahi Event' ? activeNavBtnStyle : navBtnStyle}
          >
            <Compass size={18} /> Explore Events
          </button>
          <button
            onClick={() => setActiveMenu('Tiket Saya')}
            style={activeMenu === 'Tiket Saya' ? activeNavBtnStyle : navBtnStyle}
          >
            <Ticket size={18} /> My Tickets
          </button>
          <button
            onClick={() => setActiveMenu('Pengaturan')}
            style={activeMenu === 'Pengaturan' ? activeNavBtnStyle : navBtnStyle}
          >
            <Settings size={18} /> Settings
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT WRAPPER */}
      <div style={mainContentWrapperStyle}>
        {/* TOPBAR / HEADER */}
        <header style={topbarStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} color="#38bdf8" />
            <select style={selectCityStyle}>
              <option>Jakarta</option>
              <option>Bandung</option>
              <option>Surabaya</option>
            </select>
          </div>

          <form onSubmit={handleSearchSubmit} style={{ flex: 1, maxWidth: '450px', margin: '0 20px', position: 'relative' }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search events, concerts, or venues..."
              style={searchbarStyle}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div>
            <button
              onClick={handleAuthAction}
              style={isLoggedIn ? logoutBtnStyle : loginBtnStyle}
            >
              {isLoggedIn ? <LogOut size={16} /> : <LogIn size={16} />}
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>
        </header>

        {/* DYNAMIC CONTENT AREA */}
        <main style={contentAreaStyle}>
          {activeMenu === 'Beranda' && (
            <div>
              {/* HERO BANNER */}
              <div style={bannerStyle}>
                <span style={badgePresaleStyle}>PRESALE ACTIVE</span>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '8px 0 4px 0' }}>
                  STARRISE WORLD TOUR 2026
                </h1>
                <h2 style={{ fontSize: '1.2rem', color: '#38bdf8', margin: '0 0 10px 0' }}>IN JAKARTA</h2>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={15} /> Saturday, 14 November 2026 &nbsp;|&nbsp; <MapPin size={15} /> GBK Stadium, Jakarta
                </p>
                <div style={{ fontSize: '0.9rem', marginBottom: '14px' }}>
                  Starting from <strong style={{ color: '#facc15' }}>Rp 350.000</strong>
                </div>
                <button style={primaryBtnStyle}>Buy Tickets Now</button>
              </div>

              {/* CATEGORY FILTERS */}
              <div style={filterContainerStyle}>
                {['All Events', 'Music', 'Seminar', 'Art', 'Sport', 'Cosplay', 'VIP'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={selectedCategory === cat ? activeCategoryBtnStyle : categoryBtnStyle}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* POPULAR EVENTS SECTION */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                  Popular Events
                </h3>
                <span onClick={() => setActiveMenu('Jelajahi Event')} style={{ fontSize: '0.8rem', color: '#94a3b8', cursor: 'pointer' }}>View All</span>
              </div>

              {/* STATE LOADING / ERROR */}
              {loading && <p style={{ color: '#94a3b8' }}>Memuat data event...</p>}
              {error && <p style={{ color: '#ef4444' }}>Error: {error}</p>}

              {/* EVENT CARDS FROM API */}
              {!loading && !error && (
                <div style={cardGridStyle}>
                  {events.length === 0 ? (
                    <p style={{ color: '#94a3b8' }}>Tidak ada event ditemukan.</p>
                  ) : (
                    events.map((evt) => {
                      const posterUrl = evt.poster
                        ? `http://192.168.1.15:8081/api/uploads/${evt.poster}`
                        : null;

                      return (
                        <div
                          key={evt.event_id}
                          style={eventCardStyle}
                          onClick={() => setSelectedEvent(evt)}
                        >
                          <div style={cardImageBoxStyle}>
                            {posterUrl ? (
                              <img src={posterUrl} alt={evt.nama_event} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                            ) : (
                              <Calendar size={28} color="#64748b" />
                            )}
                          </div>
                          <h4 style={{ fontSize: '0.9rem', margin: '0 0 4px 0', color: '#fff' }}>{evt.nama_event}</h4>
                          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={12} /> {evt.deskripsi ? evt.deskripsi.substring(0, 30) + '...' : 'Lokasi Event'}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#facc15', fontWeight: 'bold', margin: 0 }}>
                            {evt.harga_mulai ? `Rp ${Number(evt.harga_mulai).toLocaleString('id-ID')}` : 'Belum Ada Tiket'}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}

          {activeMenu === 'Jelajahi Event' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '16px', color: '#fff' }}>Explore All Events</h2>

              {loading && <p style={{ color: '#94a3b8' }}>Memuat data event...</p>}
              {error && <p style={{ color: '#ef4444' }}>Error: {error}</p>}

              {!loading && !error && (
                <div style={cardGridStyle}>
                  {events.map((evt) => {
                    const posterUrl = evt.poster ? `http://10.236.191./api/uploads/${evt.poster}` : null;
                    return (
                      <div key={evt.event_id} style={eventCardStyle} onClick={() => setSelectedEvent(evt)}>
                        <div style={cardImageBoxStyle}>
                          {posterUrl ? (
                            <img src={posterUrl} alt={evt.nama_event} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                          ) : (
                            <Calendar size={36} color="#64748b" />
                          )}
                        </div>
                        <h4 style={{ fontSize: '0.95rem', margin: '0 0 4px 0', color: '#fff' }}>{evt.nama_event}</h4>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0 0 4px 0' }}>{evt.deskripsi}</p>
                        <p style={{ fontSize: '0.75rem', color: '#facc15', fontWeight: 'bold', margin: 0 }}>
                          {evt.harga_mulai ? `Rp ${Number(evt.harga_mulai).toLocaleString('id-ID')}` : 'Belum Ada Tiket'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeMenu === 'Tiket Saya' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '4px', color: '#fff' }}>My Tickets</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>List of events you have successfully purchased</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={ticketCardStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={ticketIconBoxStyle}>
                      <Ticket size={24} color="#38bdf8" />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.65rem', backgroundColor: '#065f46', color: '#34d399', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>E-TICKET READY</span>
                      <h4 style={{ fontSize: '0.95rem', color: '#fff', margin: '6px 0 4px 0' }}>NEO-RHYTHM MUSIC FESTIVAL 2026</h4>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>Sat, 24 Oct 2026 • 15:00 WIB • ICE BSD</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={actionTicketBtnStyle}><Download size={14} /> PDF</button>
                    <button style={actionTicketBtnStyle}><QrCode size={14} /> QR</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'Pengaturan' && (
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '4px', color: '#fff' }}>Account Settings</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '20px' }}>Manage your profile preferences and security</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '800px' }}>
                <div style={settingRowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ ...settingIconBoxStyle, backgroundColor: '#1e3a8a', color: '#60a5fa' }}><User size={18} /></div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: '#fff', margin: 0 }}>User Profile</h4>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>Update photo, name, and contact info</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.825rem', color: '#38bdf8', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>Edit <ChevronRight size={14} /></span>
                </div>

                <div style={settingRowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ ...settingIconBoxStyle, backgroundColor: '#581c87', color: '#c084fc' }}><Lock size={18} /></div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: '#fff', margin: 0 }}>Password & Security</h4>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>Update password and 2FA authentication</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.825rem', color: '#38bdf8', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>Manage <ChevronRight size={14} /></span>
                </div>

                <div style={settingRowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ ...settingIconBoxStyle, backgroundColor: '#065f46', color: '#34d399' }}><Bell size={18} /></div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: '#fff', margin: 0 }}>Notifications</h4>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>Configure event reminders and promo alerts</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.825rem', color: '#38bdf8', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>Configure <ChevronRight size={14} /></span>
                </div>

                <div style={settingRowStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ ...settingIconBoxStyle, backgroundColor: '#78350f', color: '#fbbf24' }}><ShieldCheck size={18} /></div>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', color: '#fff', margin: 0 }}>Data Privacy</h4>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>Review terms of service and data privacy policies</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.825rem', color: '#38bdf8', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>View <ChevronRight size={14} /></span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* EVENT DETAIL MODAL / POPUP */}
      {selectedEvent && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <button
              onClick={() => setSelectedEvent(null)}
              style={closeModalBtnStyle}
            >
              <X size={18} color="#f87171" />
            </button>

            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', margin: '0 0 8px 0' }}>
              {selectedEvent.nama_event}
            </h2>

            <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#cbd5e1', margin: '0 0 4px 0' }}>
              Tanggal Mulai: {new Date(selectedEvent.tanggal_pembelian_mulai).toLocaleDateString('id-ID')}
            </p>

            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: '1.4', margin: '10px 0' }}>
              {selectedEvent.deskripsi}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #1f2937', paddingTop: '14px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>Harga Mulai</span>
                <span style={{ fontSize: '1rem', fontWeight: '700', color: '#facc15' }}>
                  {selectedEvent.harga_mulai ? `Rp ${Number(selectedEvent.harga_mulai).toLocaleString('id-ID')}` : 'Belum Ada Tiket'}
                </span>
              </div>
              <button style={buyTicketModalBtnStyle} onClick={() => alert('Proceeding to checkout / payment page!')}>
                Buy Tickets Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// STYLING DEFINITIONS
const layoutContainerStyle = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#0b0f19',
  color: '#f8fafc',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  boxSizing: 'border-box'
};

const sidebarStyle = {
  width: '240px',
  backgroundColor: '#111827',
  borderRight: '1px solid #1f2937',
  padding: '20px 12px',
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0
};

const logoStyle = {
  fontSize: '1.2rem',
  fontWeight: '800',
  margin: 0,
  color: '#fff',
  letterSpacing: '-0.5px'
};

const navBtnStyle = {
  width: '100%',
  textAlign: 'left',
  padding: '10px 12px',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '8px',
  color: '#94a3b8',
  fontSize: '0.85rem',
  fontWeight: '500',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  transition: 'all 0.2s'
};

const activeNavBtnStyle = {
  ...navBtnStyle,
  backgroundColor: '#2563eb',
  color: '#ffffff',
  fontWeight: '600'
};

const mainContentWrapperStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0
};

const topbarStyle = {
  height: '70px',
  backgroundColor: '#111827',
  borderBottom: '1px solid #1f2937',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  boxSizing: 'border-box'
};

const selectCityStyle = {
  padding: '6px 8px',
  borderRadius: '6px',
  backgroundColor: '#1f2937',
  color: '#fff',
  border: '1px solid #374151',
  fontSize: '0.825rem',
  outline: 'none',
  cursor: 'pointer'
};

const searchbarStyle = {
  width: '100%',
  padding: '8px 14px 8px 36px',
  borderRadius: '20px',
  backgroundColor: '#1f2937',
  border: '1px solid #374151',
  color: '#fff',
  fontSize: '0.85rem',
  outline: 'none',
  boxSizing: 'border-box'
};

const loginBtnStyle = {
  padding: '6px 14px',
  backgroundColor: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.825rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const logoutBtnStyle = {
  padding: '6px 14px',
  backgroundColor: '#dc2626',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.825rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const contentAreaStyle = {
  padding: '24px',
  overflowY: 'auto',
  flex: 1
};

const bannerStyle = {
  background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)',
  borderRadius: '16px',
  padding: '28px',
  marginBottom: '28px',
  color: '#fff',
  boxShadow: '0 10px 20px -5px rgba(59, 130, 246, 0.3)'
};

const badgePresaleStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '0.7rem',
  fontWeight: '700',
  letterSpacing: '0.5px'
};

const primaryBtnStyle = {
  padding: '8px 16px',
  backgroundColor: '#ffffff',
  color: '#2563eb',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.85rem',
  fontWeight: '700',
  cursor: 'pointer'
};

const filterContainerStyle = {
  display: 'flex',
  gap: '10px',
  marginBottom: '24px',
  overflowX: 'auto',
  paddingBottom: '4px'
};

const categoryBtnStyle = {
  padding: '6px 16px',
  backgroundColor: '#111827',
  border: '1px solid #1f2937',
  borderRadius: '20px',
  color: '#94a3b8',
  fontSize: '0.8rem',
  fontWeight: '600',
  cursor: 'pointer',
  whiteSpace: 'nowrap'
};

const activeCategoryBtnStyle = {
  ...categoryBtnStyle,
  backgroundColor: '#1f2937',
  color: '#fff',
  borderColor: '#38bdf8'
};

const cardGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
  gap: '16px'
};

const eventCardStyle = {
  backgroundColor: '#111827',
  border: '1px solid #1f2937',
  borderRadius: '12px',
  padding: '12px',
  cursor: 'pointer',
  boxSizing: 'border-box'
};

const cardImageBoxStyle = {
  height: '140px',
  backgroundColor: '#1a2234',
  borderRadius: '8px',
  marginBottom: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden'
};

const ticketCardStyle = {
  backgroundColor: '#111827',
  border: '1px solid #1f2937',
  borderRadius: '12px',
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const ticketIconBoxStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '10px',
  backgroundColor: '#1e293b',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const actionTicketBtnStyle = {
  padding: '6px 12px',
  backgroundColor: '#1f2937',
  color: '#fff',
  border: '1px solid #374151',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const settingRowStyle = {
  backgroundColor: '#111827',
  border: '1px solid #1f2937',
  borderRadius: '12px',
  padding: '14px 18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const settingIconBoxStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const modalOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px'
};

const modalContentStyle = {
  backgroundColor: '#111827',
  border: '1px solid #374151',
  borderRadius: '16px',
  padding: '24px',
  width: '100%',
  maxWidth: '500px',
  position: 'relative',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
  boxSizing: 'border-box'
};

const closeModalBtnStyle = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer'
};

const buyTicketModalBtnStyle = {
  padding: '8px 16px',
  backgroundColor: '#0066ff',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  fontSize: '0.825rem',
  fontWeight: '700',
  cursor: 'pointer'
};