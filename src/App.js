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
  MOCK_CERTIFICATION_HISTORY
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
import ProgressBar from './components/ui/ProgressBar/ProgressBar'; 

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
import FincaRegistration from './views/FincaRegistration/FincaRegistration'; 

// --- IMPORTACIONES DE FLUJO DE VISITAS ---
import VisitorAccessPage from './views/VisitorAccess/VisitorAccessPage';
import VisitorCheckIn from './views/VisitorCheckIn/VisitorCheckIn';
import ProducerVisitorLog from './views/ProducerVisitorLog/ProducerVisitorLog';

// --- IMPORTACIONES PARA GENERACIÓN DE PDF ---
import { jsPDF } from 'jspdf';


// --- COMPONENTE INTERNO: Formulario de Registro de Técnico ---
const RegisterTechnicianForm = ({ onSubmit, onCancel }) => {
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
  const [certHistoryModal, setCertHistoryModal] = useState(null); 


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
  const [certificationHistory, setCertificationHistory] = useState(MOCK_CERTIFICATION_HISTORY);


  // --- Efecto para generar tareas iniciales (basado en mocks) ---
  useEffect(() => {
    const initialTasks = [];
    const completedAlerts = MOCK_ALERTS.filter(a => a.status === 'completed' && a.inspectionData?.audit?.ratings);

    completedAlerts.forEach(alert => {
      const ratings = alert.inspectionData.audit.ratings;
      MOCK_INSPECTION_MODULES.forEach(module => {
        module.questions.forEach(q => {
          if (ratings[q.id] && ratings[q.id] < 3) {
            const template = MOCK_TASK_TEMPLATES[q.id];
            if (template && !tasks.find(t => t.id === `t-${alert.id}-${q.id}`)) {
              initialTasks.push({
                id: `t-${alert.id}-${q.id}`,
                ...template,
                producerId: alert.producerId,
                alertId: alert.id,
                questionId: q.id,
                status: 'pending',
                createdAt: new Date().toISOString(),
              });
            }
          }
        });
      });
    });
    if (initialTasks.length > 0) {
      setTasks(prev => [...prev, ...initialTasks]);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // --- Lógica de Negocio (Handlers) ---

  const showLoadingAndModal = (message, type = 'success', duration = 500) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModal({ show: true, message, type });
    }, duration);
  };

  const createNotification = (producerId, text, link) => {
    const newNotif = {
      id: `n${Date.now()}`,
      producerId,
      text,
      link,
      date: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleShowTraining = (task) => {
    setTrainingModalTask(task);
  };

  const handleLogin = (role, page = null) => {
    setUserRole(role);
    if (role === 'manager') {
      setCurrentUser({ id: 'm1', name: 'Gerente Palmar' });
      setCurrentPage(page || 'managerDashboard');
    } else if (role === 'producer') {
      setCurrentUser(producers[0]);
      setCurrentPage(page || 'producerDashboard');
    } else if (role === 'technician') {
      const techUser = technicians[0];
      setCurrentUser(techUser);
      setCurrentPage(page || 'technicianSchedule');
    } else if (role === 'public') {
      setCurrentUser(null);
      if (page === 'visitorForm') {
        setCurrentPage('visitorAccessPage'); 
      } else if (page === 'visitorCheckIn') { // Aseguramos que la 'I' sea mayúscula
        setCurrentPage('visitorCheckIn'); 
      }
    } else {
      setCurrentUser(null);
      setCurrentPage('login');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentUser(null);
    setCurrentPage('login');
    setPageData(null);
  };

  const handleNavigate = (page, data = null) => {
    if (page === 'logout') {
      handleLogout();
      return;
    }
    setCurrentPage(page);
    setPageData(data); 
  };
  
  const handleSubmitAlert = (newAlert) => {
    setLoading(true);
    setTimeout(() => {
      const alertWithId = { ...newAlert, id: `a${Date.now()}` };
      setAlerts(prev => [alertWithId, ...prev]);
      createNotification(newAlert.producerId, `Tu Alerta #${alertWithId.id} (${newAlert.farmName}) ha sido recibida.`, 'producerDashboard');
      setLoading(false);
      setModal({ show: true, message: 'Alerta enviada con éxito. El gerente será notificado.', type: 'success' });
      handleNavigate('producerDashboard');
    }, 500);
  };

  const handleSubmitVisitRequest = (requestData) => {
    return new Promise((resolve) => { 
      setLoading(true);
      setTimeout(() => {
        const fincaData = fincas.find(f => f.id === requestData.fincaId);
        const producerId = fincaData ? fincaData.producerId : null;
        const newVisit = {
          id: `V-${requestData.fincaId}-${Date.now()}-${requestData.id.slice(-3)}`,
          producerId: producerId, 
          fincaId: requestData.fincaId, 
          name: requestData.name,
          idNumber: requestData.id,
          company: requestData.company,
          purpose: requestData.purpose,
          valueChain: requestData.valueChain,
          entryTime: requestData.entryTime, 
          exitTime: requestData.exitTime,   
          status: 'PENDING',
          qrData: null,
          risk: null,
          checkIn: null, 
          checkOut: null, 
          signature: null,
          visitorPhoto: null, 
          vehiclePhoto: null, 
        };
        setVisits(prev => [newVisit, ...prev]);
        if (producerId) {
           createNotification(producerId, `Nueva solicitud de visita de ${newVisit.name} para ${fincaData.name}.`, 'visitorApproval');
        }
        setLoading(false);
        resolve(true); 
      }, 500);
    });
  };

  const handleApproveVisit = (visitId, potentialRisk) => { 
    setLoading(true);
    setTimeout(() => {
      let producerId = '';
      let visitName = '';
      setVisits(prev => prev.map(v => {
        if (v.id === visitId) {
          producerId = v.producerId;
          visitName = v.name;
          return {
            ...v,
            status: 'APPROVED',
            risk: potentialRisk, 
            qrData: `${v.id}|${v.idNumber}|${potentialRisk.toUpperCase()}`, 
          };
        }
        return v;
      }));
      if (producerId) {
        createNotification(producerId, `Has aprobado la visita de ${visitName}.`, 'visitorApproval');
      }
      showLoadingAndModal('Visita aprobada. Se generó el código QR.', 'success');
    }, 500);
  };

  const handleRejectVisit = (visitId) => {
    setLoading(true);
    setTimeout(() => {
      setVisits(prev => prev.map(v => v.id === visitId ? { ...v, status: 'DENIED' } : v));
      showLoadingAndModal('Visita rechazada.', 'info');
      setLoading(false);
    }, 500);
  };

  const handleScanQr = (qrData) => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      setTimeout(() => {
        const now = new Date().toISOString();
        const visitIndex = visits.findIndex(v => v.qrData === qrData);
        if (visitIndex === -1) {
          setLoading(false);
          reject(new Error("QR Inválido. La visita no se encuentra."));
          return;
        }
        const originalVisit = visits[visitIndex];
        let updatedVisit;
        if (originalVisit.status === 'APPROVED') {
          updatedVisit = { ...originalVisit, status: 'CHECKED_IN', checkIn: now, scannedTime: now };
        } else if (originalVisit.status === 'CHECKED_IN') {
          updatedVisit = { ...originalVisit, status: 'CHECKED_OUT', checkOut: now, scannedTime: now };
        } else if (originalVisit.status === 'CHECKED_OUT') {
          setLoading(false);
          reject(new Error("Esta visita ya fue registrada como SALIDA."));
          return;
        } else {
          setLoading(false);
          reject(new Error(`El estado de esta visita es '${originalVisit.status}'. No se puede escanear.`));
          return;
        }
        setVisits(prev => prev.map((v, index) => index === visitIndex ? updatedVisit : v));
        setLoading(false);
        resolve(updatedVisit); 
      }, 500);
    });
  };
  
  const handleCaptureEvidence = (visitId, type, data) => {
    setVisits(prev => prev.map(v => 
      v.id === visitId ? { ...v, [type]: data } : v
    ));
    console.log(`Evidencia [${type}] guardada para ${visitId}`);
  };

  const handleGeneratePDF = async (visit) => {
    // (Código existente... no se necesita cambiar)
  };

  const handleAssignAlert = (alertId, comment, diseases, techId, date, priority) => {
    // (Código existente... no se necesita cambiar)
  };

  const handleCompleteTask = (taskId) => {
    // (Código existente... no se necesita cambiar)
  };

  const handleMarkAsRead = (notificationId) => {
    // (Código existente... no se necesita cambiar)
  };

  const handleSaveInspectionModule = (alertId, partialInspectionData, finalize = false) => {
    // (Código existente... no se necesita cambiar)
  };
  
  const handleRegisterTechnician = (name, zone) => {
    const newTech = { 
      id: `t${Date.now()}`, 
      name, 
      zone, 
      specialties: [], 
      workload: 0 
    };
    setTechnicians(prev => [...prev, newTech]);
    setRegisterTechModal(false);
    showLoadingAndModal('Técnico registrado con éxito.', 'success');
  };
  
  const handleUpdateTechnicianProfile = (specialties) => {
    setLoading(true);
    setTechnicians(prev => prev.map(tech => 
      tech.id === currentUser.id ? { ...tech, specialties } : tech
    ));
    setCurrentUser(prev => ({ ...prev, specialties }));
    setTimeout(() => {
      setLoading(false);
      setModal({ show: true, message: 'Perfil actualizado con éxito.', type: 'success' });
    }, 500);
  };

  const handleRegisterFinca = (fincaData) => {
    setLoading(true);

    const newProducersList = producers.map(producer => {
      if (producer.id === currentUser.id) {
        return {
          ...producer,
          fincas: [...producer.fincas, fincaData]
        };
      }
      return producer;
    });
    setProducers(newProducersList);

    setCurrentUser(prev => ({
      ...prev,
      fincas: [...prev.fincas, fincaData]
    }));
    
    const newFincasFlat = newProducersList.flatMap(p => 
      p.fincas.map(f => ({...f, producerId: p.id, owner: p.owner}))
    );
    setFincas(newFincasFlat);
    
    setTimeout(() => {
      setLoading(false);
      setModal({ show: true, message: 'Finca registrada con éxito.', type: 'success' });
      handleNavigate('producerProfile'); 
    }, 500);
  };


  // --- Renderizado Condicional de Páginas ---

  const renderPage = () => {
    // Públicas
    if (currentPage === 'login') {
      return <LoginScreen onLogin={handleLogin} />;
    }
    if (currentPage === 'visitorAccessPage') {
      const myApprovedVisits = visits.filter(v => v.idNumber === "12345"); 
      return (
        <VisitorAccessPage
          onNewRequest={handleSubmitVisitRequest}
          approvedVisits={myApprovedVisits} 
          onNavigate={handleNavigate}
        />
      );
    }
    if (currentPage === 'visitorCheckIn') {
      return (
        <VisitorCheckIn
          onNavigate={handleNavigate}
          onScanQr={handleScanQr}
          onCaptureEvidence={handleCaptureEvidence}
          setModal={setModal}
        />
      );
    }

    // Privadas
    if (!userRole || !currentUser) {
      return <LoginScreen onLogin={handleLogin} />;
    }

    switch (userRole) {
      case 'manager':
        switch (currentPage) {
          case 'managerDashboard':
            return <ManagerDashboard alerts={alerts} visits={visits} technicians={technicians} onNavigate={handleNavigate} />;
          case 'technicianControl':
            return <TechnicianControl technicians={technicians} onNavigate={handleNavigate} onShowRegisterModal={() => setRegisterTechModal(true)} />;
          case 'visitorReport':
            return <VisitorReport visits={visits} fincas={fincas} pageData={pageData} />;
          case 'alertTriage':
            return <AlertTriageView alerts={alerts} technicians={technicians} onAssignAlert={handleAssignAlert} setModal={setModal} pageData={pageData} />; 
          case 'technicianSchedule':
            return <TechnicianSchedule technician={pageData || technicians[0]} alerts={alerts} onNavigate={handleNavigate} />;
          default:
            return <ManagerDashboard alerts={alerts} visits={visits} technicians={technicians} onNavigate={handleNavigate} />;
        }

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
          case 'producerProfile': 
            return <ProducerProfile producer={currentUser} onNavigate={handleNavigate} />;
          
          case 'fincaRegistration':
            return <FincaRegistration 
              onRegisterFinca={handleRegisterFinca} 
              onNavigate={handleNavigate}
              setModal={setModal}
            />;
            
          default:
            return <ProducerDashboard producer={currentUser} alerts={alerts} visits={visits} tasks={tasks} technicians={technicians} onNavigate={handleNavigate} />;
        }

      case 'technician':
        switch (currentPage) {
          case 'technicianSchedule':
            return <TechnicianSchedule technician={currentUser} alerts={alerts} onNavigate={handleNavigate} />;
          case 'technicianInspection':
            return <TechnicianInspectionCenter
              alert={pageData}
              onNavigate={handleNavigate}
              onSaveInspection={handleSaveInspectionModule}
              setModal={setModal}
            />;
          case 'technicianProfile':
            return <TechnicianProfile 
              currentUser={currentUser} 
              onSaveProfile={handleUpdateTechnicianProfile} 
            />;
          default:
            return <TechnicianSchedule technician={currentUser} alerts={alerts} onNavigate={handleNavigate} />;
        }

      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
  // Se ha añadido el '===' que faltaba
  const isLoginOrPublicForm = currentPage === 'login' || currentPage === 'visitorAccessPage' || currentPage === 'visitorCheckIn';

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
          // --- ¡ESTA ES LA CORRECCIÓN! ---
          onLogout={handleLogout} // Se añade la prop que faltaba
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