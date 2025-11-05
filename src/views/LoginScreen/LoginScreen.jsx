import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import './LoginScreen.css';

/**
 * Pantalla de Login con tu logo Lytiks SVG.
 * Mantiene la lógica de 2 pasos (Administrativo / Ingreso a Finca).
 */
const LoginScreen = ({ onLogin }) => {
  const [selection, setSelection] = useState('main'); // 'main', 'admin', 'access'

  // Componente interno para el botón de volver
  const BackButton = () => (
    <button className="loginBackButton" onClick={() => setSelection('main')}>
      <Icon path={ICONS.back} size={20} /> Volver
    </button>
  );

  const titles = {
    main: {
      title: 'Bienvenido',
      subtitle: 'Seleccione su tipo de ingreso'
    },
    admin: {
      title: 'Acceso Administrativo',
      subtitle: 'Seleccione su rol para continuar'
    },
    access: {
      title: 'Control de Ingreso',
      subtitle: 'Identifíquese para continuar'
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        {/* --- AQUÍ ESTÁ EL CAMBIO CON TU NUEVA URL --- */}
        <div className="loginLogoContainer">
          <img
            src="https://res.cloudinary.com/do4vybtt4/image/upload/v1762369002/Lytiks-02_indfgk.svg"
            alt="Lytiks Logo"
            className="loginImageLogo"
          />
        </div>
        {/* --- FIN DEL CAMBIO DEL LOGO --- */}

        <h1 className="loginTitle">{titles[selection].title}</h1>
        <p className="loginSubtitle">{titles[selection].subtitle}</p>

        {/* Contenedor animado para las vistas */}
        <div className="loginAnimatedContainer">

          {/* Vista 1: Principal (main) */}
          <div className={`loginView main-view ${selection === 'main' ? 'visible' : 'hidden'}`}>
            <button
              className="loginChoiceButton outline-primary"
              onClick={() => setSelection('admin')}
            >
              <Icon path={ICONS.dashboard} size={30} />
              <span className="buttonText">Administrativo</span>
            </button>
            <button
              className="loginChoiceButton solid-primary"
              onClick={() => setSelection('access')}
            >
              <Icon path={ICONS.visit} size={30} />
              <span className="buttonText">Ingreso a Finca</span>
            </button>
          </div>

          {/* Vista 2: Administrativo (admin) */}
          <div className={`loginView internal-view ${selection === 'admin' ? 'visible' : 'hidden'}`}>
            <BackButton />
            <div className="internalButtonRow">
              <button className="loginChoiceButton outline-primary" onClick={() => onLogin('manager')}>
                <Icon path={ICONS.manager} size={24} />
                <span className="buttonText">Gerente</span>
              </button>
              <button className="loginChoiceButton outline-primary" onClick={() => onLogin('producer')}>
                <Icon path={ICONS.user} size={24} />
                <span className="buttonText">Productor</span>
              </button>
              <button className="loginChoiceButton outline-primary" onClick={() => onLogin('technician')}>
                <Icon path={ICONS.technician} size={24} />
                <span className="buttonText">Técnico</span>
              </button>
            </div>
          </div>

          {/* Vista 3: Ingreso a Finca (access) */}
          <div className={`loginView internal-view ${selection === 'access' ? 'visible' : 'hidden'}`}>
            <BackButton />
            <div className="internalButtonRow">
              <button className="loginChoiceButton solid-primary" onClick={() => onLogin('public', 'visitorForm')}>
                <Icon path={ICONS.visit} size={24} />
                <span className="buttonText">Visitante</span>
              </button>
              <button
                className="loginChoiceButton solid-primary"
                onClick={() => onLogin('public', 'visitorCheckIn')}
              >
                <Icon path={ICONS.checkCircle} size={24} />
                <span className="buttonText">Portería</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginScreen;