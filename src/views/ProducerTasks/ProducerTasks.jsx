import React from 'react';
import EmptyState from '../../components/ui/EmptyState';
import Icon from '../../components/ui/Icon';
import { ICONS } from '../../config/icons';
import './ProducerTasks.css';

/**
 * Tareas Pendientes (Productor, con Modal de Capacitación)
 * ACTUALIZADO: Acepta pageData para futuros filtros
 */
const ProducerTasks = ({ producer, tasks, onCompleteTask, onShowTraining, pageData }) => {
  
  // NOTA: pageData?.filter está disponible, pero esta vista
  // no tiene pestañas. Mostraremos pendientes y completadas.
  
  const pendingTasks = tasks.filter(t => t.producerId === producer.id && t.status === 'pending');
  const completedTasks = tasks.filter(t => t.producerId === producer.id && t.status === 'completed');

  const TaskItem = ({ task, isCompleted = false }) => (
    <div key={task.id} className={`listItem ${isCompleted ? 'completed' : ''}`}>
      <div className="listItemContent" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
        <span className={`taskTitle ${isCompleted ? 'completed' : ''}`}>{task.title}</span>
        <p className="taskDescription">{task.description.split('\n')[0]}</p>
        <p className="taskOrigin">Basado en Auditoría: Alerta #{task.alertId} (Pregunta {task.questionId})</p>
      </div>
      <div className="listItemActions">
        {!isCompleted && (
          <>
            <button
              className="button button-secondary"
              onClick={() => onShowTraining(task)}
            >
              <Icon path={ICONS.training} /> Ver Capacitación
            </button>
            <button
              className="button button-success"
              onClick={() => onCompleteTask(task.id)}
            >
              Marcar como Cumplida
            </button>
          </>
        )}
        {isCompleted && (
          <span className="taskCompletedIcon">
            <Icon path={ICONS.approve} size={24} />
            Completada
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="container">
      <h1 className="h1">Tareas Pendientes ({pendingTasks.length})</h1>
      {pendingTasks.length === 0 ? (
        <EmptyState
          iconPath={ICONS.checkCircle}
          title="¡Felicitaciones!"
          message="No tienes tareas pendientes. ¡Sigue así!"
        />
      ) : (
        pendingTasks.map(task => <TaskItem key={task.id} task={task} />)
      )}

      {completedTasks.length > 0 && (
        <>
          <h2 className="h2" style={{ marginTop: '30px', borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
            Tareas Completadas
          </h2>
          {completedTasks.map(task => <TaskItem key={task.id} task={task} isCompleted={true} />)}
        </>
      )}
    </div>
  );
};

export default ProducerTasks;