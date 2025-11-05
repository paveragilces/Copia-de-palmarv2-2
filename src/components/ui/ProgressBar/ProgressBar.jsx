import React from 'react';
import './ProgressBar.css';

/**
 * NUEVO COMPONENTE: ProgressBar
 * Muestra una barra de progreso con etiqueta y puntaje.
 * El color cambia según el puntaje.
 */
const ProgressBar = ({ label, score }) => {
  
  // Determina el color basado en el puntaje
  const getScoreColor = (s) => {
    if (s > 90) return '#5cb85c'; // Verde (Éxito)
    if (s > 75) return '#f0ad4e'; // Naranja (Advertencia)
    return '#d9534f'; // Rojo (Peligro)
  };

  const scoreColor = getScoreColor(score);

  return (
    <div className="progressBarContainer">
      <div className="progressBarLabel">
        <span className="labelName">{label}</span>
        <span className="labelScore" style={{ color: scoreColor }}>
          {score}%
        </span>
      </div>
      <div className="progressBarBackground">
        <div 
          className="progressBarFill" 
          style={{ 
            width: `${score}%`, 
            backgroundColor: scoreColor 
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;