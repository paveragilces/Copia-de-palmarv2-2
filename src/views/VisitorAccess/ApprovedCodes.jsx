// src/views/VisitorAccess/ApprovedCodes.jsx
import React, { useState } from 'react';
import QRCodeDisplay from './QRCodeDisplay';
import './VisitorAccess.css'; // Usa el CSS compartido
import Button from '../../components/ui/Button';

function ApprovedCodes({ approvedVisits }) {
  const [activeVisitId, setActiveVisitId] = useState(null);

  const handleToggleQr = (visitId) => {
    setActiveVisitId(prevId => (prevId === visitId ? null : visitId));
  };

  // Filtra solo las visitas que están aprobadas o ya dentro
  const myVisits = approvedVisits.filter(v => v.status === 'APPROVED' || v.status === 'CHECKED_IN');

  return (
    <div className="visitList">
      {myVisits.length === 0 ? (
        <div className="messageBox">
          <p>No tienes pases de visita activos. Primero solicita una visita y espera que sea aprobada.</p>
        </div>
      ) : (
        myVisits.map(visit => (
          <div key={visit.id} className="visitCard">
            <div className="visitDetails">
              <h3>{visit.name} ({visit.company})</h3>
              <p>Motivo: {visit.purpose}</p>
              <p className={`riskTag ${visit.risk?.toLowerCase()}`}>
                Riesgo Fitosanitario: <strong>{visit.risk}</strong>
              </p>
              <p className="status">
                Estado:
                <span className={visit.status === 'CHECKED_IN' ? 'statusIn' : 'statusApproved'}>
                  {visit.status.replace('_', ' ')}
                </span>
              </p>
            </div>
            
            <Button 
              variant="secondary"
              onClick={() => handleToggleQr(visit.id)}
            >
              {activeVisitId === visit.id ? 'Ocultar QR' : 'Mostrar QR'}
            </Button>

            {activeVisitId === visit.id && (
              <div className="qrCodeContainer">
                <QRCodeDisplay value={visit.qrData} />
                <p className="qrNote">ID de Visita: {visit.id}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default ApprovedCodes;