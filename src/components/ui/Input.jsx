// src/components/ui/Input.jsx
import React from 'react';

/**
 * Componente de Input Reutilizable (Versión Completa y Corregida)
 * - Maneja 'select' y 'textarea'.
 * - Usa las clases CSS globales de tu app (.formGroup, .label, .input, .select).
 * - Corrige el error "input is a void element tag".
 */
const Input = ({ label, type = 'text', name, value, onChange, placeholder, required, children, rows }) => {
  
  // Caso 1: El Input es un <select>
  if (type === 'select') {
    // El 'select' SÍ puede tener hijos (las <option>)
    return (
      <div className="formGroup">
        {label && <label className="label" htmlFor={name}>{label}</label>}
        <select 
          id={name} 
          name={name} 
          className="select" // Usa tu clase CSS global
          value={value} 
          onChange={onChange} 
          required={required}
        >
          {children} 
        </select>
      </div>
    );
  }

  // Caso 2: El Input es un <textarea>
  if (type === 'textarea') {
    return (
      <div className="formGroup">
        {label && <label className="label" htmlFor={name}>{label}</label>}
        <textarea 
          id={name} 
          name={name} 
          className="input" // Usa tu clase CSS global
          value={value} 
          onChange={onChange} 
          placeholder={placeholder} 
          required={required}
          rows={rows || 4} // Default 4 filas
        />
      </div>
    );
  }
  
  // Caso 3: El Input es un <input> normal (text, password, number, etc.)
  return (
    <div className="formGroup">
      {label && <label className="label" htmlFor={name}>{label}</label>}
      {/* --- ¡ESTA ES LA CORRECCIÓN CLAVE! ---
        La etiqueta <input> no puede tener "hijos" (children).
        Debe ser una etiqueta que se cierra sola (auto-cerrable) con '/>'.
      */}
      <input 
        type={type}
        id={name}
        name={name}
        className="input" // Usa tu clase CSS global
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default Input;