import React from 'react';
import { ICONS } from '../../config/icons';
import NavButton from '../ui/NavButton'; // Importamos el componente de botón
import './Header.css';

/**
 * Cabecera principal de la App (Glassmorphism)
 */
const Header = ({ userRole, onNavigate, onLogout, unreadNotifications }) => {
  return (
    <header className="app-header">
      <div className="app-logo">AgroAliados</div>
      <nav className="app-nav">
        {/* En este nuevo layout, los links de navegación
          principal se manejan en el Sidebar.
          El header solo contiene acciones globales.
        */}

        {/* Notificaciones (solo para Productor en este header) */}
        {userRole === 'producer' && (
          <NavButton
            onClick={() => onNavigate('notifications')}
            iconPath={ICONS.notifications}
            badgeCount={unreadNotifications}
          >
            Notificaciones
          </NavButton>
        )}
        
        {/* Botón de Salir (global) */}
        <NavButton onClick={onLogout} iconPath={ICONS.logout}>
          Salir
        </NavButton>
      </nav>
    </header>
  );
};

export default Header;