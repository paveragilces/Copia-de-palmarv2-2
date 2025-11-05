import React from 'react';
import Icon from '../../components/ui/Icon';
import ProgressBar from '../../components/ui/ProgressBar/ProgressBar'; 
import { ICONS } from '../../config/icons';
import { MOCK_INSPECTION_MODULES } from '../../data/mockData'; 
import './ProducerCertification.css';

/**
 * VISTA DE CERTIFICACIÓN (Rediseñada)
 * Muestra el estado actual Y el historial de revisiones.
 * onShowHistoryModal es una nueva prop de App.js
 */
const ProducerCertification = ({ certificationHistory, onShowHistoryModal }) => {
  
  // El estado actual es el primer (más reciente) ítem del historial
  const currentStatus = certificationHistory[0];
  const totalScore = currentStatus.averageScore;
  const isCertified = totalScore > 90;

  return (
    <div className="container">
      <h1 className="h1">Certificación Interna "Sello AgroAliados"</h1>
      
      {/* --- HEADER DE CERTIFICACIÓN --- */}
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
        </div>
        <div className="certificationScoreBox">
          <span className="scoreLabel">Promedio Actual</span>
          <span className="scoreValue">{totalScore}%</span>
        </div>
      </div>

      {/* --- DESGLOSE DE CUMPLIMIENTO (ACTUAL) --- */}
      <div className="certificationBreakdown">
        <h2 className="h2">Desglose de Cumplimiento Actual (Revisión: {currentStatus.date})</h2>
        <p>Este puntaje es el promedio de tu desempeño en la última auditoría, dividido por módulo.</p>
        
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

      {/* --- ¡NUEVO! HISTORIAL DE REVISIONES --- */}
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