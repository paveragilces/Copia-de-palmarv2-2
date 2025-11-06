// src/views/LoginScreen/LoginScreen.jsx
import React from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons'; 
import './LoginScreen.css'; 

// Usando los íconos del archivo de configuración
const { producer, manager, technician, visitor, checkIn, dashboard } = ICONS; 

/**
 * Pantalla de Login (Pública) - UI MEJORADA
 * Mantiene la lógica original de 5 botones.
 */
const LoginScreen = ({ onLogin }) => {
  return (
    <div className="loginContainer">
      <div className="loginBox">
        
        <div className="loginLogo">
          <span>Agro</span>
          <span className="loginLogoSub">Aliados</span>
        </div>
        
        <h1 className="loginTitle">Portal de Acceso</h1>
        <p className="loginSubtitle">Selecciona tu rol principal para ingresar al sistema.</p>
        
        {/* --- GRUPO PRINCIPAL (3 Botones) --- */}
        <div className="mainButtonGrid">
          <button 
            className="roleButton primary-role" 
            onClick={() => onLogin('producer')} 
          >
            {/* --- CAMBIO 1: ÍCONO ESPECÍFICO PARA PRODUCTOR --- */}
            <Icon path={ICONS.leaf || producer} size="36px" /> 
            <span className="buttonText">Productor</span>
          </button>
          
          <button 
            className="roleButton primary-role" 
            onClick={() => onLogin('manager')} 
          >
            <Icon path={dashboard} size="36px" /> 
            <span className="buttonText">Líder</span> 
          </button>
          
          <button 
            className="roleButton primary-role" 
            onClick={() => onLogin('technician')} 
          >
            <Icon path={technician} size="36px" />
            <span className="buttonText">Técnico</span>
          </button>
        </div>

        <div className="separator">o si eres un visitante</div>

        {/* --- GRUPO SECUNDARIO (2 Botones de Acceso a Finca) --- */}
        <div className="secondaryButtonRow">
          {/* --- CAMBIO 2: BOTÓN VISITANTE --- */}
          <button 
            className="roleButton secondary-role" 
            onClick={() => onLogin('public', 'visitorForm')} 
          >
            <Icon path={visitor} size="24px" />
            <span className="buttonText">Portal de Visitantes</span>
          </button>
          {/* --- CAMBIO 3: BOTÓN PORTERÍA --- */}
          <button 
            className="roleButton secondary-role" 
            onClick={() => onLogin('public', 'visitorCheckIn')} 
          >
            <Icon path={checkIn} size="24px" />
            <span className="buttonText">Portal de Portería</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginScreen;