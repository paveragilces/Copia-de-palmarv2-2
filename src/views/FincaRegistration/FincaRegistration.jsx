import React, { useState } from 'react';
import Icon from '../../components/ui/Icon';
import Input from '../../components/ui/Input';
import MapPinSelector from '../../components/ui/MapPinSelector/MapPinSelector';
import { ICONS } from '../../config/icons';
import './FincaRegistration.css';

/**
 * NUEVA VISTA: FincaRegistration
 * Formulario para que un productor registre una nueva finca.
 */
const FincaRegistration = ({ onRegisterFinca, onNavigate, setModal }) => {
  const [fincaName, setFincaName] = useState('');
  const [hectares, setHectares] = useState('');
  const [lotes, setLotes] = useState([]);
  const [currentLote, setCurrentLote] = useState('');
  const [location, setLocation] = useState(null);

  const handleAddLote = () => {
    if (currentLote.trim() === '') return;
    if (lotes.includes(currentLote.trim())) {
      setModal({ show: true, message: 'El lote ya existe.', type: 'error' });
      return;
    }
    setLotes(prev => [...prev, currentLote.trim()]);
    setCurrentLote('');
  };

  const handleRemoveLote = (loteToRemove) => {
    setLotes(prev => prev.filter(lote => lote !== loteToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fincaName || !hectares || !location || lotes.length === 0) {
      setModal({
        show: true,
        message: 'Por favor complete todos los campos: Nombre, Hectáreas, al menos un Lote y fije la Ubicación.',
        type: 'error'
      });
      return;
    }

    const fincaData = {
      name: fincaName,
      hectares: parseFloat(hectares),
      lotes,
      location,
      id: `f${Date.now()}` // Genera un ID simple
    };

    onRegisterFinca(fincaData);
  };

  return (
    <div className="container">
      <button className="button button-secondary" onClick={() => onNavigate('producerProfile')} style={{marginBottom: '15px'}}>
        <Icon path={ICONS.back} /> Volver a Mis Fincas
      </button>
      <h1 className="h1">Registrar Nueva Finca</h1>

      <form onSubmit={handleSubmit}>
        <div className="formGrid">
          <Input
            label="Nombre de la Finca"
            name="fincaName"
            value={fincaName}
            onChange={(e) => setFincaName(e.target.value)}
            placeholder="Ej: Hacienda El Sol"
            required
          />
          <Input
            label="Hectáreas Totales"
            name="hectares"
            type="number"
            value={hectares}
            onChange={(e) => setHectares(e.target.value)}
            placeholder="Ej: 120"
            required
          />
        </div>

        <h2 className="h2">Gestor de Lotes</h2>
        <div className="loteManager">
          <div className="loteInputGroup">
            <Input
              label="Añadir Lote"
              name="loteName"
              value={currentLote}
              onChange={(e) => setCurrentLote(e.target.value)}
              placeholder="Ej: Lote 01 (Producción)"
            />
            <button type="button" className="button btn-primary" onClick={handleAddLote}>
              Añadir
            </button>
          </div>
          <div className="loteTagContainer">
            {lotes.length === 0 ? (
              <p>Aún no has añadido lotes.</p>
            ) : (
              lotes.map(lote => (
                <span key={lote} className="loteTag">
                  {lote}
                  <button type="button" className="removeLoteButton" onClick={() => handleRemoveLote(lote)}>
                    <Icon path={ICONS.reject} size={14} />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        <h2 className="h2">Ubicación de la Finca</h2>
        <p>Arrastra el mapa y presiona "Fijar Ubicación" cuando el pin esté sobre la entrada principal de la finca.</p>
        <MapPinSelector onLocationSet={setLocation} />

        <hr className="formDivider" />

        <button className="button btn-primary" type="submit">
          Guardar Finca
        </button>
      </form>
    </div>
  );
};

export default FincaRegistration;