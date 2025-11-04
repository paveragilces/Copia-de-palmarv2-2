import React from 'react';
import { ICONS } from '../../config/icons'; // Asumiendo que se movió
import './ProducerDashboard.css';

/**
 * Dashboard del Productor
 */
const ProducerDashboard = ({ producer, alerts, visits, tasks, technicians, onNavigate }) => {
  const myAlerts = alerts.filter(a => a.producerId === producer.id);
  const pendingAlerts = myAlerts.filter(a => a.status === 'pending').length;
  const assignedAlerts = myAlerts.filter(a => a.status === 'assigned');
  const completedAlerts = myAlerts.filter(a => a.status === 'completed' && a.inspectionData?.plant);

  const myVisits = visits.filter(v => v.producerId === producer.id);
  const pendingVisits = myVisits.filter(v => v.status === 'pending').length;

  const pendingTasks = tasks.filter(t => t.producerId === producer.id && t.status === 'pending').length;

  const getCountdown = (date) => {
    if (!date) return null;
    const today = new Date(new Date().toISOString().split('T')[0]);
    const visitDate = new Date(new Date(date).toISOString().split('T')[0]);
    const diffTime = visitDate - today;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days < 0) return 'Visita Atrasada';
    if (days === 0) return 'Visita Hoy';
    if (days === 1) return 'Visita Mañana';
    return `Visita en ${days} días`;
  };

  return (
    <div className="container">
      <h1 className="h1">Dashboard: {producer.name}</h1>

      <div className="dashboardGrid">
        <div 
          className="card card-interactive" 
          style={{ backgroundColor: pendingAlerts > 0 ? '#fff8f8' : '#fff', borderColor: pendingAlerts > 0 ? '#d9534f' : '#f0f0f0' }} 
          onClick={() => onNavigate('reportAlert')}
        >
          <h2 className="cardTitle">Alertas Pendientes</h2>
          <p className="cardNumericValue" style={{ color: pendingAlerts > 0 ? '#d9534f' : '#5cb85c' }}>{pendingAlerts}</p>
        </div>
        <div 
          className="card card-interactive" 
          style={{ backgroundColor: pendingTasks > 0 ? '#fffaf5' : '#fff', borderColor: pendingTasks > 0 ? '#f0ad4e' : '#f0f0f0' }} 
          onClick={() => onNavigate('producerTasks')}
        >
          <h2 className="cardTitle">Tareas Pendientes</h2>
          <p className="cardNumericValue" style={{ color: pendingTasks > 0 ? '#f0ad4e' : '#5cb85c' }}>{pendingTasks}</p>
        </div>
        <div 
          className="card card-interactive" 
          style={{ backgroundColor: pendingVisits > 0 ? '#fffaf5' : '#fff', borderColor: pendingVisits > 0 ? '#f0ad4e' : '#f0f0f0' }} 
          onClick={() => onNavigate('visitorApproval')}
        >
          <h2 className="cardTitle">Visitas por Aprobar</h2>
          <p className="cardNumericValue" style={{ color: pendingVisits > 0 ? '#f0ad4e' : '#5cb85c' }}>{pendingVisits}</p>
        </div>
        <div className="card card-interactive" onClick={() => onNavigate('producerCertification')}>
          <h2 className="cardTitle">Mi Certificación</h2>
          <p className="cardNumericValue">92%</p> {/* Mockeado */}
        </div>
      </div>

      {/* Próximas Visitas */}
      {assignedAlerts.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2 className="h2">Próximas Visitas Técnicas</h2>
          {assignedAlerts.map(alert => (
            <div 
              key={alert.id} 
              className="listItem" 
              style={{ borderLeft: `5px solid ${alert.priority === 'Alta' ? '#d9534f' : (alert.priority === 'Media' ? '#f0ad4e' : '#5bc0de')}` }}
            >
              <div className="listItemContent" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
                <span className="listItemTitle">Alerta #{alert.id} - {(alert.possibleDisease || []).join(', ') || 'Evaluación'}</span>
                <p>Evaluación Previa: {alert.managerComment || 'Pendiente de comentario'}</p>
                <p>Técnico: <strong>{technicians.find(t => t.id === alert.techId)?.name || 'Asignado'}</strong></p>
              </div>
              <div className="listItemActions" style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                <span className="countdownTimer">{getCountdown(alert.visitDate)}</span>
                <span className="countdownDate">{alert.visitDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resultados de Inspección */}
      {completedAlerts.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2 className="h2">Resultados de Inspección</h2>
          {completedAlerts.map(alert => {
            const inspData = alert.inspectionData.plant.data;
            return (
              <div key={alert.id} className="listItem resultItem">
                <div className="resultHeader">
                  <span className="listItemTitle">Resultados Alerta #{alert.id}</span>
                  <span className="tag tag-completed">Completada</span>
                </div>
                <p><strong>Técnico:</strong> {technicians.find(t => t.id === alert.techId)?.name}</p>
                <p><strong>Diagnóstico Final:</strong> <span className="diagnosis">{inspData.diagnosis.join(', ')}</span></p>
                <p><strong>Acciones Tomadas:</strong> <span className="actions">{inspData.actions.join(', ')}</span></p>
                <p><strong>Incidencia / Severidad:</strong> {inspData.incidence}% / {inspData.severity}%</p>
                <p><strong>Recomendaciones:</strong> <span className="recommendation">{inspData.recommendations}</span></p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProducerDashboard;