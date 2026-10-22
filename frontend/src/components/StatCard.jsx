import React from 'react';

export default function StatCard({ icon: Icon, number, label, accentColor = '#3b82f6', subtitle }) {
  return (
    <div className="stat-card">
      <div className="stat-icon-wrap" style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
        <Icon size={22} strokeWidth={2.2} />
      </div>
      <div>
        <div className="stat-number">{number}</div>
        <div className="stat-label">{label}</div>
        {subtitle && (
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
