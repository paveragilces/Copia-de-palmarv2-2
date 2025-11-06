// src/views/ProducerProfile/ProducerProfile.jsx
import React from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import './ProducerProfile.css'; // Usaremos el CSS de abajo
import EmptyState from '../../components/ui/EmptyState'; // Importamos EmptyState

/**
 * Vista: Perfil del Productor (Mis Fincas)
 * Muestra las fincas y lotes del productor.
 * CORREGIDO: Se añade 'onNavigate' a las props.
 * MEJORADO: Nuevo layout de tarjetas.
 */
// --- ¡CORRECCIÓN DEL BUG! ---
// Se ha añadido 'onNavigate' a las props
const ProducerProfile = ({ producer, onNavigate }) => {
  return (
    <div className="container">
      <div className="profileHeader">
        <h1 className="h1">Mis Fincas</h1>
        <Button 
          variant="primary" 
          // Esta función ahora existirá y no dará error
          onClick={() => onNavigate('fincaRegistration')} 
          iconPath={ICONS.add}
        >
          Registrar Nueva Finca
        </Button>
      </div>
      
      {/* --- ¡MEJORA VISUAL! --- */}
      {(!producer.fincas || producer.fincas.length === 0) ? (
        <div className="card">
          <EmptyState
            iconPath={ICONS.finca} // Asumiendo que tienes un ícono de finca
            title="No tienes fincas registradas"
            message="Para empezar a reportar alertas y gestionar visitas, primero debes registrar una finca."
          />
        </div>
      ) : (
        <div className="fincaGrid"> {/* Nueva clase para la cuadrícula */}
          {producer.fincas.map(finca => (
            <div key={finca.id} className="card fincaCard">
              <div className="fincaCardHeader">
                <Icon path={ICONS.finca} size="24px" />
                <h2 className="h2">{finca.name}</h2>
              </div>
              <div className="fincaCardInfo">
                <Icon path={ICONS.location} size="16px" />
                <span>{finca.province}, {finca.canton}</span>
              </div>
              <div className="fincaCardInfo">
                <Icon path={ICONS.area} size="16px" />
                <span>{finca.hectares} hectáreas</span>
              </div>
              
              <hr className="cardSeparator" />
              
              <h3 className="h3">Lotes Registrados:</h3>
              {finca.lotes && finca.lotes.length > 0 ? (
                <ul className="loteList">
                  {finca.lotes.map(lote => (
                    <li key={lote.id} className="loteItem">
                      <span className="loteName">
                        <Icon path={ICONS.lote} size="14px" />
                        Lote {lote.name}
                      </span>
                      <span className="loteArea">{lote.hectares} ha</span>
                    </li>
                  ))}
                </ul>
              ) : (
                 <p className="noLotesMessage">
                   No hay lotes registrados para esta finca.
                 </p>
              )}
            </div>
          ))}
        </div>
      )}
      {/* --- FIN DE MEJORA VISUAL --- */}
    </div>
  );
};

export default ProducerProfile;