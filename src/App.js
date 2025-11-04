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
  MOCK_FINCAS_FLAT 
} from './data/mockData';
import { MOCK_TASK_TEMPLATES } from './data/constants';
import { calculateRisk } from './utils/riskCalculator';

// --- SECCIÓN 3: IMPORTAR COMPONENTES REUTILIZABLES ---
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Modal from './components/ui/Modal';

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
// --- ¡¡ESTA LÍNEA ES CRUCIAL!! ---
// Asegúrate de que es así (sin llaves)
import ProducerAlertList from './views/ProducerAlertList/ProducerAlertList'; 

// --- IMPORTACIONES DE FLUJO DE VISITAS ---
import VisitorAccessPage from './views/VisitorAccess/VisitorAccessPage';
import VisitorCheckIn from './views/VisitorCheckIn/VisitorCheckIn';
import ProducerVisitorLog from './views/ProducerVisitorLog/ProducerVisitorLog';

// --- IMPORTACIONES PARA GENERACIÓN DE PDF ---
import { jsPDF } from 'jspdf';

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
      setCurrentUser(technicians[0]);
      setCurrentPage(page || 'technicianSchedule');
    } else if (role === 'public') {
      setCurrentUser(null);
      if (page === 'visitorForm') {
        setCurrentPage('visitorAccessPage'); 
      } else if (page === 'visitorCheckIn') {
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
    setLoading(true);
    try {
      const doc = new jsPDF();
      let yPos = 20; 
      const lineHeight = 7;
      const margin = 15;
      const imgWidth = 80;
      const imgHeight = 60;

      doc.setFontSize(22);
      doc.setTextColor(30, 70, 40); 
      doc.text("Reporte de Visita Fitosanitaria", margin, yPos);
      yPos += 10;
      doc.setDrawColor(166, 227, 75); 
      doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
      yPos += lineHeight + 5;

      doc.setFontSize(12);
      doc.setTextColor(50, 50, 50); 
      doc.text(`ID Visita: ${visit.id}`, margin, yPos); yPos += lineHeight;
      
      const fincaName = fincas.find(f => f.id === visit.fincaId)?.name || 'N/A';
      doc.text(`Finca: ${fincaName}`, margin, yPos); yPos += lineHeight;

      doc.text(`Visitante: ${visit.name}`, margin, yPos); yPos += lineHeight;
      doc.text(`Cédula: ${visit.idNumber}`, margin, yPos); yPos += lineHeight;
      doc.text(`Compañía: ${visit.company}`, margin, yPos); yPos += lineHeight;
      doc.text(`Motivo: ${visit.purpose}`, margin, yPos); yPos += lineHeight;
      doc.text(`Cadena Valor: ${visit.valueChain}`, margin, yPos); yPos += lineHeight;
      doc.text(`Riesgo Calculado: ${visit.risk || 'N/A'}`, margin, yPos); yPos += lineHeight + 5;

      doc.text(`--- Detalles de Tiempo ---`, margin, yPos); yPos += lineHeight;
      doc.text(`Solicitó Entrada: ${visit.entryTime ? new Date(visit.entryTime).toLocaleString() : 'N/A'}`, margin, yPos); yPos += lineHeight;
      doc.text(`Solicitó Salida: ${visit.exitTime ? new Date(visit.exitTime).toLocaleString() : 'N/A'}`, margin, yPos); yPos += lineHeight;
      doc.text(`Ingreso Real: ${visit.checkIn ? new Date(visit.checkIn).toLocaleString() : 'N/A'}`, margin, yPos); yPos += lineHeight;
      doc.text(`Salida Real: ${visit.checkOut ? new Date(visit.checkOut).toLocaleString() : 'N/A'}`, margin, yPos); yPos += lineHeight + 10;

      doc.setFontSize(16);
      doc.setTextColor(30, 70, 40);
      doc.text("Evidencia Fotográfica y Firma", margin, yPos);
      yPos += 10;
      doc.line(margin, yPos, doc.internal.pageSize.width - margin, yPos);
      yPos += lineHeight + 5;

      if (visit.visitorPhoto) {
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text("Foto del Visitante:", margin, yPos);
        yPos += lineHeight;
        doc.addImage(visit.visitorPhoto, 'JPEG', margin, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 10;
      } else {
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text("Foto del Visitante: No Capturada", margin, yPos);
        yPos += lineHeight + 10;
      }

      if (visit.vehiclePhoto) {
        if (yPos + imgHeight + lineHeight > doc.internal.pageSize.height - margin) {
            doc.addPage();
            yPos = margin + lineHeight; 
        }
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text("Foto del Vehículo/Placa:", margin, yPos);
        yPos += lineHeight;
        doc.addImage(visit.vehiclePhoto, 'JPEG', margin, yPos, imgWidth, imgHeight);
        yPos += imgHeight + 10;
      } else {
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text("Foto del Vehículo/Placa: No Capturada", margin, yPos);
        yPos += lineHeight + 10;
      }

      if (visit.signature) {
        if (yPos + imgHeight + lineHeight > doc.internal.pageSize.height - margin) {
            doc.addPage();
            yPos = margin + lineHeight; 
        }
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text("Firma del Visitante:", margin, yPos);
        yPos += lineHeight;
        doc.addImage(visit.signature, 'PNG', margin, yPos, imgWidth, imgHeight / 2); 
        yPos += imgHeight / 2 + 10;
      } else {
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        doc.text("Firma del Visitante: No Capturada", margin, yPos);
        yPos += lineHeight + 10;
      }

      doc.save(`Reporte_Visita_${visit.name}_${visit.id}.pdf`);
      showLoadingAndModal('PDF generado con éxito.', 'success');

    } catch (error) {
      console.error("Error al generar el PDF:", error);
      setModal({ show: true, message: `Error al generar el PDF: ${error.message}`, type: 'error' });
    } finally {
      setLoading(false);
    }
  };


  const handleAssignAlert = (alertId, comment, diseases, techId, date, priority) => {
    setLoading(true);
    setTimeout(() => {
      let producerId = '';
      let farmName = '';
      setAlerts(prev => prev.map(a => {
        if (a.id === alertId) {
          producerId = a.producerId;
          farmName = a.farmName; 
          return { ...a, status: 'assigned', managerComment: comment, possibleDisease: diseases, techId: techId, visitDate: date, priority: priority };
        }
        return a;
      }));
      setTechnicians(prev => prev.map(t =>
        t.id === techId
          ? { ...t, workload: (t.workload || 0) + 1 }
          : t
      ));
      
      const techName = technicians.find(t => t.id === techId)?.name || 'un técnico';
      createNotification(producerId, `El Gerente ha asignado la Alerta #${alertId} (${farmName}). ${techName} visitará su finca el ${date}.`, 'producerDashboard');
      
      setLoading(false);
      setModal({ show: true, message: 'Alerta asignada con éxito.', type: 'success' });
      handleNavigate('alertTriage');
    }, 500);
  };

  const handleCompleteTask = (taskId) => {
    setLoading(true);
    setTimeout(() => {
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, status: 'completed' } : t
      ));
      showLoadingAndModal('¡Tarea completada!', 'success');
    }, 500);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => prev.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const handleSaveInspectionModule = (alertId, partialInspectionData, finalize = false) => {
    setLoading(true);
    setTimeout(() => {
      let producerId = '';
      let techId = '';
      let farmName = '';

      setAlerts(prev => prev.map(a => {
        if (a.id === alertId) {
          producerId = a.producerId;
          techId = a.techId;
          farmName = a.farmName;
          
          return { 
            ...a, 
            inspectionData: partialInspectionData, 
            status: finalize ? 'completed' : a.status 
          };
        }
        return a;
      }));
      
      if (finalize) {
        if (techId) {
          setTechnicians(prev => prev.map(t =>
            t.id === techId && t.workload > 0
              ? { ...t, workload: t.workload - 1 }
              : t
          ));
        }
        
        const newTasks = [];
        const ratings = partialInspectionData.audit?.ratings || {};
        MOCK_INSPECTION_MODULES.forEach(module => {
          module.questions.forEach(q => {
            if (ratings[q.id] && ratings[q.id] < 3) {
              const template = MOCK_TASK_TEMPLATES[q.id];
              if (template) {
                newTasks.push({
                  id: `t-${alertId}-${q.id}`, 
                  ...template,
                  producerId: producerId, 
                  alertId: alertId,
                  questionId: q.id,
                  status: 'pending',
                  createdAt: new Date().toISOString(),
                });
              }
            }
          });
        });
        
        setTasks(prev => [...prev, ...newTasks]);
        createNotification(producerId, `La inspección de la Alerta #${alertId} (${farmName}) ha sido completada. Revise los resultados y las ${newTasks.length} nuevas tareas.`, 'producerDashboard');
        showLoadingAndModal(`Inspección enviada. ${newTasks.length} tareas generadas. Notificando al productor y gerente.`, 'success');
        handleNavigate('technicianSchedule');
      } else {
        setLoading(false);
      }
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
            return <TechnicianControl technicians={technicians} onNavigate={handleNavigate} />;
          case 'visitorReport':
            return <VisitorReport visits={visits} fincas={fincas} />;
          case 'alertTriage':
            return <AlertTriageView alerts={alerts} technicians={technicians} onAssignAlert={handleAssignAlert} setModal={setModal} />;
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
          
          // --- ¡¡ESTA ES LA RUTA QUE FALLA!! ---
          // App.js intenta renderizar "ProducerAlertList" aquí.
          // Si el "import" de la línea 46 falló, la app crashea.
          case 'producerAlertList': 
            return <ProducerAlertList producer={currentUser} alerts={alerts} technicians={technicians} onNavigate={handleNavigate} />;
          
          case 'visitorApproval': 
            const myFincaIds = currentUser.fincas.map(f => f.id);
            const visitsToMe = visits.filter(v => myFincaIds.includes(v.fincaId));
            return <VisitorApprovalList producer={currentUser} visits={visitsToMe} onApproveVisit={handleApproveVisit} onRejectVisit={handleRejectVisit} />;
          case 'producerVisitorLog': 
            const myFincaIdsLog = currentUser.fincas.map(f => f.id);
            const producerLog = visits.filter(v => myFincaIdsLog.includes(v.fincaId));
            return <ProducerVisitorLog producerLog={producerLog} onGeneratePDF={handleGeneratePDF} />;
          case 'producerTasks':
            return <ProducerTasks producer={currentUser} tasks={tasks} onCompleteTask={handleCompleteTask} onShowTraining={handleShowTraining} />;
          case 'producerCertification':
            return <ProducerCertification />;
          case 'notifications':
            return <NotificationCenter
              notifications={notifications.filter(n => n.producerId === currentUser.id)}
              onMarkAsRead={handleMarkAsRead}
              onNavigate={handleNavigate}
            />;
          case 'producerProfile': 
            return <ProducerProfile producer={currentUser} />;
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
          default:
            return <TechnicianSchedule technician={currentUser} alerts={alerts} onNavigate={handleNavigate} />;
        }

      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

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
          {trainingModalTask.description.split('\n').map((line, index) => (
            <p key={index} style={{marginBottom: '10px'}}>{line}</p>
          ))}
          <a 
            href={trainingModalTask.trainingUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              backgroundColor: '#005a3a',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '600',
              marginTop: '15px'
            }}
          >
            Abrir Módulo Externo
          </a>
        </Modal>
      )}
      
      {!isLoginOrPublicForm && (
        <Header
          userRole={userRole}
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
          onLogout={handleLogout}
        />
      )}
      
      <main className={!isLoginOrPublicForm ? 'mainContentWithSidebar' : 'mainContentFull'}>
        {renderPage()}
      </main>
    </>
  );
}

export default App;