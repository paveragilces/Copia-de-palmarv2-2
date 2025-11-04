import React, { useState } from 'react';
import Icon from '../ui/Icon';
import { ICONS } from '../../config/icons';
import { LYTIKS_LOGO_URL } from '../../data/constants';
import './Sidebar.css';

/**
 * Barra Lateral (Sidebar)
 */
const Sidebar = ({ userRole, currentPage, onNavigate, onLogout }) => {

  // --- Sub-componente interno: SidebarButton ---
  const SidebarButton = ({ page, iconPath, label }) => {
    const isSelected = currentPage === page;
    const [hover, setHover] = useState(false);

    // Construye las clases dinámicamente
    const buttonClasses = [
      'sidebarButton',
      isSelected ? 'selected' : '',
      !isSelected && hover ? 'hover' : ''
    ].filter(Boolean).join(' '); // filter(Boolean) elimina strings vacíos

    return (
      <button
        className={buttonClasses}
        onClick={() => onNavigate(page)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Icon path={iconPath} color={isSelected ? 'white' : '#005a3a'} />
        {label}
      </button>
    );
  };
  // --- Fin de Sub-componente ---

  // No renderizar nada si no hay rol
  if (!userRole) return null;

  return (
    <div className="sidebar">
      <div>
        <div className="sidebarLogo">
          <span>Agro</span>
          <span className="sidebarLogoSub">Aliados</span>
        </div>
        <nav className="sidebarNav">
          {/* --- Vistas de Productor --- */}
          {userRole === 'producer' && (
            <>
              <SidebarButton page="producerDashboard" iconPath={ICONS.dashboard} label="Dashboard" />
              <SidebarButton page="reportAlert" iconPath={ICONS.report} label="Reportar Alerta" />
              {/* --- ¡NUEVO LINK! --- */}
              <SidebarButton page="producerAlertList" iconPath={ICONS.alert} label="Registro de Alertas" />
              <SidebarButton page="visitorApproval" iconPath={ICONS.visit} label="Aprobar Visitas" />
              <SidebarButton page="producerVisitorLog" iconPath={ICONS.audit} label="Registro de Visitas" />
              <SidebarButton page="producerTasks" iconPath={ICONS.tasks} label="Mis Tareas" />
              <SidebarButton page="producerCertification" iconPath={ICONS.certification} label="Certificación" />
              <SidebarButton page="producerProfile" iconPath={ICONS.technician} label="Mis Fincas" />
            </>
          )}

          {/* --- Vistas de Gerente --- */}
          {userRole === 'manager' && (
            <>
              <SidebarButton page="managerDashboard" iconPath={ICONS.dashboard} label="Dashboard" />
              <SidebarButton page="alertTriage" iconPath={ICONS.alert} label="Alertas" />
              <SidebarButton page="technicianControl" iconPath={ICONS.technician} label="Técnicos" />
              <SidebarButton page="visitorReport" iconPath={ICONS.visit} label="Visitas" />
            </>
          )}

          {/* --- Vistas de Técnico --- */}
          {userRole === 'technician' && (
            <>
              <SidebarButton page="technicianSchedule" iconPath={ICONS.calendar} label="Mi Agenda" />
            </>
          )}
        </nav>
      </div>

      {/* --- Pie de Página del Sidebar --- */}
      <div className="sidebarFooter">
        <SidebarButton page="logout" iconPath={ICONS.logout} label="Salir" />
        <div className="footerLogoContainer">
          {LYTIKS_LOGO_URL ? (
            <img src={LYTIKS_LOGO_URL} alt="Lytiks Logo" className="footerLogo" />
          ) : (
            <span className="footerLogoText">Powered by <strong>Lytiks</strong></span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;