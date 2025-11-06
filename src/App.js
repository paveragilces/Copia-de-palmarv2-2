// src/App.js
import React, { useState, useEffect } from 'react';

// --- SECCIÓN 1: IMPORTAR ESTILOS GLOBALES ---
import './styles/index.css';
import './App.css';

// --- SECCIÓN 2: IMPORTAR DATOS Y CONSTANTES ---
import {
  MOCK_PRODUCERS,
  MOCK_TECHNICIANS_PROFILES,
  MOCK_ALERTS,
  MOCK_VISITS,
  MOCK_TASKS,
  MOCK_NOTIFICATIONS,
  MOCK_INSPECTION_MODULES,
  MOCK_FINCAS_FLAT,
  MOCK_CERTIFICATION_HISTORY // Añadido para que no falle Certificación
} from './data/mockData';
import { 
  MOCK_TASK_TEMPLATES, 
  TECHNICIAN_SPECIALTIES, 
  BANANA_DISEASES, 
  TECHNICIAN_ACTIONS 
} from './data/constants';
import { calculateRisk } from './utils/riskCalculator';

// --- SECCIÓN 3: IMPORTAR COMPONENTES REUTILIZABLES ---
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Modal from './components/ui/Modal';
import Input from './components/ui/Input'; 
import ProgressBar from './components/ui/ProgressBar/ProgressBar'; // Añadido

// --- SECCIÓN 4: IMPORTAR VISTAS (PÁGINAS) ---
import LoginScreen from './views/LoginScreen/LoginScreen';
import ManagerDashboard from './views/ManagerDashboard/ManagerDashboard';
import TechnicianControl from './views/TechnicianControl/TechnicianControl';
import VisitorReport from './views/VisitorReport/VisitorReport';
import AlertTriageView from './views/AlertTriageView/AlertTriageView';
import TechnicianSchedule from './views/TechnicianSchedule/TechnicianSchedule';
import ProducerDashboard from './views/ProducerDashboard/ProducerDashboard';
import AlertReportForm from './views/AlertReportForm/AlertReportForm';
import VisitorApprovalList from './views/VisitorApprovalList/VisitorApprovalList';
import ProducerTasks from './views/ProducerTasks/ProducerTasks';
import ProducerCertification from './views/ProducerCertification/ProducerCertification';
import NotificationCenter from './views/NotificationCenter/NotificationCenter';
import TechnicianInspectionCenter from './views/TechnicianInspectionCenter/TechnicianInspectionCenter';
import ProducerProfile from './views/ProducerProfile/ProducerProfile'; 
import ProducerAlertList from './views/ProducerAlertList/ProducerAlertList'; 
import TechnicianProfile from './views/TechnicianProfile/TechnicianProfile'; 
// --- ¡NUEVA VISTA AÑADIDA! ---
import FincaRegistration from './views/FincaRegistration/FincaRegistration'; 

// --- IMPORTACIONES DE FLUJO DE VISITAS ---
import VisitorAccessPage from './views/VisitorAccess/VisitorAccessPage';
import VisitorCheckIn from './views/VisitorCheckIn/VisitorCheckIn';
import ProducerVisitorLog from './views/ProducerVisitorLog/ProducerVisitorLog';

// --- IMPORTACIONES PARA GENERACIÓN DE PDF ---
import { jsPDF } from 'jspdf';


// --- COMPONENTE INTERNO: Formulario de Registro de Técnico ---
const RegisterTechnicianForm = ({ onSubmit, onCancel }) => {
  // (Tu código de RegisterTechnicianForm... no necesita cambios)
  const [name, setName] = useState('');
  const [zone, setZone] = useState('Norte');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && zone) {
      onSubmit(name, zone);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      <Input
        label="Nombre Completo del Técnico"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <div className="formGroup">
        <label className="label" htmlFor="zone">Zona Asignada</label>
        <select
          id="zone"
          name="zone"
          className="select" 
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        >
          <option value="Norte">Norte</option>
          <option value="Sur">Sur</option>
          <option value="Este">Este</option>
          <option value="Oeste">Oeste</option>
        </select>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
        <button type="button" className="button button-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="button btn-primary">
          Registrar Técnico
        </button>
      </div>
    </form>
  );
};


