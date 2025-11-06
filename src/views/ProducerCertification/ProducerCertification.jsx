import React from 'react';
import Icon from '../../components/ui/Icon';
import ProgressBar from '../../components/ui/ProgressBar/ProgressBar'; 
import { ICONS } from '../../config/icons';
import { MOCK_INSPECTION_MODULES } from '../../data/mockData'; 
import './ProducerCertification.css';
// --- AÑADIDO ---
// Importamos EmptyState para manejar el caso de que no haya historial
import EmptyState from '../../components/ui/EmptyState'; 

/**
 * VISTA DE CERTIFICACIÓN (Rediseñada)
 * Muestra el estado actual Y el historial de revisiones.
 * onShowHistoryModal es una nueva prop de App.js
 */
const ProducerCertification = ({ certificationHistory, onShowHistoryModal }) => {
  
  // --- ¡CORRECCIÓN DEL BUG! ---
  // Si el historial está vacío, mostramos un mensaje en lugar de crashear.
  if (!certificationHistory || certificationHistory.length === 0) {
    return (
      <div className="container">
        <h1 className="h1">Certificación Interna "Sello AgroAliados"</h1>
        <EmptyState
          iconPath={ICONS.certification}
          title="Sin Historial de Certificación"
          message="Aún no se ha completado ninguna auditoría. Tu puntaje aparecerá aquí después de la primera revisión."
        />
      </div>
    );
  }
  // --- FIN DE LA CORRECCIÓN ---

  // Si el código continúa, es seguro leer el historial
  const currentStatus = certificationHistory[0];
  const totalScore = currentStatus.averageScore;
  // Ajustamos la lógica de certificación (asumiendo que 90 es la meta)
  const isCertified = totalScore > 90; 

  return (
    <div className="container">
      <h1 className="h1">Certificación Interna "Sello AgroAliados"</h1>
      
      {/* --- HEADER DE CERTIFICACIÓN (Tu diseño original) --- */}
      <div className={`certificationHeader ${isCertified ? 'certified' : 'pending'}`}>
        <div className="certificationBadge">
          <Icon path={ICONS.certification} size={40} />
        </div>
        <div className="certificationSummary">
          <span className="summaryTitle">{isCertified ? '¡SELLO OBTENIDO!' : 'EN PROCESO'}</span>
          <p>
            {isCertified
              ? 'Has obtenido el Sello por mantener un cumplimiento promedio superior al 90%.'
              : 'Tu puntaje de cumplimiento es bueno, pero necesitas superar el 90% para obtener el Sello.'
            }
          </p>
          <span className="summaryScore">Tu promedio actual: <strong>{totalScore}%</strong></span>
        </div>
      </div>

      {/* --- DESGLOSE DE PUNTAJES (Tu diseño original) --- */}
      <div className="certificationBreakdown">
        <h2 className="h2">Desglose de Puntaje Actual</h2>
        <div className="progressGrid">
          {MOCK_INSPECTION_MODULES.map(module => (
            <ProgressBar 
              key={module.id}
              label={`${module.id}. ${module.name}`}
              score={currentStatus.breakdown[module.name] || 0}
            />
          ))}
        </div>
      </div>

      {/* --- HISTORIAL DE REVISIONES (Tu diseño original) --- */}
      <div className="certificationHistory">
        <h2 className="h2">Historial de Revisiones</h2>
        <div className="historyList">
          {certificationHistory.map(historyItem => (
            <button 
              key={historyItem.id} 
              className="historyItem"
              onClick={() => onShowHistoryModal(historyItem)} // Abre el Modal
            >
              <div className="historyInfo">
                <span className="historyDate">Revisión: {historyItem.date}</span>
                <span className="historyScore">Promedio: <strong>{historyItem.averageScore}%</strong></span>
              </div>
              <div className="historyActions">
                <span 
                  className={`tag ${historyItem.status === 'Aprobado' ? 'tag-aprobado' : 'tag-no-aprobado'}`}
                >
                  {historyItem.status}
                </span>
                <span className="historyCta">
                  Ver Desglose <Icon path={ICONS.chevronDown} size={16} style={{ transform: 'rotate(-90deg)' }} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default ProducerCertification;