import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  Archive, 
  BarChart3, 
  Settings, 
  LogOut, 
  Plus, 
  Filter,
  CheckCircle2,
  AlertCircle,
  ArrowRightLeft,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  UserCircle,
  ClipboardList,
  Layers,
  Save,
  Trash2,
  MapPin,
  Box,
  TrendingDown,
  Target,
  Clock,
  Fuel,
  Activity,
  Users,
  Building2,
  DollarSign,
  Edit,
  X,
  Menu,
  Scale,
  FileText,
  Calendar,
  MessageSquare,
  Paperclip,
  CheckCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Iconos personalizados para marcadores
const vehicleIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const clientIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Componentes auxiliares
const Card = ({ children, style }) => (
  <div style={{ 
    backgroundColor: 'white', padding: '24px', borderRadius: '12px', 
    border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', ...style 
  }}>
    {children}
  </div>
);

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>
      <Card>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>USUARIO</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }} 
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CONTRASEÑA</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }} 
            />
          </div>
          <button 
            type="submit" 
            style={{ width: '100%', backgroundColor: '#e11d48', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Ingresar
          </button>
        </form>
      </Card>
    </div>
  );
};

// Simple in-memory store to share data between mockup components
const ERPStore = {
  accounts: [
    { id: 1, code: '1.1', name: 'Caja', type: 'Activo', center: 'General', currency: 'BOB', active: true },
    { id: 2, code: '4.1', name: 'Ventas', type: 'Ingreso', center: null, currency: 'BOB', active: true },
    { id: 3, code: '5.1', name: 'Costos de Ventas', type: 'Gasto', center: 'Producción', currency: 'BOB', active: true },
    { id: 4, code: '2.1', name: 'Proveedores', type: 'Pasivo', center: null, currency: 'BOB', active: true },
    { id: 5, code: '3.1', name: 'Capital', type: 'Patrimonio', center: null, currency: 'BOB', active: true },
    { id: 6, code: '6.1', name: 'Sueldos y Salarios', type: 'Gasto', center: 'General', currency: 'BOB', active: true }
  ],
  asientos: [
    {
      id: 1000,
      fecha: '2025-11-15',
      tipo: 'Factura',
      glosa: 'Venta noviembre',
      lines: [
        { cuenta: '1.1', centro: 'General', debito: 4000, credito: 0 },
        { cuenta: '4.1', centro: '', debito: 0, credito: 4000 }
      ],
      estado: 'aprobado',
      createdAt: '2025-11-15T10:00:00Z'
    },
    {
      id: 1001,
      fecha: '2025-12-01',
      tipo: 'Factura',
      glosa: 'Venta de productos',
      lines: [
        { cuenta: '1.1', centro: 'General', debito: 5000, credito: 0 },
        { cuenta: '4.1', centro: '', debito: 0, credito: 5000 }
      ],
      estado: 'aprobado',
      createdAt: '2025-12-01T10:00:00Z'
    },
    {
      id: 1002,
      fecha: '2025-12-05',
      tipo: 'Recibo',
      glosa: 'Pago a proveedores',
      lines: [
        { cuenta: '5.1', centro: 'Producción', debito: 2000, credito: 0 },
        { cuenta: '1.1', centro: 'General', debito: 0, credito: 2000 }
      ],
      estado: 'aprobado',
      createdAt: '2025-12-05T14:30:00Z'
    },
    {
      id: 1003,
      fecha: '2025-12-10',
      tipo: 'Factura',
      glosa: 'Compra de insumos',
      lines: [
        { cuenta: '2.1', centro: '', debito: 1500, credito: 0 },
        { cuenta: '1.1', centro: 'General', debito: 0, credito: 1500 }
      ],
      estado: 'aprobado',
      createdAt: '2025-12-10T09:15:00Z'
    },
    {
      id: 1004,
      fecha: '2025-12-15',
      tipo: 'Planilla',
      glosa: 'Pago de planilla diciembre',
      lines: [
        { cuenta: '6.1', centro: 'General', debito: 3500, credito: 0 },
        { cuenta: '1.1', centro: 'General', debito: 0, credito: 3500 }
      ],
      estado: 'aprobado',
      createdAt: '2025-12-15T16:00:00Z'
    },
    {
      id: 1005,
      fecha: '2026-01-02',
      tipo: 'Factura',
      glosa: 'Venta enero',
      lines: [
        { cuenta: '1.1', centro: 'General', debito: 3000, credito: 0 },
        { cuenta: '4.1', centro: '', debito: 0, credito: 3000 }
      ],
      estado: 'borrador',
      createdAt: '2026-01-02T11:00:00Z'
    },
    {
      id: 1006,
      fecha: '2026-01-10',
      tipo: 'Recibo',
      glosa: 'Ingreso capital',
      lines: [
        { cuenta: '1.1', centro: 'General', debito: 10000, credito: 0 },
        { cuenta: '3.1', centro: '', debito: 0, credito: 10000 }
      ],
      estado: 'aprobado',
      createdAt: '2026-01-10T12:00:00Z'
    },
    {
      id: 1007,
      fecha: '2026-01-05',
      tipo: 'Factura',
      glosa: 'Compra de equipos',
      lines: [
        { cuenta: '2.1', centro: '', debito: 2500, credito: 0 },
        { cuenta: '1.1', centro: 'General', debito: 0, credito: 2500 }
      ],
      estado: 'borrador',
      createdAt: '2026-01-05T09:00:00Z'
    },
    {
      id: 1008,
      fecha: '2026-01-08',
      tipo: 'Recibo',
      glosa: 'Pago servicios',
      lines: [
        { cuenta: '5.1', centro: 'General', debito: 800, credito: 0 },
        { cuenta: '1.1', centro: 'General', debito: 0, credito: 800 }
      ],
      estado: 'borrador',
      createdAt: '2026-01-08T14:00:00Z'
    },
    {
      id: 1009,
      fecha: '2026-01-12',
      tipo: 'Factura',
      glosa: 'Venta adicional',
      lines: [
        { cuenta: '1.1', centro: 'General', debito: 4500, credito: 0 },
        { cuenta: '4.1', centro: '', debito: 0, credito: 4500 }
      ],
      estado: 'borrador',
      createdAt: '2026-01-12T10:30:00Z'
    },
    {
      id: 1010,
      fecha: '2026-01-15',
      tipo: 'Recibo',
      glosa: 'Pago alquiler oficina',
      lines: [
        { cuenta: '5.1', centro: 'Administrativo', debito: 1200, credito: 0 },
        { cuenta: '1.1', centro: 'General', debito: 0, credito: 1200 }
      ],
      estado: 'aprobado',
      createdAt: '2026-01-15T09:00:00Z'
    },
    {
      id: 1011,
      fecha: '2026-01-18',
      tipo: 'Factura',
      glosa: 'Compra materia prima',
      lines: [
        { cuenta: '2.1', centro: '', debito: 3200, credito: 0 },
        { cuenta: '1.1', centro: 'General', debito: 0, credito: 3200 }
      ],
      estado: 'borrador',
      createdAt: '2026-01-18T14:20:00Z'
    },
    {
      id: 1012,
      fecha: '2026-01-20',
      tipo: 'Recibo',
      glosa: 'Venta mayorista',
      lines: [
        { cuenta: '1.1', centro: 'General', debito: 7500, credito: 0 },
        { cuenta: '4.1', centro: '', debito: 0, credito: 7500 }
      ],
      estado: 'aprobado',
      createdAt: '2026-01-20T11:45:00Z'
    },
    {
      id: 1013,
      fecha: '2026-01-22',
      tipo: 'Factura',
      glosa: 'Gastos de transporte',
      lines: [
        { cuenta: '5.1', centro: 'Logística', debito: 950, credito: 0 },
        { cuenta: '1.1', centro: 'General', debito: 0, credito: 950 }
      ],
      estado: 'borrador',
      createdAt: '2026-01-22T16:10:00Z'
    },
    {
      id: 1014,
      fecha: '2026-01-25',
      tipo: 'Recibo',
      glosa: 'Pago dividendos',
      lines: [
        { cuenta: '3.1', centro: '', debito: 2000, credito: 0 },
        { cuenta: '1.1', centro: 'General', debito: 0, credito: 2000 }
      ],
      estado: 'aprobado',
      createdAt: '2026-01-25T13:30:00Z'
    },
    {
      id: 1015,
      fecha: '2026-01-28',
      tipo: 'Factura',
      glosa: 'Compra equipos oficina',
      lines: [
        { cuenta: '2.1', centro: '', debito: 1800, credito: 0 },
        { cuenta: '1.1', centro: 'General', debito: 0, credito: 1800 }
      ],
      estado: 'borrador',
      createdAt: '2026-01-28T10:15:00Z'
    }
  ],
  employees: [
    { id: 1, name: 'Juan Pérez', dni: '1234567', cargo: 'Vendedor', estado: 'Activo', sueldo: 3500 },
    { id: 2, name: 'María López', dni: '7654321', cargo: 'Gerente', estado: 'Activo', sueldo: 5000 },
    { id: 3, name: 'Carlos Ramírez', dni: '1122334', cargo: 'Contador', estado: 'Activo', sueldo: 4000 }
  ],
  bitacora: [],
  closedPeriods: ['2025-11', '2025-12'],
  cierreHistory: [
    {
      period: '2025-11',
      when: '2025-12-01T08:00:00Z',
      by: 'contador',
      totalAsientos: 2,
      balance: {
        ingresos: 12500,
        gastos: 4200,
        resultado: 8300
      },
      asientosProcesados: [
        {
          id: 1000,
          fecha: '2025-11-15',
          tipo: 'Factura',
          glosa: 'Venta noviembre',
          total: 8000
        },
        {
          id: 1001,
          fecha: '2025-11-20',
          tipo: 'Recibo',
          glosa: 'Cobro venta',
          total: 4500
        }
      ]
    },
    {
      period: '2025-12',
      when: '2026-01-02T10:30:00Z',
      by: 'auditor',
      totalAsientos: 4,
      balance: {
        ingresos: 19000,
        gastos: 8200,
        resultado: 10800
      },
      asientosProcesados: [
        {
          id: 1001,
          fecha: '2025-12-01',
          tipo: 'Factura',
          glosa: 'Venta de productos',
          total: 10000
        },
        {
          id: 1002,
          fecha: '2025-12-05',
          tipo: 'Recibo',
          glosa: 'Pago a proveedores',
          total: 4000
        },
        {
          id: 1003,
          fecha: '2025-12-10',
          tipo: 'Factura',
          glosa: 'Compra de insumos',
          total: 3000
        },
        {
          id: 1004,
          fecha: '2025-12-15',
          tipo: 'Planilla',
          glosa: 'Pago de planilla diciembre',
          total: 7000
        }
      ]
    }
  ]
};

const ERP = {
  addAccount(acc) {
    const id = Date.now();
    const newAcc = { id, ...acc };
    ERPStore.accounts.push(newAcc);
    ERPStore.bitacora.push({ when: new Date().toISOString(), who: 'system', action: 'create_account', before: null, after: newAcc });
    return newAcc;
  },
  updateAccount(id, patch) {
    const idx = ERPStore.accounts.findIndex(a => a.id === id);
    if (idx === -1) return null;
    const before = { ...ERPStore.accounts[idx] };
    ERPStore.accounts[idx] = { ...ERPStore.accounts[idx], ...patch };
    ERPStore.bitacora.push({ when: new Date().toISOString(), who: 'system', action: 'update_account', before, after: ERPStore.accounts[idx] });
    return ERPStore.accounts[idx];
  },
  toggleAccount(id) {
    const idx = ERPStore.accounts.findIndex(a => a.id === id);
    if (idx === -1) return null;
    const before = { ...ERPStore.accounts[idx] };
    ERPStore.accounts[idx].active = !ERPStore.accounts[idx].active;
    ERPStore.bitacora.push({ when: new Date().toISOString(), who: 'system', action: 'toggle_account', before, after: ERPStore.accounts[idx] });
    return ERPStore.accounts[idx];
  },
  addAsiento(asiento) {
    const id = Date.now();
    const newAs = { id, createdAt: new Date().toISOString(), status: 'borrador', ...asiento };
    ERPStore.asientos.push(newAs);
    ERPStore.bitacora.push({ when: new Date().toISOString(), who: 'system', action: 'create_asiento', before: null, after: newAs });
    return newAs;
  },
  approveAsiento(id, user='system') {
    const a = ERPStore.asientos.find(x => x.id === id);
    if (!a) return null;
    const before = { ...a };
    a.status = 'aprobado';
    ERPStore.bitacora.push({ when: new Date().toISOString(), who: user, action: 'approve_asiento', before, after: a });
    return a;
  },
  addEmployee(emp) {
    const id = Date.now();
    const newE = { id, ...emp };
    ERPStore.employees.push(newE);
    ERPStore.bitacora.push({ when: new Date().toISOString(), who: 'system', action: 'create_employee', before: null, after: newE });
    return newE;
  },
  updateEmployee(id, patch) {
    const idx = ERPStore.employees.findIndex(e => e.id === id);
    if (idx === -1) return null;
    const before = { ...ERPStore.employees[idx] };
    ERPStore.employees[idx] = { ...ERPStore.employees[idx], ...patch };
    ERPStore.bitacora.push({ when: new Date().toISOString(), who: 'system', action: 'update_employee', before, after: ERPStore.employees[idx] });
    return ERPStore.employees[idx];
  },
  calculatePayroll(period, type='mensual') {
    // Simple payroll calculation: base - 12% descuentos - 18% aportes patronales (demo)
    return ERPStore.employees.map(e => {
      const bruto = e.sueldo || 0;
      const descuentos = parseFloat((bruto * 0.12).toFixed(2));
      const aportes = parseFloat((bruto * 0.18).toFixed(2));
      const neto = parseFloat((bruto - descuentos).toFixed(2));
      return { employeeId: e.id, name: e.name, bruto, descuentos, aportes, neto };
    });
  },
  generateBankFile(payroll) {
    // Simple CSV bank file with employee and amount
    const rows = [['employeeId','name','amount']];
    payroll.forEach(p => rows.push([p.employeeId, p.name, p.neto]));
    return rows.map(r => r.join(',')).join('\n');
  },
  closePeriod(period, user='system'){
    // period format YYYY-MM
    // validations: no asientos in period with status != aprobado
    const asientos = ERPStore.asientos.filter(a => a.fecha && a.fecha.startsWith(period));
    const pending = asientos.filter(a => a.estado !== 'aprobado');
    if (pending.length > 0) return { ok:false, msg: `Existen ${pending.length} asientos sin aprobar` };
    if (ERPStore.closedPeriods.includes(period)) return { ok:false, msg: 'Período ya cerrado' };
    
    // Calculate balance for the period
    const approvedAsientos = asientos.filter(a => a.estado === 'aprobado');
    let totalIngresos = 0, totalGastos = 0;
    approvedAsientos.forEach(a => {
      a.lines.forEach(l => {
        const account = ERPStore.accounts.find(acc => acc.code === l.cuenta);
        if (account) {
          if (account.type === 'Ingreso') totalIngresos += l.credito - l.debito;
          else if (account.type === 'Gasto') totalGastos += l.debito - l.credito;
        }
      });
    });
    
    ERPStore.closedPeriods.push(period);
    const rec = { 
      period, 
      when: new Date().toISOString(), 
      by: user,
      totalAsientos: approvedAsientos.length,
      balance: {
        ingresos: totalIngresos,
        gastos: totalGastos,
        resultado: totalIngresos - totalGastos
      },
      asientosProcesados: approvedAsientos.map(a => ({
        id: a.id,
        fecha: a.fecha,
        tipo: a.tipo,
        glosa: a.glosa,
        total: a.lines.reduce((sum, l) => sum + Math.abs(l.debito) + Math.abs(l.credito), 0)
      }))
    };
    ERPStore.cierreHistory.push(rec);
    ERPStore.bitacora.push({ when: new Date().toISOString(), who: user, action: 'close_period', before: null, after: rec });
    return { ok:true, rec };
  },
  isPeriodClosed(period){
    return ERPStore.closedPeriods.includes(period);
  },
  calculateBalance(period) {
    // Simple balance calculation for demo
    const asientos = ERPStore.asientos.filter(a => a.fecha && a.fecha.startsWith(period) && a.estado === 'aprobado');
    let ingresos = 0, gastos = 0;
    asientos.forEach(a => {
      a.lines.forEach(l => {
        const acc = ERPStore.accounts.find(ac => ac.code === l.cuenta);
        if (acc && acc.type === 'Ingreso') ingresos += l.credito || 0;
        if (acc && acc.type === 'Gasto') gastos += l.debito || 0;
      });
    });
    return { ingresos, gastos, resultado: ingresos - gastos };
  }
};

const App = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [userType, setUserType] = useState('operador'); // 'cliente', 'chofer', 'operador'
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Estados para el modal de nuevo cliente
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientGroup, setNewClientGroup] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientLocation, setNewClientLocation] = useState({ lat: -16.5000, lng: -68.1500 }); // Coordenadas de La Paz por defecto
  const [gastos, setGastos] = useState([]);
  const totalGastos = gastos.reduce((s, g) => s + Number(g.monto || 0), 0);

  // Datos de clientes por grupo
  const [clientsByGroup, setClientsByGroup] = useState({
    'El Alto - Zona Norte': ['Pollería El Rey', 'Feria Sector A'],
    'El Alto - Zona Sur': ['Doña Juana', 'Supermercado Central'],
    'La Paz - Centro': ['Mercado Camacho', 'Tienda El Sol'],
    'La Paz - Zona Norte': ['Pollería Los Pinos', 'Feria 16 de Julio']
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarVisible(true); // Mostrar sidebar en desktop
      } else {
        setSidebarVisible(false); // Ocultar sidebar en móvil por defecto
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Llamar inicialmente

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getAllowedMenus = () => {
    switch (userType) {
      case 'cliente':
        return ['clientApp'];
      case 'chofer':
        return ['driverApp'];
      case 'operador':
        return ['dashboard', 'orders', 'assignments', 'tracking', 'baskets', 'reports', 'settings'];
      case 'contador':
        return [
          'contabilidad', 'planCuentas', 'registroAsientos', 'libro', 'cierre', 'reportesFinancieros',
          'rrhh', 'gestionEmpleados', 'contratos', 'asistencia', 'calculoPlanillas', 'boletas', 'aportes',
          'asientosAutom', 'pagosSueldos', 'roles', 'bitacora', 
        ];
      default:
        return [];
    }
  };

  const allowedMenus = getAllowedMenus();

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (isMobile) {
      setSidebarVisible(false);
    }
  };

  // Funciones para el modal de nuevo cliente
  const handleSaveNewClient = () => {
    if (!newClientName.trim() || !newClientGroup || !newClientPhone.trim()) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    // Agregar el nuevo cliente a la lista de clientes del grupo
    setClientsByGroup(prev => ({
      ...prev,
      [newClientGroup]: [...(prev[newClientGroup] || []), newClientName]
    }));

    // Aquí se puede enviar al backend
    alert(`Cliente "${newClientName}" agregado exitosamente al grupo "${newClientGroup}"`);
    
    // Limpiar el formulario y cerrar el modal
    setNewClientName('');
    setNewClientPhone('');
    setNewClientLocation({ lat: -16.5000, lng: -68.1500 });
    setShowNewClientModal(false);
  };

  const handleCloseNewClientModal = () => {
    setNewClientName('');
    setNewClientPhone('');
    setNewClientLocation({ lat: -16.5000, lng: -68.1500 });
    setShowNewClientModal(false);
  };

  const theme = {
    primary: '#e11d48',
    secondary: '#1e293b',
    frozen: '#0ea5e9',
    fresh: '#f97316',
    bg: '#f8fafc',
    white: '#ffffff',
    border: '#e2e8f0',
    textMain: '#1e293b',
    textMuted: '#64748b',
    sidebarBg: '#0f172a'
  };

  const menus = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'orders', label: 'Consolidación' },
    { id: 'assignments', label: 'Asignaciones' },
    { id: 'tracking', label: 'Seguimiento' },
    { id: 'baskets', label: 'Canastos' },
    { id: 'driverApp', label: 'App Chofer' },
    { id: 'clientApp', label: 'App Cliente' },
    { id: 'contabilidad', label: 'Contabilidad' },
    { id: 'rrhh', label: 'RRHH / Planillas' },
    { id: 'settings', label: 'Configuración' },
  ];

  const [roles, setRoles] = useState([
    { id: 'admin', name: 'Admin', allowedMenus: menus.map(m => m.id) },
    { id: 'gerente', name: 'Gerente', allowedMenus: ['dashboard', 'orders', 'assignments', 'tracking', 'baskets', 'reports', 'settings'] },
    { id: 'despachador 1', name: 'Despachador 1', allowedMenus: ['assignments', 'tracking'] },
    { id: 'despachador 2', name: 'Despachador 2', allowedMenus: ['assignments', 'tracking'] },
    { id: 'contador', name: 'Contador', allowedMenus: ['contabilidad', 'rrhh'] },
    { id: 'encargado de ruta', name: 'Encargado de Ruta', allowedMenus: ['assignments', 'tracking', 'reports'] },
    { id: 'preventista', name: 'Preventista', allowedMenus: ['orders', 'tracking'] },
  ]);

  const styles = (isMobile, sidebarVisible, sidebarCollapsed) => ({
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: theme.bg,
      fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
      color: theme.textMain,
      overflow: 'hidden'
    },
    sidebar: {
      width: isMobile ? '280px' : (sidebarCollapsed ? '80px' : '260px'),
      backgroundColor: theme.sidebarBg,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
      position: isMobile ? 'fixed' : 'relative',
      top: 0,
      left: 0,
      height: '100vh',
      zIndex: 1000,
      transform: isMobile && !sidebarVisible ? 'translateX(-100%)' : 'translateX(0)',
      transition: 'all 0.3s ease-in-out'
    },
    sidebarOverlay: {
      display: isMobile && sidebarVisible ? 'block' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 999
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '32px',
      padding: '0 8px',
      justifyContent: sidebarCollapsed && !isMobile ? 'center' : 'flex-start'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      backgroundColor: theme.primary,
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: '18px'
    },
    logoText: {
      fontSize: '20px',
      fontWeight: '800',
      letterSpacing: '1px',
      display: sidebarCollapsed && !isMobile ? 'none' : 'block'
    },
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      marginLeft: isMobile ? 0 : (sidebarVisible ? 0 : 0),
      transition: 'margin-left 0.3s ease-in-out'
    },
    header: {
      height: '64px',
      backgroundColor: 'white',
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: isMobile ? '0 16px' : '0 32px'
    },
    contentArea: {
      flex: 1,
      padding: isMobile ? '16px' : '32px',
      overflowY: 'auto',
    },
    mobileMenuBtn: {
      display: isMobile ? 'block' : 'none',
      backgroundColor: 'transparent',
      border: 'none',
      color: theme.textMain,
      fontSize: '24px',
      cursor: 'pointer',
      padding: '8px'
    },
    collapseBtn: {
      display: isMobile ? 'none' : 'block',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#94a3b8',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '6px',
      alignSelf: 'flex-end',
      marginBottom: '16px',
      transition: 'all 0.2s ease'
    }
  });

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView theme={theme} />;
      case 'orders': return <ConsolidationView 
        theme={theme}
        showNewClientModal={showNewClientModal}
        setShowNewClientModal={setShowNewClientModal}
        newClientName={newClientName}
        setNewClientName={setNewClientName}
        newClientGroup={newClientGroup}
        setNewClientGroup={setNewClientGroup}
        newClientPhone={newClientPhone}
        setNewClientPhone={setNewClientPhone}
        newClientLocation={newClientLocation}
        setNewClientLocation={setNewClientLocation}
        handleSaveNewClient={handleSaveNewClient}
        handleCloseNewClientModal={handleCloseNewClientModal}
      />;
      case 'assignments': return <AssignmentView 
        theme={theme} 
        showNewClientModal={showNewClientModal}
        setShowNewClientModal={setShowNewClientModal}
        newClientName={newClientName}
        setNewClientName={setNewClientName}
        newClientGroup={newClientGroup}
        setNewClientGroup={setNewClientGroup}
        newClientPhone={newClientPhone}
        setNewClientPhone={setNewClientPhone}
        newClientLocation={newClientLocation}
        setNewClientLocation={setNewClientLocation}
        handleSaveNewClient={handleSaveNewClient}
        handleCloseNewClientModal={handleCloseNewClientModal}
      />;
      case 'tracking': return <TrackingView theme={theme} />;
      case 'contabilidad': return <ContabilidadDashboard theme={theme} handleTabChange={handleTabChange} />;
      case 'planCuentas': return <PlanDeCuentas theme={theme} />;
      case 'registroAsientos': return <RegistroAsientos theme={theme} />;
      case 'libro': return <LibroDiarioMayor theme={theme} />;
      case 'cierre': return <CierreContable theme={theme} />;
      case 'reportesFinancieros': return <ReportesFinancieros theme={theme} />;
      case 'rrhh': return <RRHHDashboard theme={theme} handleTabChange={handleTabChange} />;
      case 'gestionEmpleados': return <GestionEmpleados theme={theme} />;
      case 'contratos': return <ContratosSalarios theme={theme} />;
      case 'asistencia': return <ControlAsistencia theme={theme} />;
      case 'calculoPlanillas': return <CalculoPlanillas theme={theme} />;
      case 'boletas': return <BoletasPago theme={theme} />;
      case 'aportes': return <AportesImpuestos theme={theme} />;
      case 'asientosAutom': return <AsientosAutomaticos theme={theme} />;
      case 'pagosSueldos': return <PagosSueldos theme={theme} />;
      case 'roles': return <RolesPermisos theme={theme} />;
      case 'bitacora': return <Bitacora theme={theme} />;
      case 'driverApp': return <DriverAppView theme={theme} />;
      case 'clientApp': return <ClientAppView theme={theme} />;
      case 'baskets': return <BasketView theme={theme} />;
      case 'settings': return <SettingsView 
        theme={theme} 
        showNewClientModal={showNewClientModal}
        setShowNewClientModal={setShowNewClientModal}
        newClientName={newClientName}
        setNewClientName={setNewClientName}
        newClientGroup={newClientGroup}
        setNewClientGroup={setNewClientGroup}
        newClientPhone={newClientPhone}
        setNewClientPhone={setNewClientPhone}
        newClientLocation={newClientLocation}
        setNewClientLocation={setNewClientLocation}
        handleSaveNewClient={handleSaveNewClient}
        handleCloseNewClientModal={handleCloseNewClientModal}
        clientsByGroup={clientsByGroup}
      />;
      default: return <DashboardView theme={theme} />;
    }
  };

  const currentStyles = styles(isMobile, sidebarVisible, sidebarCollapsed);

  return isLoggedIn ? (
    <div style={currentStyles.container}>
      {/* Sidebar Overlay for Mobile */}
      <div 
        style={currentStyles.sidebarOverlay} 
        onClick={() => setSidebarVisible(false)}
      />
      
      {/* Sidebar */}
      <div style={currentStyles.sidebar}>
        <div style={currentStyles.logoSection}>
          <div style={currentStyles.logoIcon}>D</div>
          <span style={currentStyles.logoText}>BOLIVIA</span>
        </div>

        {/* Botón de colapso/expansión */}
        <button 
          style={currentStyles.collapseBtn}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1e293b'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>

        {/* Selector de Tipo de Usuario */}
        <div style={{ marginBottom: '20px', display: sidebarCollapsed && !isMobile ? 'none' : 'block' }}>
          <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: '500' }}>
            TIPO DE USUARIO
          </label>
          <select
            value={userType}
            onChange={(e) => {
              const newType = e.target.value;
              setUserType(newType);
              // Cambiar activeTab al primer menú permitido
              const allowed = getAllowedMenus();
              if (allowed.length > 0 && !allowed.includes(activeTab)) {
                handleTabChange(allowed[0]);
              }
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              backgroundColor: '#1e293b',
              border: '1px solid #374151',
              borderRadius: '6px',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="cliente">Cliente</option>
            <option value="chofer">Chofer</option>
            <option value="operador">Operador</option>
            <option value="contador">Contador</option>
          </select>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {allowedMenus.includes('dashboard') && <SidebarBtn id="dashboard" icon= {LayoutDashboard} label="Dashboard" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('orders') && <SidebarBtn id="orders" icon={ShoppingCart} label="Solicitudes" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('assignments') && <SidebarBtn id="assignments" icon={Truck} label="Asignaciones" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('tracking') && <SidebarBtn id="tracking" icon={MapPin} label="Seguimiento" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('baskets') && <SidebarBtn id="baskets" icon={Archive} label="Canastos" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('driverApp') && <SidebarBtn id="driverApp" icon={Users} label="App Chofer" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('clientApp') && <SidebarBtn id="clientApp" icon={UserCircle} label="App Cliente" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('contabilidad') && <SidebarBtn id="contabilidad" icon={Scale} label="Contabilidad" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('rrhh') && <SidebarBtn id="rrhh" icon={Users} label="RRHH / Planillas" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
        </nav>

        <div style={{ paddingTop: '20px', borderTop: `1px solid #1e293b`, marginTop: '20px' }}>
          {allowedMenus.includes('settings') && <SidebarBtn id="settings" icon={Settings} label="Configuración" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          <button onClick={() => setIsLoggedIn(false)} style={{ 
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
            backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', textAlign: 'left'
          }}>
            <LogOut size={20} />
            <span style={{ fontWeight: '500' }}>Cerrar Sesión</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={currentStyles.main}>

        <div style={currentStyles.contentArea}>
          {renderView()}
        </div>

        {/* Modal para Nuevo Cliente */}
        {showNewClientModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '20px'
          }}
          onClick={handleCloseNewClientModal}
          >
            <div 
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Nuevo Cliente</h3>
                <button
                  onClick={handleCloseNewClientModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '4px',
                    color: '#64748b'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  <X size={24} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Nombre del Cliente */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                    NOMBRE DEL CLIENTE *
                  </label>
                  <input
                    type="text"
                    value={newClientName}
                    onChange={(e) => setNewClientName(e.target.value)}
                    placeholder="Ingrese el nombre del cliente"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Grupo */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                    GRUPO / RUTA *
                  </label>
                  <select
                    value={newClientGroup}
                    onChange={(e) => setNewClientGroup(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Seleccionar Grupo...</option>
                    <option value="El Alto - Zona Norte">El Alto - Zona Norte</option>
                    <option value="El Alto - Zona Sur">El Alto - Zona Sur</option>
                    <option value="La Paz - Centro">La Paz - Centro</option>
                    <option value="La Paz - Zona Norte">La Paz - Zona Norte</option>
                  </select>
                </div>

                {/* Teléfono */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                    TELÉFONO *
                  </label>
                  <input
                    type="tel"
                    value={newClientPhone}
                    onChange={(e) => setNewClientPhone(e.target.value)}
                    placeholder="Ej: 70123456"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      fontSize: '14px'
                    }}
                  />
                </div>

                {/* Ubicación (Mapa) */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                    UBICACIÓN
                  </label>
                  <div style={{
                    width: '100%',
                    height: '300px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    marginBottom: '8px'
                  }}>
                    <MapContainer
                      center={[newClientLocation.lat, newClientLocation.lng]}
                      zoom={13}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <MapClickHandler 
                        onMapClick={(latlng) => {
                          setNewClientLocation({ lat: latlng.lat, lng: latlng.lng });
                        }}
                      />
                      <Marker position={[newClientLocation.lat, newClientLocation.lng]}>
                        <Popup>
                          Ubicación del cliente
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                    <span>Lat: {newClientLocation.lat.toFixed(4)}</span>
                    <span>Lng: {newClientLocation.lng.toFixed(4)}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Haga clic en el mapa para seleccionar la ubicación del cliente
                  </p>
                </div>

                {/* Botones */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    onClick={handleCloseNewClientModal}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: 'white',
                      color: '#64748b',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveNewClient}
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: theme.primary,
                      color: 'white',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '14px'
                    }}
                    onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.target.style.opacity = '1'}
                  >
                    Guardar Cliente
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : <Login onLogin={() => setIsLoggedIn(true)} />;
};

// Componentes Auxiliares
const SidebarBtn = ({ id, icon: Icon, label, activeTab, setActiveTab, theme, collapsed }) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', 
        gap: collapsed ? '0' : '12px', padding: '12px 16px',
        borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left', transition: '0.2s',
        backgroundColor: isActive ? theme.primary : 'transparent',
        color: isActive ? 'white' : '#94a3b8',
        boxShadow: isActive ? '0 4px 6px rgba(225, 29, 72, 0.2)' : 'none'
      }}
    >
      <Icon size={20} />
      {!collapsed && <span style={{ fontWeight: '600' }}>{label}</span>}
    </button>
  );
};

// --- VISTAS ESPECÍFICAS ---

