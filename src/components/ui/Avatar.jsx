import React from 'react';
import './Avatar.css';

/**
 * Avatar con Iniciales y color dinámico
 */
const Avatar = ({ name }) => {
  const getInitials = (name) => {
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const getColor = (name) => {
    const colors = ['#d9534f', '#f0ad4e', '#5cb85c', '#5bc0de', '#005a3a'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="avatar" style={{ backgroundColor: getColor(name) }}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;