function App() {
  // --- Estado de Navegación ---
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [pageData, setPageData] = useState(null);

  // --- Estado Global de la App ---
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ show: false, message: '', type: 'info' });
  const [trainingModalTask, setTrainingModalTask] = useState(null);
  const [registerTechModal, setRegisterTechModal] = useState(false); 
  const [certHistoryModal, setCertHistoryModal] = useState(null); // Añadido


  // --- Estado de Datos (Mocks) ---
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const [visits, setVisits] = useState(MOCK_VISITS);
  const [technicians, setTechnicians] = useState(
    MOCK_TECHNICIANS_PROFILES.map(t => ({
      ...t,
      workload: MOCK_ALERTS.filter(a => a.techId === t.id && a.status === 'assigned').length
    }))
  );
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [producers, setProducers] = useState(MOCK_PRODUCERS);
  const [fincas, setFincas] = useState(MOCK_FINCAS_FLAT);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [certificationHistory, setCertificationHistory] = useState(MOCK_CERTIFICATION_HISTORY); // Añadido


  // --- Efecto para generar tareas iniciales (basado en mocks) ---
  useEffect(() => {
    // (Tu código de useEffect... no necesita cambios)
  }, []);


  // --- Lógica de Negocio (Handlers) ---

  const showLoadingAndModal = (message, type = 'success', duration = 500) => {
    // (Tu código... no necesita cambios)
  };

  const createNotification = (producerId, text, link) => {
    // (Tu código... no necesita cambios)
  };

  const handleShowTraining = (task) => {
    // (Tu código... no necesita cambios)
  };

  const handleLogin = (role, page = null) => {
    // (Tu código... no necesita cambios)
  };

  const handleLogout = () => {
    // (Tu código... no necesita cambios)
  };

  const handleNavigate = (page, data = null) => {
    // (Tu código... no necesita cambios)
  };
  
  const handleSubmitAlert = (newAlert) => {
    // (Tu código... no necesita cambios)
  };

  const handleSubmitVisitRequest = (requestData) => {
    // (Tu código... no necesita cambios)
  };

  const handleApproveVisit = (visitId, potentialRisk) => { 
    // (Tu código... no necesita cambios)
  };

  const handleRejectVisit = (visitId) => {
    // (Tu código... no necesita cambios)
  };

  const handleScanQr = (qrData) => {
    // (Tu código... no necesita cambios)
  };
  
  const handleCaptureEvidence = (visitId, type, data) => {
    // (Tu código... no necesita cambios)
  };

  const handleGeneratePDF = async (visit) => {
    // (Tu código... no necesita cambios)
  };

  const handleAssignAlert = (alertId, comment, diseases, techId, date, priority) => {
    // (Tu código... no necesita cambios)
  };

  const handleCompleteTask = (taskId) => {
    // (Tu código... no necesita cambios)
  };

  const handleMarkAsRead = (notificationId) => {
    // (Tu código... no necesita cambios)
  };

  const handleSaveInspectionModule = (alertId, partialInspectionData, finalize = false) => {
    // (Tu código... no necesita cambios)
  };
  
  const handleRegisterTechnician = (name, zone) => {
    // (Tu código... no necesita cambios)
  };
  
  const handleUpdateTechnicianProfile = (specialties) => {
    // (Tu código... no necesita cambios)
  };

  // --- ¡NUEVA FUNCIÓN AÑADIDA! ---
  const handleRegisterFinca = (fincaData) => {
    setLoading(true);

    // 1. Actualizar la lista de 'producers'
    const newProducersList = producers.map(producer => {
      if (producer.id === currentUser.id) {
        return {
          ...producer,
          fincas: [...producer.fincas, fincaData] // Añade la nueva finca
        };
      }
      return producer;
    });
    setProducers(newProducersList);

    // 2. Actualizar el 'currentUser' para que vea la finca inmediatamente
    setCurrentUser(prev => ({
      ...prev,
      fincas: [...prev.fincas, fincaData]
    }));
    
    // 3. Actualizar la lista plana de 'fincas' (usada en otros reportes)
    const newFincasFlat = newProducersList.flatMap(p => 
      p.fincas.map(f => ({...f, producerId: p.id, owner: p.owner}))
    );
    setFincas(newFincasFlat);
    
    // 4. Mostrar modal y navegar de vuelta al perfil
    setTimeout(() => {
      setLoading(false);
      setModal({ show: true, message: 'Finca registrada con éxito.', type: 'success' });
      handleNavigate('producerProfile'); 
    }, 500);
  };
  // --- FIN DE NUEVA FUNCIÓN ---


  // --- Renderizado Condicional de Páginas ---

  const renderPage = () => {
    // Públicas
    if (currentPage === 'login') {
      return <LoginScreen onLogin={handleLogin} />;
    }
    if (currentPage === 'visitorAccessPage') {
      // ... (Tu código de visitorAccessPage)
    }
    if (currentPage === 'visitorCheckIn') {
      // ... (Tu código de visitorCheckIn)
    }

    // Privadas
    if (!userRole || !currentUser) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    switch (userRole) {
      case 'manager':
        switch (currentPage) {
          // (Tu código de manager... no necesita cambios)
        }
        break; // Añadido

      case 'producer':
        switch (currentPage) {
          case 'producerDashboard':
            return <ProducerDashboard producer={currentUser} alerts={alerts} visits={visits} tasks={tasks} technicians={technicians} onNavigate={handleNavigate} />;
          case 'reportAlert':
            return <AlertReportForm producer={currentUser} onSubmitAlert={handleSubmitAlert} setModal={setModal} />;
          case 'producerAlertList': 
            return <ProducerAlertList producer={currentUser} alerts={alerts} technicians={technicians} onNavigate={handleNavigate} pageData={pageData} />;
          case 'visitorApproval': 
            const myFincaIds = currentUser.fincas.map(f => f.id);
            const visitsToMe = visits.filter(v => myFincaIds.includes(v.fincaId));
            return <VisitorApprovalList producer={currentUser} visits={visitsToMe} onApproveVisit={handleApproveVisit} onRejectVisit={handleRejectVisit} pageData={pageData} />;
          
          case 'producerVisitorLog': 
            const myFincaIdsLog = currentUser.fincas.map(f => f.id);
            const producerLog = visits.filter(v => myFincaIdsLog.includes(v.fincaId));
            return <ProducerVisitorLog producerLog={producerLog} onGeneratePDF={handleGeneratePDF} producer={currentUser} />;
          
          case 'producerTasks':
            return <ProducerTasks producer={currentUser} tasks={tasks} onCompleteTask={handleCompleteTask} onShowTraining={handleShowTraining} pageData={pageData} />;
          case 'producerCertification':
            // --- ¡CORRECCIÓN! Pasando las props necesarias ---
            return <ProducerCertification 
              certificationHistory={certificationHistory}
              onShowHistoryModal={setCertHistoryModal} 
            />;
          case 'notifications':
            return <NotificationCenter
              notifications={notifications.filter(n => n.producerId === currentUser.id)}
              onMarkAsRead={handleMarkAsRead}
              onNavigate={handleNavigate}
            />;
          
          // --- ¡CASO CORREGIDO! ---
          case 'producerProfile': 
            // Ahora pasamos onNavigate, lo que corrige el bug
            return <ProducerProfile 
              producer={currentUser} 
              onNavigate={handleNavigate} 
            />;
          
          // --- ¡NUEVO CASO AÑADIDO! ---
          case 'fincaRegistration':
            return <FincaRegistration 
              onRegisterFinca={handleRegisterFinca} 
              onNavigate={handleNavigate}
              setModal={setModal}
            />;
            
          default:
            return <ProducerDashboard producer={currentUser} alerts={alerts} visits={visits} tasks={tasks} technicians={technicians} onNavigate={handleNavigate} />;
        }
        break; // Añadido

      case 'technician':
        switch (currentPage) {
          // (Tu código de technician... no necesita cambios)
        }
        break; // Añadido

      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  const isLoginOrPublicForm = currentPage === 'login' || currentPage === 'visitorAccessPage' || currentPage === 'visitorCheckIn' || currentPage === 'fincaRegistration'; // Añadido fincaRegistration

  const unreadNotifications = userRole === 'producer'
    ? notifications.filter(n => n.producerId === currentUser?.id && !n.read).length
    : 0;

  // --- ESTRUCTURA PRINCIPAL DE LA APP (con Sidebar) ---
  return (
    <>
      {loading && <LoadingSpinner />}
      
      {modal.show && (
        <Modal
          message={modal.message}
          type={modal.type}
          onClose={() => setModal({ show: false, message: '' })}
        />
      )}
      
      {trainingModalTask && (
        <Modal
          title={trainingModalTask.title}
          onClose={() => setTrainingModalTask(null)}
          size="large"
        >
          {/* ... (código del modal de capacitación) ... */}
        </Modal>
      )}
      
      {registerTechModal && (
        <Modal
          title="Registrar Nuevo Técnico"
          onClose={() => setRegisterTechModal(false)}
        >
          <RegisterTechnicianForm
            onSubmit={handleRegisterTechnician}
            onCancel={() => setRegisterTechModal(false)}
          />
        </Modal>
      )}
      
      {/* --- ¡MODAL DE CERTIFICACIÓN AÑADIDO! --- */}
      {certHistoryModal && (
        <Modal
          title={`Desglose de la Revisión: ${certHistoryModal.date}`}
          onClose={() => setCertHistoryModal(null)}
          size="large"
        >
          <div className="historyModalContent">
            <div className="historyModalHeader">
              <h2 className="h2">Promedio: {certHistoryModal.averageScore}%</h2>
              <span 
                className={`tag ${certHistoryModal.status === 'Aprobado' ? 'tag-aprobado' : 'tag-no-aprobado'}`}
              >
                {certHistoryModal.status}
              </span>
            </div>
            <p>Este fue el desglose de puntajes para esta revisión:</p>
            <div className="progressGrid">
              {MOCK_INSPECTION_MODULES.map(module => (
                <ProgressBar 
                  key={module.id}
                  label={`${module.id}. ${module.name}`}
                  score={certHistoryModal.breakdown[module.name] || 0}
                />
              ))}
            </div>
          </div>
        </Modal>
      )}
      
      {!isLoginOrPublicForm && (
        <Header
          userRole={userRole}
          currentUser={currentUser} 
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          unreadNotifications={unreadNotifications}
        />
      )}
      
      {!isLoginOrPublicForm && (
        <Sidebar
          userRole={userRole}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
      )}
      
      <main className={!isLoginOrPublicForm ? 'mainContentWithSidebar' : 'mainContentFull'}>
        {renderPage()}
      </main>
    </>
  );
}

export default App;