const DashboardView = ({ theme }) => {
  // Datos de ejemplo para los indicadores
  const salesByClient = [
    { name: 'Pollería El Rey', sales: 12500 },
    { name: 'Doña Juana', sales: 8900 },
    { name: 'Feria Sector A', sales: 11200 },
    { name: 'Mercado Central', sales: 7500 },
    { name: 'Distribuidor Sucre', sales: 9800 }
  ];

  const maxSales = Math.max(...salesByClient.map(c => c.sales));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Primera fila de indicadores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <StatCard title="Entregas Hoy" value="42" change="+5" icon={CheckCircle2} color="#10b981" />
        <StatCard title="Total Solicitudes" value="158" change="+12" icon={ShoppingCart} color="#3b82f6" />
        <StatCard title="Canastos en Clientes" value="842" change="-18" icon={Archive} color="#f59e0b" />
        <StatCard title="Stock Crítico" value="3 Categorías" icon={AlertCircle} color="#ef4444" />
      </div>

      {/* Segunda fila de indicadores nuevos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        <StatCard title="Fuga de Canastos" value="18" change="-3" icon={TrendingDown} color="#f43f5e" />
        <StatCard title="Efectividad de Entregas" value="94.2%" change="+2.1" icon={Target} color="#10b981" />
        <StatCard title="Tiempo Promedio Entrega" value="2.4h" change="-0.3" icon={Clock} color="#3b82f6" />
        <StatCard title="Utilización Vehículos" value="78%" change="+5" icon={Activity} color="#f59e0b" />
      </div>

      {/* Tercera fila con gráficos y métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Gráfico de Ventas por Cliente */}
        <Card>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Ventas por Cliente</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {salesByClient.map((client, i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                  <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.name}</span>
                  <span style={{ color: theme.primary, fontWeight: 'bold' }}>Bs {client.sales.toLocaleString()}</span>
                </div>
                <div style={{ width: '100%', height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${(client.sales / maxSales) * 100}%`, 
                      height: '100%', 
                      backgroundColor: theme.primary,
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Pedidos por Categoría (Hoy)</h3>
          {['104', '105', '106', '107', '108', '109', '110'].map((cat, i) => (
            <div key={cat} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                <span>Código {cat}</span>
                <span style={{ marginLeft: 'auto' }}>{80 - i * 10} Unid.</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${100 - (i * 12)}%`, height: '100%', backgroundColor: theme.primary }}></div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* Cuarta fila con gráficos adicionales */}
      <div style={{  gap: '24px' }}>
        <Card style={{ padding: 0, overflow: 'hidden', height: '400px' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} color={theme.primary} />
              Seguimiento de Vehículos en Tiempo Real
            </h3>
          </div>
          <div style={{ height: '100%', width: '100%', position: 'relative' }}>
            <MapContainer 
              center={[-16.5000, -68.1500]} 
              zoom={12} 
              style={{ height: '100%', width: '100%', zIndex: 0 }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* Vehículos de ejemplo */}
              <Marker position={[-16.5000, -68.1500]}>
                <Popup>
                  <div style={{ padding: '8px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Vehículo #001</div>
                    <div style={{ fontSize: '12px', color: theme.textMuted }}>Conductor: Juan Pérez</div>
                    <div style={{ fontSize: '12px', color: theme.textMuted }}>Ruta: El Alto Norte</div>
                    <div style={{ fontSize: '12px', color: theme.primary, marginTop: '4px' }}>En ruta → Pollería El Rey</div>
                  </div>
                </Popup>
              </Marker>
              <Marker position={[-16.5100, -68.1400]}>
                <Popup>
                  <div style={{ padding: '8px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Vehículo #002</div>
                    <div style={{ fontSize: '12px', color: theme.textMuted }}>Conductor: María González</div>
                    <div style={{ fontSize: '12px', color: theme.textMuted }}>Ruta: El Alto Sur</div>
                    <div style={{ fontSize: '12px', color: theme.primary, marginTop: '4px' }}>En ruta → Doña Juana</div>
                  </div>
                </Popup>
              </Marker>
              <Marker position={[-16.4900, -68.1600]}>
                <Popup>
                  <div style={{ padding: '8px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Vehículo #003</div>
                    <div style={{ fontSize: '12px', color: theme.textMuted }}>Conductor: Carlos Ramírez</div>
                    <div style={{ fontSize: '12px', color: theme.textMuted }}>Ruta: La Paz Centro</div>
                    <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>✓ Entrega completada</div>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

const InventoryView = ({ theme }) => (
  <Card style={{ padding: 0, overflow: 'hidden' }}>
    <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' }}>
        <Package size={20} color={theme.textMuted} />
        <span>Stock Maestro Actualizado</span>
      </div>
      <button style={{ 
        backgroundColor: theme.primary, color: 'white', border: 'none', padding: '10px 20px', 
        borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
      }}>
        <Plus size={18} /> Ajustar Inventario
      </button>
    </div>
    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
      <thead>
        <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px', textTransform: 'uppercase' }}>
          <th style={{ padding: '16px 24px' }}>Categoría</th>
          <th style={{ padding: '16px 24px' }}>Color</th>
          <th style={{ padding: '16px 24px' }}>Congelado</th>
          <th style={{ padding: '16px 24px' }}>Descongelado</th>
          <th style={{ padding: '16px 24px' }}>Total</th>
        </tr>
      </thead>
      <tbody>
        {[
          { id: '104', color: '#ef4444', cong: 120, desc: 45 },
          { id: '105', color: '#f97316', cong: 85, desc: 12 },
          { id: '106', color: '#facc15', cong: 210, desc: 30 },
          { id: '107', color: '#22c55e', cong: 45, desc: 0 },
          { id: '108', color: '#3b82f6', cong: 92, desc: 110 },
          { id: '109', color: '#000000', cong: 15, desc: 8 },
          { id: '110', color: '#8b5cf6', cong: 0, desc: 0 },
        ].map(row => (
          <tr key={row.id} style={{ borderTop: '1px solid #f1f5f9' }}>
            <td style={{ padding: '16px 24px', fontWeight: 'bold' }}>Código {row.id}</td>
            <td style={{ padding: '16px 24px' }}>
              <div style={{ width: '48px', height: '16px', backgroundColor: row.color, borderRadius: '4px' }}></div>
            </td>
            <td style={{ padding: '16px 24px', color: theme.frozen, fontWeight: 'bold' }}>{row.cong}</td>
            <td style={{ padding: '16px 24px', color: theme.fresh, fontWeight: 'bold' }}>{row.desc}</td>
            <td style={{ padding: '16px 24px', fontWeight: '800' }}>{row.cong + row.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

// --- VISTA DE CONSOLIDACIÓN ---

// Componente para manejar clics en el mapa
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const ConsolidationView = ({ 
  theme,
  showNewClientModal,
  setShowNewClientModal,
  newClientName,
  setNewClientName,
  newClientGroup,
  setNewClientGroup,
  newClientPhone,
  setNewClientPhone,
  newClientLocation,
  setNewClientLocation,
  handleSaveNewClient,
  handleCloseNewClientModal
}) => {
  const [expandedGroups, setExpandedGroups] = useState({});
  const [selectedProvider, setSelectedProvider] = useState('SOFIA');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [showClientSuggestions, setShowClientSuggestions] = useState(false);
  
  // Estados para filtros de solicitudes
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [filterProvider, setFilterProvider] = useState('ALL');
  const [filterClient, setFilterClient] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterGroup, setFilterGroup] = useState('ALL');
  
  // Datos de solicitudes con filtros
  const [requests, setRequests] = useState([
    {
      id: 1,
      provider: 'SOFIA',
      group: 'El Alto Norte',
      client: 'Pollería El Rey',
      date: '2025-12-25',
      status: 'emitido',
      paid: false,
      products: {
        104: { boxes: 10, units: 0, hasOffal: false },
        107: { boxes: 5, units: 0, hasOffal: true },
        109: { boxes: 0, units: 5, hasOffal: false }
      }
    },
    {
      id: 2,
      provider: 'PIO',
      group: 'El Alto Sur',
      client: 'Doña Juana',
      date: '2025-12-24',
      status: 'enviado',
      paid: true,
      products: {
        104: { boxes: 0, units: 2, hasOffal: true },
        109: { boxes: 0, units: 5, hasOffal: false }
      }
    },
    {
      id: 3,
      provider: 'SOFIA',
      group: 'La Paz - Centro',
      client: 'Pollería Central',
      date: '2025-12-25',
      status: 'emitido',
      paid: false,
      products: {
        105: { boxes: 8, units: 0, hasOffal: false },
        106: { boxes: 3, units: 0, hasOffal: true }
      }
    },
    {
      id: 4,
      provider: 'PIO',
      group: 'La Paz - Zona Norte',
      client: 'Carnicería Norte',
      date: '2025-12-23',
      status: 'enviado',
      paid: true,
      products: {
        110: { boxes: 0, units: 10, hasOffal: false }
      }
    }
  ]);
  
  // Función para filtrar solicitudes
  const getFilteredRequests = () => {
    return requests.filter(request => {
      const requestDate = new Date(request.date);
      const startDate = filterStartDate ? new Date(filterStartDate) : null;
      const endDate = filterEndDate ? new Date(filterEndDate) : null;
      
      const matchesDate = (!startDate || requestDate >= startDate) && (!endDate || requestDate <= endDate);
      const matchesProvider = filterProvider === 'ALL' || request.provider === filterProvider;
      const matchesClient = !filterClient || request.client.toLowerCase().includes(filterClient.toLowerCase());
      const matchesStatus = filterStatus === 'ALL' || request.status === filterStatus;
      const matchesGroup = filterGroup === 'ALL' || request.group === filterGroup;
      
      return matchesDate && matchesProvider && matchesClient && matchesStatus && matchesGroup;
    });
  };
  
  const [selectedProducts, setSelectedProducts] = useState(() => {
    const init = {};
    ['SOFIA', 'PIO'].forEach(provider => {
      init[provider] = {};
      [104, 105, 106, 107, 108, 109, 110].forEach(code => {
        init[provider][code] = { boxes: 0, units: 0, hasOffal: true };
      });
    });
    return init;
  });

  // Categorías por proveedor
  const providerCategories = {
    SOFIA: [104, 105, 106, 107, 108, 109, 110],
    PIO: [104, 105, 106, 107, 108, 109, 110]  // Rojo, Blanco, Amarillo, Verde, Azul, Negro, Menudencia
  };

  // Datos consolidados por proveedor, grupo y cliente
  const consolidatedData = {
    SOFIA: {
      'El Alto Norte': [
        { client: 'Pollería El Rey', orders: {104: 10, 107: 5} }
      ]
    },
    PIO: {
      'El Alto Sur': [
        { client: 'Doña Juana', orders: {109: 5, 104: 2} }
      ]
    }
  };

  // Lista de clientes por grupo
  const clientsByGroup = {
    'El Alto - Zona Norte': [
      'Pollería El Rey',
      'Súper Pollo',
      'Pollería Los Hermanos',
      'Carnicería El Norte',
      'Restaurante La Cumbre'
    ],
    'El Alto - Zona Sur': [
      'Doña Juana',
      'Pollería Sur',
      'Carnicería El Sur',
      'Restaurante Valle',
      'Pollería Los Andes'
    ],
    'La Paz - Centro': [
      'Pollería Central',
      'Carnicería Plaza',
      'Restaurante Plaza',
      'Pollería Murillo',
      'Súper Pollo Centro'
    ],
    'La Paz - Zona Norte': [
      'Pollería Norte',
      'Carnicería Norte',
      'Restaurante Norte',
      'Pollería Achumani',
      'Súper Pollo Norte'
    ]
  };

  // Función para filtrar clientes basado en la búsqueda
  const getFilteredClients = () => {
    if (!selectedGroup || !clientsByGroup[selectedGroup]) return [];
    return clientsByGroup[selectedGroup].filter(client =>
      client.toLowerCase().includes(clientSearch.toLowerCase())
    );
  };

  // Estado editable para cajas / unidades por cliente y código en la vista de consolidación
  const [clientOrders, setClientOrders] = useState(() => {
    const init = {};
    Object.entries(consolidatedData).forEach(([provider, groups]) => {
      init[provider] = {};
      Object.entries(groups).forEach(([groupName, clients]) => {
        init[provider][groupName] = clients.map(client => {
          const codesState = {};
          providerCategories[provider].forEach(code => {
            const totalUnits = client.orders[code] || 0;
            const boxes = totalUnits > 10 ? Math.floor(totalUnits / 10) : 0;
            const units = totalUnits > 10 ? totalUnits % 10 : totalUnits;
            codesState[code] = { boxes, units };
          });
          return {
            client: client.client,
            codes: codesState
          };
        });
      });
    });
    return init;
  });

  // Switch para habilitar / deshabilitar edición
  const [editEnabled, setEditEnabled] = useState(false);

  const toggleGroup = (provider, group) => {
    const key = `${provider}-${group}`;
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateGroupTotals = (clients, categories) => {
    const totals = {};
    categories.forEach(code => totals[code] = 0);
    clients.forEach(client => {
      Object.entries(client.orders).forEach(([code, qty]) => {
        if (totals[code] !== undefined) totals[code] += qty;
      });
    });
    return totals;
  };

  const calculateProviderTotals = (groups, categories) => {
    const totals = {};
    categories.forEach(code => totals[code] = 0);
    Object.values(groups).forEach(clients => {
      const groupTotals = calculateGroupTotals(clients, categories);
      Object.entries(groupTotals).forEach(([code, qty]) => {
        totals[code] += qty;
      });
    });
    return totals;
  };

  // Helpers para usar el estado editable en la vista de consolidación
  const getClientCodeState = (provider, group, clientIndex, code) => {
    const groupState = clientOrders[provider]?.[group]?.[clientIndex];
    if (!groupState) {
      return { boxes: 0, units: 0 };
    }
    return groupState.codes[code] || { boxes: 0, units: 0 };
  };

  const handleClientOrderChange = (provider, group, clientIndex, code, field, value) => {
    if (!editEnabled) return;
    const numeric = parseInt(value, 10);
    const safeValue = isNaN(numeric) || numeric < 0 ? 0 : numeric;
    setClientOrders(prev => {
      const providerState = prev[provider] || {};
      const groupState = providerState[group] || [];
      const clientState = groupState[clientIndex] || { client: '', codes: {} };
      const currentCode = clientState.codes[code] || { boxes: 0, units: 0 };

      const newClient = {
        ...clientState,
        codes: {
          ...clientState.codes,
          [code]: {
            ...currentCode,
            [field]: safeValue
          }
        }
      };

      const newGroupArray = [...groupState];
      newGroupArray[clientIndex] = newClient;

      return {
        ...prev,
        [provider]: {
          ...providerState,
          [group]: newGroupArray
        }
      };
    });
  };

  const calculateGroupTotalsFromState = (provider, group, categories) => {
    const totals = {};
    categories.forEach(code => totals[code] = 0);
    const clientsState = clientOrders[provider]?.[group] || [];
    clientsState.forEach(client => {
      categories.forEach(code => {
        const codeState = client.codes[code] || { boxes: 0, units: 0 };
        // Regla simple: 1 caja = 10 unidades
        const totalUnits = (codeState.boxes || 0) * 10 + (codeState.units || 0);
        totals[code] += totalUnits;
      });
    });
    return totals;
  };

  const calculateProviderTotalsFromState = (provider, categories) => {
    const totals = {};
    categories.forEach(code => totals[code] = 0);
    const groups = clientOrders[provider] || {};
    Object.entries(groups).forEach(([groupName]) => {
      const groupTotals = calculateGroupTotalsFromState(provider, groupName, categories);
      Object.entries(groupTotals).forEach(([code, qty]) => {
        totals[code] += qty;
      });
    });
    return totals;
  };

  const handleSaveConsolidatedChanges = () => {
    // Aquí en el futuro se puede enviar clientOrders al backend
    alert('Cambios de consolidación guardados (mock).');
    setEditEnabled(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Formulario de Nueva Solicitud */}
      <Card>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} color={theme.primary} /> Nueva de Solicitud
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'flex-start' }}>
            {/* Columna izquierda: PROVEEDOR ORIGEN, GRUPO/RUTA, CLIENTE DESTINO */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '0 0 auto', minWidth: '300px' }}>
              {/* Selección de Proveedor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PROVEEDOR ORIGEN</label>
                <select 
                  value={selectedProvider} 
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#fdf2f2' }}
                >
                  <option value="SOFIA">Avícola Sofía</option>
                  <option value="PIO">PIO</option>
                  <option value="Pío Lindo">Pío Lindo</option>
                </select>
              </div>

              {/* Selección de Grupo de Cliente (NUEVO) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>GRUPO / RUTA</label>
                <select 
                  value={selectedGroup}
                  onChange={(e) => {
                    setSelectedGroup(e.target.value);
                    setSelectedClient(''); // Limpiar cliente seleccionado al cambiar grupo
                    setClientSearch('');
                  }}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                >
                  <option value="">Seleccionar Grupo...</option>
                  <option value="El Alto - Zona Norte">El Alto - Zona Norte</option>
                  <option value="El Alto - Zona Sur">El Alto - Zona Sur</option>
                  <option value="La Paz - Centro">La Paz - Centro</option>
                  <option value="La Paz - Zona Norte">La Paz - Zona Norte</option>
                </select>
              </div>

              {/* Selección de Cliente */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CLIENTE DESTINO</label>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={clientSearch}
                    onChange={(e) => {
                      setClientSearch(e.target.value);
                      setShowClientSuggestions(true);
                    }}
                    onFocus={() => setShowClientSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowClientSuggestions(false), 200)}
                    placeholder="Buscar cliente..."
                    disabled={!selectedGroup}
                    style={{ 
                      flex: '1',
                      padding: '12px', 
                      borderRadius: '8px', 
                      border: '1px solid #e2e8f0', 
                      outline: 'none',
                      opacity: selectedGroup ? 1 : 0.5
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setNewClientGroup(selectedGroup);
                      setShowNewClientModal(true);
                    }}
                    disabled={!selectedGroup}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      backgroundColor: selectedGroup ? theme.primary : '#e2e8f0',
                      color: selectedGroup ? 'white' : '#94a3b8',
                      cursor: selectedGroup ? 'pointer' : 'not-allowed',
                      outline: 'none',
                      minWidth: '44px',
                      height: '44px'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedGroup) {
                        e.target.style.backgroundColor = theme.primary;
                        e.target.style.opacity = '0.9';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedGroup) {
                        e.target.style.backgroundColor = theme.primary;
                        e.target.style.opacity = '1';
                      }
                    }}
                  >
                    <Plus size={20} />
                  </button>
                </div>
                {showClientSuggestions && selectedGroup && clientSearch && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}>
                    {getFilteredClients().map((client, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          setSelectedClient(client);
                          setClientSearch(client);
                          setShowClientSuggestions(false);
                        }}
                        style={{
                          padding: '12px',
                          cursor: 'pointer',
                          borderBottom: index < getFilteredClients().length - 1 ? '1px solid #f1f5f9' : 'none',
                          backgroundColor: selectedClient === client ? '#f8fafc' : 'white',
                          ':hover': { backgroundColor: '#f8fafc' }
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#f8fafc'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = selectedClient === client ? '#f8fafc' : 'white'}
                      >
                        {client}
                      </div>
                    ))}
                    {getFilteredClients().length === 0 && (
                      <div style={{ padding: '12px', color: '#64748b', fontStyle: 'italic' }}>
                        No se encontraron clientes
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Columna derecha: PRODUCTOS REQUERIDOS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '1 1 auto' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PRODUCTOS REQUERIDOS</label>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
                {providerCategories[selectedProvider].map(code => (
                  <ProductRow 
                    key={code} 
                    label={`Código ${code}`} 
                    code={code}
                    provider={selectedProvider}
                    values={selectedProducts[selectedProvider][code]}
                    onChange={(code, field, value) => {
                      setSelectedProducts(prev => ({
                        ...prev,
                        [selectedProvider]: {
                          ...prev[selectedProvider],
                          [code]: {
                            ...prev[selectedProvider][code],
                            [field]: field === 'hasOffal' ? value : (parseFloat(value) || 0)
                          }
                        }
                      }));
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <button style={{ 
            backgroundColor: theme.primary, color: 'white', border: 'none', padding: '14px', 
            borderRadius: '10px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <Save size={18} /> Registrar Pedido
          </button>
        </div>
      </Card>

      {/* Tabla de Pendientes */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: 0, fontSize: '16px' }}>Solicitudes</h3>
        </div>
        
        {/* Filtros */}
        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', alignItems: 'end', flexWrap: 'nowrap', overflowX: 'auto' }}>
            <div style={{ flex: '0 0 auto', minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                FECHA INICIO
              </label>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>
            
            <div style={{ flex: '0 0 auto', minWidth: '150px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                FECHA FIN
              </label>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>
            
            <div style={{ flex: '0 0 auto', minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                PROVEEDOR
              </label>
              <select
                value={filterProvider}
                onChange={(e) => setFilterProvider(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
              >
                <option value="ALL">Todos los Proveedores</option>
                <option value="SOFIA">SOFIA</option>
                <option value="PIO">PIO</option>
              </select>
            </div>
                        
            <div style={{ flex: '0 0 auto', minWidth: '180px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                GRUPO
              </label>
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
              >
                <option value="ALL">Todos los Grupos</option>
                <option value="El Alto Norte">El Alto Norte</option>
                <option value="El Alto Sur">El Alto Sur</option>
                <option value="La Paz - Centro">La Paz - Centro</option>
                <option value="La Paz - Zona Norte">La Paz - Zona Norte</option>
              </select>
            </div>

            <div style={{ flex: '0 0 auto', minWidth: '180px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                CLIENTE
              </label>
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>

            
            <div style={{ flex: '0 0 auto', minWidth: '160px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                ESTADO
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
              >
                <option value="ALL">Todos los Estados</option>
                <option value="emitido">Emitido</option>
                <option value="enviado">Enviado</option>
              </select>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {getFilteredRequests().map((request) => (
            <Card key={request.id}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'flex-start' }}>
                {/* Columna izquierda: FECHA, GRUPO/RUTA, CLIENTE, ESTADO */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '0 0 auto', minWidth: '250px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}>FECHA</div>
                    <div style={{ fontSize: '14px' }}>{new Date(request.date).toLocaleDateString('es-ES')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}>GRUPO / RUTA</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px' }}>
                      <MapPin size={14} color="#94a3b8" /> {request.group}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}>CLIENTE</div>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{request.client}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}>ESTADO</div>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: request.status === 'emitido' ? '#fef3c7' : '#d1fae5',
                        color: request.status === 'emitido' ? '#92400e' : '#065f46',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        textTransform: 'capitalize'
                      }}>
                        {request.status}
                      </span>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}>PAGADO</div>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: request.paid ? '#d1fae5' : '#fee2e2',
                        color: request.paid ? '#065f46' : '#991b1b',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        textTransform: 'uppercase'
                      }}>
                        {request.paid ? 'SI' : 'NO'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Columna derecha: PROVEEDOR y PRODUCTOS SOLICITADOS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '1 1 auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px', marginBottom: '4px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>PRODUCTOS SOLICITADOS</div>
                    <div>
                      <span style={{
                        fontSize:'12px', 
                        fontWeight:'bold', 
                        background: request.provider === 'SOFIA' ? '#fee2e2' : '#e0f2fe', 
                        color: request.provider === 'SOFIA' ? theme.primary : '#0369a1', 
                        padding:'4px 8px', 
                        borderRadius:'6px'
                      }}>
                        {request.provider}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
                    {[104, 105, 106, 107, 108, 109, 110].map((code) => {
                      const details = request.products[code] || { boxes: 0, units: 0, hasOffal: false };
                      return (
                        <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', minWidth: 'fit-content' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>Código {code}</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                            <div style={{ position: 'relative' }}>
                              <div style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                                {details.boxes || 0}
                              </div>
                              <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                              <div style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                                {details.units || 0}
                              </div>
                              <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '16px', height: '16px', borderRadius: '4px', border: '2px solid', borderColor: details.hasOffal ? '#059669' : '#dc2626', backgroundColor: details.hasOffal ? '#059669' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {details.hasOffal && <span style={{ color: 'white', fontSize: '10px' }}>✓</span>}
                              </div>
                              <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', cursor: 'default', userSelect: 'none' }}>
                                MENUDENCIA
                              </label>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};


const ProductRow = ({ label, code, provider, values, deferredPricing, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', minWidth: 'fit-content' }}>
    <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>{label}</span>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
      <div style={{ position: 'relative' }}>
        <input
          type="number"
          placeholder="0"
          value={values?.boxes || ''}
          onChange={(e) => onChange(code, 'boxes', e.target.value)}
          style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
        />
        <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type="number"
          placeholder="0"
          value={values?.units || ''}
          onChange={(e) => onChange(code, 'units', e.target.value)}
          style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
        />
        <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <input
          type="checkbox"
          id={`offal-${code}`}
          checked={values?.hasOffal || true}
          onChange={(e) => onChange(code, 'hasOffal', e.target.checked)}
          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
        />
        <label
          htmlFor={`offal-${code}`}
          style={{ fontSize: '10px', fontWeight: 'bold', color: '#94a3b8', cursor: 'pointer', userSelect: 'none' }}
        >
          MENUDENCIA
        </label>
      </div>

      {deferredPricing && (
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={values?.price || ''}
              onChange={(e) => onChange(code, 'price', e.target.value)}
              style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }}
            />
            <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>PRECIO</span>
          </div>
      )}
    </div>
  </div>
);

const ConsolidatedBox = ({ title, color, totals }) => (
  <Card style={{ borderTop: `4px solid ${color}`, padding: 0 }}>
    <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: color }}>{title}</h3>
      <button style={{ backgroundColor: color, color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>GENERAR PDF</button>
    </div>
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '12px' }}>
        {Object.entries(totals).map(([code, qty]) => (
          <div key={code} style={{ textAlign: 'center', padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>{code}</div>
            <div style={{ fontSize: '18px', fontWeight: '900' }}>{qty} <small style={{fontSize:'10px'}}>Unid</small></div>
          </div>
        ))}
      </div>
    </div>
  </Card>
);

const AssignmentView = ({ 
  theme,
  showNewClientModal,
  setShowNewClientModal,
  newClientName,
  setNewClientName,
  newClientGroup,
  setNewClientGroup,
  newClientPhone,
  setNewClientPhone,
  newClientLocation,
  setNewClientLocation,
  handleSaveNewClient,
  handleCloseNewClientModal
}) => {
  // Categorías por proveedor
  const providerCategories = {
    SOFIA: [104, 105, 106, 107, 108, 109, 110],
    PIO: [104, 105, 106, 107, 108, 109, 110]  // IMBA/PIO
  };

  const [selectedProvider, setSelectedProvider] = useState('SOFIA');
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [filterProvider, setFilterProvider] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [distributionMode, setDistributionMode] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [planningMode, setPlanningMode] = useState(false);
  const [selectedPlanningAssignment, setSelectedPlanningAssignment] = useState(null);
  const [receiveMode, setReceiveMode] = useState(false);
  const [selectedReceiveAssignment, setSelectedReceiveAssignment] = useState(null);
  const [weighingMode, setWeighingMode] = useState(false);
  const [selectedWeighingGroup, setSelectedWeighingGroup] = useState(null);
  const [currentPlanning, setCurrentPlanning] = useState({});

  const [selectedProducts, setSelectedProducts] = useState(() => {
    const init = {};
    ['SOFIA', 'PIO'].forEach(provider => {
      init[provider] = {};
      providerCategories[provider].forEach(code => {
        init[provider][code] = { boxes: 0, units: 0, grossWeight: 0, netWeight: 0 };
      });
    });
    return init;
  });

  const [assignmentPrice, setAssignmentPrice] = useState(0);
  const [deferredPricing, setDeferredPricing] = useState(false);

  const [history, setHistory] = useState([
    { id: 1, date: '2025-12-01', provider: 'SOFIA', client: 'Pollería El Rey', costPerKg: 10.00, deferredPricing: false, details: {104:{boxes:10,units:5,grossWeight:100.00,netWeight:95.00},107:{boxes:5,units:2,grossWeight:50.00,netWeight:47.50}}, status: 'COMPLETO' },
    { id: 2, date: '2025-12-05', provider: 'PIO', client: 'Feria Sector A', costPerKg: 12.00, deferredPricing: true, pricesPerCode: {109: 12.00, 104: 11.50}, details: {109:{boxes:5,units:10,grossWeight:75.00,netWeight:70.00},104:{boxes:2,units:3,grossWeight:25.00,netWeight:23.00}}, status: 'PENDIENTE' }
  ]);

  const getAssignmentTotalNetWeight = () => {
    return providerCategories[selectedProvider].reduce((sum, code) => sum + (selectedProducts[selectedProvider][code]?.netWeight || 0), 0);
  };

  const getAssignmentTotalCost = () => {
    if (deferredPricing) {
      return providerCategories[selectedProvider].reduce((sum, code) => {
        const product = selectedProducts[selectedProvider][code];
        const netWeight = product?.netWeight || 0;
        const price = product?.price || 0;
        return sum + (netWeight * price);
      }, 0);
    } else {
      return getAssignmentTotalNetWeight() * assignmentPrice;
    }
  };
  const matchesFilters = (e) => {
    if (filterProvider !== 'ALL' && e.provider !== filterProvider) return false;
    if (filterStatus !== 'ALL' && e.status !== filterStatus) return false;
    if (dateFrom && e.date < dateFrom) return false;
    if (dateTo && e.date > dateTo) return false;
    return true;
  };
  const filteredHistory = history.filter(matchesFilters);

  const codeNames = {
    104: 'Rojo',
    105: 'Blanco',
    106: 'Amarillo',
    107: 'Verde',
    108: 'Azul',
    109: 'Negro',
    110: 'Menudencia'
  };

  const handleDistribute = (assignment) => {
    setSelectedAssignment(assignment);
    setDistributionMode(true);
  };

  const handlePlan = (assignment) => {
    setSelectedPlanningAssignment(assignment);
    setPlanningMode(true);
  };

  const handleBackToHistory = () => {
    setDistributionMode(false);
    setSelectedAssignment(null);
  };

  const handleBackToHistoryFromPlanning = () => {
    setPlanningMode(false);
    setSelectedPlanningAssignment(null);
  };

  const handleReceive = (assignment) => {
    setSelectedReceiveAssignment(assignment);
    setReceiveMode(true);
  };

  const handleBackToHistoryFromReceive = () => {
    setReceiveMode(false);
    setSelectedReceiveAssignment(null);
  };

  const handleBackToDistribution = () => {
    setWeighingMode(false);
    setSelectedWeighingGroup(null);
  };

  if (receiveMode && selectedReceiveAssignment) {
    return <ReceiveView theme={theme} assignment={selectedReceiveAssignment} onBack={handleBackToHistoryFromReceive} />;
  }

  if (weighingMode && selectedWeighingGroup && selectedAssignment) {
    return <DistributionWeighingView theme={theme} assignment={selectedAssignment} groupName={selectedWeighingGroup} onBack={handleBackToDistribution} setWeighingMode={setWeighingMode} setSelectedWeighingGroup={setSelectedWeighingGroup} />;
  }

  if (distributionMode && selectedAssignment) {
    return <DistributionView theme={theme} assignment={selectedAssignment} planning={currentPlanning} onBack={handleBackToHistory} setWeighingMode={setWeighingMode} setSelectedWeighingGroup={setSelectedWeighingGroup} />;
  }

  if (planningMode && selectedPlanningAssignment) {
    return <PlanningView theme={theme} assignment={selectedPlanningAssignment} onBack={handleBackToHistoryFromPlanning} onSavePlanning={setCurrentPlanning} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} color={theme.primary} /> Asignación de Productos
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'flex-start' }}>
            {/* Columna Izquierda: PROVEEDOR, PRECIO, PRECIO DIFERIDO, TOTAL A PAGAR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '0 0 auto', minWidth: '300px' }}>
              {/* Selección de Proveedor */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PROVEEDOR</label>
                <select 
                  value={selectedProvider} 
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                >
                  <option value="SOFIA">Avícola Sofía</option>
                  <option value="PIO">PIO / IMBA</option>
                </select>
              </div>

              {/* Selección de Grupo de Productos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>GRUPO DE PRODUCTOS</label>
                <select 
                  value={selectedGroup} 
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                >
                  <option value="ALL">Todos</option>
                  <option value="POLLO SOFIA">Pollo Sofía</option>
                  <option value="POLLO AVC">Pollo AVC</option>
                  <option value="OTROS SOFIA">Otros Sofía</option>
                  <option value="OTROS AVC">Otros AVC</option>
                  <option value="PROCESADOS">Procesados</option>
                  <option value="HUEVO">Huevo</option>
                  <option value="CERDO">Cerdo</option>
                  <option value="POLLO CONGELADO">Pollo Congelado</option>
                </select>
              </div>

              {/* Precio y Total */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PRECIO (Bs./Kg.)</label>
                <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={assignmentPrice || ''} 
                    onChange={(e) => setAssignmentPrice(parseFloat(e.target.value) || 0)}
                    disabled={deferredPricing}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', opacity: deferredPricing ? 0.5 : 1 }}
                  />

                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label htmlFor="deferred-pricing" style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', cursor: 'pointer' }}>
                      Precio diferido
                    </label>
                    <input
                      type="checkbox"
                      id="deferred-pricing"
                      checked={deferredPricing}
                      onChange={(e) => setDeferredPricing(e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: CANTIDADES A ASIGNAR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '1 1 auto' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CANTIDADES A ASIGNAR</label>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
              {providerCategories[selectedProvider].map(code => (
                <ProductRow
                  key={code}
                  label={`Código ${code}`}
                  code={code}
                  provider={selectedProvider}
                  values={selectedProducts[selectedProvider][code]}
                  deferredPricing={deferredPricing}
                  onChange={(code, field, value) => {
                    setSelectedProducts(prev => ({
                      ...prev,
                      [selectedProvider]: {
                        ...prev[selectedProvider],
                        [code]: {
                          ...prev[selectedProvider][code],
                          [field]: field === 'hasOffal' ? value : (parseFloat(value) || 0)
                        }
                      }
                    }));
                  }}
                />
              ))}
              </div>
            </div>
          </div>

          <button style={{ 
            backgroundColor: theme.primary, color: 'white', border: 'none', padding: '14px', 
            borderRadius: '10px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
            <Save size={18} /> Asignar Productos
          </button>
        </div>
      </Card>

      <Card>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Historial de Asignaciones</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <select value={filterProvider} onChange={e=>setFilterProvider(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <option value="ALL">Todos los Proveedores</option>
              <option value="SOFIA">SOFIA</option>
              <option value="PIO">PIO / IMBA</option>
            </select>
            
            <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredHistory.map((entry) => (
            <Card key={entry.id}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '24px', alignItems: 'flex-start' }}>
                {/* Columna izquierda: FECHA, PROVEEDOR, ESTADO */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: '0 0 auto', minWidth: '250px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}>FECHA</div>
                    <div style={{ fontSize: '14px' }}>{new Date(entry.date).toLocaleDateString('es-ES')}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}>PROVEEDOR</div>
                    <div>
                      <span style={{
                        fontSize:'12px', 
                        fontWeight:'bold', 
                        background: entry.provider === 'SOFIA' ? '#fee2e2' : '#e0f2fe', 
                        color: entry.provider === 'SOFIA' ? theme.primary : '#0369a1', 
                        padding:'4px 8px', 
                        borderRadius:'6px'
                      }}>
                        {entry.provider}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                    <button onClick={() => handleDistribute(entry)} style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', backgroundColor: theme.primary, color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}>Repartir</button>
                    <button onClick={() => handlePlan(entry)} style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#f59e0b', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}>Planificar</button>
                    <button onClick={() => handleReceive(entry)} style={{ padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer', width: '100%' }}>Recibir</button>
                  </div>
                </div>

                {/* Columna derecha: DETALLE DE PRODUCTOS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '1 1 auto' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginBottom: '4px' }}>DETALLE DE PRODUCTOS</div>
                  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
                    {[104, 105, 106, 107, 108, 109, 110].map((code) => {
                      const d = entry.details[code] || { boxes: 0, units: 0, grossWeight: 0, netWeight: 0 };
                      return (
                        <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', minWidth: 'fit-content' }}>
                          <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>Código {code}</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                            <div style={{ position: 'relative' }}>
                              <div style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                                {d.boxes || 0}
                              </div>
                              <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                              <div style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                                {d.units || 0}
                              </div>
                              <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', fontSize: '10px', color: '#64748b' }}>
                              <div style={{ fontWeight: '600' }}>{d.grossWeight?.toFixed(2) || '0.00'} kg Bruto</div>
                              <div style={{ fontWeight: '600' }}>{d.netWeight?.toFixed(2) || '0.00'} kg Neto</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {filteredHistory.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No hay registros que coincidan con los filtros.</div>
          )}
        </div>
      </Card>
    </div>
  );
};

const DistributionView = ({ theme, assignment, planning, onBack, setWeighingMode, setSelectedWeighingGroup }) => {
  // Clientes de ejemplo con sus solicitudes
  const clients = [
    { id: 1, name: 'Pollería El Rey', group: 'El Alto Norte', orders: {104: 10, 107: 5} },
    { id: 2, name: 'Feria Sector A', group: 'El Alto Norte', orders: {104: 8, 109: 12} },
    { id: 3, name: 'Doña Juana', group: 'El Alto Sur', orders: {104: 5, 107: 3} }
  ];

  const [selectedGroup, setSelectedGroup] = useState('ALL');

  const groups = ['ALL', ...new Set(clients.map(c => c.group))];
  const filteredClients = selectedGroup === 'ALL' ? clients : clients.filter(c => c.group === selectedGroup);

  const [selectedVehicle, setSelectedVehicle] = useState('VH-01');
  const [selectedDriver, setSelectedDriver] = useState('CH-01');

  const [expandedGroups, setExpandedGroups] = useState(new Set());

  const [deliveries, setDeliveries] = useState(() => {
    const init = {};
    clients.forEach(client => {
      init[client.id] = {};
      [104, 105, 106, 107, 108, 109, 110].forEach(code => {
        const planned = planning[client.id]?.[code] || 0;
        init[client.id][code] = planned > 0 ? [{ boxes: planned, units: 0, grossWeight: 0, netWeight: 0 }] : [];
      });
    });
    return init;
  });

  const [sellingPrices, setSellingPrices] = useState(() => {
    const init = {};
    clients.forEach(client => {
      init[client.id] = 0;
    });
    return init;
  });

  const [costPrices, setCostPrices] = useState(() => {
    const init = {};
    clients.forEach(client => {
      init[client.id] = 0;
    });
    return init;
  });

  const [deferredPricing, setDeferredPricing] = useState(() => {
    const init = {};
    clients.forEach(client => {
      init[client.id] = false;
    });
    return init;
  });

  const [deferredPrices, setDeferredPrices] = useState(() => {
    const init = {};
    clients.forEach(client => {
      init[client.id] = {};
      [104, 105, 106, 107, 108, 109, 110].forEach(code => {
        init[client.id][code] = 0;
      });
    });
    return init;
  });

  const [hasOffal, setHasOffal] = useState(() => {
    const init = {};
    clients.forEach(client => {
      init[client.id] = {};
      [104, 105, 106, 107, 108, 109, 110].forEach(code => {
        init[client.id][code] = true; // Por defecto true como en ProductRow
      });
    });
    return init;
  });

  const [savedClients, setSavedClients] = useState({});

  // Vehículos y choferes de ejemplo por grupo de clientes
  const availableVehicles = [
    { id: 'VH-01', plate: '1234-ABC', capacity: '', description: 'Camión frigorífico pequeño' },
    { id: 'VH-02', plate: '5678-DEF', capacity: '', description: 'Camión frigorífico mediano' },
    { id: 'VH-03', plate: '9999-XYZ', capacity: '', description: 'Camioneta refrigerada' },
  ];

  const availableDrivers = [
    { id: 'CH-01', name: 'Juan Pérez' },
    { id: 'CH-02', name: 'María González' },
    { id: 'CH-03', name: 'Carlos Ramírez' },
  ];

  // Asignación de vehículo/chofer por grupo de clientes (ruta)
  const [groupAssignments, setGroupAssignments] = useState(() => {
    const init = {};
    groups.forEach(g => {
      if (g === 'ALL') return;
      init[g] = { vehicleId: 'VH-01', driverId: 'CH-01' };
    });
    return init;
  });

  const addDelivery = (clientId) => {
    setDeliveries(prev => ({
      ...prev,
      [clientId]: [...prev[clientId], {104: {boxes: 0, units: 0, grossWeight: 0, netWeight: 0}, 105: {boxes: 0, units: 0, grossWeight: 0, netWeight: 0}, 106: {boxes: 0, units: 0, grossWeight: 0, netWeight: 0}, 107: {boxes: 0, units: 0, grossWeight: 0, netWeight: 0}, 108: {boxes: 0, units: 0, grossWeight: 0, netWeight: 0}, 109: {boxes: 0, units: 0, grossWeight: 0, netWeight: 0}, 110: {boxes: 0, units: 0, grossWeight: 0, netWeight: 0}}]
    }));
  };

  const updateDelivery = (clientId, deliveryIndex, code, field, value) => {
    setDeliveries(prev => ({
      ...prev,
      [clientId]: prev[clientId].map((delivery, i) => 
        i === deliveryIndex ? { ...delivery, [code]: { ...delivery[code], [field]: parseFloat(value) || 0 } } : delivery
      )
    }));
  };

  const removeDelivery = (clientId, deliveryIndex) => {
    setDeliveries(prev => ({
      ...prev,
      [clientId]: prev[clientId].filter((_, i) => i !== deliveryIndex)
    }));
  };

  const getClientTotal = (clientId, code, field) => {
    const weighings = deliveries[clientId]?.[code] || [];
    return weighings.reduce((sum, weighing) => sum + (weighing[field] || 0), 0);
  };

  const getClientTotalBoxes = (clientId) => {
    return [104, 105, 106, 107, 108, 109, 110].reduce((sum, code) => sum + getClientTotal(clientId, code, 'boxes'), 0);
  };

  const getClientTotalUnits = (clientId) => {
    return [104, 105, 106, 107, 108, 109, 110].reduce((sum, code) => sum + getClientTotal(clientId, code, 'units'), 0);
  };

  const getClientTotalWeight = (clientId) => {
    return [104, 105, 106, 107, 108, 109, 110].reduce((sum, code) => sum + getClientTotal(clientId, code, 'netWeight'), 0);
  };

  const getClientTotalGrossWeight = (clientId) => {
    return [104, 105, 106, 107, 108, 109, 110].reduce((sum, code) => sum + getClientTotal(clientId, code, 'grossWeight'), 0);
  };

  const getTotalDistributed = (code) => {
    return clients.reduce((sum, client) => sum + getClientTotal(client.id, code, 'boxes'), 0);
  };

  const getTotalDistributedUnits = (code) => {
    return clients.reduce((sum, client) => sum + getClientTotal(client.id, code, 'units'), 0);
  };

  const getGroupTotalBoxes = (groupName) => {
    return filteredClients.filter(c => c.group === groupName).reduce((sum, client) => sum + getClientTotalBoxes(client.id), 0);
  };

  const getGroupTotalUnits = (groupName) => {
    return filteredClients.filter(c => c.group === groupName).reduce((sum, client) => sum + getClientTotalUnits(client.id), 0);
  };

  const getGroupTotalWeight = (groupName) => {
    return filteredClients.filter(c => c.group === groupName).reduce((sum, client) => sum + getClientTotalWeight(client.id), 0);
  };

  const getGroupTotalGrossWeight = (groupName) => {
    return filteredClients.filter(c => c.group === groupName).reduce((sum, client) => sum + getClientTotalGrossWeight(client.id), 0);
  };

  const getGroupSellingTotal = (groupName) => {
    return filteredClients.filter(c => c.group === groupName).reduce((sum, client) => sum + getClientSellingTotal(client.id), 0);
  };

  const getGroupTotalByCode = (groupName, code, field) => {
    return filteredClients.filter(c => c.group === groupName).reduce((sum, client) => sum + getClientTotal(client.id, code, field), 0);
  };

  const getGroupTotals = () => {
    const groupTotals = {};
    groups.forEach(group => {
      groupTotals[group] = { boxes: 0, units: 0, byCode: {} };
    });

    clients.forEach(client => {
      const group = client.group;
      if (groupTotals[group]) {
        Object.entries(deliveries[client.id] || []).forEach(([deliveryIndex, delivery]) => {
          Object.entries(delivery).forEach(([code, data]) => {
            if (data.boxes > 0) {
              groupTotals[group].boxes += data.boxes;
              groupTotals[group].units += data.units;
              groupTotals[group].byCode[code] = (groupTotals[group].byCode[code] || 0) + data.boxes;
            }
          });
        });
      }
    });

    return groupTotals;
  };

  const toggleGroupExpansion = (group) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(group)) {
        newSet.delete(group);
      } else {
        newSet.add(group);
      }
      return newSet;
    });
  };
  const updateSellingPrice = (clientId, price) => {
    setSellingPrices(prev => ({
      ...prev,
      [clientId]: parseFloat(price) || 0
    }));
  };
  const updateCostPrice = (clientId, price) => {
    setCostPrices(prev => ({
      ...prev,
      [clientId]: parseFloat(price) || 0
    }));
  };

  const saveClient = (clientId) => {
    setSavedClients(prev => ({
      ...prev,
      [clientId]: true
    }));
    alert(`Cliente ${clients.find(c => c.id === clientId).name} guardado exitosamente`);
  };

  const getClientSellingTotal = (clientId) => {
    const totalWeight = getClientTotalWeight(clientId);
    const price = sellingPrices[clientId] || 0;
    return totalWeight * price;
  };

  // Agregar pesaje a un código específico de un cliente
  const addWeighing = (clientId, code) => {
    setDeliveries(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [code]: [...(prev[clientId]?.[code] || []), { boxes: 0, units: 0, grossWeight: 0, netWeight: 0 }]
      }
    }));
  };

  // Actualizar pesaje
  const updateWeighing = (clientId, code, index, field, value) => {
    setDeliveries(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [code]: (prev[clientId]?.[code] || []).map((w, i) => 
          i === index ? { ...w, [field]: parseFloat(value) || 0 } : w
        )
      }
    }));
  };

  // Remover pesaje
  const removeWeighing = (clientId, code, index) => {
    setDeliveries(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [code]: (prev[clientId]?.[code] || []).filter((_, i) => i !== index)
      }
    }));
  };

  // Actualizar precio diferido de cliente
  const updateDeferredPricing = (clientId, deferred) => {
    setDeferredPricing(prev => ({
      ...prev,
      [clientId]: deferred
    }));
  };

  // Actualizar precio diferido por código
  const updateDeferredPrice = (clientId, code, price) => {
    setDeferredPrices(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [code]: parseFloat(price) || 0
      }
    }));
  };

  // Actualizar menudencia por código
  const updateHasOffal = (clientId, code, hasOffalValue) => {
    setHasOffal(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [code]: hasOffalValue
      }
    }));
  };

  const getClientCostTotal = (clientId) => {
    const totalWeight = getClientTotalWeight(clientId);
    const price = costPrices[clientId] || 0;
    return totalWeight * price;
  };

  const printClientDetails = (client) => {
    const printWindow = window.open('', '_blank');
    const totalGrossWeight = getClientTotalGrossWeight(client.id);
    const totalNetWeight = getClientTotalWeight(client.id);
    const totalBoxes = getClientTotalBoxes(client.id);
    const totalUnits = getClientTotalUnits(client.id);
    const sellingPrice = sellingPrices[client.id] || 0;
    const totalSelling = getClientSellingTotal(client.id);

    const html = `
      <html>
        <head>
          <title>Detalle de Venta - ${client.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #e11d48; }
            h2 { color: #1f2937; margin-top: 30px; }
            .details { margin: 20px 0; }
            .codes-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .codes-table th, .codes-table td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            .codes-table th { background-color: #f3f4f6; font-weight: bold; }
            .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Detalle de Venta</h1>
          <div class="details">
            <p><strong>Cliente:</strong> ${client.name}</p>
            <p><strong>Grupo:</strong> ${client.group}</p>
            <p><strong>Encargado:</strong> Juan Perez</p>
          </div>
          <h2>Productos Entregados</h2>
          <table class="codes-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cajas</th>
                <th>Unidades</th>
                <th>Peso Bruto (kg)</th>
                <th>Peso Neto (kg)</th>
                <th>Total BS</th>
              </tr>
            </thead>
            <tbody>
              ${[104, 105, 106, 107, 108, 109, 110].map(code => {
                const netWeight = getClientTotal(client.id, code, 'netWeight');
                const codePrice = deferredPrices[client.id]?.[code] || sellingPrice;
                const codeTotal = netWeight * codePrice;
                return `
                  <tr>
                    <td><strong>${code}</strong></td>
                    <td>${getClientTotal(client.id, code, 'boxes')}</td>
                    <td>${getClientTotal(client.id, code, 'units')}</td>
                    <td>${getClientTotal(client.id, code, 'grossWeight').toFixed(2)}</td>
                    <td>${netWeight.toFixed(2)}</td>
                    <td>Bs ${codeTotal.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
              <tr style="font-weight: bold; background-color: #f3f4f6;">
                <td><strong>TOTAL</strong></td>
                <td>${totalBoxes}</td>
                <td>${totalUnits}</td>
                <td>${totalGrossWeight.toFixed(2)}</td>
                <td>${totalNetWeight.toFixed(2)}</td>
                <td>Bs ${totalSelling.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="font-weight: bold; color: #495057;">Total cajas deuda:</span>
              <span style="font-weight: bold; color: #dc3545;">${totalBoxes}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
              <span style="font-weight: bold; color: #495057;">Total deuda:</span>
              <span style="font-weight: bold; color: #dc3545;">Bs ${totalSelling.toFixed(2)}</span>
            </div>
            <div style="text-align: center;">
              <p style="margin: 10px 0; font-size: 14px; color: #6c757d;">Puedes pagar por este medio:</p>
              <img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=puedes+pagar+por+este+medio" alt="Código QR para pago" style="border: 2px solid #dee2e6; border-radius: 8px;" />
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      <Card style={{ position: 'sticky', top: 0, zIndex: 10, padding: '8px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 360px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Repartir Asignación </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PROVEEDOR:</span> <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{assignment.provider}</span></div>
              <div><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>COSTO POR KG:</span> <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Bs {assignment.costPerKg?.toFixed(2) || 'N/A'}</span></div>
              <div><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PRECIO DIFERIDO:</span> <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{assignment.deferredPricing ? 'Sí' : 'No'}</span></div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={onBack} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold', color: theme.textMain }}>Cancelar</button>
              <button style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Guardar</button>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ padding: '16px', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>Detalles de la Asignación</h4>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
            {[104, 105, 106, 107, 108, 109, 110].map((code) => {
              const detail = assignment.details[code] || { boxes: 0, units: 0, grossWeight: 0, netWeight: 0 };
              return (
                <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', minWidth: 'fit-content' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>Código {code}</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                        {(detail.boxes || 0) - getTotalDistributed(code)}/{detail.boxes || 0}
                      </div>
                      <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                        {(detail.units || 0) - getTotalDistributedUnits(code)}/{detail.units || 0}
                      </div>
                      <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', fontSize: '10px', color: '#64748b' }}>
                      <div style={{ fontWeight: '600' }}>Costo: Bs {(assignment.deferredPricing ? (assignment.pricesPerCode?.[code] || 0) : assignment.costPerKg || 0).toFixed(2)}/kg</div>
                    </div>
                </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </Card>

      <Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(
            filteredClients.reduce((groups, client) => {
              if (!groups[client.group]) {
                groups[client.group] = [];
              }
              groups[client.group].push(client);
              return groups;
            }, {})
          ).map(([groupName, groupClients]) => {
            const isExpanded = expandedGroups.has(groupName);
            return (
              <div key={groupName} style={{ backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div onClick={() => toggleGroupExpansion(groupName)} style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: theme.primary, minWidth: '120px' }}>{groupName}</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {[104, 105, 106, 107, 108, 109, 110].map((code) => {
                        const boxes = getGroupTotalByCode(groupName, code, 'boxes');
                        const units = getGroupTotalByCode(groupName, code, 'units');
                        return (
                          <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #cbd5e1', minWidth: '70px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>Código {code}</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ position: 'relative' }}>
                                <div style={{ width: '50px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                                  {boxes}
                                </div>
                                <span style={{ position: 'absolute', top: '-12px', left: '8px', fontSize: '7px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                              </div>
                              <div style={{ position: 'relative' }}>
                                <div style={{ width: '50px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                                  {units}
                                </div>
                                <span style={{ position: 'absolute', top: '-12px', left: '10px', fontSize: '7px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px', backgroundColor: theme.primary, borderRadius: '6px', border: '1px solid #7c3aed', minWidth: '80px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'center', color: 'white' }}>TOTAL</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ position: 'relative' }}>
                            <div style={{ width: '60px', padding: '6px', borderRadius: '4px', border: '1px solid #7c3aed', backgroundColor: 'white', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                              {getGroupTotalBoxes(groupName)}
                            </div>
                            <span style={{ position: 'absolute', top: '-12px', left: '10px', fontSize: '7px', backgroundColor: theme.primary, padding: '0 2px', fontWeight: 'bold', color: 'white' }}>CAJAS</span>
                          </div>
                          <div style={{ position: 'relative' }}>
                            <div style={{ width: '60px', padding: '6px', borderRadius: '4px', border: '1px solid #7c3aed', backgroundColor: 'white', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                              {getGroupTotalUnits(groupName)}
                            </div>
                            <span style={{ position: 'absolute', top: '-12px', left: '12px', fontSize: '7px', backgroundColor: theme.primary, padding: '0 2px', fontWeight: 'bold', color: 'white' }}>UNID.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      onClick={() => {
                        setWeighingMode(true);
                        setSelectedWeighingGroup(groupName);
                      }}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        backgroundColor: theme.primary,
                        color: 'white',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '11px'
                      }}
                    >
                      Empezar
                    </button>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {groupClients.length} cliente{groupClients.length !== 1 ? 's' : ''}
                    </div>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </div>
                
                {isExpanded && (
                  <div style={{ padding: '12px', borderTop: '1px solid #e2e8f0' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#64748b' }}>Clientes del Grupo:</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {groupClients.map(client => (
                          <div key={client.id} style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {/* Header con nombre y botones */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: theme.primary }}>{client.name}</h4>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <button
                                    onClick={() => saveClient(client.id)}
                                    disabled={savedClients[client.id]}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      border: 'none',
                                      backgroundColor: savedClients[client.id] ? '#10b981' : theme.primary,
                                      color: 'white',
                                      cursor: savedClients[client.id] ? 'not-allowed' : 'pointer',
                                      fontWeight: 'bold',
                                      fontSize: '11px'
                                    }}
                                  >
                                    {savedClients[client.id] ? 'Guardado' : 'Guardar'}
                                  </button>
                                  <button
                                    onClick={() => printClientDetails(client)}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      border: '1px solid #e2e8f0',
                                      backgroundColor: 'white',
                                      color: theme.primary,
                                      cursor: 'pointer',
                                      fontWeight: 'bold',
                                      fontSize: '11px'
                                    }}
                                  >
                                    🖨️ Imprimir
                                  </button>
                                </div>
                              </div>

                              {/* Controles de precio */}
                              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>PRECIO VENTA (Bs/Kg)</div>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={sellingPrices[client.id] || ''}
                                    onChange={(e) => updateSellingPrice(client.id, e.target.value)}
                                    disabled={deferredPricing[client.id]}
                                    style={{
                                      width: '100px',
                                      padding: '4px',
                                      borderRadius: '4px',
                                      border: '1px solid #cbd5e1',
                                      outline: 'none',
                                      fontSize: '11px',
                                      textAlign: 'center',
                                      opacity: deferredPricing[client.id] ? 0.5 : 1
                                    }}
                                  />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <label htmlFor={`deferred-pricing-${client.id}`} style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', cursor: 'pointer' }}>
                                    Precio diferido
                                  </label>
                                  <input
                                    type="checkbox"
                                    id={`deferred-pricing-${client.id}`}
                                    checked={deferredPricing[client.id] || false}
                                    onChange={(e) => updateDeferredPricing(client.id, e.target.checked)}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                  />
                                </div>
                              </div>

                              {/* Códigos */}
                              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px', alignItems: 'flex-start' }}>
                                {[104, 105, 106, 107, 108, 109, 110].map((code) => {
                                  const hasWeighings = (deliveries[client.id]?.[code] || []).length > 0;
                                  return (
                                    <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', minWidth: 'fit-content' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>Código {code}</span>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ position: 'relative' }}>
                                          <div style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '12px', fontWeight: '600' }}>
                                            {getClientTotal(client.id, code, 'boxes')}
                                          </div>
                                          <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                          <div style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '12px', fontWeight: '600' }}>
                                            {getClientTotal(client.id, code, 'units')}
                                          </div>
                                          <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', fontSize: '10px', color: '#64748b' }}>
                                          <div style={{ fontWeight: '600' }}>{(assignment.details[code]?.grossWeight || 0).toFixed(2)} kg Bruto</div>
                                          <div style={{ fontWeight: '600' }}>{getClientTotal(client.id, code, 'netWeight').toFixed(2)} kg Neto</div>
                                        </div>
                                      </div>
                                      {deferredPricing[client.id] && (
                                        <div style={{ position: 'relative', marginTop: '4px' }}>
                                          <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Bs/Kg"
                                            value={(deferredPrices[client.id]?.[code] || '')}
                                            onChange={(e) => updateDeferredPrice(client.id, code, e.target.value)}
                                            style={{
                                              width: '60px',
                                              padding: '3px',
                                              borderRadius: '3px',
                                              border: '1px solid #d97706',
                                              outline: 'none',
                                              fontSize: '9px',
                                              textAlign: 'center',
                                              backgroundColor: 'white'
                                            }}
                                          />
                                          <span style={{ position: 'absolute', top: '-6px', left: '2px', fontSize: '7px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#92400e' }}>PRECIO</span>
                                        </div>
                                      )}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                        <input
                                          type="checkbox"
                                          id={`offal-${client.id}-${code}`}
                                          checked={hasOffal[client.id]?.[code] || true}
                                          onChange={(e) => updateHasOffal(client.id, code, e.target.checked)}
                                          style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                                        />
                                        <label
                                          htmlFor={`offal-${client.id}-${code}`}
                                          style={{ fontSize: '8px', fontWeight: 'bold', color: '#94a3b8', cursor: 'pointer', userSelect: 'none' }}
                                        >
                                          MENUDENCIA
                                        </label>
                                      </div>
                                      <button onClick={() => addWeighing(client.id, code)} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer', fontWeight: 'bold', color: theme.primary, fontSize: '10px' }}>
                                        Agregar Pesaje
                                      </button>
                                      {hasWeighings && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                                          {(deliveries[client.id][code] || []).map((weighing, index) => (
                                            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Pesaje {index + 1}:</span>
                                                <button onClick={() => removeWeighing(client.id, code, index)} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', fontSize: '10px' }}>×</button>
                                              </div>
                                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <div style={{ position: 'relative' }}>
                                                  <input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    value={weighing.boxes || ''} 
                                                    onChange={(e) => updateWeighing(client.id, code, index, 'boxes', e.target.value)}
                                                    style={{ 
                                                      width: '60px', 
                                                      padding: '6px', 
                                                      borderRadius: '4px', 
                                                      border: '1px solid #cbd5e1', 
                                                      outline: 'none',
                                                      fontSize: '12px',
                                                      textAlign: 'center'
                                                    }}
                                                  />
                                                  <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                                                
                                                    <input
                                                      type="checkbox"
                                                      id={`offal-${client.id}-${code}`}
                                                      checked={hasOffal[client.id]?.[code] || false}
                                                      onChange={(e) => updateHasOffal(client.id, code, e.target.checked)}
                                                      style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                                                    />
                                                </div>

                                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                  <input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    value={weighing.units || ''} 
                                                    onChange={(e) => updateWeighing(client.id, code, index, 'units', e.target.value)}
                                                    style={{ 
                                                      width: '60px', 
                                                      padding: '6px', 
                                                      borderRadius: '4px', 
                                                      border: '1px solid #cbd5e1', 
                                                      outline: 'none',
                                                      fontSize: '12px',
                                                      textAlign: 'center'
                                                    }}
                                                  />
                                                  <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                                                  
                                                  <button 
                                                    onClick={() => {/* función para seleccionar contenedor */}}
                                                      style={{ 
                                                        padding: '6px', 
                                                        borderRadius: '4px', 
                                                        border: '1px solid #cbd5e1', 
                                                        backgroundColor: 'white', 
                                                        cursor: 'pointer', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center'
                                                      }}
                                                  >
                                                    <Package size={14} color={theme.primary} />
                                                  </button>
                                                </div>
                                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                  <input 
                                                    type="number" 
                                                    step="0.01"
                                                    placeholder="0.00" 
                                                    value={weighing.weight || ''} 
                                                    onChange={(e) => updateWeighing(client.id, code, index, 'weight', e.target.value)}
                                                    style={{ 
                                                      width: '60px', 
                                                      padding: '6px', 
                                                      borderRadius: '4px', 
                                                      border: '1px solid #cbd5e1', 
                                                      outline: 'none',
                                                      fontSize: '12px',
                                                      textAlign: 'center'
                                                    }}
                                                  />
                                                  <button 
                                                    onClick={() => {/* función para conectar */}}
                                                    style={{ 
                                                      padding: '6px', 
                                                      borderRadius: '4px', 
                                                      border: '1px solid #cbd5e1', 
                                                      backgroundColor: 'white', 
                                                      cursor: 'pointer', 
                                                      display: 'flex', 
                                                      alignItems: 'center', 
                                                      justifyContent: 'center'
                                                    }}
                                                  >
                                                    <Scale size={14} color={theme.primary} />
                                                  </button>
                                                  <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>KG</span>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>


        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onBack} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold', color: theme.textMain }}>Cancelar</button>
          <button style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: theme.primary, color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Save size={16} /> Guardar Distribución
          </button>
        </div>
      </Card>
    </div>
  );
};

const DistributionWeighingView = ({ theme, assignment, groupName, onBack, setWeighingMode, setSelectedWeighingGroup }) => {
  // All clients for the assignment
  const clients = [
    { id: 1, name: 'Pollería El Rey', group: 'El Alto Norte', orders: {104: 10, 107: 5} },
    { id: 2, name: 'Feria Sector A', group: 'El Alto Norte', orders: {104: 8, 109: 12} },
    { id: 3, name: 'Doña Juana', group: 'El Alto Sur', orders: {104: 5, 107: 3} },
    { id: 4, name: 'Supermercado Central', group: 'La Paz Centro', orders: {105: 15, 108: 7} }
  ];

  // Filter clients for the group if groupName is provided, else all
  const filteredClients = groupName ? clients.filter(client => client.group === groupName) : clients;

  // Create clientRequests from clients for compatibility with the card
  const clientRequests = filteredClients.map(client => ({
    id: client.id,
    clientName: client.name,
    group: client.group,
    requested: client.orders,
    status: 'PENDIENTE'
  }));

  // State for weighings per client
  const [clientWeighings, setClientWeighings] = useState(() => {
    const init = {};
    clients.forEach(client => {
      init[client.id] = {};
      [104, 105, 106, 107, 108, 109, 110].forEach(code => {
        init[client.id][code] = [];
      });
    });
    return init;
  });

  const [deliveries, setDeliveries] = useState(clientWeighings);

  useEffect(() => {
    setDeliveries(clientWeighings);
  }, [clientWeighings]);

  // Planning states
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [plannedDistributions, setPlannedDistributions] = useState({});
  const [savedGroups, setSavedGroups] = useState(new Set());

  // Additional states for the assignment card
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [groupAssignments, setGroupAssignments] = useState({});
  const [savedClients, setSavedClients] = useState(new Set());
  const [sellingPrices, setSellingPrices] = useState({});
  const [deferredPricing, setDeferredPricing] = useState({});
  const [deferredPrices, setDeferredPrices] = useState({});
  const [hasOffal, setHasOffal] = useState({});

  // Dummy data for vehicles and drivers
  const availableVehicles = [
    { id: 1, plate: 'ABC-123', capacity: '5 tons' },
    { id: 2, plate: 'DEF-456', capacity: '3 tons' }
  ];
  const availableDrivers = [
    { id: 1, name: 'Juan Perez' },
    { id: 2, name: 'Maria Lopez' }
  ];

  // Selected group
  const selectedGroup = groupName;

  // Add weighing to a client and code
  const addWeighing = (clientId, code) => {
    setClientWeighings(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [code]: [...(prev[clientId]?.[code] || []), { boxes: 0, units: 0, grossWeight: 0, netWeight: 0 }]
      }
    }));
  };

  // Update weighing
  const updateWeighing = (clientId, code, index, field, value) => {
    setClientWeighings(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [code]: (prev[clientId]?.[code] || []).map((w, i) => 
          i === index ? { ...w, [field]: parseFloat(value) || 0 } : w
        )
      }
    }));
  };

  // Remove weighing
  const removeWeighing = (clientId, code, index) => {
    setClientWeighings(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [code]: (prev[clientId]?.[code] || []).filter((_, i) => i !== index)
      }
    }));
  };

  // Planning functions
  const toggleGroupExpansion = (groupName) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupName)) {
        newSet.delete(groupName);
      } else {
        newSet.add(groupName);
      }
      return newSet;
    });
  };

  const updatePlannedDistribution = (clientId, code, value) => {
    setPlannedDistributions(prev => ({
      ...prev,
      [clientId]: {
        ...prev[clientId],
        [code]: parseInt(value) || 0
      }
    }));
  };

  const handleSaveGroup = (group) => {
    setSavedGroups(prev => new Set([...prev, group]));
    alert(`Grupo ${group} guardado`);
  };

  const getTotalPlannedByCode = (code) => {
    return filteredClients.reduce((sum, client) => sum + (plannedDistributions[client.id]?.[code] || 0), 0);
  };

  const getGroupTotals = () => {
    const groupTotals = {};
    [...new Set(filteredClients.map(c => c.group))].forEach(group => {
      groupTotals[group] = { boxes: 0, units: 0, byCode: {} };
      [104, 105, 106, 107, 108, 109, 110].forEach(code => {
        groupTotals[group].byCode[code] = filteredClients.filter(c => c.group === group).reduce((sum, client) => sum + (plannedDistributions[client.id]?.[code] || 0), 0);
        groupTotals[group].boxes += groupTotals[group].byCode[code];
        groupTotals[group].units += groupTotals[group].byCode[code]; // Assuming 1 box = 1 unit
      });
    });
    return groupTotals;
  };

  const getGroupTotalBoxes = (groupName) => {
    return filteredClients.filter(c => c.group === groupName).reduce((sum, client) => sum + Object.values(client.orders || {}).reduce((s, qty) => s + qty, 0), 0);
  };

  const getGroupTotalUnits = (groupName) => {
    return getGroupTotalBoxes(groupName); // Assuming 1 box = 1 unit
  };

  const getGroupTotalByCode = (groupName, code, field) => {
    return filteredClients.filter(c => c.group === groupName).reduce((sum, client) => sum + (client.orders?.[code] || 0), 0);
  };

  // Get total weight for a client and code
  const getClientCodeWeight = (clientId, code) => {
    const weighings = clientWeighings[clientId]?.[code] || [];
    return weighings.reduce((sum, w) => sum + (w.netWeight || 0), 0);
  };

  // Get total weight for a client
  const getClientTotalWeight = (clientId) => {
    return [104, 105, 106, 107, 108, 109, 110].reduce((sum, code) => sum + getClientCodeWeight(clientId, code), 0);
  };

  // Get group totals
  const getGroupTotalWeight = () => {
    return clients.reduce((sum, client) => sum + getClientTotalWeight(client.id), 0);
  };

  // Get total boxes for a client
  const getClientTotalBoxes = (clientId) => {
    return [104, 105, 106, 107, 108, 109, 110].reduce((sum, code) => sum + getClientTotal(clientId, code, 'boxes'), 0);
  };

  // Get total units for a client
  const getClientTotalUnits = (clientId) => {
    return [104, 105, 106, 107, 108, 109, 110].reduce((sum, code) => sum + getClientTotal(clientId, code, 'units'), 0);
  };

  // Get selling total for a client
  const getClientSellingTotal = (clientId) => {
    const totalWeight = getClientTotalWeight(clientId);
    const price = sellingPrices[clientId] || 0;
    return totalWeight * price;
  };

  // Additional functions for the assignment card
  const saveClient = (clientId) => {
    setSavedClients(prev => new Set([...prev, clientId]));
    alert(`Cliente ${clientId} guardado`);
  };

  const printClientDetails = (client) => {
    const printWindow = window.open('', '_blank');
    const totalGrossWeight = [104, 105, 106, 107, 108, 109, 110].reduce((sum, code) => sum + getClientTotal(client.id, code, 'grossWeight'), 0);
    const totalNetWeight = getClientTotalWeight(client.id);
    const totalBoxes = getClientTotalBoxes(client.id);
    const totalUnits = getClientTotalUnits(client.id);
    const sellingPrice = sellingPrices[client.id] || 0;
    const totalSelling = getClientSellingTotal(client.id);

    const html = `
      <html>
        <head>
          <title>Detalle de Venta - ${client.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #e11d48; }
            h2 { color: #1f2937; margin-top: 30px; }
            .details { margin: 20px 0; }
            .codes-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .codes-table th, .codes-table td { border: 1px solid #ccc; padding: 8px; text-align: center; }
            .codes-table th { background-color: #f3f4f6; font-weight: bold; }
            .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Detalle de Venta</h1>
          <div class="details">
            <p><strong>Cliente:</strong> ${client.name}</p>
            <p><strong>Grupo:</strong> ${client.group}</p>
            <p><strong>Encargado:</strong> Juan Perez</p>
          </div>
          <h2>Productos Entregados</h2>
          <table class="codes-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Cajas</th>
                <th>Unidades</th>
                <th>Peso Bruto (kg)</th>
                <th>Peso Neto (kg)</th>
                <th>Total BS</th>
              </tr>
            </thead>
            <tbody>
              ${[104, 105, 106, 107, 108, 109, 110].map(code => {
                const netWeight = getClientTotal(client.id, code, 'netWeight');
                const codePrice = deferredPrices[client.id]?.[code] || sellingPrice;
                const codeTotal = netWeight * codePrice;
                return `
                  <tr>
                    <td><strong>${code}</strong></td>
                    <td>${getClientTotal(client.id, code, 'boxes')}</td>
                    <td>${getClientTotal(client.id, code, 'units')}</td>
                    <td>${getClientTotal(client.id, code, 'grossWeight').toFixed(2)}</td>
                    <td>${netWeight.toFixed(2)}</td>
                    <td>Bs ${codeTotal.toFixed(2)}</td>
                  </tr>
                `;
              }).join('')}
              <tr style="font-weight: bold; background-color: #f3f4f6;">
                <td><strong>TOTAL</strong></td>
                <td>${totalBoxes}</td>
                <td>${totalUnits}</td>
                <td>${totalGrossWeight.toFixed(2)}</td>
                <td>${totalNetWeight.toFixed(2)}</td>
                <td>Bs ${totalSelling.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
              <span style="font-weight: bold; color: #495057;">Total cajas deuda:</span>
              <span style="font-weight: bold; color: #dc3545;">${totalBoxes}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
              <span style="font-weight: bold; color: #495057;">Total deuda:</span>
              <span style="font-weight: bold; color: #dc3545;">Bs ${totalSelling.toFixed(2)}</span>
            </div>
            <div style="text-align: center;">
              <p style="margin: 10px 0; font-size: 14px; color: #6c757d;">Puedes pagar por este medio:</p>
              <img src="https://chart.googleapis.com/chart?chs=150x150&cht=qr&chl=puedes+pagar+por+este+medio" alt="Código QR para pago" style="border: 2px solid #dee2e6; border-radius: 8px;" />
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const updateSellingPrice = (clientId, value) => {
    setSellingPrices(prev => ({ ...prev, [clientId]: value }));
  };

  const updateDeferredPricing = (clientId, checked) => {
    setDeferredPricing(prev => ({ ...prev, [clientId]: checked }));
  };

  const updateDeferredPrice = (clientId, code, value) => {
    setDeferredPrices(prev => ({
      ...prev,
      [clientId]: { ...prev[clientId], [code]: value }
    }));
  };

  const updateHasOffal = (clientId, code, checked) => {
    setHasOffal(prev => ({
      ...prev,
      [clientId]: { ...prev[clientId], [code]: checked }
    }));
  };

  const getClientTotal = (clientId, code, field) => {
    const weighings = clientWeighings[clientId]?.[code] || [];
    if (field === 'boxes') return weighings.reduce((sum, w) => sum + (w.boxes || 0), 0);
    if (field === 'units') return weighings.reduce((sum, w) => sum + (w.units || 0), 0);
    if (field === 'netWeight') return weighings.reduce((sum, w) => sum + (w.netWeight || 0), 0);
    if (field === 'grossWeight') return weighings.reduce((sum, w) => sum + (w.grossWeight || 0), 0);
    return 0;
  };

  const printRoute = () => {
    const printWindow = window.open('', '_blank');
    const html = `
      <html>
        <head>
          <title>Ruta de Distribución - ${groupName}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #3b82f6; }
            .details { margin: 20px 0; }
            .route-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .route-table th, .route-table td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            .route-table th { background-color: #f3f4f6; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Ruta de Distribución</h1>
          <div class="details">
            <p><strong>Grupo:</strong> ${groupName}</p>
            <p><strong>Vehículo:</strong> ${selectedVehicle ? availableVehicles.find(v => v.id == selectedVehicle)?.plate : 'No asignado'}</p>
            <p><strong>Chofer:</strong> ${selectedDriver ? availableDrivers.find(d => d.id == selectedDriver)?.name : 'No asignado'}</p>
          </div>
          <table class="route-table">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Monto a Cobrar (Bs)</th>
                <th>Deuda Cajas</th>
                <th>Deuda Dinero</th>
              </tr>
            </thead>
            <tbody>
              ${filteredClients.map(client => {
                const totalWeight = getClientTotalWeight(client.id);
                const sellingPrice = sellingPrices[client.id] || 0;
                const amount = totalWeight * sellingPrice;
                const boxDebt = client.orders ? Object.values(client.orders).reduce((sum, qty) => sum + qty, 0) - getClientTotal(client.id, null, 'boxes') : 0;
                const moneyDebt = deferredPricing[client.id] ? amount.toFixed(2) : '0.00';
                return `
                  <tr>
                    <td>${client.name}</td>
                    <td>${amount.toFixed(2)}</td>
                    <td>${boxDebt}</td>
                    <td>${moneyDebt}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card style={{ position: 'sticky', top: 0, zIndex: 10, padding: '8px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 360px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Pesaje - {groupName}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PROVEEDOR:</span> <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{assignment.provider}</span></div>
              <div><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>GRUPO:</span> <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{groupName}</span></div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>VEHÍCULO</label>
                  <select 
                    value={selectedVehicle} 
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '12px' }}
                  >
                    {availableVehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>{vehicle.plate} - {vehicle.capacity}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CHOFER</label>
                  <select 
                    value={selectedDriver} 
                    onChange={(e) => setSelectedDriver(e.target.value)}
                    style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '12px' }}
                  >
                    {availableDrivers.map(driver => (
                      <option key={driver.id} value={driver.id}>{driver.name}</option>
                    ))}
                  </select>
                </div>
            </div>
            
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={onBack} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold', color: theme.textMain }}>Volver</button>
              <button style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Guardar Pesaje</button>
              <button onClick={printRoute} style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Imprimir Ruta</button>
            </div>
          </div>

          <div style={{ flex: 1 }}>

<div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {[104, 105, 106, 107, 108, 109, 110].map((code) => {
                        const boxes = getGroupTotalByCode(groupName, code, 'boxes');
                        const units = getGroupTotalByCode(groupName, code, 'units');
                        return (
                          <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #cbd5e1', minWidth: '70px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>Código {code}</span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ position: 'relative' }}>
                                <div style={{ width: '50px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                                  {boxes}
                                </div>
                                <span style={{ position: 'absolute', top: '-12px', left: '8px', fontSize: '7px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                              </div>
                              <div style={{ position: 'relative' }}>
                                <div style={{ width: '50px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                                  {units}
                                </div>
                                <span style={{ position: 'absolute', top: '-12px', left: '10px', fontSize: '7px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px', backgroundColor: theme.primary, borderRadius: '6px', border: '1px solid #7c3aed', minWidth: '80px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'center', color: 'white' }}>TOTAL</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ position: 'relative' }}>
                            <div style={{ width: '60px', padding: '6px', borderRadius: '4px', border: '1px solid #7c3aed', backgroundColor: 'white', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                              {getGroupTotalBoxes(groupName)}
                            </div>
                            <span style={{ position: 'absolute', top: '-12px', left: '10px', fontSize: '7px', backgroundColor: theme.primary, padding: '0 2px', fontWeight: 'bold', color: 'white' }}>CAJAS</span>
                          </div>
                          <div style={{ position: 'relative' }}>
                            <div style={{ width: '60px', padding: '6px', borderRadius: '4px', border: '1px solid #7c3aed', backgroundColor: 'white', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                              {getGroupTotalUnits(groupName)}
                            </div>
                            <span style={{ position: 'absolute', top: '-12px', left: '12px', fontSize: '7px', backgroundColor: theme.primary, padding: '0 2px', fontWeight: 'bold', color: 'white' }}>UNID.</span>
                          </div>
                        </div>
                      </div>
                    </div>

          </div>
        </div>
      </Card>

      <Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(
            filteredClients.reduce((groups, client) => {
              if (!groups[client.group]) {
                groups[client.group] = [];
              }
              groups[client.group].push(client);
              return groups;
            }, {})
          ).map(([groupName, groupClients]) => {
            const isExpanded = expandedGroups.has(groupName);
            return (
              <div key={groupName} style={{ backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>

                
                  <div style={{ padding: '12px', borderTop: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {groupClients.map(client => (
                          <div key={client.id} style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              {/* Header con nombre y botones */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: theme.primary }}>{client.name}</h4>
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <button
                                    onClick={() => saveClient(client.id)}
                                    disabled={savedClients[client.id]}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      border: 'none',
                                      backgroundColor: savedClients[client.id] ? '#10b981' : theme.primary,
                                      color: 'white',
                                      cursor: savedClients[client.id] ? 'not-allowed' : 'pointer',
                                      fontWeight: 'bold',
                                      fontSize: '11px'
                                    }}
                                  >
                                    {savedClients[client.id] ? 'Guardado' : 'Guardar'}
                                  </button>
                                  <button
                                    onClick={() => printClientDetails(client)}
                                    style={{
                                      padding: '6px 10px',
                                      borderRadius: '6px',
                                      border: '1px solid #e2e8f0',
                                      backgroundColor: 'white',
                                      color: theme.primary,
                                      cursor: 'pointer',
                                      fontWeight: 'bold',
                                      fontSize: '11px'
                                    }}
                                  >
                                    🖨️ Imprimir
                                  </button>
                                </div>
                              </div>

                              {/* Controles de precio */}
                              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>PRECIO VENTA (Bs/Kg)</div>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={sellingPrices[client.id] || ''}
                                    onChange={(e) => updateSellingPrice(client.id, e.target.value)}
                                    disabled={deferredPricing[client.id]}
                                    style={{
                                      width: '100px',
                                      padding: '4px',
                                      borderRadius: '4px',
                                      border: '1px solid #cbd5e1',
                                      outline: 'none',
                                      fontSize: '11px',
                                      textAlign: 'center',
                                      opacity: deferredPricing[client.id] ? 0.5 : 1
                                    }}
                                  />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <label htmlFor={`deferred-pricing-${client.id}`} style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', cursor: 'pointer' }}>
                                    Precio diferido
                                  </label>
                                  <input
                                    type="checkbox"
                                    id={`deferred-pricing-${client.id}`}
                                    checked={deferredPricing[client.id] || false}
                                    onChange={(e) => updateDeferredPricing(client.id, e.target.checked)}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                  />
                                </div>
                              </div>

                              {/* Códigos */}
                              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px', alignItems: 'flex-start' }}>
                                {[104, 105, 106, 107, 108, 109, 110].map((code) => {
                                  const hasWeighings = (deliveries[client.id]?.[code] || []).length > 0;
                                  return (
                                    <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', minWidth: 'fit-content' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>Código {code}</span>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        <div style={{ position: 'relative' }}>
                                          <div style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '12px', fontWeight: '600' }}>
                                            {getClientTotal(client.id, code, 'boxes')}
                                          </div>
                                          <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                          <div style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '12px', fontWeight: '600' }}>
                                            {getClientTotal(client.id, code, 'units')}
                                          </div>
                                          <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', fontSize: '10px', color: '#64748b' }}>
                                          <div style={{ fontWeight: '600' }}>{(assignment.details[code]?.grossWeight || 0).toFixed(2)} kg Bruto</div>
                                          <div style={{ fontWeight: '600' }}>{getClientTotal(client.id, code, 'netWeight').toFixed(2)} kg Neto</div>
                                        </div>
                                      </div>
                                      {deferredPricing[client.id] && (
                                        <div style={{ position: 'relative', marginTop: '4px' }}>
                                          <input
                                            type="number"
                                            step="0.01"
                                            placeholder="Bs/Kg"
                                            value={(deferredPrices[client.id]?.[code] || '')}
                                            onChange={(e) => updateDeferredPrice(client.id, code, e.target.value)}
                                            style={{
                                              width: '60px',
                                              padding: '3px',
                                              borderRadius: '3px',
                                              border: '1px solid #d97706',
                                              outline: 'none',
                                              fontSize: '9px',
                                              textAlign: 'center',
                                              backgroundColor: 'white'
                                            }}
                                          />
                                          <span style={{ position: 'absolute', top: '-6px', left: '2px', fontSize: '7px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#92400e' }}>PRECIO</span>
                                        </div>
                                      )}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                                        <input
                                          type="checkbox"
                                          id={`offal-${client.id}-${code}`}
                                          checked={hasOffal[client.id]?.[code] || true}
                                          onChange={(e) => updateHasOffal(client.id, code, e.target.checked)}
                                          style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                                        />
                                        <label
                                          htmlFor={`offal-${client.id}-${code}`}
                                          style={{ fontSize: '8px', fontWeight: 'bold', color: '#94a3b8', cursor: 'pointer', userSelect: 'none' }}
                                        >
                                          MENUDENCIA
                                        </label>
                                      </div>
                                      <button onClick={() => addWeighing(client.id, code)} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer', fontWeight: 'bold', color: theme.primary, fontSize: '10px' }}>
                                        Agregar Pesaje
                                      </button>
                                      {hasWeighings && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                                          {(deliveries[client.id][code] || []).map((weighing, index) => (
                                            <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Pesaje {index + 1}:</span>
                                                <button onClick={() => removeWeighing(client.id, code, index)} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', fontSize: '10px' }}>×</button>
                                              </div>
                                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                <div style={{ position: 'relative' }}>
                                                  <input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    value={weighing.boxes || ''} 
                                                    onChange={(e) => updateWeighing(client.id, code, index, 'boxes', e.target.value)}
                                                    style={{ 
                                                      width: '60px', 
                                                      padding: '6px', 
                                                      borderRadius: '4px', 
                                                      border: '1px solid #cbd5e1', 
                                                      outline: 'none',
                                                      fontSize: '12px',
                                                      textAlign: 'center'
                                                    }}
                                                  />
                                                  <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                                                
                                                    <input
                                                      type="checkbox"
                                                      id={`offal-${client.id}-${code}`}
                                                      checked={hasOffal[client.id]?.[code] || false}
                                                      onChange={(e) => updateHasOffal(client.id, code, e.target.checked)}
                                                      style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                                                    />
                                                </div>

                                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                  <input 
                                                    type="number" 
                                                    placeholder="0" 
                                                    value={weighing.units || ''} 
                                                    onChange={(e) => updateWeighing(client.id, code, index, 'units', e.target.value)}
                                                    style={{ 
                                                      width: '60px', 
                                                      padding: '6px', 
                                                      borderRadius: '4px', 
                                                      border: '1px solid #cbd5e1', 
                                                      outline: 'none',
                                                      fontSize: '12px',
                                                      textAlign: 'center'
                                                    }}
                                                  />
                                                  <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                                                  
                                                  <button 
                                                    onClick={() => {/* función para seleccionar contenedor */}}
                                                      style={{ 
                                                        padding: '6px', 
                                                        borderRadius: '4px', 
                                                        border: '1px solid #cbd5e1', 
                                                        backgroundColor: 'white', 
                                                        cursor: 'pointer', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center'
                                                      }}
                                                  >
                                                    <Package size={14} color={theme.primary} />
                                                  </button>
                                                </div>
                                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                  <input 
                                                    type="number" 
                                                    step="0.01"
                                                    placeholder="0.00" 
                                                    value={weighing.weight || ''} 
                                                    onChange={(e) => updateWeighing(client.id, code, index, 'weight', e.target.value)}
                                                    style={{ 
                                                      width: '60px', 
                                                      padding: '6px', 
                                                      borderRadius: '4px', 
                                                      border: '1px solid #cbd5e1', 
                                                      outline: 'none',
                                                      fontSize: '12px',
                                                      textAlign: 'center'
                                                    }}
                                                  />
                                                  <button 
                                                    onClick={() => {/* función para conectar */}}
                                                    style={{ 
                                                      padding: '6px', 
                                                      borderRadius: '4px', 
                                                      border: '1px solid #cbd5e1', 
                                                      backgroundColor: 'white', 
                                                      cursor: 'pointer', 
                                                      display: 'flex', 
                                                      alignItems: 'center', 
                                                      justifyContent: 'center'
                                                    }}
                                                  >
                                                    <Scale size={14} color={theme.primary} />
                                                  </button>
                                                  <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>KG</span>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                  </div>


              </div>
            );
          })}
        </div>


        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onBack} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold', color: theme.textMain }}>Cancelar</button>
          <button style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: theme.primary, color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Save size={16} /> Guardar Distribución
          </button>
        </div>
      </Card>

    </div>
  );
};

const PlanningView = ({ theme, assignment, onBack, onSavePlanning }) => {
  // Solicitudes de clientes de ejemplo (ya registradas)
  const clientRequests = [
    { id: 1, clientName: 'Pollería El Rey', group: 'El Alto Norte', requested: {104: 10, 107: 5}, status: 'PENDIENTE' },
    { id: 2, clientName: 'Feria Sector A', group: 'El Alto Norte', requested: {104: 8, 109: 12}, status: 'PENDIENTE' },
    { id: 3, clientName: 'Doña Juana', group: 'El Alto Sur', requested: {104: 5, 107: 3}, status: 'PENDIENTE' },
    { id: 4, clientName: 'Supermercado Central', group: 'La Paz Centro', requested: {105: 15, 108: 7}, status: 'PENDIENTE' }
  ];

  const groups = [...new Set(clientRequests.map(r => r.group))];

  const [expandedGroups, setExpandedGroups] = useState(new Set());

  const [plannedDistributions, setPlannedDistributions] = useState(() => {
    const init = {};
    clientRequests.forEach(request => {
      init[request.id] = { ...request.requested }; // Inicialmente asignar lo solicitado
    });
    return init;
  });

  // Estado para marcar grupos guardados
  const [savedGroups, setSavedGroups] = useState(() => {
    const init = {};
    groups.forEach(g => { init[g] = false; });
    return init;
  });

  const handleSaveGroup = (group) => {
    setSavedGroups(prev => ({ ...prev, [group]: true }));
    alert(`Grupo ${group} guardado`);
  };

  const updatePlannedDistribution = (requestId, code, value) => {
    setPlannedDistributions(prev => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [code]: Math.max(0, parseInt(value) || 0)
      }
    }));
  };

  const getTotalPlannedByCode = (code) => {
    return Object.values(plannedDistributions).reduce((sum, dist) => sum + (dist[code] || 0), 0);
  };

  const toggleGroupExpansion = (group) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(group)) {
        newSet.delete(group);
      } else {
        newSet.add(group);
      }
      return newSet;
    });
  };

  const getGroupTotals = () => {
    const groupTotals = {};
    groups.forEach(group => {
      groupTotals[group] = { boxes: 0, units: 0, byCode: {} };
    });

    clientRequests.forEach(request => {
      const group = request.group;
      if (groupTotals[group]) {
        Object.entries(plannedDistributions[request.id] || {}).forEach(([code, quantity]) => {
          if (quantity > 0) {
            groupTotals[group].boxes += quantity;
            groupTotals[group].units += quantity;
            groupTotals[group].byCode[code] = (groupTotals[group].byCode[code] || 0) + quantity;
          }
        });
      }
    });

    return groupTotals;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card style={{ position: 'sticky', top: 0, zIndex: 10, padding: '8px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 360px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PROVEEDOR:</span> <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{assignment.provider}</span></div>
              <div><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CLIENTE ORIGEN:</span> <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{assignment.client}</span></div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={onBack} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold', color: theme.textMain }}>Cancelar</button>
              <button onClick={() => { }} style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#f11852', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Planificación Automática</button>
              <button onClick={() => { onSavePlanning(plannedDistributions); alert('Planificación guardada'); }} style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#f59e0b', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Guardar Planificación</button>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ padding: '16px', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>Detalles de la Asignación</h4>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
                {[104, 105, 106, 107, 108, 109, 110].map((code) => {
                  const detail = assignment.details[code] || { boxes: 0, units: 0, grossWeight: 0, netWeight: 0 };
                  const totalPlanned = getTotalPlannedByCode(code);
                  const available = detail.boxes - totalPlanned;
                  return (
                    <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', minWidth: 'fit-content' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>Código {code}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                            {available}/{detail.boxes || 0}
                          </div>
                          <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                            {(detail.units || 0) - totalPlanned}/{detail.units || 0}
                          </div>
                          <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID</span>
                        </div>
                        
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ marginBottom: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>Totales por Grupo</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(getGroupTotals()).map(([group, totals]) => {
              const isExpanded = expandedGroups.has(group);
              return (
                <div key={group} style={{ backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div onClick={() => toggleGroupExpansion(group)} style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: theme.primary, minWidth: '120px' }}>{group}</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {[104, 105, 106, 107, 108, 109, 110].map((code) => {
                          const quantity = totals.byCode[code] || 0;
                          return (
                            <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #cbd5e1', minWidth: '70px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>Código {code}</span>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <div style={{ position: 'relative' }}>
                                  <div style={{ width: '50px', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                                    {quantity}
                                  </div>
                                  <span style={{ position: 'absolute', top: '-12px', left: '8px', fontSize: '7px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                                </div>
                                <div style={{ position: 'relative' }}>
                                  <div style={{ width: '50px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                                    {quantity}
                                  </div>
                                  <span style={{ position: 'absolute', top: '-12px', left: '10px', fontSize: '7px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '8px', backgroundColor: '#f59e0b', borderRadius: '6px', border: '1px solid #d97706', minWidth: '80px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'center', color: 'white' }}>TOTAL</span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                            <div style={{ position: 'relative' }}>
                              <div style={{ width: '60px', padding: '6px', borderRadius: '4px', border: '1px solid #d97706', backgroundColor: 'white', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                                {totals.boxes}
                              </div>
                              <span style={{ position: 'absolute', top: '-12px', left: '10px', fontSize: '7px', backgroundColor: '#f59e0b', padding: '0 2px', fontWeight: 'bold', color: 'white' }}>CAJAS</span>
                            </div>
                            <div style={{ position: 'relative' }}>
                              <div style={{ width: '60px', padding: '6px', borderRadius: '4px', border: '1px solid #d97706', backgroundColor: 'white', textAlign: 'center', fontSize: '13px', fontWeight: '600' }}>
                                {totals.units}
                              </div>
                              <span style={{ position: 'absolute', top: '-12px', left: '12px', fontSize: '7px', backgroundColor: '#f59e0b', padding: '0 2px', fontWeight: 'bold', color: 'white' }}>UNID.</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button onClick={(e)=>{e.stopPropagation(); handleSaveGroup(group)}} disabled={savedGroups[group]} style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', backgroundColor: savedGroups[group] ? '#10b981' : theme.primary, color: 'white', fontWeight: '700', cursor: savedGroups[group] ? 'not-allowed' : 'pointer' }}>
                        {savedGroups[group] ? 'Guardado' : 'Guardar Grupo'}
                      </button>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div style={{ padding: '12px', borderTop: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#64748b' }}>Pedidos de Clientes:</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {clientRequests.filter(request => request.group === group).map((request) => (
                            <div key={request.id} style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                                <div style={{ flex: '0 0 260px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: theme.primary }}>{request.clientName}</h4>
                                  <div style={{ fontSize: '12px', color: '#64748b' }}>Estado:
                                    <span style={{
                                      marginLeft: '8px',
                                      fontWeight: '700',
                                      padding: '6px 10px',
                                      borderRadius: '8px',
                                      background: request.status && request.status.toLowerCase() === 'emitido' ? '#fef3c7' : '#d1fae5',
                                      color: request.status && request.status.toLowerCase() === 'emitido' ? '#92400e' : '#065f46',
                                      textTransform: 'capitalize',
                                      display: 'inline-block'
                                    }}>{request.status}</span>
                                  </div>
                                </div>

                                <div style={{ flex: '1 1 auto' }}>
                                  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px', alignItems: 'flex-start' }}>
                                    {[104, 105, 106, 107, 108, 109, 110].map((code) => {
                                      const requested = request.requested[code] || 0;
                                      const planned = plannedDistributions[request.id]?.[code] || 0;
                                      const assignmentAvailable = assignment.details[code]?.boxes || 0;
                                      const totalPlannedForCode = getTotalPlannedByCode(code);
                                      const remaining = assignmentAvailable - totalPlannedForCode + planned;
                                      return (
                                        <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px', backgroundColor: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0', minWidth: '100px' }}>
                                          <div style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'center' }}>Código {code}</div>
                                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                            <div style={{ fontSize: '9px', color: '#64748b' }}>Solicitado: {requested}</div>
                                            <div style={{ position: 'relative' }}>
                                              <input
                                                type="number"
                                                value={planned}
                                                onChange={(e) => updatePlannedDistribution(request.id, code, e.target.value)}
                                                min="0"
                                                max={remaining + planned}
                                                style={{
                                                  width: '70px',
                                                  padding: '4px',
                                                  borderRadius: '3px',
                                                  border: '1px solid #cbd5e1',
                                                  textAlign: 'center',
                                                  fontSize: '11px',
                                                  fontWeight: 'bold'
                                                }}
                                              />
                                              <span style={{ position: 'absolute', top: '-6px', left: '2px', fontSize: '6px', backgroundColor: '#f8fafc', padding: '0 1px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                              <div style={{ width: '70px', padding: '4px', borderRadius: '3px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '11px', fontWeight: '600' }}>
                                                {planned}
                                              </div>
                                              <span style={{ position: 'absolute', top: '-6px', left: '2px', fontSize: '6px', backgroundColor: '#f8fafc', padding: '0 1px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                                            </div>
                                            <div style={{ fontSize: '9px', color: planned > remaining ? '#ef4444' : '#10b981' }}>
                                              Restante: {remaining - planned}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px', backgroundColor: '#f59e0b', borderRadius: '4px', border: '1px solid #d97706', minWidth: '110px' }}>
                                      <div style={{ fontSize: '11px', fontWeight: 'bold', textAlign: 'center', color: 'white' }}>TOTAL</div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <div style={{ position: 'relative' }}>
                                          <div style={{ width: '80px', padding: '4px', borderRadius: '3px', border: '1px solid #d97706', backgroundColor: 'white', textAlign: 'center', fontSize: '11px', fontWeight: '600' }}>
                                            {Object.values(plannedDistributions[request.id] || {}).reduce((sum, qty) => sum + qty, 0)}
                                          </div>
                                          <span style={{ position: 'absolute', top: '-6px', left: '2px', fontSize: '6px', backgroundColor: '#f59e0b', padding: '0 1px', fontWeight: 'bold', color: 'white' }}>CAJAS</span>
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                          <div style={{ width: '80px', padding: '4px', borderRadius: '3px', border: '1px solid #d97706', backgroundColor: 'white', textAlign: 'center', fontSize: '11px', fontWeight: '600' }}>
                                            {Object.values(plannedDistributions[request.id] || {}).reduce((sum, qty) => sum + qty, 0)}
                                          </div>
                                          <span style={{ position: 'absolute', top: '-6px', left: '2px', fontSize: '6px', backgroundColor: '#f59e0b', padding: '0 1px', fontWeight: 'bold', color: 'white' }}>UNID.</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

const ReceiveView = ({ theme, assignment, onBack }) => {
  const [boletas, setBoletas] = useState([]);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

  // Agregar nueva boleta
  const addBoleta = () => {
    const newBoleta = {
      id: boletas.length + 1,
      boletaCode: '',
      costPerKg: 0,
      deferredPricing: false,
      pricesPerCode: {},
      codes: {},
      weighings: {}
    };
    [104, 105, 106, 107, 108, 109, 110].forEach(code => {
      newBoleta.pricesPerCode[code] = 0;
    });
    setBoletas(prev => [...prev, newBoleta]);
  };

  // Actualizar código de boleta
  const updateBoletaCodeNumber = (boletaId, code) => {
    setBoletas(prev => prev.map(boleta => {
      if (boleta.id === boletaId) {
        return { ...boleta, boletaCode: code };
      }
      return boleta;
    }));
  };

  // Eliminar boleta
  const removeBoleta = (boletaId) => {
    setBoletas(prev => prev.filter(b => b.id !== boletaId).map((b, idx) => ({ ...b, id: idx + 1 })));
  };

  // Actualizar código en boleta
  const updateBoletaCode = (boletaId, code, field, value) => {
    setBoletas(prev => prev.map(boleta => {
      if (boleta.id === boletaId) {
        const updatedCodes = {
          ...boleta.codes,
          [code]: {
            ...(boleta.codes[code] || { boxes: 0, units: 0 }),
            [field]: field === 'hasCode' ? value : (parseFloat(value) || 0)
          }
        };
        return { ...boleta, codes: updatedCodes };
      }
      return boleta;
    }));
  };

  // Agregar pesaje a un código en una boleta
  const addWeighing = (boletaId, code) => {
    setBoletas(prev => prev.map(boleta => {
      if (boleta.id === boletaId) {
        const updatedWeighings = {
          ...boleta.weighings,
          [code]: [...(boleta.weighings[code] || []), { weight: 0, boxes: 0, units: 0 }]
        };
        return { ...boleta, weighings: updatedWeighings };
      }
      return boleta;
    }));
  };

  // Actualizar pesaje
  const updateWeighing = (boletaId, code, index, field, value) => {
    setBoletas(prev => prev.map(boleta => {
      if (boleta.id === boletaId) {
        const updatedWeighings = {
          ...boleta.weighings,
          [code]: (boleta.weighings[code] || []).map((w, i) => 
            i === index ? { ...w, [field]: field === 'weight' ? (parseFloat(value) || 0) : (parseInt(value) || 0) } : w
          )
        };
        return { ...boleta, weighings: updatedWeighings };
      }
      return boleta;
    }));
  };

  // Eliminar pesaje
  const removeWeighing = (boletaId, code, index) => {
    setBoletas(prev => prev.map(boleta => {
      if (boleta.id === boletaId) {
        const updatedWeighings = {
          ...boleta.weighings,
          [code]: (boleta.weighings[code] || []).filter((_, i) => i !== index)
        };
        return { ...boleta, weighings: updatedWeighings };
      }
      return boleta;
    }));
  };

  // Guardar boleta y mostrar resumen
  const saveBoleta = () => {
    // Calcular totales recibidos por código
    const receivedByCode = {};
    [104, 105, 106, 107, 108, 109, 110].forEach(code => {
      receivedByCode[code] = { units: 0, netWeight: 0 };
    });

    boletas.forEach(boleta => {
      Object.entries(boleta.weighings).forEach(([code, weighings]) => {
        weighings.forEach(w => {
          receivedByCode[code].units += w.units || 0;
          receivedByCode[code].netWeight += w.weight || 0;
        });
      });
    });

    // Calcular totales de asignación por código
    const assignmentByCode = {};
    [104, 105, 106, 107, 108, 109, 110].forEach(code => {
      const detail = assignment.details[code] || { boxes: 0, units: 0, grossWeight: 0, netWeight: 0 };
      assignmentByCode[code] = {
        boxes: detail.boxes || 0,
        units: detail.units || 0,
        grossWeight: detail.grossWeight || 0,
        netWeight: detail.netWeight || 0
      };
    });

    // Calcular totales generales
    const receivedTotals = { units: 0, netWeight: 0 };
    const assignmentTotals = { units: 0, netWeight: 0 };

    Object.values(receivedByCode).forEach(codeData => {
      receivedTotals.units += codeData.units;
      receivedTotals.netWeight += codeData.netWeight;
    });

    Object.values(assignmentByCode).forEach(codeData => {
      assignmentTotals.units += codeData.units;
      assignmentTotals.netWeight += codeData.netWeight;
    });

    // Preparar datos para el diálogo
    const summary = {
      assignment: assignmentTotals,
      received: receivedTotals,
      difference: {
        units: receivedTotals.units - assignmentTotals.units,
        netWeight: receivedTotals.netWeight - assignmentTotals.netWeight
      },
      byCode: {
        assignment: assignmentByCode,
        received: receivedByCode
      }
    };

    setSummaryData(summary);
    setShowSummaryDialog(true);
  };

  // Obtener total de peso por código en una boleta
  const getBoletaCodeWeight = (boletaId, code) => {
    const boleta = boletas.find(b => b.id === boletaId);
    if (!boleta || !boleta.weighings[code]) return 0;
    return boleta.weighings[code].reduce((sum, w) => sum + (w.weight || 0), 0);
  };

  // Obtener total de peso por código en todas las boletas
  const getTotalWeightByCode = (code) => {
    return boletas.reduce((sum, boleta) => sum + getBoletaCodeWeight(boleta.id, code), 0);
  };

  // Obtener peso total general
  const getOverallTotalWeight = () => {
    return [104, 105, 106, 107, 108, 109, 110].reduce((sum, code) => sum + getTotalWeightByCode(code), 0);
  };

  // Actualizar costo por kg de boleta
  const updateBoletaCostPerKg = (boletaId, cost) => {
    setBoletas(prev => prev.map(boleta => {
      if (boleta.id === boletaId) {
        return { ...boleta, costPerKg: parseFloat(cost) || 0 };
      }
      return boleta;
    }));
  };

  // Actualizar precio diferido de boleta
  const updateBoletaDeferredPricing = (boletaId, deferred) => {
    setBoletas(prev => prev.map(boleta => {
      if (boleta.id === boletaId) {
        return { ...boleta, deferredPricing: deferred };
      }
      return boleta;
    }));
  };

  // Actualizar precio por código en boleta
  const updateBoletaPricePerCode = (boletaId, code, price) => {
    setBoletas(prev => prev.map(boleta => {
      if (boleta.id === boletaId) {
        return {
          ...boleta,
          pricesPerCode: {
            ...boleta.pricesPerCode,
            [code]: parseFloat(price) || 0
          }
        };
      }
      return boleta;
    }));
  };

  // Obtener costo de una boleta
  const getBoletaCost = (boletaId) => {
    const boleta = boletas.find(b => b.id === boletaId);
    if (!boleta) return 0;

    if (boleta.deferredPricing) {
      return [104, 105, 106, 107, 108, 109, 110].reduce((sum, code) => {
        const weight = getBoletaCodeWeight(boletaId, code);
        const price = boleta.pricesPerCode[code] || 0;
        return sum + (weight * price);
      }, 0);
    } else {
      const boletaTotalWeight = [104, 105, 106, 107, 108, 109, 110].reduce((sum, code) => 
        sum + getBoletaCodeWeight(boletaId, code), 0
      );
      return boletaTotalWeight * (boleta.costPerKg || 0);
    }
  };

  // Obtener costo total de todas las boletas
  const getTotalCost = () => {
    return boletas.reduce((sum, boleta) => sum + getBoletaCost(boleta.id), 0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Card style={{ position: 'sticky', top: 0, zIndex: 10, padding: '8px' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '0 0 360px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
              <div><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PROVEEDOR:</span> <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{assignment.provider}</span></div>
              <div><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CLIENTE:</span> <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{assignment.client}</span></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>COSTO TOTAL GENERAL</label>
                <div style={{ 
                  padding: '8px 16px', 
                  borderRadius: '6px', 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #e2e8f0',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: theme.primary,
                  minWidth: '140px',
                  textAlign: 'center'
                }}>
                  Bs {getTotalCost().toFixed(2)}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={onBack} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold', color: theme.textMain }}>Cancelar</button>
              <button onClick={saveBoleta} style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <Truck size={16} /> Registrar Recepción
              </button>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ padding: '16px', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>Detalles de la Asignación</h4>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
                {[104, 105, 106, 107, 108, 109, 110].map((code) => {
                  const detail = assignment.details[code] || { boxes: 0, units: 0, grossWeight: 0, netWeight: 0 };
                  return (
                    <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', minWidth: 'fit-content' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>Código {code}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                            {detail.boxes || 0}
                          </div>
                          <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: 'white', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
                            {detail.units || 0}
                          </div>
                          <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', fontSize: '10px', color: '#64748b' }}>
                          <div style={{ fontWeight: '600' }}>{detail.grossWeight?.toFixed(2) || '0.00'} kg Bruto</div>
                          <div style={{ fontWeight: '600' }}>{detail.netWeight?.toFixed(2) || '0.00'} kg Neto</div>
                          <div style={{ fontWeight: '600', color: '#10b981' }}>{getTotalWeightByCode(code).toFixed(2)} kg Recibidos</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>Boletas de Recepción</h4>
          <button onClick={addBoleta} style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', backgroundColor: theme.primary, color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={14} /> Agregar Boleta
          </button>
        </div>

        {boletas.length === 0 && (
          <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            No hay boletas registradas. Haz clic en "Agregar Boleta" para comenzar.
          </div>
        )}

        {boletas.map((boleta) => (
          <Card key={boleta.id} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: theme.primary }}>Boleta #{boleta.id}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>CÓDIGO DE BOLETA</label>
                  <input
                    type="text"
                    placeholder="Ingrese código"
                    value={boleta.boletaCode || ''}
                    onChange={(e) => updateBoletaCodeNumber(boleta.id, e.target.value)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      minWidth: '150px'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => {}} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: '#10b981', color: 'white', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Guardar Boleta</button>
                <button onClick={() => removeBoleta(boleta.id)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>Eliminar Boleta</button>
              </div>
            </div>

            <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>COSTO POR KG (Bs)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    value={boleta.costPerKg || ''} 
                    onChange={(e) => updateBoletaCostPerKg(boleta.id, e.target.value)}
                    disabled={boleta.deferredPricing}
                    style={{ 
                      width: '120px', 
                      padding: '8px', 
                      borderRadius: '6px', 
                      border: '1px solid #e2e8f0', 
                      outline: 'none',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      opacity: boleta.deferredPricing ? 0.5 : 1
                    }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>COSTO DE ESTA BOLETA</label>
                  <div style={{ 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: theme.primary,
                    minWidth: '140px',
                    textAlign: 'center'
                  }}>
                    Bs {getBoletaCost(boleta.id).toFixed(2)}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label htmlFor={`deferred-pricing-${boleta.id}`} style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', cursor: 'pointer' }}>
                      Precio diferido
                    </label>
                    <input
                      type="checkbox"
                      id={`deferred-pricing-${boleta.id}`}
                      checked={boleta.deferredPricing || false}
                      onChange={(e) => updateBoletaDeferredPricing(boleta.id, e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                  </div>
                </div>
              </div>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 'bold', color: '#64748b' }}>Códigos en esta Boleta</h4>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px' }}>
                {[104, 105, 106, 107, 108, 109, 110].map((code) => {
                  const codeData = boleta.codes[code] || { boxes: 0, units: 0 };
                  const hasCode = !!boleta.codes[code];
                  
                  return (
                    <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: hasCode ? '#f8fafc' : '#ffffff', borderRadius: '8px', border: `1px solid ${hasCode ? '#f1f5f9' : '#e2e8f0'}`, minWidth: 'fit-content', opacity: hasCode ? 1 : 0.5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="checkbox"
                          checked={hasCode}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBoletas(prev => prev.map(b => {
                                if (b.id === boleta.id) {
                                  return {
                                    ...b,
                                    codes: {
                                      ...b.codes,
                                      [code]: { boxes: 0, units: 0 }
                                    }
                                  };
                                }
                                return b;
                              }));
                            } else {
                              setBoletas(prev => prev.map(b => {
                                if (b.id === boleta.id) {
                                  const { [code]: removed, ...restCodes } = b.codes;
                                  const { [code]: removedWeighings, ...restWeighings } = b.weighings;
                                  return { ...b, codes: restCodes, weighings: restWeighings };
                                }
                                return b;
                              }));
                            }
                          }}
                          style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>Código {code}</span>
                      </div>
                      {hasCode && (
                        <>
                          <div style={{ position: 'relative' }}>
                            <input
                              type="number"
                              placeholder="0"
                              value={codeData.boxes || ''}
                              onChange={(e) => updateBoletaCode(boleta.id, code, 'boxes', e.target.value)}
                              style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '12px', textAlign: 'center' }}
                            />
                            <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                          </div>
                          <div style={{ position: 'relative' }}>
                            <input
                              type="number"
                              placeholder="0"
                              value={codeData.units || ''}
                              onChange={(e) => updateBoletaCode(boleta.id, code, 'units', e.target.value)}
                              style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '12px', textAlign: 'center' }}
                            />
                            <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                          </div>
                          {boleta.deferredPricing && (
                            <div style={{ position: 'relative', marginTop: '4px' }}>
                              <input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={boleta.pricesPerCode[code] || ''}
                                onChange={(e) => updateBoletaPricePerCode(boleta.id, code, e.target.value)}
                                style={{ width: '60px', padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '12px', textAlign: 'center' }}
                              />
                              <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>PRECIO</span>
                            </div>
                          )}
                        </>
                      )}
                      {hasCode && (
                        <>
                          <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px' }}>
                            <div>Peso Bruto: {(assignment.details[code]?.grossWeight || 0).toFixed(2)} kg</div>
                            <div>Peso Neto: {(assignment.details[code]?.netWeight || 0).toFixed(2)} kg</div>
                          </div>
                          <button onClick={() => addWeighing(boleta.id, parseInt(code))} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer', fontWeight: 'bold', color: theme.primary, fontSize: '12px' }}>
                            Agregar Pesaje
                          </button>
                          {(() => {
                            const weighings = boleta.weighings[code] || [];
                            return weighings.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                                {weighings.map((weighing, index) => (
                                  <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Pesaje {index + 1}:</span>
                                      <button onClick={() => removeWeighing(boleta.id, parseInt(code), index)} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', fontSize: '10px' }}>×</button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                      <div style={{ position: 'relative' }}>
                                        <input 
                                          type="number" 
                                          placeholder="0" 
                                          value={weighing.boxes || ''} 
                                          onChange={(e) => updateWeighing(boleta.id, parseInt(code), index, 'boxes', e.target.value)}
                                          style={{ 
                                            width: '60px', 
                                            padding: '6px', 
                                            borderRadius: '4px', 
                                            border: '1px solid #cbd5e1', 
                                            outline: 'none',
                                            fontSize: '12px',
                                            textAlign: 'center'
                                          }}
                                        />
                                        <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                                      </div>
                                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <input 
                                          type="number" 
                                          placeholder="0" 
                                          value={weighing.units || ''} 
                                          onChange={(e) => updateWeighing(boleta.id, parseInt(code), index, 'units', e.target.value)}
                                          style={{ 
                                            width: '60px', 
                                            padding: '6px', 
                                            borderRadius: '4px', 
                                            border: '1px solid #cbd5e1', 
                                            outline: 'none',
                                            fontSize: '12px',
                                            textAlign: 'center'
                                          }}
                                        />
                                        <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                                        
                                        <button 
                                          onClick={() => {/* función para seleccionar contenedor */}}
                                            style={{ 
                                              padding: '6px', 
                                              borderRadius: '4px', 
                                              border: '1px solid #cbd5e1', 
                                              backgroundColor: 'white', 
                                              cursor: 'pointer', 
                                              display: 'flex', 
                                              alignItems: 'center', 
                                              justifyContent: 'center'
                                            }}
                                        >
                                          <Package size={14} color={theme.primary} />
                                        </button>
                                      </div>
                                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <input 
                                          type="number" 
                                          step="0.01"
                                          placeholder="0.00" 
                                          value={weighing.weight || ''} 
                                          onChange={(e) => updateWeighing(boleta.id, parseInt(code), index, 'weight', e.target.value)}
                                          style={{ 
                                            width: '60px', 
                                            padding: '6px', 
                                            borderRadius: '4px', 
                                            border: '1px solid #cbd5e1', 
                                            outline: 'none',
                                            fontSize: '12px',
                                            textAlign: 'center'
                                          }}
                                        />
                                        <button 
                                          onClick={() => {/* función para conectar */}}
                                          style={{ 
                                            padding: '6px', 
                                            borderRadius: '4px', 
                                            border: '1px solid #cbd5e1', 
                                            backgroundColor: 'white', 
                                            cursor: 'pointer', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center'
                                          }}
                                        >
                                          <Scale size={14} color={theme.primary} />
                                        </button>
                                        <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>KG</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : null;
                          })()}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>


          </Card>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: theme.primary }}>Peso Total General: {getOverallTotalWeight().toFixed(2)} kg</div>
        </div>

        
      </Card>

      {/* Diálogo de resumen de recepción */}
      {showSummaryDialog && summaryData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '900px',
            width: '95%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <Truck size={24} color={theme.primary} />
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: theme.textMain }}>Resumen de Recepción</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>Resumen por Código</h4>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                {[104, 105, 106, 107, 108, 109, 110].map((code) => {
                  const assignmentDetail = summaryData.byCode.assignment[code];
                  const receivedDetail = summaryData.byCode.received[code];
                  return (
                    <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9', minWidth: 'fit-content' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>Código {code}</span>
                      
                      {/* Asignación */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b', marginBottom: '4px' }}>ASIGNACIÓN</div>
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: '50px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', textAlign: 'center', fontSize: '12px', fontWeight: '600' }}>
                            {assignmentDetail.boxes}
                          </div>
                          <span style={{ position: 'absolute', top: '-6px', left: '2px', fontSize: '7px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: '50px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', textAlign: 'center', fontSize: '12px', fontWeight: '600' }}>
                            {assignmentDetail.units}
                          </div>
                          <span style={{ position: 'absolute', top: '-6px', left: '2px', fontSize: '7px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                        </div>
                      </div>

                      {/* Recibido */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #10b981' }}>
                        <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>RECIBIDO</div>
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: '50px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', textAlign: 'center', fontSize: '12px', fontWeight: '600' }}>
                            0
                          </div>
                          <span style={{ position: 'absolute', top: '-6px', left: '2px', fontSize: '7px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
                        </div>
                        <div style={{ position: 'relative' }}>
                          <div style={{ width: '50px', padding: '6px', borderRadius: '4px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', textAlign: 'center', fontSize: '12px', fontWeight: '600' }}>
                            {receivedDetail.units}
                          </div>
                          <span style={{ position: 'absolute', top: '-6px', left: '2px', fontSize: '7px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
                        </div>
                        <div style={{ fontSize: '9px', color: '#10b981', textAlign: 'center', fontWeight: '600' }}>
                          <div>{receivedDetail.netWeight.toFixed(2)} kg Bruto</div>
                          <div>{receivedDetail.netWeight.toFixed(2)} kg Neto</div>
                        </div>
                      </div>

                      {/* Diferencia */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', padding: '6px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                        <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#64748b' }}>DIFERENCIA</div>
                        <div style={{ fontSize: '10px', fontWeight: '600', color: (0 - assignmentDetail.boxes) >= 0 ? '#10b981' : '#ef4444' }}>
                          {(0 - assignmentDetail.boxes) >= 0 ? '+' : ''}{0 - assignmentDetail.boxes} cajas
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: '600', color: (receivedDetail.units - assignmentDetail.units) >= 0 ? '#10b981' : '#ef4444' }}>
                          {(receivedDetail.units - assignmentDetail.units) >= 0 ? '+' : ''}{receivedDetail.units - assignmentDetail.units} unid.
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: '600', color: (receivedDetail.netWeight - assignmentDetail.netWeight) >= 0 ? '#10b981' : '#ef4444' }}>
                          {(receivedDetail.netWeight - assignmentDetail.netWeight) >= 0 ? '+' : ''}{(receivedDetail.netWeight - assignmentDetail.netWeight).toFixed(2)} kg
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={() => setShowSummaryDialog(false)}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0', 
                  backgroundColor: '#f8fafc', 
                  cursor: 'pointer', 
                  fontWeight: 'bold', 
                  color: theme.textMain 
                }}
              >
                Cerrar
              </button>
              <button 
                onClick={() => {
                  // Aquí iría la lógica para guardar definitivamente
                  setShowSummaryDialog(false);
                  alert('Recepción registrada exitosamente');
                }}
                style={{ 
                  flex: 1, 
                  padding: '12px', 
                  borderRadius: '8px', 
                  backgroundColor: '#10b981', 
                  color: 'white', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontWeight: 'bold' 
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TrackingView = ({ theme }) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState('VH-01');
  const [routeFilter, setRouteFilter] = useState('ALL');

  const vehicles = [
    {
      id: 'VH-01',
      plate: '1234-ABC',
      driver: 'Juan Pérez',
      route: 'El Alto Norte',
      status: 'En ruta',
      lat: -16.5,
      lng: -68.15,
      deliveredOrders: 8,
      pendingOrders: 4,
      basketsOnTruck: 60,
      basketsDelivered: 40,
      lastUpdate: '10:25',
    },
    {
      id: 'VH-02',
      plate: '5678-DEF',
      driver: 'María González',
      route: 'El Alto Sur',
      status: 'Entregando',
      lat: -16.51,
      lng: -68.14,
      deliveredOrders: 5,
      pendingOrders: 2,
      basketsOnTruck: 35,
      basketsDelivered: 25,
      lastUpdate: '10:22',
    },
    {
      id: 'VH-03',
      plate: '9999-XYZ',
      driver: 'Carlos Ramírez',
      route: 'La Paz Centro',
      status: 'Retornando',
      lat: -16.49,
      lng: -68.16,
      deliveredOrders: 10,
      pendingOrders: 0,
      basketsOnTruck: 5,
      basketsDelivered: 80,
      lastUpdate: '10:15',
    },
  ];

  const deliveries = [
    { 
      time: '09:40',
      client: 'Pollería El Rey',
      route: 'El Alto Norte',
      vehicleId: 'VH-01',
      driver: 'Juan Pérez',
      orders: 3,
      baskets: 10,
      lat: -16.495,
      lng: -68.145,
      status: 'ENTREGADO',
      payment: 'SI',
    },
    {
      time: '09:55',
      client: 'Feria 16 de Julio - Sector A',
      route: 'El Alto Norte',
      vehicleId: 'VH-01',
      driver: 'Juan Pérez',
      orders: 2,
      baskets: 8,
      lat: -16.505,
      lng: -68.155,
      status: 'ENVIADO',
      payment: 'NO',
    },
    {
      time: '10:10',
      client: 'Supermercado Norte',
      route: 'El Alto Norte',
      vehicleId: 'VH-01',
      driver: 'Juan Pérez',
      orders: 1,
      baskets: 5,
      lat: -16.510,
      lng: -68.150,
      status: 'ENTREGADO',
      payment: 'SI',
    },
    {
      time: '10:25',
      client: 'Restaurante Los Andes',
      route: 'El Alto Norte',
      vehicleId: 'VH-01',
      driver: 'Juan Pérez',
      orders: 4,
      baskets: 12,
      lat: -16.520,
      lng: -68.140,
      status: 'ENVIADO',
      payment: 'NO',
    },
    {
      time: '10:05',
      client: 'Doña Juana',
      route: 'El Alto Sur',
      vehicleId: 'VH-02',
      driver: 'María González',
      orders: 2,
      baskets: 6,
      lat: -16.515,
      lng: -68.135,
      status: 'ENTREGADO',
      payment: 'SI',
    },
    {
      time: '10:20',
      client: 'Tienda La Paz',
      route: 'El Alto Sur',
      vehicleId: 'VH-02',
      driver: 'María González',
      orders: 3,
      baskets: 9,
      lat: -16.525,
      lng: -68.130,
      status: 'ENVIADO',
      payment: 'NO',
    },
    {
      time: '09:30',
      client: 'Mercado Central - Puesto 4',
      route: 'La Paz Centro',
      vehicleId: 'VH-03',
      driver: 'Carlos Ramírez',
      orders: 4,
      baskets: 15,
      lat: -16.485,
      lng: -68.165,
      status: 'ENTREGADO',
      payment: 'SI',
    },
    {
      time: '09:50',
      client: 'Café Paradiso',
      route: 'La Paz Centro',
      vehicleId: 'VH-03',
      driver: 'Carlos Ramírez',
      orders: 2,
      baskets: 7,
      lat: -16.490,
      lng: -68.170,
      status: 'ENTREGADO',
      payment: 'SI',
    },
    {
      time: '10:10',
      client: 'Hotel Bolivia',
      route: 'La Paz Centro',
      vehicleId: 'VH-03',
      driver: 'Carlos Ramírez',
      orders: 4,
      baskets: 18,
      lat: -16.495,
      lng: -68.175,
      status: 'ENVIADO',
      payment: 'NO',
    },
  ];

  const routes = ['ALL', ...Array.from(new Set(vehicles.map(v => v.route)))];

  const filteredVehicles = vehicles.filter(v =>
    routeFilter === 'ALL' ? true : v.route === routeFilter
  );

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const filteredDeliveries = deliveries.filter(d =>
    routeFilter === 'ALL' ? true : d.route === routeFilter
  );

  const selectedVehicleDeliveries = deliveries.filter(d => d.vehicleId === selectedVehicle.id);

  const totalBasketsDelivered = deliveries.reduce((sum, d) => sum + d.baskets, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>


      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', alignItems: 'stretch' }}>
        {/* Mapa y detalle de vehículo */}
        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
          </div>
          <div style={{ height: '500px' }}>
            <MapContainer
              center={[selectedVehicle.lat, selectedVehicle.lng]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Marcadores de vehículos */}
              {filteredVehicles.map(v => (
                <Marker
                  key={v.id}
                  position={[v.lat, v.lng]}
                  icon={vehicleIcon}
                  eventHandlers={{
                    click: () => setSelectedVehicleId(v.id),
                  }}
                >
                  <Popup>
                    <div style={{ fontSize: '12px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        🚚 {v.id} · {v.plate}
                      </div>
                      <div>Chofer: <strong>{v.driver}</strong></div>
                      <div>Ruta: {v.route}</div>
                      <div>Estado: {v.status}</div>
                      <div>Órdenes: {v.deliveredOrders} / {v.pendingOrders + v.deliveredOrders}</div>
                      <div>Canastos en camión: {v.basketsOnTruck}</div>
                      <div>Canastos entregados: {v.basketsDelivered}</div>
                      <div style={{ marginTop: '4px', color: theme.textMuted }}>Últ. actualización: {v.lastUpdate}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Marcadores de clientes / entregas */}
              {filteredDeliveries.map((d, idx) => (
                <Marker
                  key={`cli-${idx}-${d.client}`}
                  position={[d.lat, d.lng]}
                  icon={clientIcon}
                >
                  <Popup>
                    <div style={{ fontSize: '12px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        📍 {d.client}
                      </div>
                      <div>Ruta: {d.route}</div>
                      <div>Vehículo: {d.vehicleId}</div>
                      <div>Chofer: {d.driver}</div>
                      <div>Órdenes: {d.orders}</div>
                      <div>Canastos: {d.baskets}</div>
                      <div style={{ marginTop: '4px' }}>
                        <span style={{ fontWeight: 'bold' }}>Estado: </span>
                        <span style={{ 
                          color: d.status === 'ENTREGADO' ? '#10b981' : '#f59e0b',
                          fontWeight: 'bold'
                        }}>
                          {d.status}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold' }}>Pago: </span>
                        <span style={{ 
                          color: d.payment === 'SI' ? '#10b981' : '#ef4444',
                          fontWeight: 'bold'
                        }}>
                          {d.payment === 'SI' ? 'SI' : 'NO'}
                        </span>
                      </div>
                      <div style={{ marginTop: '4px', color: theme.textMuted }}>Hora: {d.time}</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          <div style={{ padding: '12px 18px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>
              Detalle del vehículo seleccionado
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '12px', color: theme.textMuted }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>Unidad</div>
                <div>{selectedVehicle.id} · {selectedVehicle.plate}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Chofer</div>
                <div>{selectedVehicle.driver}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Ruta</div>
                <div>{selectedVehicle.route}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Estado</div>
                <div>{selectedVehicle.status}</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Órdenes</div>
                <div>{selectedVehicle.deliveredOrders} entregadas / {selectedVehicle.pendingOrders} pendientes</div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold' }}>Canastos</div>
                <div>{selectedVehicle.basketsDelivered} entregados · {selectedVehicle.basketsOnTruck} en camión</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '12px 18px', borderTop: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>
              Detalle de la ruta
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {selectedVehicleDeliveries.map((d, idx) => (
                <div key={idx} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '8px 0', 
                  borderBottom: idx < selectedVehicleDeliveries.length - 1 ? '1px solid #f1f5f9' : 'none' 
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>{d.client}</div>
                    <div style={{ fontSize: '11px', color: theme.textMuted }}>{d.time} · {d.orders} órdenes · {d.baskets} canastos</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{ 
                      fontSize: '10px', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      backgroundColor: d.status === 'ENTREGADO' ? '#10b981' : '#f59e0b',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {d.status}
                    </div>
                    <div style={{ 
                      fontSize: '10px', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      backgroundColor: d.payment === 'SI' ? '#10b981' : '#ef4444',
                      color: 'white',
                      fontWeight: 'bold'
                    }}>
                      {d.payment === 'SI' ? 'PAGADO' : 'PENDIENTE'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Lista de vehículos y resumen de canastos/órdenes */}
        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>Vehículos en ruta</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Selecciona una unidad para centrar el mapa</div>
            </div>
            
          </div>


          <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
            {filteredVehicles.map(v => {
              const isActive = v.id === selectedVehicleId;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '10px 16px',
                    border: 'none',
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: isActive ? '#fee2e2' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontWeight: '600', color: isActive ? theme.primary : 'inherit' }}>
                      {v.id} · {v.plate}
                    </span>
                    <span style={{ fontSize: '12px', color: theme.textMuted }}>
                      {v.driver} · {v.route}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '11px' }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {v.deliveredOrders}/{v.deliveredOrders + v.pendingOrders} ord.
                    </div>
                    <div style={{ color: theme.textMuted }}>Canastos: {v.basketsOnTruck + v.basketsDelivered}</div>
                    <div
                      style={{
                        marginTop: '2px',
                        display: 'inline-block',
                        padding: '2px 6px',
                        borderRadius: '999px',
                        backgroundColor:
                          v.status === 'En ruta' ? '#dbeafe'
                            : v.status === 'Entregando' ? '#dcfce7'
                            : '#fef9c3',
                        color:
                          v.status === 'En ruta' ? '#1d4ed8'
                            : v.status === 'Entregando' ? '#15803d'
                            : '#854d0e',
                      }}
                    >
                      {v.status}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

        </Card>
      </div>
    </div>
  );
};

const BasketView = ({ theme }) => {
  // Datos de ejemplo
  const summary = {
    totalBaskets: 2200,
    inWarehouse: 1350,
    withClients: 820,
    lostOrDamaged: 30,
  };

  const clientBaskets = [
    { client: 'Pollería El Rey', route: 'El Alto Norte', baskets: 120, lastMovement: '2025-12-22', status: 'Al día' },
    { client: 'Doña Juana', route: 'El Alto Sur', baskets: 80, lastMovement: '2025-12-21', status: 'Mora 3 días' },
    { client: 'Mercado Central - Puesto 4', route: 'La Paz Centro', baskets: 45, lastMovement: '2025-12-20', status: 'Al día' },
    { client: 'Distribuidor Sucre', route: 'Sucre Centro', baskets: 160, lastMovement: '2025-12-18', status: 'Mora 7 días' },
    { client: 'Feria 16 de Julio - Sector A', route: 'El Alto Norte', baskets: 95, lastMovement: '2025-12-23', status: 'Al día' },
    { client: 'Restaurante La Cumbre', route: 'La Paz Centro', baskets: 95, lastMovement: '2025-12-15', status: 'Mora 10 días' },
    { client: 'Tienda El Valle', route: 'El Alto Sur', baskets: 65, lastMovement: '2025-12-19', status: 'Mora 5 días' },
    { client: 'Supermercado Andino', route: 'La Paz Centro', baskets: 110, lastMovement: '2025-12-14', status: 'Mora 12 días' },
    { client: 'Café Paradiso', route: 'La Paz Centro', baskets: 40, lastMovement: '2025-12-17', status: 'Mora 8 días' },
    { client: 'Panadería San Miguel', route: 'El Alto Norte', baskets: 75, lastMovement: '2025-12-16', status: 'Mora 9 días' },
    { client: 'Carnicería Los Andes', route: 'El Alto Sur', baskets: 85, lastMovement: '2025-12-13', status: 'Mora 14 días' },
    { client: 'Verdulería El Sol', route: 'La Paz Centro', baskets: 55, lastMovement: '2025-12-18', status: 'Mora 6 días' },
    { client: 'Minimarket Plaza', route: 'Sucre Centro', baskets: 90, lastMovement: '2025-12-12', status: 'Mora 15 días' },
    { client: 'Hotel Continental', route: 'La Paz Centro', baskets: 130, lastMovement: '2025-12-11', status: 'Mora 16 días' },
    { client: 'Farmacia Central', route: 'El Alto Norte', baskets: 50, lastMovement: '2025-12-20', status: 'Mora 4 días' },
  ];

  const warehouseLocations = [
    { name: 'Almacén Central La Paz', section: 'Zona A', baskets: 620 },
    { name: 'Depósito El Alto', section: 'Zona Frío', baskets: 430 },
    { name: 'Depósito Viacha', section: 'Principal', baskets: 300 },
  ];

  const movements = [
    { date: '2025-12-23', client: 'Feria 16 de Julio - Sector A', type: 'Salida a cliente', baskets: -40, warehouse: 'Depósito El Alto', balanceWarehouse: 390, balanceClient: 95 },
    { date: '2025-12-23', client: 'Pollería El Rey', type: 'Devolución de canastos', baskets: +30, warehouse: 'Almacén Central La Paz', balanceWarehouse: 650, balanceClient: 120 },
    { date: '2025-12-22', client: 'Doña Juana', type: 'Salida a cliente', baskets: -20, warehouse: 'Depósito El Alto', balanceWarehouse: 430, balanceClient: 80 },
    { date: '2025-12-21', client: 'Distribuidor Sucre', type: 'Salida a cliente', baskets: -50, warehouse: 'Depósito Viacha', balanceWarehouse: 300, balanceClient: 160 },
    { date: '2025-12-20', client: 'Mercado Central - Puesto 4', type: 'Devolución parcial', baskets: +10, warehouse: 'Almacén Central La Paz', balanceWarehouse: 620, balanceClient: 45 },
  ];

  const [search, setSearch] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showExtractModal, setShowExtractModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const openExtractModal = (client) => {
    setSelectedClient(client);
    setShowExtractModal(true);
  };

  const closeExtractModal = () => {
    setShowExtractModal(false);
    setSelectedClient(null);
  };

  const filteredClients = clientBaskets
    .filter(c => {
      const s = search.toLowerCase();
      return (
        c.status.includes('Mora') &&
        (c.client.toLowerCase().includes(s) ||
         c.route.toLowerCase().includes(s))
      );
    })
    .sort((a, b) => b.baskets - a.baskets);

  const routeTotals = clientBaskets.reduce((acc, c) => {
    if (!acc[c.route]) acc[c.route] = 0;
    acc[c.route] += c.baskets;
    return acc;
  }, {});

  const routeList = Object.entries(routeTotals)
    .map(([route, baskets]) => ({ route, baskets }))
    .sort((a, b) => b.baskets - a.baskets);

  const filteredMovements = movements.filter(m => {
    if (!selectedDate) return true;
    return m.date === selectedDate;
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Resumen de canastos */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <Card>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Total Canastos</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '900' }}>{summary.totalBaskets.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Inventario teórico</div>
            </div>
            <Archive size={32} color={theme.primary} />
          </div>
        </Card>
        <Card>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>En Almacén</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '900' }}>{summary.inWarehouse.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Entre todos los depósitos</div>
            </div>
            <Box size={32} color={theme.frozen} />
          </div>
        </Card>
        <Card>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>En Clientes</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: theme.primary }}>{summary.withClients.toLocaleString()}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Deuda de canastos</div>
            </div>
            <ArrowRightLeft size={32} color={theme.primary} />
          </div>
        </Card>
        <Card>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>Perdidos / Dañados</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '900', color: '#b91c1c' }}>{summary.lostOrDamaged}</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Pendiente regularización</div>
            </div>
            <AlertCircle size={28} color="#b91c1c" />
          </div>
        </Card>
      </div>

      {/* Canastos en clientes + stock en almacén */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Clientes con canastos */}
        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>Clientes en Mora</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Canastos pendientes - Ordenado por cantidad (mayor a menor)</div>
            </div>
            <input
              type="text"
              placeholder="Buscar cliente o ruta..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: '8px 10px',
                borderRadius: '999px',
                border: '1px solid #e2e8f0',
                fontSize: '12px',
                minWidth: '220px',
                outline: 'none',
              }}
            />
          </div>
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '10px 16px' }}>Cliente</th>
                  <th style={{ padding: '10px 16px' }}>Ruta</th>
                  <th style={{ padding: '10px 16px' }}>Canastos</th>
                  <th style={{ padding: '10px 16px' }}>Últ. movimiento</th>
                  <th style={{ padding: '10px 16px' }}>Estado</th>
                  <th style={{ padding: '10px 16px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((c, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 16px', fontWeight: '600' }}>{c.client}</td>
                    <td style={{ padding: '10px 16px' }}>{c.route}</td>
                    <td style={{ padding: '10px 16px', fontWeight: '800', color: theme.primary }}>{c.baskets}</td>
                    <td style={{ padding: '10px 16px', fontSize: '12px', color: '#64748b' }}>{c.lastMovement}</td>
                    <td style={{ padding: '10px 16px' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          backgroundColor: c.status.includes('Mora') ? '#fef2f2' : '#ecfdf3',
                          color: c.status.includes('Mora') ? '#b91c1c' : '#166534',
                        }}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 16px' }}>
                      <button
                        onClick={() => openExtractModal(c)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #e2e8f0',
                          backgroundColor: 'white',
                          color: theme.primary,
                          fontSize: '11px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                        }}
                      >
                        Extracto
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                      No se encontraron clientes con ese criterio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Canastos por ruta */}
        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>Canastos por Ruta</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Total de canastos en cada ruta</div>
            </div>
          </div>
          <div>
            {routeList.map((r, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 20px',
                  borderBottom: idx === routeList.length - 1 ? 'none' : '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600' }}>{r.route}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Ruta de distribución</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '800', color: theme.primary }}>{r.baskets} canastos</div>
                  <div
                    style={{
                      marginTop: '4px',
                      width: '120px',
                      height: '6px',
                      backgroundColor: '#e5e7eb',
                      borderRadius: '999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${(r.baskets / summary.withClients) * 100}%`,
                        height: '100%',
                        backgroundColor: theme.primary,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Histórico de movimientos por día */}
      <Card style={{ padding: 0 }}>
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontWeight: 'bold' }}>Histórico de Movimientos por Día</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Entradas y salidas de canastos por fecha</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Fecha</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '12px',
                outline: 'none',
              }}
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate('')}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: theme.primary,
                  fontSize: '12px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
        <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', textAlign: 'left' }}>
                <th style={{ padding: '10px 16px' }}>Fecha</th>
                <th style={{ padding: '10px 16px' }}>Cliente</th>
                <th style={{ padding: '10px 16px' }}>Tipo Movimiento</th>
                <th style={{ padding: '10px 16px' }}>Canastos (+/-)</th>
                <th style={{ padding: '10px 16px' }}>Almacén</th>
                <th style={{ padding: '10px 16px' }}>Saldo Cliente</th>
                <th style={{ padding: '10px 16px' }}>Saldo Almacén</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.map((m, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 16px', fontSize: '12px', color: '#64748b' }}>{m.date}</td>
                  <td style={{ padding: '10px 16px', fontWeight: '600' }}>{m.client}</td>
                  <td style={{ padding: '10px 16px' }}>{m.type}</td>
                  <td
                    style={{
                      padding: '10px 16px',
                      fontWeight: '800',
                      color: m.baskets < 0 ? theme.primary : '#16a34a',
                    }}
                  >
                    {m.baskets > 0 ? `+${m.baskets}` : m.baskets}
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: '12px', color: '#64748b' }}>{m.warehouse}</td>
                  <td style={{ padding: '10px 16px', fontSize: '12px' }}>{m.balanceClient} can.</td>
                  <td style={{ padding: '10px 16px', fontSize: '12px' }}>{m.balanceWarehouse} can.</td>
                </tr>
              ))}
              {filteredMovements.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                    No se encontraron movimientos para la fecha seleccionada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal para extracto del cliente */}
      {showExtractModal && selectedClient && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={closeExtractModal}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '800px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Extracto de {selectedClient.client}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748b' }}>
                  Histórico de movimientos de canastos
                </p>
              </div>
              <button
                onClick={closeExtractModal}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: theme.primary }}>{selectedClient.baskets}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Canastos pendientes</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>{selectedClient.route}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Ruta asignada</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#b91c1c' }}>{selectedClient.status}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Estado actual</div>
                </div>
              </div>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', textAlign: 'left' }}>
                    <th style={{ padding: '10px 16px' }}>Fecha</th>
                    <th style={{ padding: '10px 16px' }}>Tipo Movimiento</th>
                    <th style={{ padding: '10px 16px' }}>Canastos (+/-)</th>
                    <th style={{ padding: '10px 16px' }}>Almacén</th>
                    <th style={{ padding: '10px 16px' }}>Saldo Cliente</th>
                    <th style={{ padding: '10px 16px' }}>Saldo Almacén</th>
                  </tr>
                </thead>
                <tbody>
                  {movements
                    .filter(m => m.client === selectedClient.client)
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((m, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 16px', fontSize: '12px', color: '#64748b' }}>{m.date}</td>
                        <td style={{ padding: '10px 16px' }}>{m.type}</td>
                        <td
                          style={{
                            padding: '10px 16px',
                            fontWeight: '800',
                            color: m.baskets < 0 ? theme.primary : '#16a34a',
                          }}
                        >
                          {m.baskets > 0 ? `+${m.baskets}` : m.baskets}
                        </td>
                        <td style={{ padding: '10px 16px', fontSize: '12px', color: '#64748b' }}>{m.warehouse}</td>
                        <td style={{ padding: '10px 16px', fontSize: '12px' }}>{m.balanceClient} can.</td>
                        <td style={{ padding: '10px 16px', fontSize: '12px' }}>{m.balanceWarehouse} can.</td>
                      </tr>
                    ))}
                  {movements.filter(m => m.client === selectedClient.client).length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ padding: '16px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                        No se encontraron movimientos para este cliente.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Componentes Pequeños
const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase' }}>{title}</span>
      <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: `${color}15`, color: color }}>
        <Icon size={18} />
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
      <span style={{ fontSize: '24px', fontWeight: '900' }}>{value}</span>
      {change && <span style={{ fontSize: '12px', fontWeight: 'bold', color: change.includes('+') ? '#10b981' : '#f43f5e' }}>{change}%</span>}
    </div>
  </div>
);

const InputBox = ({ label, value, placeholder, readOnly }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>{label.toUpperCase()}</label>
    <input 
      type="text" defaultValue={value} placeholder={placeholder} readOnly={readOnly}
      style={{ 
        padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px',
        backgroundColor: readOnly ? '#f8fafc' : 'white', outline: 'none'
      }} 
    />
  </div>
);

const TableRow = ({ client, req, asig, status }) => (
  <tr style={{ borderBottom: '1px solid #f8fafc' }}>
    <td style={{ padding: '16px 24px', fontWeight: '500' }}>{client}</td>
    <td style={{ padding: '16px 24px' }}>{req}</td>
    <td style={{ padding: '16px 24px' }}>
      <input type="number" defaultValue={asig} style={{ width: '60px', padding: '6px', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
    </td>
    <td style={{ padding: '16px 24px' }}>
      <span style={{ 
        padding: '4px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold',
        backgroundColor: status === 'COMPLETO' ? '#dcfce7' : '#fee2e2',
        color: status === 'COMPLETO' ? '#166534' : '#991b1b'
      }}>{status}</span>
    </td>
  </tr>
);

// Vista de Configuración
const SettingsView = ({ 
  theme,
  showNewClientModal,
  setShowNewClientModal,
  newClientName,
  setNewClientName,
  newClientGroup,
  setNewClientGroup,
  newClientPhone,
  setNewClientPhone,
  newClientLocation,
  setNewClientLocation,
  handleSaveNewClient,
  handleCloseNewClientModal,
  clientsByGroup
}) => {
  const [activeSection, setActiveSection] = useState('providers');
  
  const [productCategories, setProductCategories] = useState([
    {
      id: 5,
      name: 'POLLO SOFIA',
      products: [
        '104',
        '105',
        '106',
        '107',
        '108',
        '109',
        'menudencia'
      ]
    },
    {
      id: 6,
      name: 'POLLO AVC',
      products: [
        'cinta',
        'verde',
        'amarilla Segunda',
        'azul',
        'negro',
        'blanco',
        'rojo',
        'menudencia'
      ]
    },
    {
      id: 1,
      name: 'OTROS SOFIA',
      products: [
        'pechuga',
        'filete de Pollo',
        'pierna muslo',
        'ala',
        'trozado mix',
        'patitas',
        'higado'
      ]
    },
    {
      id: 8,
      name: 'OTROS AVC',
      products: [
        'ala',
        'pierna muslo',
        'pechuga',
        'cazuela',
        'cuello',
        'higado',
        'alas Segunda'
      ]
    },
    {
      id: 2,
      name: 'PROCESADOS',
      products: [
        'chorizo',
        'salchicha bonnisima',
        'mortadela primavera',
        'nuggets de Pollo',
        'milanesa americana',
        'hambuerguesas'
      ]
    },
    {
      id: 3,
      name: 'HUEVO',
      products: [
        'extracto',
        'primera',
        'Segunda',
        'Terceracuarta',
        'quinta'
      ]
    },
    {
      id: 4,
      name: 'CERDO',
      products: [
        'cerdo entero',
        'chuletas de cerdo'
      ]
    },
    {
      id: 7,
      name: 'POLLO CONGELADO',
      products: [
        '500117',
        '500116',
        '500114'
      ]
    }
  ]);
  
  const sections = [
    { id: 'providers', label: 'Proveedores', icon: Package },
    { id: 'products', label: 'Productos', icon: Box },
    { id: 'clients', label: 'Clientes', icon: UserCircle },
    { id: 'vehicles', label: 'Vehículos', icon: Truck },
    { id: 'baskets', label: 'Contenedores', icon: Archive },
    { id: 'users', label: 'Usuarios', icon: UserCircle },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '12px', flexWrap: 'wrap' }}>
        {sections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
                backgroundColor: isActive ? 'white' : 'transparent',
                color: isActive ? theme.primary : theme.textMuted,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Icon size={16} />
              {section.label}
            </button>
          );
        })}
      </div>

      {activeSection === 'providers' && <ProvidersSettings theme={theme} productCategories={productCategories} />}
      {activeSection === 'products' && <ProductsSettings theme={theme} productCategories={productCategories} setProductCategories={setProductCategories} />}
      {activeSection === 'clients' && <ClientsSettings 
        theme={theme}
        showNewClientModal={showNewClientModal}
        setShowNewClientModal={setShowNewClientModal}
        clientsByGroup={clientsByGroup}
      />}
      {activeSection === 'vehicles' && <VehiclesSettings theme={theme} />}
      {activeSection === 'baskets' && <BasketsSettings theme={theme} />}
      {activeSection === 'users' && <UsersSettings theme={theme} />}
    </div>
  );
};
const ProvidersSettings = ({ theme, productCategories }) => {
  const [providers, setProviders] = useState([
    { id: 1, name: 'Avícola Sofía', code: 'SOFIA', contact: 'contacto@sofia.com', phone: '+591 2 1234567', active: true, groups: ['POLLO SOFIA'] },
    { id: 2, name: 'PIO / IMBA', code: 'PIO', contact: 'contacto@pio.com', phone: '+591 2 7654321', active: true, groups: ['OTROS SOFIA', 'PROCESADOS'] },
  ]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', groups: [] });
  const [selectedGroupToAdd, setSelectedGroupToAdd] = useState('');

  const handleSave = () => {
    if (editing) {
      setProviders(providers.map(p => p.id === editing ? { ...p, ...formData } : p));
    } else {
      setProviders([...providers, { id: Date.now(), ...formData, active: true }]);
    }
    setEditing(null);
    setFormData({ name: '', groups: [] });
    setSelectedGroupToAdd('');
  };

  const addGroup = () => {
    if (selectedGroupToAdd && !formData.groups.includes(selectedGroupToAdd)) {
      setFormData({ ...formData, groups: [...formData.groups, selectedGroupToAdd] });
      setSelectedGroupToAdd('');
    }
  };

  const removeGroup = (groupToRemove) => {
    setFormData({ ...formData, groups: formData.groups.filter(g => g !== groupToRemove) });
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Proveedores</h3>
        <button
          onClick={() => setEditing('new')}
          style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> Nuevo Proveedor
        </button>
      </div>
      {(editing === 'new' || editing) && (
        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>NOMBRE</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>AGREGAR GRUPO DE PRODUCTOS</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  value={selectedGroupToAdd} 
                  onChange={(e) => setSelectedGroupToAdd(e.target.value)}
                  style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }}
                >
                  <option value="">Seleccionar grupo...</option>
                  {productCategories.filter(c => !formData.groups.includes(c.name)).map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <button 
                  type="button"
                  onClick={addGroup}
                  disabled={!selectedGroupToAdd}
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    border: 'none', 
                    backgroundColor: selectedGroupToAdd ? theme.primary : '#cbd5e1', 
                    color: 'white', 
                    cursor: selectedGroupToAdd ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold'
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Grupos seleccionados */}
          {formData.groups.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '6px' }}>
                GRUPOS ASIGNADOS ({formData.groups.length})
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {formData.groups.map(group => (
                  <div key={group} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    padding: '4px 8px',
                    backgroundColor: theme.primary + '20',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {group}
                    <button 
                      type="button"
                      onClick={() => removeGroup(group)}
                      style={{ 
                        border: 'none', 
                        backgroundColor: 'transparent', 
                        color: '#dc2626', 
                        cursor: 'pointer',
                        padding: '0',
                        fontSize: '14px',
                        lineHeight: 1
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSave} style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              <Save size={14} /> Guardar
            </button>
            <button onClick={() => { setEditing(null); setFormData({ name: '', groups: [] }); setSelectedGroupToAdd(''); }} style={{ backgroundColor: '#f1f5f9', color: theme.textMain, border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Grupos de Productos</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {providers.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: '600' }}>{p.name}</td>
              <td style={{ padding: '12px' }}>
                {p.groups && p.groups.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {p.groups.map((group, idx) => (
                      <span key={idx} style={{ 
                        padding: '2px 6px', 
                        backgroundColor: theme.primary + '20', 
                        borderRadius: '3px', 
                        fontSize: '11px',
                        fontWeight: '500'
                      }}>
                        {group}
                      </span>
                    ))}
                  </div>
                ) : (
                  'No especificado'
                )}
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: p.active ? '#dcfce7' : '#fee2e2', color: p.active ? '#166534' : '#991b1b' }}>
                  {p.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => { setEditing(p.id); setFormData({ name: p.name, groups: p.groups || [] }); setSelectedGroupToAdd(''); }} style={{ marginRight: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }}>
                  <Edit size={14} />
                </button>
                <button onClick={() => setProviders(providers.filter(pr => pr.id !== p.id))} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', backgroundColor: '#fee2e2', color: '#991b1b', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

const ProductsSettings = ({ theme, productCategories, setProductCategories }) => {
  // Estados para formularios
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newProductName, setNewProductName] = useState('');
  const [selectedCategoryForProduct, setSelectedCategoryForProduct] = useState('');

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Productos</h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => setShowNewProductForm(true)}
            style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Nuevo Producto
          </button>
          <button 
            onClick={() => setShowNewCategoryForm(true)}
            style={{ backgroundColor: '#6b7280', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Nueva Categoría
          </button>
        </div>
      </div>

      {/* Formulario de Nueva Categoría */}
      {showNewCategoryForm && (
        <Card style={{ marginBottom: '20px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold' }}>Nueva Categoría</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                NOMBRE DE LA CATEGORÍA *
              </label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ingrese el nombre de la categoría"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowNewCategoryForm(false);
                  setNewCategoryName('');
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!newCategoryName.trim()) {
                    alert('Por favor ingrese el nombre de la categoría');
                    return;
                  }
                  const newId = Math.max(...productCategories.map(c => c.id)) + 1;
                  setProductCategories([...productCategories, { 
                    id: newId, 
                    name: newCategoryName.toUpperCase(), 
                    products: [] 
                  }]);
                  setShowNewCategoryForm(false);
                  setNewCategoryName('');
                  alert(`Categoría "${newCategoryName}" creada exitosamente`);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Crear Categoría
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Formulario de Nuevo Producto */}
      {showNewProductForm && (
        <Card style={{ marginBottom: '20px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold' }}>Nuevo Producto</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                CATEGORÍA *
              </label>
              <select
                value={selectedCategoryForProduct}
                onChange={(e) => setSelectedCategoryForProduct(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '14px'
                }}
              >
                <option value="">Seleccionar Categoría...</option>
                {productCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                NOMBRE DEL PRODUCTO *
              </label>
              <input
                type="text"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Ingrese el nombre del producto"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowNewProductForm(false);
                  setNewProductName('');
                  setSelectedCategoryForProduct('');
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!selectedCategoryForProduct || !newProductName.trim()) {
                    alert('Por favor complete todos los campos obligatorios');
                    return;
                  }
                  setProductCategories(productCategories.map(category => 
                    category.id === parseInt(selectedCategoryForProduct)
                      ? { ...category, products: [...category.products, newProductName] }
                      : category
                  ));
                  setShowNewProductForm(false);
                  setNewProductName('');
                  setSelectedCategoryForProduct('');
                  alert(`Producto "${newProductName}" agregado exitosamente`);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: theme.primary,
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Crear Producto
              </button>
            </div>
          </div>
        </Card>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {productCategories.map(category => (
          <div key={category.id} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: theme.primary }}>{category.name}</h4>
            </div>
            <div style={{ padding: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {category.products.map((product, index) => (
                  <div key={index} style={{ 
                    padding: '12px', 
                    backgroundColor: '#f8fafc', 
                    borderRadius: '6px', 
                    border: '1px solid #e2e8f0',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {product}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const ClientsSettings = ({ 
  theme,
  showNewClientModal,
  setShowNewClientModal,
  clientsByGroup
}) => {
  const [clients, setClients] = useState([
    { id: 1, name: 'Pollería El Rey', route: 'El Alto Norte', group: 'Grupo A', contact: 'rey@email.com', phone: '+591 71234567', active: true },
    { id: 2, name: 'Doña Juana', route: 'El Alto Sur', group: 'Grupo B', contact: 'juana@email.com', phone: '+591 71234568', active: true },
    { id: 3, name: 'Mercado Central - Puesto 4', route: 'La Paz Centro', group: 'Grupo A', contact: 'mercado@email.com', phone: '+591 71234569', active: true },
  ]);
  const [groups, setGroups] = useState([
    { id: 1, name: 'Grupo A', description: 'Clientes principales del norte', active: true },
    { id: 2, name: 'Grupo B', description: 'Clientes del sur', active: true },
  ]);
  const [activeTab, setActiveTab] = useState('clients');
  const [showNewGroupForm, setShowNewGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupRoute, setNewGroupRoute] = useState('');

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Clientes</h3>
        <button onClick={() => activeTab === 'clients' ? setShowNewClientModal(true) : setShowNewGroupForm(true)} style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> {activeTab === 'clients' ? 'Nuevo Cliente' : 'Nuevo Grupo'}
        </button>
      </div>

      {/* Pestañas */}
      <div style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
        <button 
          onClick={() => setActiveTab('clients')}
          style={{ 
            padding: '10px 20px', 
            border: 'none', 
            backgroundColor: activeTab === 'clients' ? theme.primary : 'transparent', 
            color: activeTab === 'clients' ? 'white' : theme.textMain, 
            borderRadius: '6px 6px 0 0', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
          }}
        >
          Clientes
        </button>
        <button 
          onClick={() => setActiveTab('groups')}
          style={{ 
            padding: '10px 20px', 
            border: 'none', 
            backgroundColor: activeTab === 'groups' ? theme.primary : 'transparent', 
            color: activeTab === 'groups' ? 'white' : theme.textMain, 
            borderRadius: '6px 6px 0 0', 
            fontWeight: 'bold', 
            cursor: 'pointer' 
          }}
        >
          Grupos
        </button>
      </div>

      {/* Tabla de Clientes */}
      {activeTab === 'clients' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Ruta</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Teléfono</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontWeight: '600' }}>{c.name}</td>
                <td style={{ padding: '12px' }}>{c.route}</td>
                <td style={{ padding: '12px' }}>{c.phone}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: c.active ? '#dcfce7' : '#fee2e2', color: c.active ? '#166534' : '#991b1b' }}>
                    {c.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => alert('Funcionalidad próximamente')} style={{ marginRight: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }}>
                    <Edit size={14} />
                  </button>
                  <button onClick={() => setClients(clients.filter(cl => cl.id !== c.id))} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', backgroundColor: '#fee2e2', color: '#991b1b', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Formulario de Nuevo Grupo */}
      {activeTab === 'groups' && showNewGroupForm && (
        <Card style={{ marginBottom: '20px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold' }}>Nuevo Grupo</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                NOMBRE DEL GRUPO *
              </label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Ingrese el nombre del grupo"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                RUTA *
              </label>
              <select
                value={newGroupRoute}
                onChange={(e) => setNewGroupRoute(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '14px'
                }}
              >
                <option value="">Seleccionar Ruta...</option>
                <option value="El Alto - Zona Norte">El Alto - Zona Norte</option>
                <option value="El Alto - Zona Sur">El Alto - Zona Sur</option>
                <option value="La Paz - Centro">La Paz - Centro</option>
                <option value="La Paz - Zona Norte">La Paz - Zona Norte</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowNewGroupForm(false);
                  setNewGroupName('');
                  setNewGroupRoute('');
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!newGroupName.trim() || !newGroupRoute) {
                    alert('Por favor complete todos los campos obligatorios');
                    return;
                  }
                  setGroups([...groups, { 
                    id: Date.now(), 
                    name: newGroupName, 
                    description: `Grupo de ${newGroupRoute}`, 
                    active: true 
                  }]);
                  setShowNewGroupForm(false);
                  setNewGroupName('');
                  setNewGroupRoute('');
                  alert(`Grupo "${newGroupName}" creado exitosamente`);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: theme.primary,
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Crear Grupo
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Tabla de Grupos */}
      {activeTab === 'groups' && (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Descripción</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(g => (
              <tr key={g.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontWeight: '600' }}>{g.name}</td>
                <td style={{ padding: '12px' }}>{g.description}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: g.active ? '#dcfce7' : '#fee2e2', color: g.active ? '#166534' : '#991b1b' }}>
                    {g.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button onClick={() => alert('Funcionalidad próximamente')} style={{ marginRight: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }}>
                    <Edit size={14} />
                  </button>
                  <button onClick={() => setGroups(groups.filter(gr => gr.id !== g.id))} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', backgroundColor: '#fee2e2', color: '#991b1b', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
};



const VehiclesSettings = ({ theme }) => {
  const [vehicles, setVehicles] = useState([
    { id: 'VH-01', plate: '1234-ABC', capacity: '1234-ABC', status: 'Activo', active: true },
    { id: 'VH-02', plate: '5678-DEF', capacity: '5678-DEF', status: 'Activo', active: true },
    { id: 'VH-03', plate: '9999-XYZ', capacity: '9999-XYZ', status: 'Mantenimiento', active: false },
  ]);
  const [showNewVehicleForm, setShowNewVehicleForm] = useState(false);
  const [newVehicleName, setNewVehicleName] = useState('');
  const [newVehiclePlate, setNewVehiclePlate] = useState('');
  const [newVehicleCapacity, setNewVehicleCapacity] = useState('');

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Vehículos</h3>
        <button onClick={() => setShowNewVehicleForm(true)} style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Nuevo Vehículo
        </button>
      </div>

      {/* Formulario de Nuevo Vehículo */}
      {showNewVehicleForm && (
        <Card style={{ marginBottom: '20px', padding: '20px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 'bold' }}>Nuevo Vehículo</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                NOMBRE DEL VEHÍCULO *
              </label>
              <input
                type="text"
                value={newVehicleName}
                onChange={(e) => setNewVehicleName(e.target.value)}
                placeholder="Ingrese el nombre del vehículo"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                PLACA *
              </label>
              <input
                type="text"
                value={newVehiclePlate}
                onChange={(e) => setNewVehiclePlate(e.target.value)}
                placeholder="Ingrese la placa del vehículo"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>
                Monnet *
              </label>
              <select
                value={newVehicleCapacity}
                onChange={(e) => setNewVehicleCapacity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  fontSize: '14px'
                }}
              >
                <option value="">Sincronizar con monnet</option>
                <option value="1111ABC">1111ABC</option>
                <option value="2222ABC">2222ABC</option>
                <option value="3333ABC">3333ABC</option>
                <option value="4444ABC">4444ABC</option>
                <option value="5555ABC">5555ABC</option>
                <option value="6666ABC">6666ABC</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowNewVehicleForm(false);
                  setNewVehicleName('');
                  setNewVehiclePlate('');
                  setNewVehicleCapacity('');
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#64748b',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (!newVehicleName.trim() || !newVehiclePlate.trim() || !newVehicleCapacity) {
                    alert('Por favor complete todos los campos obligatorios');
                    return;
                  }
                  const newId = `VH-${String(vehicles.length + 1).padStart(2, '0')}`;
                  setVehicles([...vehicles, { 
                    id: newId, 
                    plate: newVehiclePlate, 
                    capacity: newVehicleCapacity, 
                    status: 'Activo',
                    active: true 
                  }]);
                  setShowNewVehicleForm(false);
                  setNewVehicleName('');
                  setNewVehiclePlate('');
                  setNewVehicleCapacity('');
                  alert(`Vehículo "${newVehicleName}" creado exitosamente`);
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: theme.primary,
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Crear Vehículo
              </button>
            </div>
          </div>
        </Card>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Placa</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>monnet</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map(v => (
            <tr key={v.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: '600' }}>{v.id}</td>
              <td style={{ padding: '12px' }}>{v.plate}</td>
              <td style={{ padding: '12px' }}>{v.capacity}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: v.active ? '#dcfce7' : '#fee2e2', color: v.active ? '#166534' : '#991b1b' }}>
                  {v.status}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <button style={{ marginRight: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }}>
                  <Edit size={14} />
                </button>
                <button style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', backgroundColor: '#fee2e2', color: '#991b1b', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};


const BasketsSettings = ({ theme }) => {
  const [baskets, setBaskets] = useState([
    { id: 1, name: 'Canasto Grande', weight: 2.5, isDefault: true },
    { id: 2, name: 'Canasto Pequeño', weight: 1.0, isDefault: false },
    { id: 3, name: 'Caja Mediana', weight: 1.8, isDefault: false },
  ]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', weight: '', isDefault: false });

  const handleSave = () => {
    if (editing) {
      if (formData.isDefault) {
        setBaskets(baskets.map(b => ({ ...b, isDefault: b.id === editing })));
      }
      setBaskets(baskets.map(b => b.id === editing ? { ...b, ...formData } : b));
    } else {
      const newId = Math.max(...baskets.map(b => b.id)) + 1;
      if (formData.isDefault) {
        setBaskets([...baskets.map(b => ({ ...b, isDefault: false })), { id: newId, ...formData }]);
      } else {
        setBaskets([...baskets, { id: newId, ...formData }]);
      }
    }
    setEditing(null);
    setFormData({ name: '', weight: '', isDefault: false });
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Contenedores</h3>
        <button
          onClick={() => setEditing('new')}
          style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={16} /> Agregar Contenedor
        </button>
      </div>
      {(editing === 'new' || editing) && (
        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>NOMBRE</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PESO (DESTARE) KG</label>
              <input 
                type="number" 
                step="0.1"
                value={formData.weight} 
                onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value) || 0})} 
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }} 
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                type="checkbox" 
                checked={formData.isDefault} 
                onChange={(e) => setFormData({...formData, isDefault: e.target.checked})} 
                style={{ width: '16px', height: '16px' }} 
              />
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CONTENEDOR POR DEFECTO</label>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSave} style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              <Save size={14} /> Guardar
            </button>
            <button onClick={() => { setEditing(null); setFormData({ name: '', weight: '', isDefault: false }); }} style={{ backgroundColor: '#f1f5f9', color: theme.textMain, border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Peso (Destare)</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Por Defecto</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {baskets.map(b => (
            <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: '600' }}>{b.name}</td>
              <td style={{ padding: '12px' }}>{b.weight} kg</td>
              <td style={{ padding: '12px' }}>
                {b.isDefault ? (
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#dcfce7', color: '#166534' }}>
                    Sí
                  </span>
                ) : (
                  <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#fee2e2', color: '#991b1b' }}>
                    No
                  </span>
                )}
              </td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => { setEditing(b.id); setFormData({ name: b.name, weight: b.weight, isDefault: b.isDefault }); }} style={{ marginRight: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }}>
                  <Edit size={14} />
                </button>
                <button onClick={() => setBaskets(baskets.filter(basket => basket.id !== b.id))} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', backgroundColor: '#fee2e2', color: '#991b1b', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

const UsersSettings = ({ theme }) => {
  const [users, setUsers] = useState([
    { id: 1, firstName: 'Admin', lastName: 'Bolivia', ci: '12345678', role: 'admin', active: true },
    { id: 2, firstName: 'Operador', lastName: 'Uno', ci: '87654321', role: 'despachador 1', active: true },
  ]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', ci: '', role: '' });

  const menus = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'orders', label: 'Consolidación' },
    { id: 'assignments', label: 'Asignaciones' },
    { id: 'tracking', label: 'Seguimiento' },
    { id: 'baskets', label: 'Canastos' },
    { id: 'driverApp', label: 'App Chofer' },
    { id: 'clientApp', label: 'App Cliente' },
    { id: 'contabilidad', label: 'Contabilidad' },
    { id: 'rrhh', label: 'RRHH / Planillas' },
    { id: 'settings', label: 'Configuración' },
  ];

  const [roles, setRoles] = useState([
    { id: 'admin', name: 'Admin', allowedMenus: menus.map(m => m.id) },
    { id: 'gerente', name: 'Gerente', allowedMenus: ['dashboard', 'orders', 'assignments', 'tracking', 'baskets', 'reports', 'settings'] },
    { id: 'despachador 1', name: 'Despachador 1', allowedMenus: ['assignments', 'tracking'] },
    { id: 'despachador 2', name: 'Despachador 2', allowedMenus: ['assignments', 'tracking'] },
    { id: 'contador', name: 'Contador', allowedMenus: ['contabilidad', 'rrhh'] },
    { id: 'encargado de ruta', name: 'Encargado de Ruta', allowedMenus: ['assignments', 'tracking', 'reports'] },
    { id: 'preventista', name: 'Preventista', allowedMenus: ['orders', 'tracking'] },
  ]);

  const [creatingRole, setCreatingRole] = useState(false);
  const [roleForm, setRoleForm] = useState({ name: '', allowedMenus: [] });

  const handleSave = () => {
    if (editing) {
      setUsers(users.map(u => u.id === editing ? { ...u, ...formData } : u));
    } else {
      const newId = Math.max(...users.map(u => u.id)) + 1;
      setUsers([...users, { id: newId, ...formData, active: true }]);
    }
    setEditing(null);
    setFormData({ firstName: '', lastName: '', ci: '', role: '' });
  };

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Usuarios</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setCreatingRole(true)}
            style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Crear Rol
          </button>
          <button
            onClick={() => setEditing('new')}
            style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} /> Nuevo Usuario
          </button>
        </div>
      </div>
      {(editing === 'new' || editing) && (
        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>NOMBRE</label>
              <input 
                type="text" 
                value={formData.firstName} 
                onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>APELLIDO</label>
              <input 
                type="text" 
                value={formData.lastName} 
                onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CI</label>
              <input 
                type="text" 
                value={formData.ci} 
                onChange={(e) => setFormData({...formData, ci: e.target.value})} 
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }} 
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>ROL</label>
              <select 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})} 
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }}
              >
                <option value="">Seleccionar rol...</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSave} style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              <Save size={14} /> Guardar
            </button>
            <button onClick={() => { setEditing(null); setFormData({ firstName: '', lastName: '', ci: '', role: '' }); }} style={{ backgroundColor: '#f1f5f9', color: theme.textMain, border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
      {creatingRole && (
        <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>NOMBRE DEL ROL</label>
            <input 
              type="text" 
              value={roleForm.name} 
              onChange={(e) => setRoleForm({...roleForm, name: e.target.value})} 
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }} 
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PANTALLAS CON ACCESO</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '8px' }}>
              {menus.map(menu => (
                <label key={menu.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <input
                    type="checkbox"
                    checked={roleForm.allowedMenus.includes(menu.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setRoleForm({...roleForm, allowedMenus: [...roleForm.allowedMenus, menu.id]});
                      } else {
                        setRoleForm({...roleForm, allowedMenus: roleForm.allowedMenus.filter(id => id !== menu.id)});
                      }
                    }}
                  />
                  {menu.label}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => {
              const newId = Math.max(...roles.map(r => r.id.length ? parseInt(r.id) : 0), 0) + 1;
              setRoles([...roles, { id: newId.toString(), name: roleForm.name, allowedMenus: roleForm.allowedMenus }]);
              setCreatingRole(false);
              setRoleForm({ name: '', allowedMenus: [] });
            }} style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              <Save size={14} /> Guardar Rol
            </button>
            <button onClick={() => { setCreatingRole(false); setRoleForm({ name: '', allowedMenus: [] }); }} style={{ backgroundColor: '#f1f5f9', color: theme.textMain, border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Apellido</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>CI</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Rol</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: '600' }}>{u.firstName}</td>
              <td style={{ padding: '12px' }}>{u.lastName}</td>
              <td style={{ padding: '12px' }}>{u.ci}</td>
              <td style={{ padding: '12px' }}>{roles.find(r => r.id === u.role)?.name || u.role}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: u.active ? '#dcfce7' : '#fee2e2', color: u.active ? '#166534' : '#991b1b' }}>
                  {u.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => { setEditing(u.id); setFormData({ firstName: u.firstName, lastName: u.lastName, ci: u.ci, role: u.role }); }} style={{ marginRight: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }}>
                  <Edit size={14} />
                </button>
                <button onClick={() => setUsers(users.filter(user => user.id !== u.id))} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', backgroundColor: '#fee2e2', color: '#991b1b', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

const DriverAppView = ({ theme }) => {
  const [route] = useState({ id: 'R-001', name: 'El Alto Norte', vehicle: 'VH-01', driver: 'Juan Pérez', center: [-16.5000, -68.1500] });

  const [clients, setClients] = useState([
    { id: 1, name: 'Pollería El Rey', codes: [{code:104, boxes:10, units:5, grossWeight:100, netWeight:95}], lat: -16.495, lng: -68.145, total: 450.00, delivered: false, paid: false, paymentMethod: null, paidAmount: 0, returnedBaskets: 0 },
    { id: 2, name: 'Feria Sector A', codes: [{code:104, boxes:8, units:12, grossWeight:100, netWeight:80},{code:109, boxes:5, units:10, grossWeight:75, netWeight:75}], lat: -16.505, lng: -68.155, total: 620.00, delivered: false, paid: false, paymentMethod: null, paidAmount: 0, returnedBaskets: 0 },
    { id: 3, name: 'Doña Juana', codes: [{code:107, boxes:5, units:3, grossWeight:50, netWeight:47.5}], lat: -16.515, lng: -68.135, total: 285.00, delivered: false, paid: false, paymentMethod: null, paidAmount: 0, returnedBaskets: 0 }
  ]);

  const toggleDelivered = (id) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, delivered: !c.delivered } : c));
  };

  const registerPayment = (id, method) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, paid: true, paymentMethod: method, paidAmount: c.total } : c));
  };

  const updateReturnedBaskets = (id, baskets) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, returnedBaskets: parseInt(baskets) || 0, basketsRegistered: true } : c));
  };

  const totalToCharge = clients.reduce((s, c) => s + (c.total || 0), 0);

  const [gastos, setGastos] = useState([]);
  const [showGastoForm, setShowGastoForm] = useState(false);
  const [gastoForm, setGastoForm] = useState({ monto: 0, detalle: '' });

  const openGastoForm = () => {
    setGastoForm({ monto: 0, detalle: '' });
    setShowGastoForm(true);
  };

  const saveGasto = () => {
    if (!gastoForm.monto || Number(gastoForm.monto) <= 0) return alert('Ingrese un monto válido');
    const nuevo = { ...gastoForm, fecha: new Date().toISOString().slice(0,10), id: Date.now() };
    setGastos(prev => [nuevo, ...prev]);
    setShowGastoForm(false);
    setGastoForm({ monto: 0, detalle: '' });
    alert('Gasto registrado');
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '20px' }}>
      <div>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 'bold' }}>Ruta: {route.name} · {route.id}</div>
              <div style={{ fontSize: '12px', color: theme.textMuted }}>Vehículo: {route.vehicle} · Chofer: {route.driver}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: theme.textMuted }}>Total a Cobrar</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: theme.primary }}>Bs {totalToCharge.toFixed(2)}</div>
              <div style={{ marginTop:8 }}>
                <button onClick={openGastoForm} style={{ padding:8, background:'#ef4444', color:'white', border:'none', borderRadius:6 }}>Registrar Gastos</button>
              </div>
            </div>
          </div>

          {showGastoForm && (
            <Card style={{ marginBottom:12 }}>
              <h4>Registrar Gasto</h4>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <input type="number" placeholder="Monto" value={gastoForm.monto} onChange={e=>setGastoForm({...gastoForm, monto: Number(e.target.value)})} />
                <input placeholder="Detalle" value={gastoForm.detalle} onChange={e=>setGastoForm({...gastoForm, detalle: e.target.value})} />
                <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                  <button onClick={saveGasto} style={{ padding:8, background:'#10b981', color:'white', border:'none', borderRadius:6 }}>Guardar</button>
                  <button onClick={() => setShowGastoForm(false)} style={{ padding:8, background:'#6b7280', color:'white', border:'none', borderRadius:6 }}>Cancelar</button>
                </div>
              </div>
            </Card>
          )}

          <div style={{ height: '360px' }}>
            <MapContainer center={route.center} zoom={12} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {clients.map(c => (
                <Marker key={c.id} position={[c.lat, c.lng]}>
                  <Popup>
                    <div style={{ minWidth: '220px' }}>
                      <div style={{ fontWeight: 'bold' }}>{c.name}</div>
                      <div style={{ fontSize: '12px', color: theme.textMuted }}>Total: Bs {c.total.toFixed(2)}</div>
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '6px' }}>Detalle de Entrega</div>
                        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
                          {[104,105,106,107,108,109,110].map(code => {
                            const item = c.codes.find(x => x.code === code) || { boxes: 0, units: 0, grossWeight: 0, netWeight: 0 };
                            return (
                              <div key={code} style={{ minWidth: '140px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', color: theme.primary, textAlign: 'center' }}>Código {code}</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#0ea5e9' }}>
                                    <Package size={12} />
                                    <span>{item.boxes || 0} Cajas</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#f97316' }}>
                                    <Box size={12} />
                                    <span>{item.units || 0} Unidades</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#059669' }}>
                                    <Truck size={12} />
                                    <span>{(item.grossWeight || 0).toFixed(2)} kg Bruto</span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981' }}>
                                    <Truck size={12} />
                                    <span>{(item.netWeight || 0).toFixed(2)} kg Neto</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexDirection: 'column' }}>
                        {/* Paso 1: Entregar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                          <div style={{ 
                            width: '16px', 
                            height: '16px', 
                            borderRadius: '50%', 
                            backgroundColor: c.delivered ? '#10b981' : '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            color: c.delivered ? 'white' : '#64748b'
                          }}>
                            {c.delivered ? '✓' : '1'}
                          </div>
                          <button onClick={() => toggleDelivered(c.id)} style={{ padding: '6px 8px', borderRadius: '4px', border: 'none', backgroundColor: c.delivered ? '#10b981' : theme.primary, color: 'white', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', flex: 1 }}>
                            {c.delivered ? '✓ Entregado' : 'Entregar'}
                          </button>
                        </div>

                        {/* Paso 2: Cobrar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                          <div style={{ 
                            width: '16px', 
                            height: '16px', 
                            borderRadius: '50%', 
                            backgroundColor: c.paid ? '#10b981' : '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            color: c.paid ? 'white' : '#64748b'
                          }}>
                            {c.paid ? '✓' : '2'}
                          </div>
                          {c.paid ? (
                            <div style={{ 
                              padding: '6px 8px', 
                              borderRadius: '4px', 
                              backgroundColor: '#10b981', 
                              color: 'white',
                              fontSize: '11px',
                              fontWeight: 'bold',
                              flex: 1,
                              textAlign: 'center'
                            }}>
                              ✓ {c.paymentMethod}
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flex: 1 }}>
                              <select 
                                value={c.selectedPaymentMethod || ''} 
                                onChange={(e) => setClients(prev => prev.map(client => client.id === c.id ? { ...client, selectedPaymentMethod: e.target.value } : client))}
                                style={{ 
                                  flex: 1,
                                  padding: '4px', 
                                  borderRadius: '3px', 
                                  border: '1px solid #cbd5e1', 
                                  outline: 'none',
                                  fontSize: '10px',
                                  backgroundColor: 'white'
                                }}
                              >
                                <option value="">Método...</option>
                                <option value="Efectivo">💵 Efectivo</option>
                                <option value="QR">📱 QR</option>
                              </select>
                              <button 
                                onClick={() => c.selectedPaymentMethod && registerPayment(c.id, c.selectedPaymentMethod)} 
                                disabled={!c.selectedPaymentMethod}
                                style={{ 
                                  padding: '4px 6px', 
                                  borderRadius: '3px', 
                                  border: 'none', 
                                  backgroundColor: c.selectedPaymentMethod ? '#10b981' : '#cbd5e1', 
                                  color: 'white', 
                                  cursor: c.selectedPaymentMethod ? 'pointer' : 'not-allowed', 
                                  fontSize: '10px',
                                  fontWeight: 'bold'
                                }}
                              >
                                ✓
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Paso 3: Canastos */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <div style={{ 
                            width: '16px', 
                            height: '16px', 
                            borderRadius: '50%', 
                            backgroundColor: c.basketsRegistered ? '#10b981' : '#e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            color: c.basketsRegistered ? 'white' : '#64748b'
                          }}>
                            {c.basketsRegistered ? '✓' : '3'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }}>
                            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>Canastos:</span>
                            <input 
                              type="number" 
                              value={c.returnedBaskets || ''} 
                              onChange={(e) => setClients(prev => prev.map(client => client.id === c.id ? { ...client, returnedBaskets: e.target.value } : client))}
                              style={{ 
                                width: '35px', 
                                padding: '4px', 
                                borderRadius: '3px', 
                                border: '1px solid #cbd5e1', 
                                outline: 'none',
                                fontSize: '10px',
                                textAlign: 'center'
                              }}
                              placeholder="0"
                            />
                            <button 
                              onClick={() => updateReturnedBaskets(c.id, c.returnedBaskets || '0')} 
                              disabled={c.basketsRegistered || (!c.returnedBaskets && c.returnedBaskets !== '0')}
                              style={{ 
                                padding: '4px 6px', 
                                borderRadius: '3px', 
                                border: 'none', 
                                backgroundColor: c.basketsRegistered ? '#10b981' : (c.returnedBaskets || c.returnedBaskets === '0') ? '#10b981' : '#cbd5e1', 
                                color: 'white', 
                                cursor: c.basketsRegistered ? 'default' : (c.returnedBaskets || c.returnedBaskets === '0') ? 'pointer' : 'not-allowed', 
                                fontSize: '10px',
                                fontWeight: 'bold'
                              }}
                            >
                              {c.basketsRegistered ? '✓' : 'OK'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          {gastos.length > 0 && (
            <div style={{ marginTop:12 }}>
              <h4>Gastos registrados</h4>
              <ul style={{ listStyle:'none', padding:0 }}>
                {gastos.map(g => (
                  <li key={g.id} style={{ padding:8, border:'1px solid #e2e8f0', borderRadius:6, marginBottom:8 }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <div>
                        <div style={{ fontWeight:700 }}>{g.detalle}</div>
                        <div style={{ fontSize:12, color: theme.textMuted }}>{g.fecha}</div>
                      </div>
                      <div style={{ fontWeight:800 }}>Bs {g.monto}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          </div>
        </Card>

        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {clients.map(c => (
            <Card key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: 'bold', color: theme.primary, fontSize: '16px' }}>{c.name}</div>
                  <div style={{ fontSize: '12px', color: theme.textMuted }}>Total a Cobrar: Bs {c.total.toFixed(2)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: theme.textMuted }}>
                    {(() => {
                      const steps = [];
                      if (c.delivered) steps.push('✓Entregado');
                      if (c.paid) steps.push(`✓${c.paymentMethod}`);
                      if (c.basketsRegistered) steps.push('✓Canastos');
                      
                      if (steps.length === 0) return 'Pendiente';
                      if (steps.length === 3) return 'Completado';
                      return steps.join(' • ');
                    })()}
                  </div>
                  {c.paid && <div style={{ fontSize: '14px', fontWeight: '800', color: '#10b981' }}>Recibido: Bs {c.paidAmount.toFixed(2)}</div>}
                </div>
              </div>

              <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', overflowX: 'auto' }}>
                {[104,105,106,107,108,109,110].map(code => {
                  const item = c.codes.find(x => x.code === code) || { boxes: 0, units: 0, grossWeight: 0, netWeight: 0 };
                  return (
                    <div key={code} style={{ minWidth: '140px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '8px' }}>
                      <div style={{ fontSize: '11px', fontWeight: '800', color: theme.primary, textAlign: 'center' }}>Código {code}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#0ea5e9' }}>
                          <Package size={12} />
                          <span>{item.boxes || 0} Cajas</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#f97316' }}>
                          <Box size={12} />
                          <span>{item.units || 0} Unidades</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#059669' }}>
                          <Truck size={12} />
                          <span>{(item.grossWeight || 0).toFixed(2)} kg Bruto</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981' }}>
                          <Truck size={12} />
                          <span>{(item.netWeight || 0).toFixed(2)} kg Neto</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Paso 1: Entregar Solicitud */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: c.delivered ? '#10b981' : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: c.delivered ? 'white' : '#64748b'
                  }}>
                    {c.delivered ? '✓' : '1'}
                  </div>
                  <button 
                    onClick={() => toggleDelivered(c.id)} 
                    style={{ 
                      padding: '8px 16px', 
                      borderRadius: '6px', 
                      border: 'none', 
                      backgroundColor: c.delivered ? '#10b981' : theme.primary, 
                      color: 'white', 
                      cursor: 'pointer', 
                      fontWeight: 'bold',
                      flex: 1
                    }}
                  >
                    {c.delivered ? '✓ Entregado' : 'Entregar Solicitud'}
                  </button>
                </div>

                {/* Paso 2: Cobrar Monto */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: c.paid ? '#10b981' : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: c.paid ? 'white' : '#64748b'
                  }}>
                    {c.paid ? '✓' : '2'}
                  </div>
                  {c.paid ? (
                    <div style={{ 
                      padding: '8px 16px', 
                      borderRadius: '6px', 
                      backgroundColor: '#10b981', 
                      color: 'white',
                      fontWeight: 'bold',
                      flex: 1,
                      textAlign: 'center'
                    }}>
                      ✓ Pagado ({c.paymentMethod})
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', minWidth: '80px' }}>Cobranza:</span>
                      <select 
                        value={c.selectedPaymentMethod || ''} 
                        onChange={(e) => setClients(prev => prev.map(client => client.id === c.id ? { ...client, selectedPaymentMethod: e.target.value } : client))}
                        style={{ 
                          padding: '6px 8px', 
                          borderRadius: '4px', 
                          border: '1px solid #cbd5e1', 
                          outline: 'none',
                          fontSize: '12px',
                          backgroundColor: 'white',
                          flex: 1
                        }}
                      >
                        <option value="">Seleccionar método...</option>
                        <option value="Efectivo">💵 Efectivo</option>
                        <option value="QR">📱 QR</option>
                      </select>
                      <button 
                        onClick={() => c.selectedPaymentMethod && registerPayment(c.id, c.selectedPaymentMethod)} 
                        disabled={!c.selectedPaymentMethod}
                        style={{ 
                          padding: '6px 12px', 
                          borderRadius: '4px', 
                          border: 'none', 
                          backgroundColor: c.selectedPaymentMethod ? '#10b981' : '#cbd5e1', 
                          color: 'white', 
                          cursor: c.selectedPaymentMethod ? 'pointer' : 'not-allowed', 
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        ✓
                      </button>
                    </div>
                  )}
                </div>

                {/* Paso 3: Recibir Canastos */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    borderRadius: '50%', 
                    backgroundColor: c.basketsRegistered ? '#10b981' : '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: c.basketsRegistered ? 'white' : '#64748b'
                  }}>
                    {c.basketsRegistered ? '✓' : '3'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', minWidth: '120px' }}>Canastos devueltos:</span>
                    <input 
                      type="number" 
                      value={c.returnedBaskets || ''} 
                      onChange={(e) => setClients(prev => prev.map(client => client.id === c.id ? { ...client, returnedBaskets: e.target.value } : client))}
                      style={{ 
                        width: '60px', 
                        padding: '6px', 
                        borderRadius: '4px', 
                        border: '1px solid #cbd5e1', 
                        outline: 'none',
                        fontSize: '12px',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}
                      placeholder="0"
                    />
                    <button 
                      onClick={() => updateReturnedBaskets(c.id, c.returnedBaskets || '0')} 
                      disabled={c.basketsRegistered || (!c.returnedBaskets && c.returnedBaskets !== '0')}
                      style={{ 
                        padding: '6px 10px', 
                        borderRadius: '4px', 
                        border: 'none', 
                        backgroundColor: c.basketsRegistered ? '#10b981' : (c.returnedBaskets || c.returnedBaskets === '0') ? '#10b981' : '#cbd5e1', 
                        color: 'white', 
                        cursor: c.basketsRegistered ? 'default' : (c.returnedBaskets || c.returnedBaskets === '0') ? 'pointer' : 'not-allowed', 
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {c.basketsRegistered ? '✓' : 'OK'}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Card>
          <h3 style={{ margin: 0, marginBottom: '12px' }}>Resumen de Ruta</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Clientes</span><strong>{clients.length}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Entregados</span><strong>{clients.filter(c=>c.delivered).length}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pagados</span><strong>{clients.filter(c=>c.paid).length}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total a Cobrar</span><strong>Bs {totalToCharge.toFixed(2)}</strong></div>
            
            {/* Resumen por tipo de pago */}
            <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '8px', paddingTop: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px' }}>Resumen de Cobranza</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Total QR</span>
                <strong style={{ color: '#059669' }}>
                  Bs {clients.filter(c => c.paid && c.paymentMethod === 'QR').reduce((sum, c) => sum + c.paidAmount, 0).toFixed(2)}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Total Efectivo</span>
                <strong style={{ color: '#059669' }}>
                  Bs {clients.filter(c => c.paid && c.paymentMethod === 'Efectivo').reduce((sum, c) => sum + c.paidAmount, 0).toFixed(2)}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px solid #e2e8f0', marginTop: '6px', paddingTop: '6px', fontWeight: 'bold', color: theme.primary }}>
                <span>Total Cobrado</span>
                <strong>
                  Bs {clients.filter(c => c.paid).reduce((sum, c) => sum + c.paidAmount, 0).toFixed(2)}
                </strong>
              </div>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '8px', paddingTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span>Total Gastos</span>
                <strong style={{ color: '#059669' }}>
                  Bs 150
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderTop: '1px solid #e2e8f0', marginTop: '6px', paddingTop: '6px', fontWeight: 'bold', color: theme.primary }}>
                <span>Total rendir</span>
                <strong>
                  Bs -150
                </strong>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => alert('Ruta marcada como completada (simulado)')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', backgroundColor: theme.primary, color: 'white', fontWeight: 'bold' }}>Marcar Ruta Completada</button>
              <button onClick={() => alert('Enviando resumen por WhatsApp (simulado)')} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: 'white', color: theme.textMain, fontWeight: 'bold' }}>Enviar Resumen</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ClientAppView = ({ theme }) => {
  const [selectedClient, setSelectedClient] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [orderItems, setOrderItems] = useState({});
  const [basketHistory, setBasketHistory] = useState([
    { date: '2025-12-20', type: 'Entregados', quantity: 5, balance: 12 },
    { date: '2025-12-18', type: 'Devueltos', quantity: -2, balance: 14 },
    { date: '2025-12-15', type: 'Entregados', quantity: 8, balance: 6 },
    { date: '2025-12-10', type: 'Devueltos', quantity: -1, balance: 7 },
  ]);

  const clients = [
    { id: 'sofia', name: 'Sofia' },
    { id: 'pio', name: 'PIO' },
  ];

  const productCodes = [104, 105, 106, 107, 108, 109, 110];

  const updateOrderItem = (code, field, value) => {
    setOrderItems(prev => ({
      ...prev,
      [code]: {
        ...prev[code],
        [field]: parseInt(value) || 0
      }
    }));
  };

  const submitOrder = () => {
    if (!selectedClient) {
      alert('Por favor seleccione un proveedor');
      return;
    }
    
    if (!deliveryDate) {
      alert('Por favor seleccione una fecha de entrega');
      return;
    }
    
    const hasItems = Object.values(orderItems).some(item => item.boxes > 0 || item.units > 0);
    if (!hasItems) {
      alert('Por favor agregue al menos un producto a la solicitud');
      return;
    }

    alert('Solicitud enviada exitosamente');
    setOrderItems({});
    setDeliveryDate('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: theme.primary, fontSize: '28px', fontWeight: '800' }}>App Cliente</h1>
        <p style={{ margin: '8px 0 0 0', color: theme.textMuted }}>Realice sus solicitudes y consulte su extracto de canastos</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
        {/* Nueva Solicitud */}
        <div>
          <Card>
            <h3 style={{ margin: 0, marginBottom: '16px', color: theme.primary }}>Nueva Solicitud</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: theme.textMain, marginBottom: '8px' }}>
                Proveedor
              </label>
              <select 
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="">Seleccione un proveedor...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: theme.textMain, marginBottom: '8px' }}>
                Fecha de Entrega
              </label>
              <input 
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: theme.textMain, marginBottom: '12px' }}>
                Productos Solicitados
              </label>
              <div style={{ display: 'grid', gap: '12px' }}>
                {productCodes.map(code => {
                  const item = orderItems[code] || { boxes: 0, units: 0 };
                  return (
                    <div key={code} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px',
                      padding: '12px',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      backgroundColor: 'white'
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: theme.primary, minWidth: '80px' }}>
                        Código {code}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Package size={16} color="#0ea5e9" />
                        <input
                          type="number"
                          placeholder="Cajas"
                          value={item.boxes || ''}
                          onChange={(e) => updateOrderItem(code, 'boxes', e.target.value)}
                          style={{
                            width: '80px',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            textAlign: 'center'
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Box size={16} color="#f97316" />
                        <input
                          type="number"
                          placeholder="Unidades"
                          value={item.units || ''}
                          onChange={(e) => updateOrderItem(code, 'units', e.target.value)}
                          style={{
                            width: '80px',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #cbd5e1',
                            textAlign: 'center'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              onClick={submitOrder}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: theme.primary,
                color: 'white',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Enviar Solicitud
            </button>
          </Card>
        </div>

        {/* Extracto de Canastos */}
        <div>
          <Card>
            <h3 style={{ margin: 0, marginBottom: '16px', color: theme.primary }}>Extracto de Canastos</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold', color: theme.textMain }}>
                <span>Fecha</span>
                <span>Movimiento</span>
                <span>Cantidad</span>
                <span>Saldo</span>
              </div>
              
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {basketHistory.map((movement, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '12px 0', 
                    borderBottom: '1px solid #f1f5f9',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: theme.textMuted }}>{movement.date}</span>
                    <span style={{ 
                      color: movement.type === 'Entregados' ? '#10b981' : '#ef4444',
                      fontWeight: '500'
                    }}>
                      {movement.type}
                    </span>
                    <span style={{ 
                      color: movement.quantity > 0 ? '#10b981' : '#ef4444',
                      fontWeight: 'bold'
                    }}>
                      {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                    </span>
                    <span style={{ fontWeight: 'bold', color: theme.textMain }}>{movement.balance}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f8fafc', 
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: theme.primary }}>
                Saldo Actual: {basketHistory[0]?.balance || 0} canastos
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};


// ----------------------
// MOCKUPS: Contabilidad
// ----------------------

const ContabilidadDashboard = ({ theme, handleTabChange }) => {
  // Simulated data for charts
  const ingresos = 1250000;
  const gastos = 820000;
  const maxValue = Math.max(ingresos, gastos);

  const monthlyData = [
    { month: 'Ene', ingresos: 1100000, gastos: 750000 },
    { month: 'Feb', ingresos: 1200000, gastos: 800000 },
    { month: 'Mar', ingresos: 1300000, gastos: 850000 },
    { month: 'Abr', ingresos: 1250000, gastos: 820000 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: theme.primary }}>Dashboard Contable</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginTop: '16px' }}>
        <Card><h4>Ingresos del mes</h4><div style={{fontSize:22,fontWeight:800}}>Bs 1,250,000</div></Card>
        <Card><h4>Gastos del mes</h4><div style={{fontSize:22,fontWeight:800}}>Bs 820,000</div></Card>
        <Card><h4>Resultado</h4><div style={{fontSize:22,fontWeight:800}}>Bs 430,000</div></Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
        <Card>
          <h3>Ingresos vs Gastos</h3>
          <div style={{ height: 220, display: 'flex', alignItems: 'end', gap: 20, padding: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ height: (ingresos / maxValue) * 150, width: 40, background: '#10b981', borderRadius: 4 }}></div>
              <span style={{ marginTop: 8 }}>Ingresos</span>
              <span>Bs {ingresos.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ height: (gastos / maxValue) * 150, width: 40, background: '#ef4444', borderRadius: 4 }}></div>
              <span style={{ marginTop: 8 }}>Gastos</span>
              <span>Bs {gastos.toLocaleString()}</span>
            </div>
          </div>
        </Card>
        <Card>
          <h3>Evolución Mensual</h3>
          <div style={{ height: 220, display: 'flex', alignItems: 'end', gap: 10, padding: 20 }}>
            {monthlyData.map((d, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <div style={{ position: 'relative', height: 150, width: '100%', display: 'flex', alignItems: 'end' }}>
                  <div style={{ height: (d.ingresos / 1500000) * 150, width: '45%', background: '#10b981', borderRadius: 2, marginRight: 2 }}></div>
                  <div style={{ height: (d.gastos / 1500000) * 150, width: '45%', background: '#ef4444', borderRadius: 2 }}></div>
                </div>
                <span style={{ marginTop: 8, fontSize: 12 }}>{d.month}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, background: '#10b981' }}></div>
              <span style={{ fontSize: 12 }}>Ingresos</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, background: '#ef4444' }}></div>
              <span style={{ fontSize: 12 }}>Gastos</span>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: '20px' }}>
        <Card>
          <h3>Accesos rápidos</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button onClick={() => handleTabChange('planCuentas')} style={{ padding:10, background:'#8b5cf6', color:'white', border:'none', borderRadius:6 }}>Plan de Cuentas</button>
            <button onClick={() => handleTabChange('registroAsientos')} style={{ padding:10, background:theme.primary, color:'white', border:'none', borderRadius:6 }}>Nuevo asiento</button>
            <button onClick={() => handleTabChange('cierre')} style={{ padding:10, background:'#f97316', color:'white', border:'none', borderRadius:6 }}>Cierre de período</button>
            <button onClick={() => handleTabChange('reportesFinancieros')} style={{ padding:10, background:'#10b981', color:'white', border:'none', borderRadius:6 }}>Reportes financieros</button>
            {/* <button onClick={() => handleTabChange('libro')} style={{ padding:10, background:'#06b6d4', color:'white', border:'none', borderRadius:6 }}>Libro Diario / Mayor</button> */}
          </div>
        </Card>
      </div>
    </div>
  );
};

const PlanDeCuentas = ({ theme }) => {
  const [accounts, setAccounts] = useState([...ERPStore.accounts]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Activo');
  const [center, setCenter] = useState('General');
  const [currency, setCurrency] = useState('BOB');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCenter, setFilterCenter] = useState('');

  const refresh = () => setAccounts([...ERPStore.accounts]);

  const filteredAccounts = accounts.filter(a => {
    const matchesSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.code.includes(search);
    const matchesType = !filterType || a.type === filterType;
    const matchesCenter = !filterCenter || a.center === filterCenter;
    return matchesSearch && matchesType && matchesCenter && a.active;
  });

  const groupedAccounts = filteredAccounts.reduce((acc, a) => {
    if (!acc[a.type]) acc[a.type] = [];
    acc[a.type].push(a);
    return acc;
  }, {});

  const handleCreate = () => {
    if (!code || !name) return alert('Código y nombre requeridos');
    ERP.addAccount({ code, name, type, center, currency, active: true });
    setCode(''); setName(''); setType('Activo'); setCenter('General'); setCurrency('BOB');
    refresh();
  };

  const handleToggle = (id) => {
    ERP.toggleAccount(id);
    refresh();
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: theme.primary }}>Plan de Cuentas</h1>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
        <input placeholder="Buscar por nombre o código" value={search} onChange={e=>setSearch(e.target.value)} style={{ padding:8, borderRadius:6, border:'1px solid #e2e8f0', flex:1 }} />
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ padding:8, borderRadius:6, border:'1px solid #e2e8f0' }}>
          <option value="">Todos los tipos</option>
          <option>Activo</option><option>Pasivo</option><option>Patrimonio</option><option>Ingreso</option><option>Gasto</option>
        </select>
        <select value={filterCenter} onChange={e=>setFilterCenter(e.target.value)} style={{ padding:8, borderRadius:6, border:'1px solid #e2e8f0' }}>
          <option value="">Todos los centros</option>
          <option>General</option><option>Ventas</option><option>Producción</option>
        </select>
      </div>
      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
        <Card style={{ flex: 1 }}>
          <h4>Árbol jerárquico de cuentas</h4>
          <div style={{ height: 420, overflow: 'auto', background: '#fff' }}>
            {Object.keys(groupedAccounts).map(type => (
              <div key={type}>
                <h5 style={{ margin: '12px 0 8px 0', color: theme.primary }}>{type}</h5>
                <ul style={{ paddingLeft: 12, listStyle: 'none' }}>
                  {groupedAccounts[type].sort((a,b)=>a.code.localeCompare(b.code)).map(a => {
                    const level = a.code.split('.').length - 1;
                    return (
                      <li key={a.id} style={{ marginBottom:6, marginLeft: level * 20 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <div>
                            <strong>{a.code}</strong> - {a.name}
                            <div style={{ fontSize:12, color: '#64748b' }}>{a.currency} · {a.center || '-'}</div>
                          </div>
                          <div style={{ display:'flex', gap:8 }}>
                            <button onClick={() => { const newName = prompt('Editar nombre', a.name); if (newName) { ERP.updateAccount(a.id,{name:newName}); refresh(); } }} style={{ padding:4, fontSize:12 }}>Editar</button>
                            <button onClick={() => handleToggle(a.id)} style={{ padding:4, fontSize:12, background:'#ef4444', color:'white', border:'none', borderRadius:4 }}>Desactivar</button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </Card>
        <Card style={{ width: 420 }}>
          <h4>Crear / Editar Cuenta</h4>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <input placeholder="Código (ej. 1.1.01)" value={code} onChange={e=>setCode(e.target.value)} />
            <input placeholder="Nombre de cuenta" value={name} onChange={e=>setName(e.target.value)} />
            <select value={type} onChange={e=>setType(e.target.value)}>
              <option>Activo</option><option>Pasivo</option><option>Patrimonio</option><option>Ingreso</option><option>Gasto</option>
            </select>
            <input placeholder="Centro de costo" value={center} onChange={e=>setCenter(e.target.value)} />
            <select value={currency} onChange={e=>setCurrency(e.target.value)}>
              <option>BOB</option><option>USD</option><option>EUR</option>
            </select>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={handleCreate} style={{ padding:8, background:theme.primary, color:'white', border:'none' }}>Guardar</button>
              <button onClick={() => { setCode(''); setName(''); setType('Activo'); setCenter('General'); setCurrency('BOB'); }} style={{ padding:8, background:'#ef4444', color:'white', border:'none' }}>Limpiar</button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const RegistroAsientos = ({ theme }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [fecha, setFecha] = useState(new Date().toISOString().slice(0,10));
  const [tipo, setTipo] = useState('Factura');
  const [glosa, setGlosa] = useState('');
  const [lines, setLines] = useState([
    { fecha: new Date().toISOString().slice(0,10), cuenta: '1.1', centro: 'Ventas', glosa: '', debito: 1000, credito: 0, editing: false },
    { fecha: new Date().toISOString().slice(0,10), cuenta: '4.1', centro: '', glosa: '', debito: 0, credito: 1000, editing: false }
  ]);
  const [attachments, setAttachments] = useState([]);

  const totalDebito = lines.reduce((s,l)=>s+Number(l.debito||0),0);
  const totalCredito = lines.reduce((s,l)=>s+Number(l.credito||0),0);
  const isBalanced = totalDebito === totalCredito && totalDebito > 0;

  const addLine = () => setLines(prev=>[...prev,{ fecha: new Date().toISOString().slice(0,10), cuenta:'', centro:'', glosa: '', debito:0, credito:0, editing: true }]);
  const updateLine = (idx, patch) => setLines(prev=>prev.map((l,i)=>i===idx?{...l,...patch}:l));
  const removeLine = (idx) => setLines(prev=>prev.filter((_,i)=>i!==idx));

  const handleFiles = (e) => setAttachments(Array.from(e.target.files));

  const handleSave = () => {
    if (!isBalanced) return alert('Asiento no balancea o está vacío');
    const asiento = { fecha, tipo, glosa, lines, attachments: attachments.map(f=>f.name), estado: 'borrador' };
    const saved = ERP.addAsiento(asiento);
    alert('Asiento guardado id: ' + saved.id);
    // reset
    setGlosa(''); setLines([{ fecha: new Date().toISOString().slice(0,10), cuenta: '', centro: '', glosa: '', debito: 0, credito: 0, editing: false }]); setAttachments([]);
  };

  const handleApprove = () => {
    if (!isBalanced) return alert('Asiento no balancea o está vacío');
    const asiento = ERP.addAsiento({ fecha, tipo, glosa, lines, attachments: attachments.map(f=>f.name), estado: 'aprobado' });
    ERP.approveAsiento(asiento.id);
    alert('Asiento aprobado id: ' + asiento.id);
    setGlosa(''); setLines([{ fecha: new Date().toISOString().slice(0,10), cuenta: '', centro: '', glosa: '', debito: 0, credito: 0, editing: false }]); setAttachments([]);
  };

  const approveDraft = (id) => {
    ERP.approveAsiento(id);
    alert('Asiento aprobado');
  };

  const generateDailyReport = () => {
    const today = new Date().toISOString().slice(0,10);
    const todays = (ERPStore.asientos || []).filter(a => (a.fecha || '').slice(0,10) === today);
    if (!todays.length) return alert('No hay asientos registrados para hoy');
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Reporte Diario de Asientos - ${today}`, 14, 20);
    let y = 30;
    todays.forEach((a, idx) => {
      const totalDeb = (a.lines||[]).reduce((s,l)=>s + Number(l.debito||0), 0);
      const totalCred = (a.lines||[]).reduce((s,l)=>s + Number(l.credito||0), 0);
      doc.setFontSize(12);
      doc.text(`${idx+1}. ID: ${a.id}  Tipo: ${a.tipo}`, 14, y); y += 6;
      if (a.glosa) { doc.text(`Glosa: ${a.glosa}`, 14, y); y += 6; }
      doc.text(`Débito: Bs ${totalDeb}   Crédito: Bs ${totalCred}`, 14, y); y += 10;
      if (y > 270) { doc.addPage(); y = 20; }
    });
    doc.save(`Reporte_Diario_Asientos_${today}.pdf`);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <FileText size={32} style={{ color: theme.primary, marginRight: '12px' }} />
        <h1 style={{ color: theme.primary, margin: 0 }}>Registro de Asientos</h1>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button onClick={generateDailyReport} style={{ padding: '8px 12px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: 6 }}>Reporte Diario</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
        <button
          onClick={() => setActiveTab('create')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'create' ? theme.primary : 'transparent',
            color: activeTab === 'create' ? 'white' : theme.text,
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          <Plus size={16} style={{ marginRight: '8px' }} />
          Nuevo Asiento
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeTab === 'drafts' ? theme.primary : 'transparent',
            color: activeTab === 'drafts' ? 'white' : theme.text,
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          <Clock size={16} style={{ marginRight: '8px' }} />
          Asientos en Borrador ({ERPStore.asientos.filter(a => a.estado === 'borrador').length})
        </button>
      </div>

      {activeTab === 'create' && (
        <Card>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: theme.textMuted, marginBottom: '4px' }}>
                <Calendar size={14} style={{ marginRight: '4px' }} />
                Fecha
              </label>
              <input
                type="date"
                value={fecha}
                onChange={e=>setFecha(e.target.value)}
                style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
              />
            </div>
            
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ color: theme.primary, margin: 0 }}>Líneas del Asiento</h3>
              <button
                onClick={addLine}
                style={{
                  padding: '8px 16px',
                  background: theme.secondary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={14} />
                Añadir Línea
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <thead style={{ background: '#f8fafc' }}>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: theme.text }}>Fecha</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: theme.text }}>Cuenta</th>
                    <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: theme.text }}>Glosa</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: theme.text }}>Débito (BOB)</th>
                    <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: theme.text }}>Crédito (BOB)</th>
                    <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: theme.text }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.map((l, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '12px' }}>
                        {l.editing ? (
                          <input type="date" value={l.fecha} onChange={e=>updateLine(idx,{fecha:e.target.value})} style={{ padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                        ) : (
                          <div>{l.fecha}</div>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {l.editing ? (
                          <input
                            list="accounts"
                            value={l.cuenta}
                            onChange={e=>updateLine(idx,{cuenta:e.target.value})}
                            placeholder="Código cuenta"
                            style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                          />
                        ) : (
                          <div>{l.cuenta}</div>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {l.editing ? (
                          <input
                            value={l.glosa}
                            onChange={e=>updateLine(idx,{glosa:e.target.value})}
                            placeholder="Glosa"
                            style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                          />
                        ) : (
                          <div>{l.glosa}</div>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {l.editing ? (
                          <input
                            type="number"
                            value={l.debito}
                            onChange={e=>updateLine(idx,{debito: Number(e.target.value)})}
                            min="0"
                            step="0.01"
                            style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'right' }}
                          />
                        ) : (
                          <div style={{ textAlign: 'right' }}>{Number(l.debito || 0).toFixed(2)}</div>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}>
                        {l.editing ? (
                          <input
                            type="number"
                            value={l.credito}
                            onChange={e=>updateLine(idx,{credito: Number(e.target.value)})}
                            min="0"
                            step="0.01"
                            style={{ width: '100%', padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px', textAlign: 'right' }}
                          />
                        ) : (
                          <div style={{ textAlign: 'right' }}>{Number(l.credito || 0).toFixed(2)}</div>
                        )}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: 8, justifyContent: 'center' }}>
                        {l.editing ? (
                          <>
                            <button onClick={() => setLines(prev=>prev.map((it,i)=>i===idx?{...it, editing:false}:it))} style={{ padding: '6px 8px', background:'#10b981', color:'white', border:'none', borderRadius:4 }}>Guardar</button>
                            <button onClick={()=>removeLine(idx)} style={{ padding: '6px 8px', background: '#ef4444', color:'white', border:'none', borderRadius:4 }}>Eliminar</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => setLines(prev=>prev.map((it,i)=>i===idx?{...it, editing:true}:it))} style={{ padding: '6px 8px', background:'#8b5cf6', color:'white', border:'none', borderRadius:4 }}>Editar</button>
                            <button onClick={()=>removeLine(idx)} style={{ padding: '6px 8px', background: '#ef4444', color:'white', border:'none', borderRadius:4 }}>Eliminar</button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <datalist id="accounts">
            {ERPStore.accounts.filter(a => a.active).map(a => (
              <option key={a.id} value={a.code}>{a.name}</option>
            ))}
          </datalist>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>


            <div style={{
              padding: '16px',
              background: isBalanced ? '#dcfce7' : '#fef2f2',
              border: `1px solid ${isBalanced ? '#16a34a' : '#dc2626'}`,
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: isBalanced ? '#16a34a' : '#dc2626' }}>
                {isBalanced ? '✓ Asiento Balanceado' : '✗ Asiento Desbalanceado'}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: theme.primary }}>
                Débito: {totalDebito.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})} |
                Crédito: {totalCredito.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={handleSave}
              disabled={!isBalanced}
              style={{
                padding: '12px 24px',
                background: isBalanced ? '#64748b' : '#94a3b8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isBalanced ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '500'
              }}
            >
              <Save size={16} />
              Guardar como Borrador
            </button>
            <button
              onClick={handleApprove}
              disabled={!isBalanced}
              style={{
                padding: '12px 24px',
                background: isBalanced ? theme.primary : '#94a3b8',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isBalanced ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: '500'
              }}
            >
              <CheckCircle size={16} />
              Guardar y Aprobar
            </button>
          </div>
        </Card>
      )}

      {activeTab === 'drafts' && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <Clock size={20} style={{ color: theme.primary, marginRight: '8px' }} />
            <h3 style={{ color: theme.primary, margin: 0 }}>Asientos en Borrador</h3>
          </div>

          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {ERPStore.asientos.filter(a => a.estado === 'borrador').map(asiento => (
              <div key={asiento.id} style={{
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '16px',
                background: 'white',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{
                        background: '#fef3c7',
                        color: '#92400e',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {asiento.tipo}
                      </span>
                      <span style={{ fontSize: '14px', color: theme.textMuted }}>
                        ID: {asiento.id}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 8px 0', color: theme.primary }}>{asiento.glosa}</h4>
                    <div style={{ fontSize: '14px', color: theme.textMuted, marginBottom: '12px' }}>
                      <Calendar size={14} style={{ marginRight: '4px' }} />
                      {new Date(asiento.fecha).toLocaleDateString('es-BO')}
                    </div>

                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: theme.text, marginBottom: '8px' }}>
                        Líneas del asiento:
                      </div>
                      {asiento.lines.map((l, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '4px 0',
                          fontSize: '13px'
                        }}>
                          <span>{l.cuenta} {l.centro && `(${l.centro})`}</span>
                          <div>
                            {l.debito > 0 && <span style={{ color: '#dc2626' }}>Débito: {l.debito.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}</span>}
                            {l.credito > 0 && <span style={{ color: '#16a34a' }}>Crédito: {l.credito.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginLeft: '16px' }}>
                    <button
                      onClick={() => approveDraft(asiento.id)}
                      style={{
                        padding: '10px 16px',
                        background: theme.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontWeight: '500'
                      }}
                    >
                      <CheckCircle size={16} />
                      Aprobar
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {ERPStore.asientos.filter(a => a.estado === 'borrador').length === 0 && (
              <div style={{
                textAlign: 'center',
                color: theme.textMuted,
                padding: '40px',
                background: '#f8fafc',
                borderRadius: '12px'
              }}>
                <FileText size={48} style={{ color: '#cbd5e1', marginBottom: '16px' }} />
                <div style={{ fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                  No hay asientos en borrador
                </div>
                <div style={{ fontSize: '14px' }}>
                  Todos los asientos han sido procesados
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

const LibroDiarioMayor = ({ theme }) => {
  const [asientos, setAsientos] = useState([...ERPStore.asientos]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [filterCuenta, setFilterCuenta] = useState('');
  const [filterCentro, setFilterCentro] = useState('');
  const [currentPeriod, setCurrentPeriod] = useState(new Date().toISOString().slice(0,7)); // YYYY-MM

  const refresh = () => setAsientos([...ERPStore.asientos]);

  useEffect(()=>{ refresh(); }, []);

  const exportCSV = () => {
    const rows = [['Fecha','Cuenta','Centro','Débito','Crédito','Estado']];
    filtered.forEach(a => {
      a.lines.forEach(l => rows.push([a.fecha, l.cuenta, l.centro || '-', l.debito || 0, l.credito || 0, a.estado]));
    });
    const csv = rows.map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv],{type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'libro_diario.csv'; a.click(); URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    // Simular export PDF
    alert('Exportando Libro Diario como PDF');
  };

  const navigatePeriod = (direction) => {
    const [year, month] = currentPeriod.split('-').map(Number);
    let newMonth = month + direction;
    let newYear = year;
    if (newMonth > 12) { newMonth = 1; newYear++; }
    if (newMonth < 1) { newMonth = 12; newYear--; }
    const newPeriod = `${newYear}-${String(newMonth).padStart(2,'0')}`;
    setCurrentPeriod(newPeriod);
    setFrom(`${newPeriod}-01`);
    setTo(`${newPeriod}-${new Date(newYear, newMonth, 0).getDate()}`);
  };

  const filtered = asientos.filter(a => {
    if (from && a.fecha < from) return false;
    if (to && a.fecha > to) return false;
    if (filterCuenta && !a.lines.some(l => l.cuenta.includes(filterCuenta))) return false;
    if (filterCentro && !a.lines.some(l => l.centro && l.centro.includes(filterCentro))) return false;
    return true;
  });

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: theme.primary }}>Libro Diario / Mayor</h1>
      <Card>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, flexWrap:'wrap', gap:8 }}>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <button onClick={()=>navigatePeriod(-1)} style={{ padding:6, background:'#e2e8f0', border:'none', borderRadius:4 }}>◀</button>
            <span>{currentPeriod}</span>
            <button onClick={()=>navigatePeriod(1)} style={{ padding:6, background:'#e2e8f0', border:'none', borderRadius:4 }}>▶</button>
          </div>
          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <input type="date" value={from} onChange={e=>setFrom(e.target.value)} placeholder="Desde" />
            <input type="date" value={to} onChange={e=>setTo(e.target.value)} placeholder="Hasta" />
            <input placeholder="Cuenta" value={filterCuenta} onChange={e=>setFilterCuenta(e.target.value)} />
            <input placeholder="Centro" value={filterCentro} onChange={e=>setFilterCentro(e.target.value)} />
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={exportCSV} style={{ padding:8, background:theme.primary, color:'white', border:'none' }}>Exportar CSV</button>
            <button onClick={exportPDF} style={{ padding:8, background:'#10b981', color:'white', border:'none' }}>Exportar PDF</button>
          </div>
        </div>
        <div style={{ height:420, overflow:'auto', background:'#f8fafc' }}>
          <table style={{ width:'100%' }}>
            <thead><tr><th>Fecha</th><th>Asiento</th><th>Cuenta</th><th>Centro</th><th>Débito</th><th>Crédito</th><th>Estado</th></tr></thead>
            <tbody>
              {filtered.map(a=> (
                a.lines.map((l, idx) => (
                  <tr key={`${a.id}-${idx}`}>
                    {idx === 0 ? <td rowSpan={a.lines.length}>{a.fecha}</td> : null}
                    {idx === 0 ? <td rowSpan={a.lines.length}>{a.id} - {a.glosa}</td> : null}
                    <td>{l.cuenta}</td>
                    <td>{l.centro || '-'}</td>
                    <td>{l.debito || 0}</td>
                    <td>{l.credito || 0}</td>
                    {idx === 0 ? <td rowSpan={a.lines.length}>{a.estado}</td> : null}
                  </tr>
                ))
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const CierreContable = ({ theme }) => {
  const [period, setPeriod] = useState('2025-12');
  const [validations, setValidations] = useState(null);
  const [selectedCierre, setSelectedCierre] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const runValidations = () => {
    const asientos = ERPStore.asientos.filter(a => a.fecha && a.fecha.startsWith(period));
    const pending = asientos.filter(a => a.estado !== 'aprobado');
    const isClosed = ERP.isPeriodClosed(period);
    setValidations({
      pendingCount: pending.length,
      isClosed,
      msg: pending.length > 0 ? `Existen ${pending.length} asientos sin aprobar` : isClosed ? 'Período ya cerrado' : 'Listo para cerrar'
    });
  };

  const closePeriod = () => {
    const res = ERP.closePeriod(period, 'contador');
    if (res.ok) {
      alert('Período cerrado exitosamente');
      runValidations();
    } else {
      alert(res.msg);
    }
  };

  const viewCierreDetails = (cierre) => {
    setSelectedCierre(cierre);
    setShowDetailsModal(true);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ color: theme.primary }}>Cierre Contable</h1>
      <Card>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <select value={period} onChange={e=>setPeriod(e.target.value)}>
            <option>2025-12</option>
            <option>2026-01</option>
          </select>
          <button onClick={runValidations} style={{ padding:8, background:'#f97316', color:'white', border:'none' }}>Iniciar validaciones</button>
          {validations && !validations.isClosed && validations.pendingCount === 0 && (
            <button onClick={closePeriod} style={{ padding:8, background:'#10b981', color:'white', border:'none' }}>Cerrar período</button>
          )}
        </div>
        {validations && (
          <div style={{ marginTop:12 }}>
            <div style={{ color: validations.pendingCount > 0 ? '#f59e0b' : validations.isClosed ? '#10b981' : '#64748b' }}>
              {validations.msg}
            </div>
          </div>
        )}
      </Card>

      <Card style={{ marginTop: 20 }}>
        <h4>Historial de Cierres</h4>
        <div style={{ height: 300, overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: 8, textAlign: 'left' }}>Período</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Fecha de Cierre</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Cerrado por</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Asientos</th>
                <th style={{ padding: 8, textAlign: 'left' }}>Resultado</th>
                <th style={{ padding: 8, textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ERPStore.cierreHistory.map((h, idx) => (
                <tr key={idx} style={{ cursor: 'pointer', ':hover': { background: '#f8fafc' } }}>
                  <td style={{ padding: 8 }}>{h.period}</td>
                  <td style={{ padding: 8 }}>{new Date(h.when).toLocaleString()}</td>
                  <td style={{ padding: 8 }}>{h.by}</td>
                  <td style={{ padding: 8 }}>{h.totalAsientos || 'N/A'}</td>
                  <td style={{ padding: 8 }}>
                    {h.balance ? (
                      <span style={{ color: h.balance.resultado >= 0 ? '#10b981' : '#ef4444' }}>
                        {h.balance.resultado.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
                      </span>
                    ) : 'N/A'}
                  </td>
                  <td style={{ padding: 8, textAlign: 'center' }}>
                    <button 
                      onClick={() => viewCierreDetails(h)}
                      style={{ padding: '4px 8px', background: theme.primary, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal de Detalles del Cierre */}
      {showDetailsModal && selectedCierre && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflow: 'auto',
            width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: theme.primary, margin: 0 }}>Detalles del Cierre - {selectedCierre.period}</h3>
              <button 
                onClick={() => setShowDetailsModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: theme.primary }}>Información General</h4>
                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  <div><strong>Período:</strong> {selectedCierre.period}</div>
                  <div><strong>Fecha de Cierre:</strong> {new Date(selectedCierre.when).toLocaleString()}</div>
                  <div><strong>Cerrado por:</strong> {selectedCierre.by}</div>
                  <div><strong>Total de Asientos:</strong> {selectedCierre.totalAsientos}</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: theme.primary }}>Balance del Período</h4>
                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                  <div><strong>Total Ingresos:</strong> {selectedCierre.balance?.ingresos.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'}) || 'N/A'}</div>
                  <div><strong>Total Gastos:</strong> {selectedCierre.balance?.gastos.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'}) || 'N/A'}</div>
                  <div style={{ 
                    fontWeight: 'bold',
                    color: selectedCierre.balance?.resultado >= 0 ? '#10b981' : '#ef4444'
                  }}>
                    <strong>Resultado:</strong> {selectedCierre.balance?.resultado.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'}) || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ color: theme.primary, marginBottom: '12px' }}>Asientos Procesados</h4>
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc' }}>
                      <th style={{ padding: '8px', textAlign: 'left' }}>ID</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Fecha</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Tipo</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Glosa</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCierre.asientosProcesados?.map((asiento, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '8px' }}>{asiento.id}</td>
                        <td style={{ padding: '8px' }}>{asiento.fecha}</td>
                        <td style={{ padding: '8px' }}>{asiento.tipo}</td>
                        <td style={{ padding: '8px' }}>{asiento.glosa}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>
                          {asiento.total.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
                        </td>
                      </tr>
                    )) || (
                      <tr>
                        <td colSpan="5" style={{ padding: '16px', textAlign: 'center', color: '#64748b' }}>
                          No hay información detallada disponible para este cierre
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button 
                onClick={() => setShowDetailsModal(false)}
                style={{ padding: '8px 16px', background: '#64748b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReportesFinancieros = ({ theme }) => {
  const [period, setPeriod] = useState('2025-12');
  const [activeReport, setActiveReport] = useState('balance');
  const balance = ERP.calculateBalance(period);

  // Datos de prueba para reportes financieros
  const financialData = {
    balanceGeneral: {
      activos: {
        corriente: {
          caja: 25000,
          bancos: 150000,
          cuentasPorCobrar: 45000,
          inventario: 80000
        },
        noCorriente: {
          propiedades: 200000,
          equipos: 120000,
          depreciacionAcumulada: -30000
        }
      },
      pasivos: {
        corriente: {
          proveedores: 35000,
          prestamosBancarios: 50000,
          impuestosPorPagar: 12000
        },
        noCorriente: {
          prestamosLargoPlazo: 80000
        }
      },
      patrimonio: {
        capitalSocial: 150000,
        reservas: 25000,
        resultadoAcumulado: balance.resultado
      }
    },
    estadoResultados: {
      ingresos: {
        ventasProductos: 185000,
        servicios: 25000,
        otrosIngresos: 5000
      },
      gastos: {
        costoVentas: 95000,
        gastosAdministrativos: 35000,
        gastosVentas: 28000,
        gastosFinancieros: 8000,
        depreciacion: 5000
      }
    },
    flujoCaja: {
      operativo: {
        resultadoNeto: balance.resultado,
        depreciacion: 5000,
        cambiosCuentasPorCobrar: -5000,
        cambiosInventario: -10000,
        cambiosProveedores: 8000
      },
      inversion: {
        compraEquipos: -25000,
        ventaActivos: 5000
      },
      financiamiento: {
        prestamosObtenidos: 30000,
        dividendosPagados: -15000
      }
    },
    comparativos: [
      { mes: 'Oct-25', ingresos: 165000, gastos: 142000, resultado: 23000 },
      { mes: 'Nov-25', ingresos: 178000, gastos: 148000, resultado: 30000 },
      { mes: 'Dic-25', ingresos: 210000, gastos: 158000, resultado: 52000 },
      { mes: 'Ene-26', ingresos: 195000, gastos: 152000, resultado: 43000 }
    ]
  };

  const calculateTotal = (obj) => Object.values(obj).reduce((sum, val) => typeof val === 'object' ? sum + calculateTotal(val) : sum + val, 0);

  const exportPDF = (type) => {
    alert(`Exportando ${type} para ${period} como PDF`);
  };

  const renderBalanceGeneral = () => {
    const totalActivos = calculateTotal(financialData.balanceGeneral.activos);
    const totalPasivos = calculateTotal(financialData.balanceGeneral.pasivos);
    const totalPatrimonio = calculateTotal(financialData.balanceGeneral.patrimonio);

    return (
      <div style={{ padding: '20px' }}>
        <h3 style={{ color: theme.primary, marginBottom: '20px' }}>Balance General - {period}</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          {/* Activos */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
            <h4 style={{ color: '#16a34a', marginBottom: '12px' }}>ACTIVOS</h4>
            <div style={{ marginBottom: '16px' }}>
              <h5 style={{ marginBottom: '8px' }}>Corriente</h5>
              {Object.entries(financialData.balanceGeneral.activos.corriente).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                  <span>{value.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '8px', paddingTop: '8px', fontWeight: 'bold' }}>
                Subtotal Corriente: {calculateTotal(financialData.balanceGeneral.activos.corriente).toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
              </div>
            </div>

            <div>
              <h5 style={{ marginBottom: '8px' }}>No Corriente</h5>
              {Object.entries(financialData.balanceGeneral.activos.noCorriente).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                  <span style={{ color: value < 0 ? '#dc2626' : 'inherit' }}>
                    {value.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
                  </span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '8px', paddingTop: '8px', fontWeight: 'bold' }}>
                Subtotal No Corriente: {calculateTotal(financialData.balanceGeneral.activos.noCorriente).toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
              </div>
            </div>

            <div style={{ borderTop: '2px solid #16a34a', marginTop: '16px', paddingTop: '8px', fontWeight: 'bold', fontSize: '18px', color: '#16a34a' }}>
              TOTAL ACTIVOS: {totalActivos.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
            </div>
          </div>

          {/* Pasivos */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
            <h4 style={{ color: '#dc2626', marginBottom: '12px' }}>PASIVOS</h4>
            <div style={{ marginBottom: '16px' }}>
              <h5 style={{ marginBottom: '8px' }}>Corriente</h5>
              {Object.entries(financialData.balanceGeneral.pasivos.corriente).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                  <span>{value.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '8px', paddingTop: '8px', fontWeight: 'bold' }}>
                Subtotal Corriente: {calculateTotal(financialData.balanceGeneral.pasivos.corriente).toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
              </div>
            </div>

            <div>
              <h5 style={{ marginBottom: '8px' }}>No Corriente</h5>
              {Object.entries(financialData.balanceGeneral.pasivos.noCorriente).map(([key, value]) => (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                  <span>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                  <span>{value.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '8px', paddingTop: '8px', fontWeight: 'bold' }}>
                Subtotal No Corriente: {calculateTotal(financialData.balanceGeneral.pasivos.noCorriente).toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
              </div>
            </div>

            <div style={{ borderTop: '2px solid #dc2626', marginTop: '16px', paddingTop: '8px', fontWeight: 'bold', fontSize: '18px', color: '#dc2626' }}>
              TOTAL PASIVOS: {totalPasivos.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
            </div>
          </div>

          {/* Patrimonio */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
            <h4 style={{ color: '#7c3aed', marginBottom: '12px' }}>PATRIMONIO</h4>
            {Object.entries(financialData.balanceGeneral.patrimonio).map(([key, value]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}</span>
                <span>{value.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}</span>
              </div>
            ))}

            <div style={{ borderTop: '2px solid #7c3aed', marginTop: '16px', paddingTop: '8px', fontWeight: 'bold', fontSize: '18px', color: '#7c3aed' }}>
              TOTAL PATRIMONIO: {totalPatrimonio.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
            </div>

            <div style={{
              borderTop: '2px solid #374151',
              marginTop: '16px',
              paddingTop: '8px',
              fontWeight: 'bold',
              fontSize: '18px',
              color: totalActivos === (totalPasivos + totalPatrimonio) ? '#10b981' : '#dc2626'
            }}>
              VERIFICACIÓN: {(totalPasivos + totalPatrimonio).toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => exportPDF('Balance General')}
            style={{ padding: '12px 24px', background: theme.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Exportar Balance General PDF
          </button>
        </div>
      </div>
    );
  };


  const renderComparativos = () => {
    return (
      <div style={{ padding: '20px' }}>
        <h3 style={{ color: theme.primary, marginBottom: '20px' }}>Comparativos Mensuales</h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead style={{ background: '#f8fafc' }}>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: theme.primary }}>Mes</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: theme.primary }}>Ingresos</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: theme.primary }}>Gastos</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: theme.primary }}>Resultado</th>
                <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: theme.primary }}>Margen (%)</th>
              </tr>
            </thead>
            <tbody>
              {financialData.comparativos.map((item, idx) => {
                const margen = ((item.resultado / item.ingresos) * 100).toFixed(1);
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontWeight: '500' }}>{item.mes}</td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {item.ingresos.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right' }}>
                      {item.gastos.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500', color: item.resultado >= 0 ? '#16a34a' : '#dc2626' }}>
                      {item.resultado.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500', color: margen >= 0 ? '#16a34a' : '#dc2626' }}>
                      {margen}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Gráfico simple de tendencias */}
        <div style={{ marginTop: '30px', background: '#f8fafc', padding: '20px', borderRadius: '8px' }}>
          <h4 style={{ color: theme.primary, marginBottom: '16px' }}>Tendencia de Resultados</h4>
          <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '200px' }}>
            {financialData.comparativos.map((item, idx) => {
              const maxResultado = Math.max(...financialData.comparativos.map(d => d.resultado));
              const height = (item.resultado / maxResultado) * 150;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '40px',
                      height: `${height}px`,
                      background: item.resultado >= 0 ? '#16a34a' : '#dc2626',
                      borderRadius: '4px 4px 0 0',
                      marginBottom: '8px'
                    }}
                  ></div>
                  <div style={{ fontSize: '12px', fontWeight: '500' }}>{item.mes}</div>
                  <div style={{ fontSize: '11px', color: theme.textMuted }}>
                    {item.resultado.toLocaleString('es-BO', {style: 'currency', currency: 'BOB'})}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => exportPDF('Comparativos Mensuales')}
            style={{ padding: '12px 24px', background: theme.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Exportar Comparativos PDF
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
        <BarChart3 size={32} style={{ color: theme.primary, marginRight: '12px' }} />
        <h1 style={{ color: theme.primary, margin: 0 }}>Reportes Financieros</h1>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '14px', color: theme.textMuted, marginBottom: '8px' }}>
          Seleccionar Período:
        </label>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          style={{ padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
        >
          <option value="2025-10">Octubre 2025</option>
          <option value="2025-11">Noviembre 2025</option>
          <option value="2025-12">Diciembre 2025</option>
          <option value="2026-01">Enero 2026</option>
        </select>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
        <button
          onClick={() => setActiveReport('balance')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeReport === 'balance' ? theme.primary : 'transparent',
            color: activeReport === 'balance' ? 'white' : theme.text,
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Balance General
        </button>
        <button
          onClick={() => setActiveReport('comparativos')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: activeReport === 'comparativos' ? theme.primary : 'transparent',
            color: activeReport === 'comparativos' ? 'white' : theme.text,
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Comparativos
        </button>
      </div>

      {/* Content */}
      <Card>
        {activeReport === 'balance' && renderBalanceGeneral()}
        {activeReport === 'comparativos' && renderComparativos()}
      </Card>
    </div>
  );
};

// ----------------------
// MOCKUPS: RRHH / PLANILLAS
// ----------------------

const RRHHDashboard = ({ theme, handleTabChange }) => (
  <div style={{ padding:20 }}>
    <h1 style={{ color: theme.primary }}>Dashboard RRHH / Planillas</h1>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginTop:12 }}>
      <Card><h4>Total empleados</h4><div style={{fontSize:22,fontWeight:800}}>128</div></Card>
      <Card><h4>Costo mensual planilla</h4><div style={{fontSize:22,fontWeight:800}}>Bs 420,000</div></Card>
      <Card><h4>Costo por CC</h4><div style={{fontSize:22,fontWeight:800}}>Ver detalle</div></Card>
      <Card><h4>Alertas</h4><div>3 contratos vencidos</div></Card>
    </div>
    <div style={{ marginTop:16 }}>
      <button onClick={() => handleTabChange('gestionEmpleados')} style={{ padding:8, background:theme.primary, color:'white', border:'none', borderRadius:6 }}>Gestión de Empleados</button>
      <button onClick={() => handleTabChange('calculoPlanillas')} style={{ padding:8, marginLeft:8, background:'#10b981', color:'white', border:'none', borderRadius:6 }}>Cálculo de Planillas</button>
    </div>
  </div>
);

const GestionEmpleados = ({ theme }) => {
  const [employees, setEmployees] = useState([...ERPStore.employees]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', dni: '', cargo: '', estado: 'Activo', sueldo: 0 });
  const [showAjuste, setShowAjuste] = useState(false);
  const [ajusteType, setAjusteType] = useState(null);
  const [selectedEmpAjuste, setSelectedEmpAjuste] = useState(null);
  const [ajusteForm, setAjusteForm] = useState({ monto: 0, detalle: '' });

  const refresh = () => setEmployees([...ERPStore.employees]);

  const handleSave = () => {
    if (editing) {
      ERP.updateEmployee(editing.id, form);
    } else {
      ERP.addEmployee(form);
    }
    setForm({ name: '', dni: '', cargo: '', estado: 'Activo', sueldo: 0 });
    setEditing(null);
    setShowForm(false);
    refresh();
  };

  const handleEdit = (emp) => {
    setForm({ ...emp });
    setEditing(emp);
    setShowForm(true);
  };

  const handleAjuste = (emp, type) => {
    setSelectedEmpAjuste(emp);
    setAjusteType(type);
    setAjusteForm({ monto: 0, detalle: '' });
    setShowAjuste(true);
  };

  const handleSaveAjuste = () => {
    if (ajusteForm.monto <= 0) {
      alert('Ingrese un monto válido');
      return;
    }
    const signo = ajusteType === 'favor' ? '+' : '-';
    alert(`${ajusteType === 'favor' ? 'A favor' : 'En contra'} ${signo} Bs ${ajusteForm.monto}\nDetalle: ${ajusteForm.detalle}\nEmpleado: ${selectedEmpAjuste.name}`);
    setShowAjuste(false);
    setAjusteForm({ monto: 0, detalle: '' });
    setSelectedEmpAjuste(null);
    setAjusteType(null);
  };

  return (
    <div style={{ padding:20 }}>
      <h1 style={{ color: theme.primary }}>Gestión de Empleados</h1>
      <div style={{ marginBottom:12 }}>
        <button onClick={() => setShowForm(true)} style={{ padding:8, background:theme.primary, color:'white', border:'none', borderRadius:6 }}>Agregar Empleado</button>
      </div>
      {showForm && (
        <Card style={{ marginBottom:12 }}>
          <h4>{editing ? 'Editar' : 'Nuevo'} Empleado</h4>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <input placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} />
            <input placeholder="DNI" value={form.dni} onChange={e=>setForm({...form, dni:e.target.value})} />
            <input placeholder="Cargo" value={form.cargo} onChange={e=>setForm({...form, cargo:e.target.value})} />
            <select value={form.estado} onChange={e=>setForm({...form, estado:e.target.value})}>
              <option>Activo</option><option>Inactivo</option>
            </select>
            <input type="number" placeholder="Sueldo" value={form.sueldo} onChange={e=>setForm({...form, sueldo: Number(e.target.value)})} />
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={handleSave} style={{ padding:8, background:theme.primary, color:'white', border:'none' }}>Guardar</button>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ padding:8, background:'#ef4444', color:'white', border:'none' }}>Cancelar</button>
            </div>
          </div>
        </Card>
      )}
      {showAjuste && selectedEmpAjuste && (
        <Card style={{ marginBottom:12 }}>
          <h4>{ajusteType === 'favor' ? 'Ajuste a Favor' : 'Ajuste en Contra'} - {selectedEmpAjuste.name}</h4>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <input type="number" placeholder="Monto" value={ajusteForm.monto} onChange={e=>setAjusteForm({...ajusteForm, monto: Number(e.target.value)})} />
            <textarea placeholder="Detalle del ajuste" value={ajusteForm.detalle} onChange={e=>setAjusteForm({...ajusteForm, detalle: e.target.value})} style={{ padding:8, borderRadius:4, border:'1px solid #ccc', fontFamily:'Arial', minHeight:80 }} />
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={handleSaveAjuste} style={{ padding:8, background: ajusteType === 'favor' ? '#10b981' : '#ef4444', color:'white', border:'none', borderRadius:4 }}>Guardar Ajuste</button>
              <button onClick={() => { setShowAjuste(false); setAjusteForm({ monto: 0, detalle: '' }); setSelectedEmpAjuste(null); setAjusteType(null); }} style={{ padding:8, background:'#6b7280', color:'white', border:'none', borderRadius:4 }}>Cancelar</button>
            </div>
          </div>
        </Card>
      )}
      <Card>
        <table style={{ width:'100%' }}>
          <thead><tr><th>Nombre</th><th>DNI</th><th>Cargo</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {employees.map(e => (
              <tr key={e.id}>
                <td>{e.name}</td><td>{e.dni}</td><td>{e.cargo}</td><td>{e.estado}</td>
                <td style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <button onClick={() => handleEdit(e)} style={{ padding:4 }}>Editar</button>
                  <button onClick={() => handleAjuste(e, 'favor')} style={{ padding:4, background:'#10b981', color:'white', border:'none', borderRadius:4 }}>A favor</button>
                  <button onClick={() => handleAjuste(e, 'contra')} style={{ padding:4, background:'#ef4444', color:'white', border:'none', borderRadius:4 }}>Descuentos</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const ContratosSalarios = ({ theme }) => {
  const [selectedEmp, setSelectedEmp] = useState(null);
  const employees = ERPStore.employees;

  return (
    <div style={{ padding:20 }}>
      <h1 style={{ color: theme.primary }}>Contratos y Salarios</h1>
      <div style={{ display:'flex', gap:12 }}>
        <Card style={{ flex:1 }}>
          <h4>Empleados</h4>
          <ul style={{ listStyle:'none', padding:0 }}>
            {employees.map(e => (
              <li key={e.id} style={{ padding:8, cursor:'pointer', background: selectedEmp?.id === e.id ? '#f1f5f9' : 'transparent' }} onClick={() => setSelectedEmp(e)}>
                {e.name} - {e.cargo}
              </li>
            ))}
          </ul>
        </Card>
        {selectedEmp && (
          <Card style={{ flex:2 }}>
            <h4>Contrato de {selectedEmp.name}</h4>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <p><strong>Tipo:</strong> Indefinido</p>
                <p><strong>Fecha Inicio:</strong> 2025-01-01</p>
                <p><strong>Fecha Fin:</strong> -</p>
              </div>
              <div>
                <p><strong>Sueldo Base:</strong> Bs {selectedEmp.sueldo}</p>
                <p><strong>Bonos:</strong> Bs 200</p>
                <p><strong>Beneficios:</strong> Seguro médico</p>
              </div>
            </div>
            <h5>Historial de Cambios Salariales</h5>
            <ul>
              <li>2025-01-01: Contratación - Bs {selectedEmp.sueldo}</li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
};

const ControlAsistencia = ({ theme }) => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0,7));
  const [selectedEmp, setSelectedEmp] = useState(ERPStore.employees[0]);
  const employees = ERPStore.employees;

  // Simple calendar days
  const daysInMonth = new Date(month + '-01').getDate();
  const days = Array.from({length: daysInMonth}, (_, i) => i+1);

  return (
    <div style={{ padding:20 }}>
      <h1 style={{ color: theme.primary }}>Control de Asistencia</h1>
      <div style={{ marginBottom:12 }}>
        <select value={month} onChange={e=>setMonth(e.target.value)}>
          <option>2025-12</option>
          <option>2026-01</option>
        </select>
        <select value={selectedEmp?.id} onChange={e=>setSelectedEmp(employees.find(emp=>emp.id==e.target.value))}>
          {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </div>
      <Card>
        <h4>Asistencia de {selectedEmp?.name} - {month}</h4>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => <div key={d} style={{ fontWeight:'bold', textAlign:'center' }}>{d}</div>)}
          {days.map(d => (
            <div key={d} style={{ padding:8, border:'1px solid #e2e8f0', textAlign:'center', cursor:'pointer' }} onClick={() => alert(`Marcar día ${d}`)}>
              {d}
            </div>
          ))}
        </div>
        <div style={{ marginTop:12 }}>
          <p><strong>Faltas:</strong> 2</p>
          <p><strong>Atrasos:</strong> 1</p>
          <p><strong>Horas Extra:</strong> 5</p>
        </div>
      </Card>
    </div>
  );
};

const CalculoPlanillas = ({ theme }) => {
  const [period, setPeriod] = useState(new Date().toISOString().slice(0,7));
  const [type, setType] = useState('mensual');
  const [preview, setPreview] = useState([]);
  const [showExtracto, setShowExtracto] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);

  const handleCalc = () => {
    const res = ERP.calculatePayroll(period, type);
    setPreview(res);
  };

  const generateAsientos = () => {
    if (!preview.length) return alert('Calcule la planilla primero');
    // create a summarized asiento per planilla
    const lines = preview.map(p=>({ cuenta: '6.1', centro: '', debito: p.bruto, credito: 0 }));
    const total = preview.reduce((s,p)=>s+p.bruto,0);
    lines.push({ cuenta: '2.1', centro: '', debito: 0, credito: total });
    const a = ERP.addAsiento({ fecha: new Date().toISOString().slice(0,10), tipo: 'Planilla', glosa: `Planilla ${period}`, lines, attachments: [], estado: 'borrador' });
    alert('Asiento generado id: ' + a.id);
  };

  const handleExtracto = (payroll) => {
    // Asegurar que existan los arrays de detalle y un historial de movimientos
    setSelectedPayroll({
      ...payroll,
      detalleDescuentos: payroll.detalleDescuentos || [
        'Descuento por llegar tarde: Bs 50 (10/01/2026)'
      ],
      detalleAFavor: payroll.detalleAFavor || [
        'Bono de antigüedad: Bs 200 (05/01/2026)'
      ],
      movimientos: payroll.movimientos || [
        { tipo: 'descuento', descripcion: 'Descuento por llegar tarde', monto: 50, fecha: '2026-01-10' },
        { tipo: 'bono', descripcion: 'Bono de antigüedad', monto: 200, fecha: '2026-01-05' },
        { tipo: 'adelanto', descripcion: 'Adelanto', monto: 300, fecha: '2026-01-02' }
      ]
    });
    setShowExtracto(true);
  };

  const handleImprimir = (payroll) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Extracto de Planilla', 20, 20);
    doc.setFontSize(12);
    doc.text(`Empleado: ${payroll.name}`, 20, 35);
    doc.text(`Período: ${period}`, 20, 45);
    doc.text(`Sueldo Bruto: Bs ${payroll.bruto}`, 20, 60);
    doc.text(`Descuentos: Bs ${payroll.descuentos}`, 20, 70);
    doc.text(`A Favor: Bs ${payroll.aportes}`, 20, 80);
    doc.text(`Neto a Pagar: Bs ${payroll.neto}`, 20, 90);
    doc.save(`Extracto_${payroll.name}_${period}.pdf`);
    alert(`Imprimiendo extracto de ${payroll.name}`);
  };

  return (
    <div style={{ padding:20 }}>
      <h1 style={{ color: theme.primary }}>Cálculo de Planillas</h1>
      <Card>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div>
            <div style={{ fontSize:12, color: theme.textMuted }}>Período</div>
            <input type="month" value={period} onChange={e=>setPeriod(e.target.value)} />
          </div>
          <div>
            <button onClick={handleCalc} style={{ padding:8, background:theme.primary, color:'white', border:'none', borderRadius:6 }}>Calcular</button>
          </div>
        </div>

        {preview.length > 0 && (
          <div style={{ marginTop:12 }}>
            <h4>Vista previa</h4>
            <table style={{ width:'100%' }}>
              <thead><tr><th>Empleado</th><th>Bruto</th><th>Descuentos</th><th>A favor</th><th>Neto</th><th>Acciones</th></tr></thead>
              <tbody>
                {preview.map(p=> (
                  <tr key={p.employeeId}>
                    <td>{p.name}</td>
                    <td>{p.bruto}</td>
                    <td>{p.descuentos}</td>
                    <td>{p.aportes}</td>
                    <td>{p.neto}</td>
                    <td style={{ display:'flex', gap:6 }}>
                      <button onClick={() => handleExtracto(p)} style={{ padding:6, background:'#3b82f6', color:'white', border:'none', borderRadius:4, fontSize:12 }}>Extracto</button>
                      <button onClick={() => handleImprimir(p)} style={{ padding:6, background:'#8b5cf6', color:'white', border:'none', borderRadius:4, fontSize:12 }}>Imprimir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div style={{ marginTop:8, display:'flex', gap:8, justifyContent:'flex-end' }}>
              <button onClick={generateAsientos} style={{ padding:8, background:'#10b981', color:'white', border:'none', borderRadius:6 }}>Guardar</button>
            </div>
          </div>
        )}
      </Card>

      {showExtracto && selectedPayroll && (
        <Card style={{ marginTop:20 }}>
          <h4>Extracto de Planilla - {selectedPayroll.name}</h4>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <div>
              <h5 style={{ borderBottom:`2px solid ${theme.primary}`, paddingBottom:8 }}>Información del Empleado</h5>
              <p><strong>Nombre:</strong> {selectedPayroll.name}</p>
              <p><strong>Período:</strong> {period}</p>
              <p><strong>ID Empleado:</strong> {selectedPayroll.employeeId || '—'}</p>
            </div>
            <div>
              <h5 style={{ borderBottom:`2px solid ${theme.primary}`, paddingBottom:8 }}>Resumen de Planilla</h5>
              <p><strong>Sueldo Bruto:</strong> Bs {selectedPayroll.bruto}</p>
              <p style={{ color:'#ef4444' }}><strong>Descuentos Totales:</strong> -Bs {selectedPayroll.descuentos}</p>
              <ul style={{ color:'#ef4444', marginLeft:18 }}>
                {selectedPayroll.detalleDescuentos && selectedPayroll.detalleDescuentos.map((d,i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
              <p style={{ color:'#10b981' }}><strong>A Favor Totales:</strong> +Bs {selectedPayroll.aportes}</p>
              <ul style={{ color:'#10b981', marginLeft:18 }}>
                {selectedPayroll.detalleAFavor && selectedPayroll.detalleAFavor.map((a,i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ marginTop:20, padding:12, background:'#f3f4f6', borderRadius:6 }}>
            <h5 style={{ marginTop:0 }}>Historial de Movimientos</h5>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ textAlign:'left' }}>
                  <th style={{ padding:'6px 8px' }}>Fecha</th>
                  <th style={{ padding:'6px 8px' }}>Tipo</th>
                  <th style={{ padding:'6px 8px' }}>Descripción</th>
                  <th style={{ padding:'6px 8px' }}>Monto</th>
                </tr>
              </thead>
              <tbody>
                {selectedPayroll.movimientos && selectedPayroll.movimientos.map((m, idx) => (
                  <tr key={idx} style={{ borderTop:'1px solid #e5e7eb' }}>
                    <td style={{ padding:'6px 8px' }}>{m.fecha || '—'}</td>
                    <td style={{ padding:'6px 8px' }}>{m.tipo}</td>
                    <td style={{ padding:'6px 8px' }}>{m.descripcion}</td>
                    <td style={{ padding:'6px 8px' }}>{m.monto ? `Bs ${m.monto}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop:20, padding:12, background:'#f3f4f6', borderRadius:6 }}>
            <h5 style={{ marginTop:0 }}>Total Neto a Pagar: Bs {selectedPayroll.neto}</h5>
          </div>
          <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:12 }}>
            <button onClick={() => setShowExtracto(false)} style={{ padding:8, background:'#6b7280', color:'white', border:'none', borderRadius:4 }}>Cerrar</button>
            <button onClick={() => handleImprimir(selectedPayroll)} style={{ padding:8, background:'#8b5cf6', color:'white', border:'none', borderRadius:4 }}>Imprimir Extracto</button>
          </div>
        </Card>
      )}
    </div>
  );
};

const BoletasPago = ({ theme }) => {
  const [period, setPeriod] = useState('2025-12');
  const payroll = ERP.calculatePayroll(period);

  const downloadPDF = (emp) => {
    // Simular descarga PDF
    alert(`Descargando boleta de ${emp.name} para ${period}`);
  };

  return (
    <div style={{ padding:20 }}>
      <h1 style={{ color: theme.primary }}>Boletas de Pago</h1>
      <div style={{ marginBottom:12 }}>
        <select value={period} onChange={e=>setPeriod(e.target.value)}>
          <option>2025-12</option>
          <option>2026-01</option>
        </select>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12 }}>
        {payroll.map(p => (
          <Card key={p.employeeId}>
            <h4>{p.name}</h4>
            <p>Sueldo Bruto: Bs {p.bruto}</p>
            <p>Descuentos: Bs {p.descuentos}</p>
            <p>Aportes: Bs {p.aportes}</p>
            <p><strong>Neto: Bs {p.neto}</strong></p>
            <button onClick={() => downloadPDF(p)} style={{ padding:6, background:theme.primary, color:'white', border:'none' }}>Descargar PDF</button>
          </Card>
        ))}
      </div>
    </div>
  );
};

const AportesImpuestos = ({ theme }) => {
  const [period, setPeriod] = useState('2025-12');
  const payroll = ERP.calculatePayroll(period);

  const totalAFP = payroll.reduce((s,p)=>s + p.aportes * 0.1271, 0);
  const totalCajaSalud = payroll.reduce((s,p)=>s + p.aportes * 0.0171, 0);
  const totalRCIVA = payroll.reduce((s,p)=>s + p.bruto * 0.13, 0); // Simulado

  const exportReport = (type) => {
    alert(`Exportando reporte ${type} para ${period} como PDF`);
  };

  return (
    <div style={{ padding:20 }}>
      <h1 style={{ color: theme.primary }}>Aportes e Impuestos</h1>
      <div style={{ marginBottom:12 }}>
        <select value={period} onChange={e=>setPeriod(e.target.value)}>
          <option>2025-12</option>
          <option>2026-01</option>
        </select>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        <Card>
          <h4>AFP (12.71%)</h4>
          <p>Total: Bs {totalAFP.toFixed(2)}</p>
          <button onClick={()=>exportReport('AFP')} style={{ padding:6, background:theme.primary, color:'white', border:'none' }}>Exportar Reporte</button>
        </Card>
        <Card>
          <h4>Caja de Salud (1.71%)</h4>
          <p>Total: Bs {totalCajaSalud.toFixed(2)}</p>
          <button onClick={()=>exportReport('Caja Salud')} style={{ padding:6, background:theme.primary, color:'white', border:'none' }}>Exportar Reporte</button>
        </Card>
        <Card>
          <h4>RC-IVA (13%)</h4>
          <p>Total: Bs {totalRCIVA.toFixed(2)}</p>
          <button onClick={()=>exportReport('RC-IVA')} style={{ padding:6, background:theme.primary, color:'white', border:'none' }}>Exportar Reporte</button>
        </Card>
      </div>
      <Card style={{ marginTop:12 }}>
        <h4>Detalle por Empleado</h4>
        <table style={{ width:'100%' }}>
          <thead><tr><th>Empleado</th><th>AFP</th><th>Caja Salud</th><th>RC-IVA</th></tr></thead>
          <tbody>
            {payroll.map(p=> (
              <tr key={p.employeeId}>
                <td>{p.name}</td>
                <td>Bs {(p.aportes * 0.1271).toFixed(2)}</td>
                <td>Bs {(p.aportes * 0.0171).toFixed(2)}</td>
                <td>Bs {(p.bruto * 0.13).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

// ----------------------
// INTEGRACIÓN, TESORERÍA Y SEGURIDAD
// ----------------------

const AsientosAutomaticos = ({ theme }) => {
  const [period, setPeriod] = useState('2025-12');
  const payroll = ERP.calculatePayroll(period);
  const asientos = ERPStore.asientos.filter(a => a.tipo === 'Planilla' && a.fecha.startsWith(period));

  const totalDebito = payroll.reduce((s,p)=>s+p.bruto,0);
  const totalCredito = totalDebito;

  const confirmAsiento = (id) => {
    ERP.approveAsiento(id);
    alert('Asiento confirmado');
  };

  return (
    <div style={{ padding:20 }}>
      <h1 style={{ color: theme.primary }}>Asientos Automáticos de Planillas</h1>
      <div style={{ marginBottom:12 }}>
        <select value={period} onChange={e=>setPeriod(e.target.value)}>
          <option>2025-12</option>
          <option>2026-01</option>
        </select>
      </div>
      <Card>
        <h4>Asientos Generados</h4>
        {asientos.length === 0 ? (
          <p>No hay asientos generados para este período.</p>
        ) : (
          asientos.map(a => (
            <div key={a.id} style={{ border:'1px solid #e2e8f0', padding:12, marginBottom:8 }}>
              <p><strong>ID:</strong> {a.id} | <strong>Fecha:</strong> {a.fecha} | <strong>Estado:</strong> {a.estado}</p>
              <p><strong>Glosa:</strong> {a.glosa}</p>
              <table style={{ width:'100%', marginTop:8 }}>
                <thead><tr><th>Cuenta</th><th>Débito</th><th>Crédito</th></tr></thead>
                <tbody>
                  {a.lines.map((l,i)=> (
                    <tr key={i}><td>{l.cuenta}</td><td>{l.debito}</td><td>{l.credito}</td></tr>
                  ))}
                </tbody>
              </table>
              {a.estado === 'borrador' && (
                <button onClick={()=>confirmAsiento(a.id)} style={{ padding:6, background:'#10b981', color:'white', border:'none', marginTop:8 }}>Confirmar Asiento</button>
              )}
            </div>
          ))
        )}
        <div style={{ marginTop:12 }}>
          <p><strong>Total Débito:</strong> Bs {totalDebito.toFixed(2)}</p>
          <p><strong>Total Crédito:</strong> Bs {totalCredito.toFixed(2)}</p>
          <p style={{ color: totalDebito === totalCredito ? '#10b981' : '#ef4444' }}>
            {totalDebito === totalCredito ? 'Balanceado' : 'No balanceado'}
          </p>
        </div>
      </Card>
    </div>
  );
};

const PagosSueldos = ({ theme }) => {
  const [period, setPeriod] = useState(new Date().toISOString().slice(0,7));

  const handleGenerate = () => {
    const payroll = ERP.calculatePayroll(period,'mensual');
    const csv = ERP.generateBankFile(payroll);
    const blob = new Blob([csv],{type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `pago_sueldos_${period}.csv`; a.click(); URL.revokeObjectURL(url);
    alert('Archivo bancario generado');
  };

  return (
    <div style={{ padding:20 }}>
      <h1 style={{ color: theme.primary }}>Pagos de Sueldos</h1>
      <Card>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <div>
            <div style={{ fontSize:12, color: theme.textMuted }}>Período</div>
            <input type="month" value={period} onChange={e=>setPeriod(e.target.value)} />
          </div>
          <div>
            <button onClick={handleGenerate} style={{ padding:8, background:theme.primary, color:'white', border:'none', borderRadius:6 }}>Generar archivo bancario</button>
          </div>
        </div>
      </Card>
    </div>
  );
};

const RolesPermisos = ({ theme }) => {
  const roles = [
    { name: 'Admin', permissions: { rrhh: 'full', contabilidad: 'full', finanzas: 'full', auditoria: 'full' } },
    { name: 'Contador', permissions: { rrhh: 'read', contabilidad: 'full', finanzas: 'read', auditoria: 'none' } },
    { name: 'RRHH', permissions: { rrhh: 'full', contabilidad: 'none', finanzas: 'none', auditoria: 'none' } },
    { name: 'Auditor', permissions: { rrhh: 'read', contabilidad: 'read', finanzas: 'read', auditoria: 'full' } }
  ];

  const modules = ['rrhh', 'contabilidad', 'finanzas', 'auditoria'];

  return (
    <div style={{ padding:20 }}>
      <h1 style={{ color: theme.primary }}>Roles y Permisos</h1>
      <Card>
        <h4>Matriz de Permisos</h4>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f8fafc' }}>
              <th style={{ padding:8, border:'1px solid #e2e8f0' }}>Rol</th>
              {modules.map(m => <th key={m} style={{ padding:8, border:'1px solid #e2e8f0' }}>{m.charAt(0).toUpperCase() + m.slice(1)}</th>)}
            </tr>
          </thead>
          <tbody>
            {roles.map(r => (
              <tr key={r.name}>
                <td style={{ padding:8, border:'1px solid #e2e8f0', fontWeight:'bold' }}>{r.name}</td>
                {modules.map(m => (
                  <td key={m} style={{ padding:8, border:'1px solid #e2e8f0', textAlign:'center' }}>
                    {r.permissions[m] === 'full' ? '✓' : r.permissions[m] === 'read' ? 'R' : '✗'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop:12 }}>
          <p><strong>Leyenda:</strong> ✓ = Acceso completo, R = Solo lectura, ✗ = Sin acceso</p>
        </div>
      </Card>
    </div>
  );
};

const Bitacora = ({ theme }) => {
  const [logs, setLogs] = useState([...ERPStore.bitacora]);
  useEffect(()=>{ setLogs([...ERPStore.bitacora]); }, []);
  return (
    <div style={{ padding:20 }}>
      <h1 style={{ color: theme.primary }}>Bitácora de Cambios</h1>
      <Card>
        <div style={{ maxHeight:360, overflow:'auto' }}>
          {logs.length === 0 && <div style={{ color: '#64748b' }}>Sin registros</div>}
          {logs.map((l,i)=> (
            <div key={i} style={{ padding:'8px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ fontSize:12, color:'#64748b' }}>{l.when} · {l.who} · {l.action}</div>
              <div style={{ fontWeight:600 }}>{l.after?.name || l.after?.id || ''}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default App;