import { FiBell, FiUser, FiMapPin, FiMenu, FiShoppingBag } from 'react-icons/fi'
import { useLocation } from 'react-router-dom'

export default function Header({ shops, toggleSidebar }) {
  const location = useLocation();
  const match = location.pathname.match(/\/shop\/(\d+)/);
  const shopId = match ? parseInt(match[1]) : null;
  const activeShop = shopId ? shops?.find(s => s.id === shopId) : null;
  return (
    <header style={{
      height: 'var(--header-height)',
      minHeight: 'var(--header-height)',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      margin: '16px 16px 0 16px',
      borderRadius: '16px',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(16px)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shadow)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="hamburger-btn" onClick={toggleSidebar}>
          <FiMenu />
        </button>
        {activeShop ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
            <FiMapPin style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>{activeShop.name}</span>
          </div>
        ) : (
          <div className="desktop-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--accent-success), #10b981)',
              padding: '6px',
              borderRadius: '8px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
            }}>
              <FiShoppingBag size={16} />
            </div>
            <span style={{ 
              fontWeight: 800, 
              fontSize: '1.35rem', 
              letterSpacing: '-0.5px',
              background: 'linear-gradient(to right, var(--text-primary), var(--accent-success))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Fresh Subji Hub
            </span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button className="icon-btn" style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', transition: 'var(--transition-fast)' }}>
          <FiBell />
        </button>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '4px 12px 4px 4px',
          background: '#f1f5f9',
          borderRadius: '24px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '50%',
            background: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white'
          }}>
            <FiUser />
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Admin User</span>
        </div>
      </div>
    </header>
  )
}
