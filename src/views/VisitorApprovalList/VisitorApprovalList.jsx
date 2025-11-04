// src/views/VisitorApprovalList/VisitorApprovalList.jsx
import React from 'react';
import EmptyState from '../../components/ui/EmptyState';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
// Importamos la función de cálculo de riesgo para mostrarla al productor
import { calculateRisk } from '../../utils/riskCalculator';
import './VisitorApprovalList.css'; 

/**
 * Aprobación de Visitas (Productor) - Ahora con cálculo de riesgo
 */
const VisitorApprovalList = ({ producer, visits, onApproveVisit, onRejectVisit }) => {
  // Filtra visitas PENDIENTES que sean para este productor
  const pendingVisits = visits.filter(v => v.producerId === producer.id && v.status === 'PENDING');

  const getRiskClass = (risk) => {
    if (risk === 'High') return 'risk-high';
    if (risk === 'Middle') return 'risk-middle';
    return 'risk-low';
  };

  return (
    <div className="container">
      <h1 className="h1">Aprobación de Visitas ({pendingVisits.length})</h1>
      {pendingVisits.length === 0 ? (
        <EmptyState
          iconPath={ICONS.visit}
          title="No hay Visitas Pendientes"
          message="No tienes solicitudes de visitantes por aprobar."
        />
      ) : (
        <div className="tableContainer">
          <table className="dataTable">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Compañía</th>
                <th>Motivo</th>
                <th>Cadena de Valor</th>
                <th>Riesgo Potencial</th> {/* NUEVA COLUMNA */}
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {pendingVisits.map(req => {
                // Calculamos el riesgo para mostrarlo
                const potentialRisk = calculateRisk(req.company, req.purpose, req.valueChain);
                return (
                  <tr key={req.id}>
                    <td>{req.name} ({req.idNumber})</td>
                    <td>{req.company}</td>
                    <td>{req.purpose}</td>
                    <td>{req.valueChain}</td>
                    <td className={`riskTag ${getRiskClass(potentialRisk)}`}>
                      {potentialRisk}
                    </td>
                    <td>
                      <button
                        onClick={() => onApproveVisit(req.id, potentialRisk)} // Pasamos el riesgo al aprobar
                        className="button button-success"
                        title="Aprobar y generar código QR"
                      >
                        <Icon path={ICONS.approve} /> Aprobar
                      </button>
                      <button
                        onClick={() => onRejectVisit(req.id)}
                        className="button button-outline-danger" // ¡ESTILO CAMBIADO!
                        title="Rechazar la solicitud"
                      >
                        <Icon path={ICONS.reject} /> Rechazar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VisitorApprovalList;