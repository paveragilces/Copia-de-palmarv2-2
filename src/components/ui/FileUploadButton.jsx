import React from 'react';
import Icon from './Icon';
import { ICONS } from '../../config/icons'; // Asumiendo que ICONS estará en esta ruta
import './FileUploadButton.css';

/**
 * Botón de Carga de Archivo (Estilizado)
 */
const FileUploadButton = ({ onUpload, label, evidenceLoaded }) => {
  const fileInputRef = React.useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  const buttonClasses = `
    fileUploadButton
    ${evidenceLoaded ? 'success' : 'dashed'}
  `;

  return (
    <div style={{ marginTop: '15px', width: '100%' }}>
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={handleClick}
        className={buttonClasses}
      >
        <Icon path={evidenceLoaded ? ICONS.approve : ICONS.evidence} />
        {evidenceLoaded ? 'Evidencia Cargada' : label}
      </button>
    </div>
  );
};

export default FileUploadButton;