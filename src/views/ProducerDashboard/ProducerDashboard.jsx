import React, { useState } from 'react';
import { ICONS } from '../../config/icons'; 
import './ProducerDashboard.css';

/**
 * Dashboard del Productor
 * ACTUALIZADO: El filtro de finca ahora es un "Control Segmentado" (pills)
 */
const ProducerDashboard = ({ producer, alerts, visits, tasks, technicians, onNavigate }) => {
  const [selectedFincaFilter, setSelectedFincaFilter] = useState('all'); // 'all' o un finca.id

  // 1. Filtrar datos principales por finca seleccionada
  const myAlerts = alerts.filter(a => a.producerId === producer.id);
  const myVisits = visits.filter(v => v.producerId === producer.id);
  const myTasks = tasks.filter(t => t.producerId === producer.id);

  const filteredAlerts = myAlerts.filter(a => selectedFincaFilter === 'all' || a.fincaId === selectedFincaFilter);
  const filteredVisits = myVisits.filter(v => selectedFincaFilter === 'all' || v.fincaId === selectedFincaFilter);
  
  const filteredTasks = myTasks.filter(t => {
    if (selectedFincaFilter === 'all') return true;
    const relatedAlert = myAlerts.find(a => a.id === t.alertId);
    return relatedAlert && relatedAlert.fincaId === selectedFincaFilter;
  });


  // 2. Calcular KPIs basados en los datos filtrados
  const pendingAlerts = filteredAlerts.filter(a => a.status === 'pending').length;
  const assignedAlerts = filteredAlerts.filter(a => a.status === 'assigned');
  const completedAlerts = filteredAlerts.filter(a => a.status === 'completed' && a.inspectionData?.plant);
  const pendingVisits = filteredVisits.filter(v => v.status === 'PENDING').length;
  const pendingTasks = filteredTasks.filter(t => t.status === 'pending').length;


  const getCountdown = (date) => {
    if (!date) return { text: 'Sin fecha', className: 'urgency-low' };
    
    const today = new Date(new Date().toISOString().split('T')[0]);
    const visitDate = new Date(new Date(date).toISOString().split('T')[0]);
    const diffTime = visitDate - today;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (days < 0) return { text: 'Visita Atrasada', className: 'urgency-high' };
    if (days === 0) return { text: 'Visita Hoy', className: 'urgency-high' };
    if (days === 1) return { text: 'Visita Mañana', className: 'urgency-medium' };
    return { text: `Visita en ${days} días`, className: 'urgency-low' };
  };

  return (
    <div className="container"> 
      <h1 className="h1">Dashboard: {producer.owner}</h1>
      
      {/* --- ¡FILTRO DE FINCA REDISEÑADO! --- */}
      <div className="fincaFilterContainer">
        <label className="label">Filtrar por Finca</label>
        <div className="fincaFilterGroup">
          <button
            onClick={() => setSelectedFincaFilter('all')}
            className={`fincaFilterButton ${selectedFincaFilter === 'all' ? 'active' : ''}`}
          >
            Todas mis Fincas
          </button>
          {producer.fincas.map(finca => (
            <button
              key={finca.id}
              onClick={() => setSelectedFincaFilter(finca.id)}
              className={`fincaFilterButton ${selectedFincaFilter === finca.id ? 'active' : ''}`}
            >
              {finca.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* --- GRID DE TARJETAS --- */}
      <div className="dashboardGrid">
        <div 
          className="card card-interactive" 
          style={{ backgroundColor: pendingAlerts > 0 ? '#fff8f8' : '#fff', borderColor: pendingAlerts > 0 ? '#d9534f' : '#f0f0f0' }} 
          onClick={() => onNavigate('producerAlertList', { filter: 'pending' })} 
        >
          <h2 className="cardTitle">Alertas Pendientes</h2>
          <p className="cardNumericValue" style={{ color: pendingAlerts > 0 ? '#d9534f' : '#5cb85c' }}>{pendingAlerts}</p>
        </div>
        <div 
          className="card card-interactive" 
          style={{ backgroundColor: pendingTasks > 0 ? '#fffaf5' : '#fff', borderColor: pendingTasks > 0 ? '#f0ad4e' : '#f0f0f0' }} 
          onClick={() => onNavigate('producerTasks', { filter: 'pending' })}
        >
          <h2 className="cardTitle">Tareas Pendientes</h2>
          <p className="cardNumericValue" style={{ color: pendingTasks > 0 ? '#f0ad4e' : '#5cb85c' }}>{pendingTasks}</p>
        </div>
        <div 
          className="card card-interactive" 
          style={{ backgroundColor: pendingVisits > 0 ? '#fffaf5' : '#fff', borderColor: pendingVisits > 0 ? '#f0ad4e' : '#f0f0f0' }} 
          onClick={() => onNavigate('visitorApproval', { filter: 'PENDING' })}
        >
          <h2 className="cardTitle">Visitas por Aprobar</h2>
          <p className="cardNumericValue" style={{ color: pendingVisits > 0 ? '#f0ad4e' : '#5cb85c' }}>{pendingVisits}</p>
        </div>
        <div className="card card-interactive" onClick={() => onNavigate('producerCertification')}>
          <h2 className="cardTitle">Mi Certificación</h2>
          <p className="cardNumericValue">92%</p> {/* Mockeado */}
        </div>
      </div>

      {/* --- SECCIÓN PRÓXIMAS VISITAS --- */}
      {assignedAlerts.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2 className="h2">Próximas Visitas Técnicas</h2>
          {assignedAlerts.map(alert => {
            const countdown = getCountdown(alert.visitDate);
            return (
              <div 
                key={alert.id} 
                className={`listItem ${countdown.className}`}
                style={{ borderLeft: `5px solid ${alert.priority === 'Alta' ? '#d9534f' : (alert.priority === 'Media' ? '#f0ad4e' : '#5bc0de')}` }}
              >
                <div className="listItemContent" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
                  <span className="listItemTitle">Alerta #{alert.id} - {alert.farmName} (Lote: {alert.lote})</span>
                  <p>Evaluación Previa: {alert.managerComment || 'Pendiente de comentario'}</p>
                  <p>Técnico: <strong>{technicians.find(t => t.id === alert.techId)?.name || 'Asignado'}</strong></p>
                </div>
                <div className="listItemActions" style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span className={`countdownTimer ${countdown.className}`}>{countdown.text}</span>
                  <span className="countdownDate">{alert.visitDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- SECCIÓN RESULTADOS DE INSPECCIÓN --- */}
      {completedAlerts.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h2 className="h2">Resultados de Inspección</h2>
          {completedAlerts.map(alert => {
            const inspData = alert.inspectionData.plant.data;
            return (
              <div key={alert.id} className="listItem resultItem">
                <div className="resultHeader">
                  <span className="listItemTitle">Resultados Alerta #{alert.id} ({alert.farmName})</span>
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