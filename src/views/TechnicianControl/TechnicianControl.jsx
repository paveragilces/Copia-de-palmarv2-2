import React from 'react';
import EmptyState from '../../components/ui/EmptyState';
import Avatar from '../../components/ui/Avatar';
import { ICONS } from '../../config/icons';
import './TechnicianControl.css';

/**
 * Control de Técnicos (Gerente, con Avatares)
 */
const TechnicianControl = ({ technicians, onNavigate }) => {
  return (
    <div className="container">
      <h1 className="h1">Control de Técnicos</h1>
      {technicians.length === 0 ? (
        <EmptyState
          iconPath={ICONS.technician}
          title="No hay Técnicos"
          message="No se han registrado técnicos en el sistema."
        />
      ) : (
        technicians.map(tech => (
          <div key={tech.id} className="listItem">
            <div className="listItemContent">
              <Avatar name={tech.name} />
              <div>
                <span className="techName">{tech.name}</span>
                <span className="techZone">Zona: {tech.zone}</span>
              </div>
            </div>
            <div className="listItemActions">
              <span className="techWorkload">
                Carga: <strong>{tech.workload || 0}</strong> {tech.workload === 1 ? 'asignación' : 'asignaciones'}
              </span>
              <button
                className="button button-secondary"
                onClick={() => onNavigate('technicianSchedule', tech)}
              >
                Ver Agenda
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TechnicianControl;