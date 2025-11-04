import React from 'react';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import './ProducerProfile.css';

/**
 * Vista de Perfil del Productor (Mis Fincas)
 */
const ProducerProfile = ({ producer }) => {
  const fincas = producer.fincas || [];

  return (
    <div className="container">
      <h1 className="h1">Mis Fincas ({fincas.length})</h1>
      <p style={{ fontSize: '18px', marginBottom: '25px' }}>
        Productor: <strong>{producer.owner}</strong>
      </p>

      {fincas.map(finca => (
        <div key={finca.id} className="fincaCard">
          <div className="fincaHeader">
            <h2 className="h2">{finca.name}</h2>
            <span className="fincaHectares">{finca.hectares} hectáreas</span>
          </div>
          <p><strong>ID de Finca:</strong> {finca.id}</p>
          
          <h3 className="h3">Lotes Registrados:</h3>
          {finca.lotes.length > 0 ? (
            <ul className="loteList">
              {finca.lotes.map(lote => (
                <li key={lote} className="loteItem">
                  <Icon path={ICONS.location} size={16} /> {lote}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay lotes registrados para esta finca.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProducerProfile;