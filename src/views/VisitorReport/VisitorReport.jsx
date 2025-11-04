import React, { useState } from 'react';
import EmptyState from '../../components/ui/EmptyState';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import './VisitorReport.css';

/**
 * Reporte de Visitas (Gerente, con Filtro de Fecha)
 */
const VisitorReport = ({ visits, producers }) => {
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split('T')[0]);

  const getStatusTagClass = (status) => {
    if (status === 'pending') return 'tag-pending';
    if (status === 'approved') return 'tag-approved';
    if (status === 'rejected') return 'tag-danger';
    if (status === 'completed') return 'tag-info';
    return '';
  };

  const filteredVisits = visits.filter(v => v.date === filterDate);

  return (
    <div className="container">
      <div className="reportHeader">
        <h1 className="h1">Reporte General de Visitas</h1>
        <div className="formGroup">
          <label className="label">Filtrar por Fecha</label>
          <div className="dateInputContainer">
            <input
              className="input dateInput"
              type="date"
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
            />
            <div className="dateInputIcon">
              <Icon path={ICONS.calendar} size={18} />
            </div>
          </div>
        </div>
      </div>

      {filteredVisits.length === 0 ? (
        <EmptyState
          iconPath={ICONS.visit}
          title="No hay Visitas"
          message={`No se han registrado visitas para la fecha: ${filterDate}.`}
        />
      ) : (
        filteredVisits.map(visit => (
          <div key={visit.id} className="listItem">
            <div className="listItemContent visitorDetails">
              <div className="visitorName">
                {visit.visitorName} <span className="visitorCompany">({visit.company})</span>
              </div>
              <div>Destino: <strong>{producers.find(p => p.id === visit.producerId)?.name || 'Finca Desconocida'}</strong></div>
              <div>Motivo: {visit.reason}</div>
            </div>
            <div className="listItemActions">
              <span className={`tag ${getStatusTagClass(visit.status)}`}>
                {visit.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VisitorReport;