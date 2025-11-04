// src/data/constants.js

export const ALERT_SYMPTOMS_DATA = {
  'Externo': ['Amarillamiento de hojas bajas', 'Marchitez o colapso de hojas', 'Muerte apical / pseudotallo blando', 'Hojas jóvenes torcidas o con bordes secos'],
  'Fruto': ['Frutos pequeños o deformados', 'Pulpa con manchas marrón-rojizas', 'Exudado bacteriano ("ooze") en pedúnculo'],
  'Flor masculina': ['Necrosis o ennegrecimiento en el nudo floral'],
  'Pseudotallo': ['Amarillamiento de hojas bajas', 'Puntos café en haces vasculares longitudinales', 'Exudado viscoso al presionar corte'],
  'Hoja': ['Decoloración en pecíolos o base de hojas'],
  'Rizoma': ['Oscurecimiento en el corazón del rizoma'],
};

export const BANANA_DISEASES = ["Moko", "Erwinia", "Foc R4T", "Virosis", "Picudo", "Sigatoka Negra", "Mal de Panamá", "Pudrición de la corona", "Otro"];

export const TECHNICIAN_ACTIONS = ["Cuarentena", "Erradicación", "Muestreo", "Aplicación Química", "Control Biológico", "Recomendación Poda", "Otro"];

// --- NUEVAS CONSTANTES PARA VISITAS ---

export const VISIT_PURPOSES = [
  "Inspección",
  "Venta de Insumos",
  "Entrega de Cartón",
  "Transporte de Fruta",
  "Mantenimiento",
  "Visita Administrativa",
  "Otra Visita"
];

export const VALUE_CHAIN_CATEGORIES = [
  "Producción (Personal de Finca)",
  "Agroinsumos (Proveedor)",
  "Transporte (Logística)",
  "Exportación (Cliente/Auditor)",
  "Servicios (Contratista)",
  "Otro"
];

// --- FIN DE NUEVAS CONSTANTES ---

export const MOCK_TASK_TEMPLATES = {
 '1.2': { title: 'Reforzar Desinfección de Calzado', description: 'El puntaje en desinfección de calzado (1.2) fue bajo. Por favor, revise el módulo de capacitación sobre Protocolos de Ingreso.\n\nContenido simulado: Asegúrese de que todos los pediluvios estén operativos y con la solución desinfectante correcta (ej. Amonio Cuaternario al 5%).', trainingUrl: 'https://example.com/capacitacion/protocolos-ingreso' },
 '2.3': { title: 'Mejorar Aislamiento de Plantas', description: 'El puntaje en aislamiento de plantas (2.3) fue bajo. Complete el módulo sobre Detección Temprana.\n\nContenido simulado: Toda planta sospechosa debe ser marcada con cinta roja y aislada en un radio de 5 metros. Notificar inmediatamente.', trainingUrl: 'https://example.com/capacitacion/deteccion-temprana' },
 '5.1': { title: 'Capacitación de Personal', description: 'El puntaje en capacitación (5.1) fue bajo. Agende una nueva charla de bioseguridad para su equipo.\n\nContenido simulado: Realizar charla de repaso sobre Moko y Foc R4T con todo el personal de campo.', trainingUrl: 'https://example.com/capacitacion/manejo-personal' },
};

export const LYTIKS_LOGO_URL = 'https://i.imgur.com/y8lq2Y6.png'; // URL de ejemplo del logo de Lytiks