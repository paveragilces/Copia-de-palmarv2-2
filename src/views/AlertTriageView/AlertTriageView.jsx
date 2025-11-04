import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import EmptyState from '../../components/ui/EmptyState';
import { ICONS } from '../../config/icons';
import { BANANA_DISEASES } from '../../data/constants'; // Asumiendo que se movió
import './AlertTriageView.css';

/**
 * Triaje de Alertas (Gerente, con Filtros y Mejor Info de Técnico)
 */
const AlertTriageView = ({ alerts, technicians, onAssignAlert, setModal }) => {
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const [comment, setComment] = useState('');
  const [possibleDisease, setPossibleDisease] = useState([]);
  const [assignedTech, setAssignedTech] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [priority, setPriority] = useState('Media');
  const [filterStatus, setFilterStatus] = useState('pending'); // 'pending', 'assigned', 'completed'

  const selectedAlert = alerts.find(a => a.id === selectedAlertId);

  const handleToggleDisease = (disease) => {
    setPossibleDisease(prev =>
      prev.includes(disease)
        ? prev.filter(d => d !== disease)
        : [...prev, disease]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAlertId || !assignedTech || !visitDate || !priority) {
      setModal({ show: true, message: 'Faltan campos para asignar (técnico, fecha, prioridad).', type: 'error' });
      return;
    }

    onAssignAlert(selectedAlertId, comment, possibleDisease, assignedTech, visitDate, priority);

    setSelectedAlertId(null);
    setComment('');
    setPossibleDisease([]);
    setAssignedTech('');
    setVisitDate('');
    setPriority('Media');
  };

  // VISTA 2: Formulario de Asignación
  if (selectedAlert) {
    return (
      <div className="container">
        <button
          className="button button-secondary"
          style={{ marginBottom: '20px' }}
          onClick={() => setSelectedAlertId(null)}
        >
          <Icon path={ICONS.back} /> Volver a la lista
        </button>
        <h1 className="h1">Asignar Alerta #{selectedAlert.id}</h1>
        <p><strong>Productor:</strong> {selectedAlert.farmName}</p>
        <p><strong>Fecha Reporte:</strong> {selectedAlert.date}</p>
        <p><strong>Síntomas:</strong> {selectedAlert.symptoms.join(', ')}</p>
        <div className="photoGallery">
          {selectedAlert.photos && Object.entries(selectedAlert.photos).map(([key, value]) => value && (
            <div key={key}>
              <img src={value} alt={key} className="photoThumbnail" />
              <p className="photoCaption">{key}</p>
            </div>
          ))}
        </div>
        {selectedAlert.location && <p><strong>Ubicación:</strong> Lat: {selectedAlert.location.lat.toFixed(4)}, Lon: {selectedAlert.location.lon.toFixed(4)}</p>}

        <form onSubmit={handleSubmit}>
          <div className="formGroup">
            <label className="label"><Icon path={ICONS.comment} size={16} /> Comentario Interno (para técnico)</label>
            <textarea className="textarea" value={comment} onChange={e => setComment(e.target.value)} placeholder="Ej: Revisar con prioridad la mancha foliar..."></textarea>
          </div>

          <div className="formGroup">
            <label className="label"><Icon path={ICONS.disease} size={16} /> Posible Enfermedad</label>
            <div className="buttonToggleGroup">
              {BANANA_DISEASES.map(disease => (
                <button
                  type="button"
                  key={disease}
                  onClick={() => handleToggleDisease(disease)}
                  className={`button ${possibleDisease.includes(disease) ? 'btn-primary' : 'button-secondary'}`}
                >
                  {disease} {possibleDisease.includes(disease) ? '✓' : ''}
                </button>
              ))}
            </div>
          </div>

          <div className="formGrid">
            <div className="formGroup">
              <label className="label"><Icon path={ICONS.technician} size={16} /> Asignar Técnico</label>
              <select className="select" value={assignedTech} onChange={e => setAssignedTech(e.target.value)} required>
                <option value="">Seleccionar técnico...</option>
                {technicians.sort((a, b) => (a.workload || 0) - (b.workload || 0)).map(t => (
                  <option key={t.id} value={t.id}>{t.name} (Zona: {t.zone}, Carga: {t.workload || 0})</option>
                ))}
              </select>
            </div>

            <div className="formGroup">
              <label className="label"><Icon path={ICONS.calendar} size={16} /> Fecha de Revisión</label>
              <div className="dateInputContainer">
                <input
                  className="input dateInput"
                  type="date"
                  value={visitDate}
                  onChange={e => setVisitDate(e.target.value)}
                  required
                />
                <div className="dateInputIcon">
                  <Icon path={ICONS.calendar} size={18} />
                </div>
              </div>
            </div>

            <div className="formGroup">
              <label className="label"><Icon path={ICONS.priority} size={16} /> Prioridad</label>
              <select className="select" value={priority} onChange={e => setPriority(e.target.value)} required>
                <option value="Baja">Baja</option>
                <option value="Media">Media</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>

          <button className="button btn-primary" type="submit">Asignar Tarea</button>
        </form>
      </div>
    );
  }

  // VISTA 1: Lista de Alertas (con Filtros)
  const filteredAlerts = alerts.filter(a => a.status === filterStatus);

  return (
    <div className="container">
      <h1 className="h1">Centro de Control de Alertas</h1>

      {/* Pestañas de Filtro */}
      <div className="tabContainer">
        <button
          className={`tabButton ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}>
          Pendientes ({alerts.filter(a => a.status === 'pending').length})
        </button>
        <button
          className={`tabButton ${filterStatus === 'assigned' ? 'active' : ''}`}
          onClick={() => setFilterStatus('assigned')}>
          Asignadas ({alerts.filter(a => a.status === 'assigned').length})
        </button>
        <button
          className={`tabButton ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}>
          Completadas ({alerts.filter(a => a.status === 'completed').length})
        </button>
      </div>

      {filteredAlerts.length === 0 ? (
        <EmptyState
          iconPath={ICONS.checkCircle}
          title={`No hay alertas ${filterStatus}`}
          message="Todo está en orden en esta sección."
        />
      ) : (
        filteredAlerts.map(alert => (
          <div key={alert.id} className="listItem">
            <div className="listItemContent alertDetails">
              <span className="alertFarmName">{alert.farmName}</span>
              <span className="alertDate">({alert.date})</span>
              <p>Síntomas: {alert.symptoms.join(', ')}</p>
              {filterStatus === 'assigned' && (
                <p>Técnico: <strong>{technicians.find(t => t.id === alert.techId)?.name || '...'}</strong> | Visita: <strong>{alert.visitDate}</strong></p>
              )}
            </div>
            <div className="listItemActions">
              <button className="button btn-primary" onClick={() => setSelectedAlertId(alert.id)}>
                {filterStatus === 'pending' ? 'Revisar y Asignar' : 'Ver Detalle'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AlertTriageView;