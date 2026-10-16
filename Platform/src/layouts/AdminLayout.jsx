import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  Ticket, 
  Users, 
  ChevronDown, 
  Settings, 
  LogOut,
  Search,
  Bell,
  X 
} from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { path: '/admin', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/events', name: 'Create Events', icon: CalendarPlus },
    { path: '/admin/tickets', name: 'Tickets', icon: Ticket },
    { path: '/admin/attendees', name: 'Attendees', icon: Users },
  ];

  return (
    <div style={layoutContainerStyle}>
      
      <div style={sidebarStyle}>
        <div>
          <div style={logoContainerStyle}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
              NEXA<span style={{ color: '#2563eb' }}>EVENT</span>
            </span>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Admin Dashboard</div>
          </div>

          <div style={menuListStyle}>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <div 
                  key={index} 
                  onClick={() => navigate(item.path)}
                  style={{
                    ...menuItemStyle,
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                    color: isActive ? '#2563eb' : '#334155',
                    fontWeight: isActive ? '700' : '600',
                    border: isActive ? '1px solid #dbeafe' : '1px solid transparent'
                  }}
                >
                  <Icon size={18} style={{ color: isActive ? '#2563eb' : '#64748b' }} />
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={mainContentWrapperStyle}>
        
        {/* TOP BAR */}
        <div style={topbarStyle}>
          <div style={searchContainerStyle}>
            <Search size={16} style={{ color: '#94a3b8', marginRight: '8px' }} />
            <input 
              type="text" 
              placeholder="Search events, tickets, attendees..." 
              style={searchInputStyle} 
            />
          </div>

          <div style={profileAreaStyle}>
            <div style={notificationBadgeStyle}>
              <Bell size={20} style={{ color: '#64748b' }} />
              <span style={redDotStyle}></span>
            </div>

            <div style={verticalDividerStyle}></div>

            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <div 
                style={adminProfileStyle} 
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div style={avatarStyle}>A</div>
                <div style={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      Admin <ChevronDown size={14} style={{ color: '#64748b', transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Event Organizer</div>
                  </div>
                </div>
              </div>

              {showDropdown && (
                <div style={dropdownMenuStyle}>
                  <div 
                    style={dropdownItemStyle}
                    onClick={() => { setShowDropdown(false); navigate('/admin/settings'); }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Settings size={15} style={{ color: '#475569' }} />
                    <span>Settings</span>
                  </div>
                  <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0' }}></div>
                  <div 
                    style={{ ...dropdownItemStyle, color: '#ef4444' }}
                    onClick={() => { localStorage.clear(); navigate('/login'); }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={15} style={{ color: '#ef4444' }} />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        <div style={{ flex: 1, backgroundColor: '#f8fafc', overflowY: 'auto' }}>
          <Outlet />
        </div>

      </div>

    </div>
  );
}

const layoutContainerStyle = {
  display: 'flex',
  minHeight: '100vh',
  width: '100vw',
  backgroundColor: '#f8fafc',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  boxSizing: 'border-box',
  overflow: 'hidden'
};

const sidebarStyle = {
  width: '260px',
  backgroundColor: '#ffffff',
  borderRight: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '24px 16px',
  flexShrink: 0,
  boxSizing: 'border-box'
};

const logoContainerStyle = { padding: '8px 12px 24px 12px' };
const menuListStyle = { display: 'flex', flexDirection: 'column', gap: '6px' };
const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 14px',
  borderRadius: '10px',
  fontSize: '0.88rem',
  cursor: 'pointer',
  transition: 'all 0.15s ease'
};

const mainContentWrapperStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  minWidth: 0,
  height: '100vh',
  overflow: 'hidden'
};

const topbarStyle = {
  height: '72px',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e2e8f0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 32px',
  boxSizing: 'border-box',
  width: '100%',
  flexShrink: 0,
  zIndex: 10
};

const searchContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#f8fafc',
  padding: '8px 14px',
  borderRadius: '8px',
  width: '320px',
  border: '1px solid #e2e8f0'
};

const searchInputStyle = {
  border: 'none',
  background: 'transparent',
  outline: 'none',
  fontSize: '0.8rem',
  width: '100%',
  color: '#0f172a'
};

const profileAreaStyle = { display: 'flex', alignItems: 'center', gap: '16px' };
const notificationBadgeStyle = { position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 4px' };
const redDotStyle = {
  position: 'absolute',
  top: '2px',
  right: '4px',
  width: '7px',
  height: '7px',
  backgroundColor: '#ef4444',
  borderRadius: '50%',
  border: '1px solid #ffffff'
};
const verticalDividerStyle = { width: '1px', height: '24px', backgroundColor: '#e2e8f0' };
const adminProfileStyle = { display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none', paddingLeft: '4px' };
const avatarStyle = {
  width: '36px',
  height: '36px',
  backgroundColor: '#2563eb',
  color: '#ffffff',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: '700',
  fontSize: '0.85rem'
};
const dropdownMenuStyle = {
  position: 'absolute',
  right: '0',
  top: '46px',
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  width: '140px',
  padding: '6px',
  zIndex: 100,
  boxSizing: 'border-box'
};
const dropdownItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '7px 10px',
  fontSize: '0.82rem',
  fontWeight: '500',
  color: '#334155',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease'
};