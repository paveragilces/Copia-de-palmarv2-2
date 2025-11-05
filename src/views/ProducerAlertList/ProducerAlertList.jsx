import React, { useState } from 'react';
import EmptyState from '../../components/ui/EmptyState';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import './ProducerAlertList.css'; 

/**
 * VISTA: Registro de Alertas (Productor)
 * Muestra todas las alertas enviadas por el productor, con filtros de estado.
 * Acepta pageData para pre-filtrar desde el dashboard.
 */
const ProducerAlertList = ({ producer, alerts, technicians, onNavigate, pageData }) => {
  // USA pageData para el estado inicial, o 'pending' por defecto
  const [filterStatus, setFilterStatus] = useState(pageData?.filter || 'pending'); 
  
  // Solo alertas de este productor
  const myAlerts = alerts.filter(a => a.producerId === producer.id);

  const filteredAlerts = myAlerts.filter(a => a.status === filterStatus);

  const getPriorityClass = (priority) => {
    if (priority === 'Alta') return 'priority-high';
    if (priority === 'Media') return 'priority-medium';
    return 'priority-low';
  };

  const AlertItem = ({ alert }) => {
    const techName = alert.techId ? technicians.find(t => t.id === alert.techId)?.name : 'Sin asignar';
    
    return (
      <div 
        key={alert.id} 
        className="listItem alertItem" 
        style={{ borderLeftColor: alert.priority === 'Alta' ? '#d9534f' : (alert.priority === 'Media' ? '#f0ad4e' : '#5bc0de') }}
      >
        <div className="listItemContent">
          <div className="alertInfo">
            <span className="alertFarmName">{alert.farmName} (Lote: {alert.lote})</span>
            <span className="alertDate">Reportada: {alert.date}</span>
            <p className="alertSymptoms">Síntomas: {alert.symptoms.join(', ')}</p>
          </div>
          <div className="alertStatus">
            {alert.status === 'assigned' && (
              <>
                <span className="statusLabel">Asignada a:</span>
                <span className="statusValue">{techName}</span>
                <span className="statusLabel">Visita: {alert.visitDate}</span>
              </>
            )}
            {alert.status === 'completed' && (
              <>
                <span className="statusLabel">Inspección Completada</span>
                <span className="statusValue">Por: {techName}</span>
              </>
            )}
             {alert.status === 'pending' && (
              <span className="statusLabel">Pendiente de revisión</span>
            )}
          </div>
        </div>
        <div className="listItemActions">
           <span className={`alertPriority ${getPriorityClass(alert.priority)}`}>
            Prioridad: {alert.priority || 'N/A'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="alertListHeader">
        <h1 className="h1">Mis Alertas Registradas</h1>
        <button
          className="button btn-primary"
          onClick={() => onNavigate('reportAlert')}
        >
          <Icon path={ICONS.report} /> Reportar Nueva Alerta
        </button>
      </div>

      {/* Pestañas de Filtro */}
      <div className="tabContainer">
        <button
          className={`tabButton ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}>
          Pendientes ({myAlerts.filter(a => a.status === 'pending').length})
        </button>
        <button
          className={`tabButton ${filterStatus === 'assigned' ? 'active' : ''}`}
          onClick={() => setFilterStatus('assigned')}>
          Asignadas ({myAlerts.filter(a => a.status === 'assigned').length})
        </button>
        <button
          className={`tabButton ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}>
          Completadas ({myAlerts.filter(a => a.status === 'completed').length})
        </button>
      </div>

      {filteredAlerts.length === 0 ? (
        <EmptyState
          iconPath={ICONS.checkCircle}
          title={`No hay alertas ${filterStatus}`}
          message="No tienes alertas en esta categoría."
        />
      ) : (
        <div className="alertListContainer">
          {filteredAlerts.map(alert => <AlertItem key={alert.id} alert={alert} />)}
        </div>
      )}
    </div>
  );
};

export default ProducerAlertList;