import React, { useState, useRef } from 'react';
import Icon from '../../components/ui/Icon';
import FileUploadButton from '../../components/ui/FileUploadButton';
import { ICONS } from '../../config/icons';
import { ALERT_SYMPTOMS_DATA } from '../../data/constants'; // Asumiendo que se movió
import './AlertReportForm.css';

/**
 * Formulario de Reporte de Alerta (Productor)
 * ACTUALIZADO: Con selección de Finca/Lote y GPS real
 */
const AlertReportForm = ({ producer, onSubmitAlert, setModal }) => {
  const fincas = producer.fincas || [];
  
  const [selectedFincaId, setSelectedFincaId] = useState(fincas[0]?.id || '');
  const [selectedLote, setSelectedLote] = useState('');
  
  const [selectedParts, setSelectedParts] = useState({});
  const [symptoms, setSymptoms] = useState([]);
  const [photos, setPhotos] = useState({});
  const [location, setLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const selectedFinca = fincas.find(f => f.id === selectedFincaId);
  const lotes = selectedFinca?.lotes || [];

  const handleFincaChange = (e) => {
    setSelectedFincaId(e.target.value);
    setSelectedLote(''); // Resetear lote al cambiar de finca
  };

  const handlePartToggle = (part) => {
    const newParts = { ...selectedParts, [part]: !selectedParts[part] };
    setSelectedParts(newParts);

    if (!newParts[part]) {
      const symptomsForPart = (ALERT_SYMPTOMS_DATA[part] || []).map(s => s);
      setSymptoms(symptoms.filter(s => !symptomsForPart.includes(s)));
    }
  };

  const handleSymptomToggle = (symptom) => {
    setSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handlePhotoUpload = (part, file) => {
    if (!file) return;
    const photoUrl = URL.createObjectURL(file);
    setPhotos(prev => ({ ...prev, [part]: photoUrl }));
  };

  const getLocation = () => {
    setLoadingLocation(true);
    if (!navigator.geolocation) {
      setLoadingLocation(false);
      setModal({ show: true, message: 'La geolocalización no es soportada por este navegador.', type: 'error' });
      return;
    }

    // --- LÓGICA DE GPS REAL ---
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLoc = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        setLocation(newLoc);
        setLoadingLocation(false);
        setModal({ show: true, message: 'Ubicación real capturada con éxito.', type: 'success' });
      },
      (error) => {
        setLoadingLocation(false);
        let message = 'Error al obtener la ubicación. Intente de nuevo.';
        if (error.code === error.PERMISSION_DENIED) {
          message = 'Permiso de ubicación denegado. Por favor, active los permisos en su navegador.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = 'Información de ubicación no disponible.';
        } else if (error.code === error.TIMEOUT) {
          message = 'Se agotó el tiempo de espera para obtener la ubicación.';
        }
        setModal({ show: true, message: message, type: 'error' });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // Opciones para mayor precisión
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (symptoms.length === 0 || !location || !selectedFincaId || !selectedLote) {
      setModal({ show: true, message: 'Por favor, seleccione Finca, Lote, al menos un síntoma y capture la ubicación GPS.', type: 'error' });
      return;
    }
    
    const newAlert = {
      producerId: producer.id,
      fincaId: selectedFincaId, // NUEVO
      lote: selectedLote, // NUEVO
      farmName: selectedFinca?.name || 'Finca desconocida', // ACTUALIZADO
      date: new Date().toISOString().split('T')[0],
      parts: selectedParts,
      photos: photos,
      location: location,
      status: 'pending',
      symptoms: symptoms,
      techId: null,
      visitDate: null,
      priority: null,
      managerComment: null,
      possibleDisease: null,
      inspectionData: null,
    };
    onSubmitAlert(newAlert);
  };

  return (
    <div className="container">
      <h1 className="h1">Reportar Alerta Fitosanitaria</h1>
      <form onSubmit={handleSubmit}>

        <h2 className="h2">1. Ubicación del Reporte</h2>
        <div className="formGrid">
          <div className="formGroup">
            <label className="label">Finca</label>
            <select className="select" value={selectedFincaId} onChange={handleFincaChange} required>
              <option value="">Seleccione una finca...</option>
              {fincas.map(finca => (
                <option key={finca.id} value={finca.id}>{finca.name}</option>
              ))}
            </select>
          </div>
          <div className="formGroup">
            <label className="label">Lote</label>
            <select className="select" value={selectedLote} onChange={(e) => setSelectedLote(e.target.value)} required disabled={!selectedFincaId}>
              <option value="">Seleccione un lote...</option>
              {lotes.map(lote => (
                <option key={lote} value={lote}>{lote}</option>
              ))}
            </select>
          </div>
        </div>

        <h2 className="h2">2. Partes Afectadas</h2>
        <div className="buttonToggleGroup">
          {Object.keys(ALERT_SYMPTOMS_DATA).map(part => (
            <button
              type="button"
              key={part}
              onClick={() => handlePartToggle(part)}
              className={`button ${selectedParts[part] ? 'btn-primary' : 'button-secondary'}`}
            >
              {part} {selectedParts[part] ? '✓' : ''}
            </button>
          ))}
        </div>

        <h2 className="h2">3. Síntomas Observables</h2>
        {Object.keys(ALERT_SYMPTOMS_DATA).map(part => selectedParts[part] && (
          <div className="formGroup" key={part}>
            <label className="label">Síntomas en: <strong>{part}</strong></label>
            <div className="symptomCheckboxGroup">
              {ALERT_SYMPTOMS_DATA[part].map(symptom => (
                <div key={symptom} className="checkboxItem">
                  <label className="checkboxLabel">
                    <input
                      type="checkbox"
                      checked={symptoms.includes(symptom)}
                      onChange={() => handleSymptomToggle(symptom)}
                      className="checkboxInput"
                    />
                    {symptom}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <h2 className="h2">4. Adjuntar Fotos (Opcional)</h2>
        <div className="photoUploadGrid">
          {Object.keys(ALERT_SYMPTOMS_DATA).map(part => selectedParts[part] && (
            <div className="formGroup" key={`photo-${part}`}>
              <label className="label"><Icon path={ICONS.camera} size={16} /> Foto de: <strong>{part}</strong></label>
              <FileUploadButton
                label={`[+] Adjuntar Foto ${part}`}
                onUpload={(file) => handlePhotoUpload(part, file)}
                evidenceLoaded={!!photos[part]}
              />
              {photos[part] && <img src={photos[part]} alt={`Preview ${part}`} className="photoPreview" />}
            </div>
          ))}
        </div>

        <h2 className="h2">5. Ubicación de la Planta</h2>
        <div className="formGroup">
          <button type="button" onClick={getLocation} disabled={loadingLocation} className="button button-secondary">
            <Icon path={ICONS.location} />
            {loadingLocation ? 'Obteniendo GPS...' : (location ? 'Actualizar Ubicación' : 'Obtener Ubicación GPS')}
          </button>
          {location && (
            <p className="locationFeedback">
              Ubicación capturada: Lat {location.lat.toFixed(6)}, Lon {location.lon.toFixed(6)}
            </p>
          )}
        </div>

        <hr className="formDivider" />

        <button className="button btn-primary" type="submit" disabled={symptoms.length === 0 || !location || !selectedLote}>
          Enviar Reporte de Alerta
        </button>
      </form>
    </div>
  );
};

export default AlertReportForm;