// Contiene los datos simulados de la aplicación (Sección 2 del monolito)

export const MOCK_PRODUCERS = [
  { id: 'p1', name: 'Finca Santa Rita', owner: 'Juan Valdez' },
  { id: 'p2', name: 'Hacienda El Sol', owner: 'Maria Gomez' },
];

export const MOCK_TECHNICIANS_PROFILES = [
  { id: 't1', name: 'Carlos Ruiz', zone: 'Norte' },
  { id: 't2', name: 'Ana Mendoza', zone: 'Sur' },
  { id: 't3', name: 'Luis Torres', zone: 'Norte' },
];

export const MOCK_ALERTS = [
  { id: 'a1', producerId: 'p1', farmName: 'Finca Santa Rita', date: '2024-05-01', parts: {'Hoja': true}, symptoms: ['Amarillamiento de hojas bajas'], photos: {}, location: { lat: -2.14, lon: -79.9 }, status: 'pending', techId: null, visitDate: null, priority: null, managerComment: null, possibleDisease: null, inspectionData: null },
  { id: 'a2', producerId: 'p2', farmName: 'Hacienda El Sol', date: '2024-05-03', parts: {'Fruto': true}, symptoms: ['Frutos pequeños o deformados'], photos: {}, location: { lat: -2.2, lon: -79.8 }, status: 'pending', techId: null, visitDate: null, priority: null, managerComment: null, possibleDisease: null, inspectionData: null },
  { id: 'a3', producerId: 'p1', farmName: 'Finca Santa Rita', date: '2024-04-20', parts: {'Pseudotallo': true}, symptoms: ['Exudado viscoso al presionar corte'], photos: {}, location: { lat: -2.145, lon: -79.905 }, status: 'completed', techId: 't1', visitDate: '2024-04-25', priority: 'Alta', managerComment: 'Revisar urgente Moko', possibleDisease: ['Moko'], 
    inspectionData: {
      audit: { 
        status: 'Completado',
        ratings: { '1.1': 5, '1.2': 2, '1.3': 4, '2.1': 5, '2.2': 3, '2.3': 3, '3.1': 5, '3.2': 4, '3.3': 5, '4.1': 5, '4.2': 4, '4.3': 5, '5.1': 3, '5.2': 5, '5.3': 5 },
        evidence: { '1.2': 'data:image/png;base64,EVIDENCIA-MOCK-1.2' },
      },
      drone: { 
        status: 'Completado',
        data: { altitude: '100', plan: 'libre', hectares: '10', observations: 'Vuelo sobre lote 5' },
      },
      plant: { 
        status: 'Completado',
        data: { 
          diagnosis: ['Moko'], 
          actions: ['Cuarentena', 'Muestreo'],
          incidence: 20, 
          severity: 10,  
          recommendations: 'Iniciar protocolo de bioseguridad Nivel 5. Eliminar plantas afectadas y aplicar cal.' 
        }
      }
    }
  },
  { id: 'a4', producerId: 'p1', farmName: 'Finca Santa Rita', date: '2024-05-05', parts: {'Hoja': true}, symptoms: ['Marchitez o colapso de hojas'], photos: {}, location: { lat: -2.142, lon: -79.901 }, status: 'assigned', techId: 't1', visitDate: '2024-11-01', priority: 'Alta', managerComment: 'Posible Erwinia, revisar urgente.', possibleDisease: ['Erwinia'], inspectionData: null },
];

export const MOCK_VISITS = [
  { id: 'v1', producerId: 'p1', visitorName: 'Carlos R.', company: 'AgroInsumos S.A.', reason: 'Entrega de fertilizantes', type: 'Entrega agroinsumos', date: '2024-11-01', status: 'pending', qrIn: null, qrOut: null, checkIn: null, checkOut: null, signature: null },
  { id: 'v2', producerId: 'p1', visitorName: 'Ana Gomez', company: 'Fumigax', reason: 'Fumigación programada', type: 'Fumigación', date: '2024-11-02', status: 'approved', qrIn: 'QR-IN-V2-XYZ', qrOut: 'QR-OUT-V4-456', checkIn: null, checkOut: null, signature: null },
  { id: 'v3', producerId: 'p2', visitorName: 'Luis Peña', company: 'Cartonera Nacional', reason: 'Entrega de cartón', type: 'Entrega cartón', date: '2024-11-01', status: 'pending', qrIn: null, qrOut: null, checkIn: null, checkOut: null, signature: null },
];

export const MOCK_TASKS = []; 

export const MOCK_NOTIFICATIONS = [
  { id: 'n1', producerId: 'p1', date: '2024-04-22', text: 'El Gerente ha asignado la Alerta #a3. El técnico Carlos Ruiz visitará su finca el 2024-04-25.', read: true, link: 'producerDashboard' },
  { id: 'n2', producerId: 'p1', date: '2024-04-25', text: 'La inspección de la Alerta #a3 ha sido completada. Revise los resultados y tareas.', read: true, link: 'producerDashboard' },
  { id: 'n3', producerId: 'p1', date: '2024-05-05', text: 'Su Alerta #a4 ha sido recibida y está siendo revisada por el gerente.', read: true, link: 'producerDashboard' },
  { id: 'n4', producerId: 'p1', date: '2024-05-06', text: 'El Gerente ha asignado la Alerta #a4. El técnico Carlos Ruiz visitará su finca el 2024-11-01.', read: false, link: 'producerDashboard' },
  { id: 'n5', producerId: 'p1', date: '2024-10-30', text: 'La solicitud de visita de Carlos R. (AgroInsumos S.A.) está pendiente de aprobación.', read: false, link: 'visitorApproval' },
];

export const MOCK_INSPECTION_MODULES = [
  { id: '1', name: 'Ingreso', questions: [
    { id: '1.1', text: '¿Existe control y registro de ingreso de personas y vehículos?' },
    { id: '1.2', text: '¿Se realiza desinfección de calzado, llantas y herramientas?' },
    { id: '1.3', text: '¿El personal usa ropa exclusiva para la finca o equipo limpio?' },
  ]},
  { id: '2', name: 'Producción', questions: [
    { id: '2.1', text: '¿Se limpian y desinfectan las herramientas después del uso?' },
    { id: '2.2', text: '¿Se controla el ingreso de personas ajenas a las áreas de cultivo?' },
    { id: '2.3', text: '¿Se identifican y aíslan plantas sospechosas o enfermas?' },
  ]},
  { id: '3', name: 'Infraestructura', questions: [
    { id: '3.1', text: '¿Los puntos de lavado y desinfección están operativos?' },
    { id: '3.2', text: '¿Se realiza limpieza frecuente en zonas comunes (bodegas, baños, comedores)?' },
    { id: '3.3', text: '¿El agua utilizada proviene de una fuente segura y tratada?' },
  ]},
  { id: '4', name: 'Empaque', questions: [
    { id: '4.1', text: '¿Se limpia y desinfecta el área de empaque antes de cada jornada?' },
    { id: '4.2', text: '¿Los materiales de empaque se almacenan en lugar limpio y cerrado?' },
    { id: '4.3', text: '¿Los vehículos que transportan fruta son inspeccionados y desinfectados antes del ingreso?' },
  ]},
  { id: '5', name: 'Gestión', questions: [
    { id: '5.1', text: '¿El personal ha recibido capacitación recente en bioseguridad?' },
    { id: '5.2', text: '¿Se mantiene registro de limpieza, ingreso y monitoreo de enfermedades?' },
    { id: '5.3', text: '¿Se dispone de productos de limpieza y desinfección aprobados?' },
  ]},
];