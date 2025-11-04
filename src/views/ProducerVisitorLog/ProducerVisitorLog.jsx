// src/views/ProducerVisitorLog/ProducerVisitorLog.jsx
import React, { useState, useEffect } from 'react';
import Table from '../../components/ui/Table/Table';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import RiskTag from '../../components/ui/RiskTag/RiskTag';
import { ICONS } from '../../config/icons';
import './ProducerVisitorLog.css';

const ProducerVisitorLog = ({ producerLog, onGeneratePDF }) => {
  const [filteredLog, setFilteredLog] = useState(producerLog);
  const [nameFilter, setNameFilter] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [monthYearFilter, setMonthYearFilter] = useState('');

  const statusOptions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'PENDING', label: 'Pendiente' },
    { value: 'APPROVED', label: 'Aprobada' },
    { value: 'DENIED', label: 'Rechazada' },
    { value: 'CHECKED_IN', label: 'Ingresó' },
    { value: 'CHECKED_OUT', label: 'Salió' }
  ];

  const riskOptions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'low', label: 'Bajo' },
    { value: 'middle', label: 'Medio' },
    { value: 'high', label: 'Alto' },
  ];

  useEffect(() => {
    let tempLog = producerLog;

    if (nameFilter) {
      tempLog = tempLog.filter(visit =>
        visit.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (companyFilter) {
      tempLog = tempLog.filter(visit =>
        visit.company.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }
    if (riskFilter !== 'Todos') {
      tempLog = tempLog.filter(visit =>
        (visit.risk || 'N/A').toLowerCase() === riskFilter.toLowerCase()
      );
    }
    if (statusFilter !== 'Todos') {
      tempLog = tempLog.filter(visit =>
        visit.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    if (monthYearFilter) {
      const [filterYear, filterMonth] = monthYearFilter.split('-').map(Number);
      tempLog = tempLog.filter(visit => {
        const visitDate = visit.checkIn ? new Date(visit.checkIn) : (visit.entryTime ? new Date(visit.entryTime) : null);
        if (!visitDate) return false;
        return visitDate.getFullYear() === filterYear && (visitDate.getMonth() + 1) === filterMonth;
      });
    }

    setFilteredLog(tempLog);
  }, [producerLog, nameFilter, companyFilter, riskFilter, statusFilter, monthYearFilter]);

  const tableHeaders = [
    { label: 'Nombre' },
    { label: 'Compañía' },
    { label: 'Riesgo', className: 'text-center' },
    { label: 'Entrada' },
    { label: 'Salida' },
    { label: 'Estado' },
    { label: 'Reporte', className: 'text-center' },
  ];

  const renderVisitRow = (visit) => (
    <>
      <td>{visit.name}</td>
      <td>{visit.company}</td>
      <td className="text-center">
        <RiskTag riskLevel={visit.risk} />
      </td>
      <td>{visit.checkIn ? new Date(visit.checkIn).toLocaleString() : 'N/A'}</td>
      <td>{visit.checkOut ? new Date(visit.checkOut).toLocaleString() : 'N/A'}</td>
      <td>
        <span className={`visitStatusTag ${visit.status.toLowerCase()}`}>
          {statusOptions.find(opt => opt.value === visit.status)?.label || visit.status}
        </span>
      </td>
      <td className="text-center">
        <Button 
          variant="icon" 
          onClick={() => onGeneratePDF(visit)}
          disabled={!visit.checkIn}
          title={!visit.checkIn ? "El reporte está disponible después del ingreso real." : "Generar Reporte PDF"}
        >
          <Icon path={ICONS.download} size={20} />
        </Button>
      </td>
    </>
  );

  return (
    <div className="producerVisitorLog">
      <h1 className="h1">Registro de Visitas a la Finca</h1>

      <div className="filtersContainer">
        <div className="filterGroup">
          <label htmlFor="monthYearFilter">Filtrar por Mes/Año:</label>
          <input
            type="month"
            id="monthYearFilter"
            className="filterInput"
            value={monthYearFilter}
            onChange={(e) => setMonthYearFilter(e.target.value)}
          />
        </div>
        <div className="filterGroup">
          <label htmlFor="nameFilter">Nombre:</label>
          <input
            type="text"
            id="nameFilter"
            className="filterInput"
            placeholder="Filtrar Nombre..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        <div className="filterGroup">
          <label htmlFor="companyFilter">Compañía:</label>
          <input
            type="text"
            id="companyFilter"
            className="filterInput"
            placeholder="Filtrar Compañía..."
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          />
        </div>
        <div className="filterGroup">
          <label htmlFor="riskFilter">Riesgo:</label>
          <select
            id="riskFilter"
            className="filterSelect"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            {riskOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div className="filterGroup">
          <label htmlFor="statusFilter">Estado:</label>
          <select
            id="statusFilter"
            className="filterSelect"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        
        {/* --- BOTÓN LIMPIAR FILTROS MEJORADO --- */}
        <div className="filterGroup clearButtonContainer">
          <Button 
            variant="icon"
            onClick={() => {
              setNameFilter('');
              setCompanyFilter('');
              setRiskFilter('Todos');
              setStatusFilter('Todos');
              setMonthYearFilter('');
            }}
            className="clearFiltersButton"
            title="Limpiar filtros"
          >
            <Icon path={ICONS.reload} size={20} />
          </Button>
        </div>
        
      </div>

      <Table
        headers={tableHeaders}
        data={filteredLog}
        renderRow={renderVisitRow}
        emptyMessage="No hay visitas que coincidan con los filtros."
      />
    </div>
  );
};

export default ProducerVisitorLog;