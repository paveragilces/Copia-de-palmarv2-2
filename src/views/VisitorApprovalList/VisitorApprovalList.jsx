// src/views/VisitorApprovalList/VisitorApprovalList.jsx
import React from 'react';
import EmptyState from '../../components/ui/EmptyState';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import { calculateRisk } from '../../utils/riskCalculator';
import Table from '../../components/ui/Table/Table'; // ¡NUEVO!
import RiskTag from '../../components/ui/RiskTag/RiskTag'; // ¡NUEVO!
import './VisitorApprovalList.css'; 

/**
 * Aprobación de Visitas (Productor) - REDISEÑADO
 * Ahora usa el componente <Table> y los botones de ícono modernos.
 */
const VisitorApprovalList = ({ producer, visits, onApproveVisit, onRejectVisit, pageData }) => {
  
  // pageData?.filter está disponible si decides añadir pestañas de "Pendiente", "Aprobado", etc.
  // Por ahora, solo mostramos las pendientes.
  
  const pendingVisits = visits.filter(v => 
    v.producerId === producer.id && v.status === 'PENDING'
  );

  // --- NUEVA DEFINICIÓN DE TABLA ---
  const tableHeaders = [
    { label: 'Nombre' },
    { label: 'Compañía' },
    { label: 'Motivo' },
    { label: 'Cadena de Valor' },
    { label: 'Riesgo Potencial', className: 'text-center' },
    { label: 'Acción', className: 'text-center' },
  ];

  // --- NUEVA FUNCIÓN renderRow ---
  const renderVisitRow = (req) => {
    // Calculamos el riesgo para mostrarlo
    const potentialRisk = calculateRisk(req.company, req.purpose, req.valueChain);

    return (
      <>
        <td>{req.name} ({req.idNumber})</td>
        <td>{req.company}</td>
        <td>{req.purpose}</td>
        <td>{req.valueChain}</td>
        <td className="text-center">
          {/* Componente <RiskTag> reutilizable */}
          <RiskTag riskLevel={potentialRisk} />
        </td>
        <td className="text-center actionCell">
          {/* ¡NUEVOS BOTONES DE ÍCONO! */}
          <button
            onClick={() => onApproveVisit(req.id, potentialRisk)}
            className="button icon approveButton"
            title="Aprobar y generar código QR"
          >
            <Icon path={ICONS.approve} size={20} />
          </button>
          <button
            onClick={() => onRejectVisit(req.id)}
            className="button icon rejectButton"
            title="Rechazar la solicitud"
          >
            <Icon path={ICONS.reject} size={16} />
          </button>
        </td>
      </>
    );
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
        // --- ¡NUEVO COMPONENTE <Table> ---
        <Table
          headers={tableHeaders}
          data={pendingVisits}
          renderRow={renderVisitRow}
          emptyMessage="No hay visitas pendientes."
        />
      )}
    </div>
  );
};

export default VisitorApprovalList;