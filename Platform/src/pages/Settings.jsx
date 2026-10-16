import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  CreditCard, 
  Bell, 
  Camera, 
  Save, 
  X
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const [formData, setFormData] = useState({
    fullName: 'Admin NexaEvent',
    email: 'admin@nexaevent.com',
    phone: '+62 812 3456 7890',
    role: 'Organizer',
    currentPassword: '',
    newPassword: '',
    // Payment Gateway Settings
    merchantId: 'M-NEXA2026',
    clientKey: 'SB-Mid-client-XXXXXX',
    serverKey: 'SB-Mid-server-XXXXXX',
    taxPercentage: 11,
    // Notification Settings
    emailNotifications: true,
    whatsappTicketAlerts: true
  });

  // Load data dari localStorage saat pertama kali dimuat
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (err) {
        console.error("Failed to parse settings from localStorage", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
    }
  };

  // Handler Save Changes
  const handleSave = (e) => {
    e.preventDefault();
    
    // Simpan ke localStorage (kecuali password lama/baru demi keamanan simulasi)
    const { currentPassword, newPassword, ...dataToSave } = formData;
    localStorage.setItem('adminSettings', JSON.stringify(dataToSave));

    if (newPassword) {
      alert('Settings & Password updated successfully!');
    } else {
      alert('Settings saved successfully!');
    }
  };

  // Handler Cancel / Reset form ke data terakhir
  const handleCancel = () => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setFormData(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
    }
    alert('Changes discarded.');
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box', padding: '28px 36px' }}>
      
      {/* Page Header */}
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Settings</h2>
        <p style={{ color: '#64748b', margin: '6px 0 0 0', fontSize: '14px' }}>Manage admin account preferences, payment gateway integration, and platform notifications.</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '28px' }}>
        <button 
          type="button"
          onClick={() => setActiveTab('profile')}
          style={tabButtonStyle(activeTab === 'profile')}
        >
          <User size={18} />
          <span>Profile & Security</span>
        </button>

        <button 
          type="button"
          onClick={() => setActiveTab('payment')}
          style={tabButtonStyle(activeTab === 'payment')}
        >
          <CreditCard size={18} />
          <span>Payment Gateway</span>
        </button>

        <button 
          type="button"
          onClick={() => setActiveTab('notifications')}
          style={tabButtonStyle(activeTab === 'notifications')}
        >
          <Bell size={18} />
          <span>Notifications</span>
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '900px' }}>
        
        {/* TAB 1: PROFILE & SECURITY */}
        {activeTab === 'profile' && (
          <>
            {/* General Profile Info */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                <User size={20} color="#2563eb" />
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: 0 }}>General Profile</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '28px', alignItems: 'center' }}>
                
                {/* Upload Avatar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', backgroundColor: '#f8fafc' }}>
                  <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', overflow: 'hidden', position: 'relative' }}>
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={45} color="#64748b" />
                    )}
                  </div>
                  <label htmlFor="avatar-input" style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Camera size={16} />
                    <span>Change Photo</span>
                  </label>
                  <input id="avatar-input" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                </div>

                {/* Form Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Role</label>
                    <input type="text" name="role" value={formData.role} disabled style={{ ...inputStyle, backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                <Lock size={20} color="#2563eb" />
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Change Password</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Current Password</label>
                  <input type="password" name="currentPassword" value={formData.currentPassword} placeholder="••••••••" onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <input type="password" name="newPassword" value={formData.newPassword} placeholder="••••••••" onChange={handleChange} style={inputStyle} />
                </div>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: PAYMENT GATEWAY */}
        {activeTab === 'payment' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
              <CreditCard size={20} color="#2563eb" />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Payment Gateway (Midtrans Integration)</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Merchant ID</label>
                <input type="text" name="merchantId" value={formData.merchantId} onChange={handleChange} style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Client Key</label>
                  <input type="text" name="clientKey" value={formData.clientKey} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Server Key</label>
                  <input type="password" name="serverKey" value={formData.serverKey} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Tax / Service Fee (%)</label>
                <input type="number" name="taxPercentage" value={formData.taxPercentage} onChange={handleChange} style={{ ...inputStyle, width: '200px' }} />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
              <Bell size={20} color="#2563eb" />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', margin: 0 }}>Notification Preferences</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={checkboxContainerStyle}>
                <input type="checkbox" name="emailNotifications" checked={formData.emailNotifications} onChange={handleChange} style={{ accentColor: '#2563eb', width: '18px', height: '18px' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Email Notifications for New Transactions</div>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Send an email alert every time a ticket is successfully ordered.</span>
                </div>
              </label>

              <label style={checkboxContainerStyle}>
                <input type="checkbox" name="whatsappTicketAlerts" checked={formData.whatsappTicketAlerts} onChange={handleChange} style={{ accentColor: '#2563eb', width: '18px', height: '18px' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>Auto Send WhatsApp E-Ticket</div>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Automatically send digital tickets with QR Codes directly to the attendee's WhatsApp.</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
          <button type="button" onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', color: '#334155', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>
            <X size={16} />
            <span>Cancel</span>
          </button>
          <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)' }}>
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>

      </form>
    </div>
  );
}

const cardStyle = { 
  backgroundColor: '#ffffff', 
  borderRadius: '16px', 
  padding: '24px', 
  border: '1px solid #e2e8f0', 
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02)' 
};

const labelStyle = { 
  display: 'block', 
  fontSize: '13px', 
  fontWeight: '600', 
  color: '#475569', 
  marginBottom: '6px' 
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

const tabButtonStyle = (isActive) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 18px',
  background: 'none',
  border: 'none',
  borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
  color: isActive ? '#2563eb' : '#64748b',
  fontWeight: isActive ? '600' : '500',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'all 0.2s'
});

const checkboxContainerStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '14px',
  cursor: 'pointer',
  padding: '16px',
  borderRadius: '10px',
  border: '1px solid #f1f5f9',
  backgroundColor: '#f8fafc'
};