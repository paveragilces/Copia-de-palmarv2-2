import React from 'react';
import Icon from './Icon';
import { ICONS } from '../../config/icons'; // Asumiendo que ICONS estará en esta ruta
import './InspectionStepper.css';

/**
 * Stepper de Inspección
 */
const InspectionStepper = ({ currentModule, modules }) => {
  const steps = [
    { key: 'audit', label: 'Auditoría', icon: ICONS.audit },
    { key: 'drone', label: 'Vuelo Drone', icon: ICONS.drone },
    { key: 'plant', label: 'Diagnóstico', icon: ICONS.plant },
  ];

  return (
    <div className="stepperContainer">
      {steps.map((step, index) => {
        const isActive = currentModule === step.key;
        const isCompleted = modules[step.key] && modules[step.key].status === 'Completado';

        const circleClasses = `
          stepCircle
          ${isActive ? 'active' : ''}
          ${isCompleted && !isActive ? 'completed' : ''}
        `;

        const labelClasses = `
          stepLabel
          ${isActive ? 'active' : ''}
        `;

        const lineClasses = `
          stepLine
          ${isCompleted ? 'completed' : ''}
        `;

        return (
          <React.Fragment key={step.key}>
            <div className="stepItem">
              <div className={circleClasses}>
                <Icon path={isCompleted && !isActive ? ICONS.approve : step.icon} size={16} color="currentColor" />
              </div>
              <div className={labelClasses}>
                {step.label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={lineClasses} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default InspectionStepper;