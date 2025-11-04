import React from 'react';
import './ProducerCertification.css';

/**
 * Certificación (Productor)
 */
const ProducerCertification = ({ score = 92 }) => {
  const isCertified = score > 90;
  const boxClasses = `
    certificationBox
    ${isCertified ? 'success' : 'warning'}
  `;
  const titleClasses = `
    certificationTitle
    ${isCertified ? 'success' : 'warning'}
  `;

  return (
    <div className="container">
      <h1 className="h1">Certificación Interna "Sello AgroAliados"</h1>
      <div className={boxClasses}>
        <h2 className={titleClasses}>
          {isCertified ? '¡FELICITACIONES!' : 'CASI LO LOGRAS'}
        </h2>

        <div className="certificationScore">{score}%</div>
        <p className="certificationText">
          {isCertified
            ? 'Has obtenido el Sello AgroAliados por mantener un cumplimiento superior al 90% durante seis semanas consecutivas.'
            : 'Tu puntaje de cumplimiento actual es bueno, pero necesitas superar el 90% durante seis semanas consecutivas para obtener el Sello AgroAliados.'
          }
        </p>

        {isCertified && (
          <div className="certificationTrophy">
            <span>🏆</span>
            <span className="trophyLabel">SELLO AGROALIADOS</span>
          </div>
        )}

        {!isCertified && (
          <p className="certificationText" style={{ marginTop: '20px' }}>
            ¡Sigue reforzando tus tareas pendientes para mejorar tu puntaje!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProducerCertification;