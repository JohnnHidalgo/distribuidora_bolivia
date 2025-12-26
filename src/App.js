import React, { useState, useEffect } from 'react';
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
  Menu
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const App = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [userType, setUserType] = useState('operador'); // 'cliente', 'chofer', 'operador'
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
      overflowY: 'auto'
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
      case 'orders': return <ConsolidationView theme={theme} />;
      case 'assignments': return <AssignmentView theme={theme} />;
      case 'tracking': return <TrackingView theme={theme} />;
      case 'driverApp': return <DriverAppView theme={theme} />;
      case 'clientApp': return <ClientAppView theme={theme} />;
      case 'baskets': return <BasketView theme={theme} />;
      case 'reports': return <ReportsView theme={theme} />;
      case 'settings': return <SettingsView theme={theme} />;
      default: return <DashboardView theme={theme} />;
    }
  };

  const currentStyles = styles(isMobile, sidebarVisible, sidebarCollapsed);

  return (
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
          </select>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {allowedMenus.includes('dashboard') && <SidebarBtn id="dashboard" icon= {LayoutDashboard} label="Dashboard" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('orders') && <SidebarBtn id="orders" icon={ShoppingCart} label="Consolidación" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('assignments') && <SidebarBtn id="assignments" icon={Truck} label="Asignaciones" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('tracking') && <SidebarBtn id="tracking" icon={MapPin} label="Seguimiento" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('baskets') && <SidebarBtn id="baskets" icon={Archive} label="Canastos" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('reports') && <SidebarBtn id="reports" icon={BarChart3} label="Reportes" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('driverApp') && <SidebarBtn id="driverApp" icon={Users} label="App Chofer" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          {allowedMenus.includes('clientApp') && <SidebarBtn id="clientApp" icon={UserCircle} label="App Cliente" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
        </nav>

        <div style={{ paddingTop: '20px', borderTop: `1px solid #1e293b`, marginTop: '20px' }}>
          {allowedMenus.includes('settings') && <SidebarBtn id="settings" icon={Settings} label="Configuración" activeTab={activeTab} setActiveTab={handleTabChange} theme={theme} collapsed={sidebarCollapsed && !isMobile} />}
          <button style={{ 
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
        <header style={currentStyles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              style={currentStyles.mobileMenuBtn}
              onClick={() => setSidebarVisible(!sidebarVisible)}
            >
              <Menu size={24} />
            </button>
            <h1 style={{ fontSize: isMobile ? '18px' : '20px', fontWeight: '600', color: theme.textMain, textTransform: 'capitalize', margin: 0 }}>
              {activeTab.replace(/([A-Z])/g, ' $1').trim()}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '24px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: theme.textMuted, fontWeight: 'bold' }}>HORA DE CORTE</div>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: theme.primary }}>10:00 AM</div>
            </div>
            <div style={{ width: '1px', height: '32px', backgroundColor: theme.border }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Admin_Bolivia</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCircle size={24} color={theme.textMuted} />
              </div>
            </div>
          </div>
        </header>

        <div style={currentStyles.contentArea}>
          {renderView()}
        </div>
      </div>
    </div>
  );
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

const Card = ({ children, style }) => (
  <div style={{ 
    backgroundColor: 'white', padding: '24px', borderRadius: '12px', 
    border: '1px solid #e2e8f0', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', ...style 
  }}>
    {children}
  </div>
);

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

        {/* Gasolina por Entrega */}
        <Card>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Fuel size={20} color={theme.primary} />
            Gasolina por Entrega
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '36px', fontWeight: '900', color: theme.primary, marginBottom: '8px' }}>8.5</div>
              <div style={{ fontSize: '14px', color: theme.textMuted, fontWeight: '600' }}>Litros por Entrega</div>
            </div>
            <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: theme.textMuted }}>
                <span>Total Entregas Hoy:</span>
                <span style={{ fontWeight: 'bold', color: theme.textMain }}>42</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: theme.textMuted }}>
                <span>Consumo Total:</span>
                <span style={{ fontWeight: 'bold', color: theme.textMain }}>357 L</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: theme.textMuted }}>
                <span>Costo Estimado:</span>
                <span style={{ fontWeight: 'bold', color: theme.primary }}>Bs 2,142</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Cuarta fila con gráficos adicionales */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
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
        <Card style={{ padding: 0, overflow: 'hidden', height: '400px' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Truck size={20} color={theme.primary} />
              Seguimiento de Vehículos en Tiempo Real
            </h3>
          </div>
          <div style={{ height: 'calc(100% - 60px)', width: '100%', position: 'relative' }}>
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

const ConsolidationView = ({ theme }) => {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        <button 
          style={{ 
            padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
            backgroundColor: 'white',
            color: theme.primary,
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <ClipboardList size={18} /> Registro de Pedidos
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '32px' }}>
          {/* Formulario */}
          <Card>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Plus size={20} color={theme.primary} /> Detalle de Solicitud
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid #e2e8f0', 
                    outline: 'none',
                    opacity: selectedGroup ? 1 : 0.5
                  }}
                />
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

              {/* Grid de Productos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PRODUCTOS REQUERIDOS</label>
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
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', alignItems: 'end' }}>
                <div>
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
                
                <div>
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
                
                <div>
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
                
                <div>
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
                
                <div>
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
                
                <div>
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
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', fontSize: '11px', color: '#94a3b8', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '16px 20px' }}>FECHA</th>
                    <th style={{ padding: '16px 20px' }}>PROVEEDOR</th>
                    <th style={{ padding: '16px 20px' }}>GRUPO / RUTA</th>
                    <th style={{ padding: '16px 20px' }}>CLIENTE</th>
                    <th style={{ padding: '16px 20px' }}>ESTADO</th>
                    <th style={{ padding: '16px 20px' }}>PRODUCTOS SOLICITADOS</th>
                    <th style={{ padding: '16px 20px' }}>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredRequests().map((request) => (
                    <tr key={request.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '16px 20px', fontSize: '12px', color: '#64748b' }}>
                        {new Date(request.date).toLocaleDateString('es-ES')}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          fontSize:'10px', 
                          fontWeight:'bold', 
                          background: request.provider === 'SOFIA' ? '#fee2e2' : '#e0f2fe', 
                          color: request.provider === 'SOFIA' ? theme.primary : '#0369a1', 
                          padding:'2px 6px', 
                          borderRadius:'4px'
                        }}>
                          {request.provider}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                          <MapPin size={12} color="#94a3b8" /> {request.group}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px', fontWeight: '600' }}>{request.client}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 'bold',
                          background: request.status === 'emitido' ? '#fef3c7' : '#d1fae5',
                          color: request.status === 'emitido' ? '#92400e' : '#065f46',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'capitalize'
                        }}>
                          {request.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', fontSize: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                          {[104, 105, 106, 107, 108, 109, 110].map((code) => {
                            const details = request.products[code] || { boxes: 0, units: 0, hasOffal: false };
                            return (
                              <div key={code} style={{ padding: '6px 8px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', minWidth: '140px', flexShrink: 0 }}>
                                <div style={{ fontSize: '11px', fontWeight: '800', marginBottom: '4px' }}>Código {code}</div>
                                <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>{details.boxes} cajas, {details.units} unidades</div>
                                <div style={{ fontSize: '10px', color: details.hasOffal ? '#059669' : '#dc2626', fontWeight: '600' }}>
                                  {details.hasOffal ? 'Con menudencia' : 'Sin menudencia'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <Trash2 size={16} color="#cbd5e1" style={{cursor:'pointer'}} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
        
    </div>
  );
};


const ProductRow = ({ label, code, provider, values, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
    <span style={{ fontSize: '12px', fontWeight: 'bold', flex: 1 }}>{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          checked={values?.hasOffal || false}
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

const AssignmentView = ({ theme }) => {
  // Categorías por proveedor
  const providerCategories = {
    SOFIA: [104, 105, 106, 107, 108, 109, 110],
    PIO: [104, 105, 106, 107, 108, 109, 110]  // IMBA/PIO
  };

  const [selectedProvider, setSelectedProvider] = useState('SOFIA');
  const [filterProvider, setFilterProvider] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [distributionMode, setDistributionMode] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [receiveMode, setReceiveMode] = useState(false);
  const [selectedReceiveAssignment, setSelectedReceiveAssignment] = useState(null);

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

  const [history, setHistory] = useState([
    { id: 1, date: '2025-12-01', provider: 'SOFIA', client: 'Pollería El Rey', details: {104:{boxes:10,units:5,grossWeight:100.00,netWeight:95.00},107:{boxes:5,units:2,grossWeight:50.00,netWeight:47.50}}, status: 'COMPLETO' },
    { id: 2, date: '2025-12-05', provider: 'PIO', client: 'Feria Sector A', details: {109:{boxes:5,units:10,grossWeight:75.00,netWeight:70.00},104:{boxes:2,units:3,grossWeight:25.00,netWeight:23.00}}, status: 'PENDIENTE' }
  ]);

  const getAssignmentTotalNetWeight = () => {
    return providerCategories[selectedProvider].reduce((sum, code) => sum + (selectedProducts[selectedProvider][code]?.netWeight || 0), 0);
  };

  const getAssignmentTotalCost = () => {
    return getAssignmentTotalNetWeight() * assignmentPrice;
  };
  const matchesFilters = (e) => {
    if (filterProvider !== 'ALL' && e.provider !== filterProvider) return false;
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

  const handleBackToHistory = () => {
    setDistributionMode(false);
    setSelectedAssignment(null);
  };

  const handleReceive = (assignment) => {
    setSelectedReceiveAssignment(assignment);
    setReceiveMode(true);
  };

  const handleBackToHistoryFromReceive = () => {
    setReceiveMode(false);
    setSelectedReceiveAssignment(null);
  };

  if (receiveMode && selectedReceiveAssignment) {
    return <ReceiveView theme={theme} assignment={selectedReceiveAssignment} onBack={handleBackToHistoryFromReceive} />;
  }

  if (distributionMode && selectedAssignment) {
    return <DistributionView theme={theme} assignment={selectedAssignment} onBack={handleBackToHistory} />;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '32px' }}>
      <Card>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Plus color={theme.primary} size={20} /> Asignación de Productos
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

          {/* Detalle de Códigos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CANTIDADES A ASIGNAR</label>
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

          {/* Precio y Total */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PRECIO (Bs./Kg.)</label>
              <input 
                type="number" 
                step="0.01" 
                value={assignmentPrice || ''} 
                onChange={(e) => setAssignmentPrice(parseFloat(e.target.value) || 0)}
                style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
              />
            </div>
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: theme.primary }}>Total a Pagar: Bs {getAssignmentTotalCost().toFixed(2)}</div>
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

      <Card style={{ padding: 0 }}>
        <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold' }}>Historial de Asignaciones</span>
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
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>
                <th style={{ padding: '12px 16px' }}>FECHA</th>
                <th style={{ padding: '12px 16px' }}>PROVEEDOR</th>
                <th style={{ padding: '12px 16px' }}>DETALLE</th>
                <th style={{ padding: '12px 16px' }}>ESTADO Y ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map(entry => (
                <tr key={entry.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px 16px' }}>{entry.date}</td>
                  <td style={{ padding: '12px 16px' }}>{entry.provider}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'nowrap', overflowX: 'auto' }}>
                      {[104, 105, 106, 107, 108, 109, 110].map((code) => {
                        const d = entry.details[code] || { boxes: 0, units: 0, grossWeight: 0, netWeight: 0 };
                        return (
                          <div key={code} style={{ padding: '4px 6px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', minWidth: '120px', flexShrink: 0 }}>
                            <div style={{ fontSize: '11px', fontWeight: '800' }}>Código {code}</div>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>{d.boxes} Cj, {d.units} Unid</div>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>{d.grossWeight?.toFixed(2) || '0.00'} kg Bruto</div>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>{d.netWeight?.toFixed(2) || '0.00'} kg Neto</div>
                          </div>
                        );
                      })}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold', backgroundColor: entry.status === 'COMPLETO' ? '#dcfce7' : '#fee2e2', color: entry.status === 'COMPLETO' ? '#166534' : '#991b1b' }}>{entry.status}</span>
                      <button onClick={() => handleDistribute(entry)} style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', backgroundColor: theme.primary, color: 'white', border: 'none', cursor: 'pointer' }}>Repartir</button>
                      <button onClick={() => handleReceive(entry)} style={{ padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer' }}>Recibir</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredHistory.length === 0 && (
                <tr><td colSpan={5} style={{ padding: '16px', color: '#64748b' }}>No hay registros que coincidan con los filtros.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const DistributionView = ({ theme, assignment, onBack }) => {
  // Clientes de ejemplo con sus solicitudes
  const clients = [
    { id: 1, name: 'Pollería El Rey', group: 'El Alto Norte', orders: {104: 10, 107: 5} },
    { id: 2, name: 'Feria Sector A', group: 'El Alto Norte', orders: {104: 8, 109: 12} },
    { id: 3, name: 'Doña Juana', group: 'El Alto Sur', orders: {104: 5, 107: 3} }
  ];

  const [selectedGroup, setSelectedGroup] = useState('ALL');

  const groups = ['ALL', ...new Set(clients.map(c => c.group))];
  const filteredClients = selectedGroup === 'ALL' ? clients : clients.filter(c => c.group === selectedGroup);

  const [deliveries, setDeliveries] = useState(() => {
    const init = {};
    clients.forEach(client => {
      init[client.id] = [{104: {boxes: 0, units: 0, grossWeight: 0, netWeight: 0}, 105: {boxes: 0, units: 0, grossWeight: 0, netWeight: 0}, 106: {boxes: 0, units: 0, grossWeight: 0, netWeight: 0}, 107: {boxes: 0, units: 0, grossWeight: 0, netWeight: 0}, 108: {boxes: 0, units: 0, grossWeight: 0, netWeight: 0}, 109: {boxes: 0, units: 0, grossWeight: 0, netWeight: 0}, 110: {boxes: 0, units: 0, grossWeight: 0, netWeight: 0}}];
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

  const [savedClients, setSavedClients] = useState({});

  // Vehículos y choferes de ejemplo por grupo de clientes
  const availableVehicles = [
    { id: 'VH-01', plate: '1234-ABC', capacity: '3.5 Ton', description: 'Camión frigorífico pequeño' },
    { id: 'VH-02', plate: '5678-DEF', capacity: '5 Ton', description: 'Camión frigorífico mediano' },
    { id: 'VH-03', plate: '9999-XYZ', capacity: '1.5 Ton', description: 'Camioneta refrigerada' },
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
    return (deliveries[clientId] || []).reduce((sum, delivery) => sum + (delivery[code]?.[field] || 0), 0);
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

  const getTotalAssigned = (code) => {
    return (assignment.details[code]?.boxes || 0) + (assignment.details[code]?.units || 0);
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
            .details { margin: 20px 0; }
            .codes { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
            .code { border: 1px solid #ccc; padding: 10px; border-radius: 5px; min-width: 120px; }
            .total { font-weight: bold; font-size: 18px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <h1>Detalle de Venta</h1>
          <div class="details">
            <p><strong>Cliente:</strong> ${client.name}</p>
            <p><strong>Grupo:</strong> ${client.group}</p>
            <p><strong>Asignación:</strong> ${assignment.date} - ${assignment.provider}</p>
            <p><strong>Precio de Venta:</strong> Bs ${sellingPrice.toFixed(2)} / kg</p>
          </div>
          <h2>Productos Entregados</h2>
          <div class="codes">
            ${[104, 105, 106, 107, 108, 109, 110].map(code => `
              <div class="code">
                <div><strong>Código ${code}</strong></div>
                <div>Cajas: ${getClientTotal(client.id, code, 'boxes')}</div>
                <div>Unidades: ${getClientTotal(client.id, code, 'units')}</div>
                <div>Peso Bruto: ${getClientTotal(client.id, code, 'grossWeight').toFixed(2)} kg</div>
                <div>Peso Neto: ${getClientTotal(client.id, code, 'netWeight').toFixed(2)} kg</div>
              </div>
            `).join('')}
          </div>
          <div class="total">
            <p>Total Cajas: ${totalBoxes}</p>
            <p>Total Unidades: ${totalUnits}</p>
            <p>Total Peso Bruto: ${totalGrossWeight.toFixed(2)} kg</p>
            <p>Total Peso Neto: ${totalNetWeight.toFixed(2)} kg</p>
            <p>Total Precio de Venta: Bs ${totalSelling.toFixed(2)}</p>
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
      <button onClick={onBack} style={{ alignSelf: 'flex-start', padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold', color: theme.textMain }}>← Volver al Historial</button>

      <Card>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 'bold' }}>Repartir Asignación del {assignment.date}</h2>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PROVEEDOR:</span> <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{assignment.provider}</span></div>
          <div><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CLIENTE ORIGEN:</span> <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{assignment.client}</span></div>
        </div>

        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>Detalles de la Asignación</h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[104, 105, 106, 107, 108, 109, 110].map((code) => {
              const detail = assignment.details[code] || { boxes: 0, units: 0, grossWeight: 0, netWeight: 0 };
              return (
                <div key={code} style={{ 
                  padding: '16px', 
                  backgroundColor: 'white', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  minWidth: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: theme.primary, textAlign: 'center' }}>Código {code}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#0ea5e9' }}>
                      <Package size={14} />
                      <span>{detail.boxes} Cajas</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#f97316' }}>
                      <Box size={14} />
                      <span>{detail.units} Unidades</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#059669' }}>
                      <Truck size={14} />
                      <span>{detail.grossWeight?.toFixed(2) || '0.00'} kg Bruto</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981' }}>
                      <Truck size={14} />
                      <span>{detail.netWeight?.toFixed(2) || '0.00'} kg Bruto</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981' }}>
                      <Truck size={14} />
                      <span>{detail.netWeight?.toFixed(2) || '0.00'} kg Neto</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>GRUPO / RUTA:</label>
            <select 
              value={selectedGroup} 
              onChange={(e) => setSelectedGroup(e.target.value)}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '12px' }}
            >
              {groups.map(group => (
                <option key={group} value={group}>{group === 'ALL' ? 'Todos los Grupos' : group}</option>
              ))}
            </select>
          </div>

          {selectedGroup !== 'ALL' && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px dashed #e2e8f0',
                backgroundColor: '#f8fafc',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '220px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>
                  VEHÍCULO ASIGNADO (para todo el grupo)
                </label>
                <select
                  value={groupAssignments[selectedGroup]?.vehicleId || ''}
                  onChange={(e) =>
                    setGroupAssignments(prev => ({
                      ...prev,
                      [selectedGroup]: {
                        ...(prev[selectedGroup] || {}),
                        vehicleId: e.target.value,
                      },
                    }))
                  }
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    fontSize: '12px',
                  }}
                >
                  {availableVehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.id} · {v.plate} · {v.capacity}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '220px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>
                  CHOFER ASIGNADO
                </label>
                <select
                  value={groupAssignments[selectedGroup]?.driverId || ''}
                  onChange={(e) =>
                    setGroupAssignments(prev => ({
                      ...prev,
                      [selectedGroup]: {
                        ...(prev[selectedGroup] || {}),
                        driverId: e.target.value,
                      },
                    }))
                  }
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    outline: 'none',
                    fontSize: '12px',
                  }}
                >
                  {availableDrivers.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.id} · {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '200px', fontSize: '12px', color: '#64748b' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Contexto de ruta</div>
                <div>
                  Este vehículo y chofer se aplicarán a todos los clientes del grupo{' '}
                  <span style={{ fontWeight: 'bold', color: theme.primary }}>
                    {selectedGroup}
                  </span>
                  . Úsalo como referencia para la logística y el despacho.
                </div>
              </div>
            </div>
          )}
        </div>

        <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 'bold' }}>Distribuir entre Clientes</h4>
        {filteredClients.map(client => (
          <div key={client.id} style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: theme.primary }}>{client.name}</h5>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>PRECIO VENTA (Bs/Kg)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={sellingPrices[client.id] || ''} 
                    onChange={(e) => updateSellingPrice(client.id, e.target.value)}
                    style={{ 
                      width: '100px', 
                      padding: '4px', 
                      borderRadius: '4px', 
                      border: '1px solid #cbd5e1', 
                      outline: 'none',
                      fontSize: '11px',
                      textAlign: 'center'
                    }}
                  />
                </div>
                <button onClick={() => addDelivery(client.id)} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer', fontWeight: 'bold', color: theme.primary, fontSize: '12px' }}>Agregar Entrega</button>
                <button 
                  onClick={() => saveClient(client.id)} 
                  disabled={savedClients[client.id]}
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: '6px', 
                    border: 'none', 
                    backgroundColor: savedClients[client.id] ? '#10b981' : theme.primary, 
                    color: 'white', 
                    cursor: savedClients[client.id] ? 'not-allowed' : 'pointer', 
                    fontWeight: 'bold', 
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Save size={12} /> {savedClients[client.id] ? 'Guardado' : 'Guardar'}
                </button>
                <button 
                  onClick={() => printClientDetails(client)} 
                  style={{ 
                    padding: '6px 12px', 
                    borderRadius: '6px', 
                    border: '1px solid #e2e8f0', 
                    backgroundColor: 'white', 
                    color: theme.primary, 
                    cursor: 'pointer', 
                    fontWeight: 'bold', 
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  🖨️ Imprimir
                </button>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {[104, 105, 106, 107, 108, 109, 110].map((code) => (
                <div key={code} style={{ 
                  padding: '12px', 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0',
                  minWidth: '120px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: theme.primary, textAlign: 'center' }}>Código {code}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#0ea5e9' }}>
                      <Package size={12} />
                      <span>{getClientTotal(client.id, code, 'boxes')} Cajas</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#f97316' }}>
                      <Box size={12} />
                      <span>{getClientTotal(client.id, code, 'units')} Unidades</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981' }}>
                      <Truck size={12} />
                      <span>{getClientTotal(client.id, code, 'grossWeight').toFixed(2)} kg Bruto</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#059669' }}>
                      <Truck size={12} />
                      <span>{getClientTotal(client.id, code, 'netWeight').toFixed(2)} kg Neto</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: '12px', padding: '8px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: theme.primary }}>Peso Bruto Total: {getClientTotalGrossWeight(client.id).toFixed(2)} kg</div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#059669' }}>Peso Neto Total: {getClientTotalWeight(client.id).toFixed(2)} kg</div>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: theme.primary }}>Total Precio de Venta: Bs {getClientSellingTotal(client.id).toFixed(2)}</div>
            </div>
            

            {(deliveries[client.id] || []).map((delivery, index) => (
              <div key={index} style={{ marginBottom: '12px', padding: '12px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>Entrega {index + 1}</span>
                  {(deliveries[client.id] || []).length > 1 && (
                    <button onClick={() => removeDelivery(client.id, index)} style={{ padding: '2px 6px', borderRadius: '4px', border: 'none', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', fontSize: '10px' }}>×</button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[104, 105, 106, 107, 108, 109, 110].map((code) => (
                    <div key={code} style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '100px' }}>
                      <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>Código {code}</label>
                      <input 
                        type="number" 
                        placeholder="Cajas" 
                        value={delivery[code]?.boxes || ''} 
                        onChange={(e) => updateDelivery(client.id, index, code, 'boxes', e.target.value)}
                        style={{ 
                          width: '100%', 
                          padding: '4px', 
                          borderRadius: '4px', 
                          border: '1px solid #cbd5e1', 
                          outline: 'none',
                          fontSize: '11px',
                          textAlign: 'center'
                        }}
                      />
                      <input 
                        type="number" 
                        placeholder="Unidades" 
                        value={delivery[code]?.units || ''} 
                        onChange={(e) => updateDelivery(client.id, index, code, 'units', e.target.value)}
                        style={{ 
                          width: '100%', 
                          padding: '4px', 
                          borderRadius: '4px', 
                          border: '1px solid #cbd5e1', 
                          outline: 'none',
                          fontSize: '11px',
                          textAlign: 'center'
                        }}
                      />
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="Peso Bruto" 
                        value={delivery[code]?.grossWeight || ''} 
                        onChange={(e) => updateDelivery(client.id, index, code, 'grossWeight', e.target.value)}
                        style={{ 
                          width: '100%', 
                          padding: '4px', 
                          borderRadius: '4px', 
                          border: '1px solid #cbd5e1', 
                          outline: 'none',
                          fontSize: '11px',
                          textAlign: 'center'
                        }}
                      />
                      <input 
                        type="number" 
                        step="0.01"
                        placeholder="Peso Neto" 
                        value={delivery[code]?.netWeight || ''} 
                        onChange={(e) => updateDelivery(client.id, index, code, 'netWeight', e.target.value)}
                        style={{ 
                          width: '100%', 
                          padding: '4px', 
                          borderRadius: '4px', 
                          border: '1px solid #cbd5e1', 
                          outline: 'none',
                          fontSize: '11px',
                          textAlign: 'center'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>Resumen de Distribución</h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[104, 105, 106, 107, 108, 109, 110].map((code) => (
              <div key={code} style={{ 
                padding: '12px', 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                minWidth: '120px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', color: theme.primary }}>Código {code}</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{getTotalDistributed(code)} / {getTotalAssigned(code)}</div>
                <div style={{ fontSize: '11px', color: getTotalDistributed(code) > getTotalAssigned(code) ? '#ef4444' : '#10b981' }}>
                  {getTotalDistributed(code) > getTotalAssigned(code) ? 'Excede' : 'OK'}
                </div>
              </div>
            ))}
          </div>
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

const ReceiveView = ({ theme, assignment, onBack }) => {
  const [batches, setBatches] = useState({});
  const [costPerKg, setCostPerKg] = useState(0);

  const addBatch = (code) => {
    setBatches(prev => ({
      ...prev,
      [code]: [...(prev[code] || []), { weight: 0, boxes: 20, units: 0 }]
    }));
  };

  const updateBatchBoxes = (code, index, boxes) => {
    setBatches(prev => ({
      ...prev,
      [code]: prev[code].map((batch, i) => i === index ? { ...batch, boxes: parseInt(boxes) || 0 } : batch)
    }));
  };

  const updateBatchUnits = (code, index, units) => {
    setBatches(prev => ({
      ...prev,
      [code]: prev[code].map((batch, i) => i === index ? { ...batch, units: parseInt(units) || 0 } : batch)
    }));
  };

  const updateBatchWeight = (code, index, weight) => {
    setBatches(prev => ({
      ...prev,
      [code]: prev[code].map((batch, i) => i === index ? { ...batch, weight: parseFloat(weight) || 0 } : batch)
    }));
  };

  const removeBatch = (code, index) => {
    setBatches(prev => ({
      ...prev,
      [code]: prev[code].filter((_, i) => i !== index)
    }));
  };

  const getTotalWeight = (code) => {
    return (batches[code] || []).reduce((sum, batch) => sum + batch.weight, 0);
  };

  const getTotalBoxes = (code) => {
    return (batches[code] || []).reduce((sum, batch) => sum + batch.boxes, 0);
  };

  const getTotalUnits = (code) => {
    return (batches[code] || []).reduce((sum, batch) => sum + batch.units, 0);
  };

  const getOverallTotalWeight = () => {
    return [104, 105, 106, 107, 108, 109, 110].reduce((sum, code) => sum + getTotalWeight(code), 0);
  };

  const getTotalCost = () => {
    return getOverallTotalWeight() * costPerKg;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <button onClick={onBack} style={{ alignSelf: 'flex-start', padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold', color: theme.textMain }}>← Volver al Historial</button>

      <Card>
        <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 'bold' }}>Registrar Recepción del {assignment.date}</h2>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
          <div><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PROVEEDOR:</span> <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{assignment.provider}</span></div>
          <div><span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CLIENTE:</span> <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{assignment.client}</span></div>
        </div>

        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>Detalles de la Asignación</h4>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[104, 105, 106, 107, 108, 109, 110].map((code) => {
              const detail = assignment.details[code] || { boxes: 0, units: 0 };
              return (
                <div key={code} style={{ 
                  padding: '16px', 
                  backgroundColor: 'white', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  minWidth: '140px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', color: theme.primary, textAlign: 'center' }}>Código {code}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#0ea5e9' }}>
                      <Package size={14} />
                      <span>{detail.boxes} Cajas</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#f97316' }}>
                      <Box size={14} />
                      <span>{detail.units} Unidades Asignadas / {getTotalUnits(code)} Recibidas</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981' }}>
                      <Truck size={14} />
                      <span>{getTotalWeight(code).toFixed(2)} kg Recibidos</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 'bold' }}>Registrar Peso por Código (Lotes de 20 cajas)</h4>
        {[104, 105, 106, 107, 108, 109, 110].map((code) => (
          <div key={code} style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h5 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: theme.primary }}>Código {code}</h5>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span>{getTotalBoxes(code)} cajas</span>
                <span>/</span>
                <span>{getTotalUnits(code)} unidades</span>
                <span>/</span>
                <span>{getTotalWeight(code).toFixed(2)} kg</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {(batches[code] || []).map((batch, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', minWidth: '60px' }}>Pesaje {index + 1}:</span>
                  <input 
                    type="number" 
                    placeholder="20" 
                    value={batch.boxes || ''} 
                    onChange={(e) => updateBatchBoxes(code, index, e.target.value)}
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
                  <span style={{ fontSize: '12px', color: '#64748b' }}>cajas</span>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={batch.units || ''} 
                    onChange={(e) => updateBatchUnits(code, index, e.target.value)}
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
                  <span style={{ fontSize: '12px', color: '#64748b' }}>unidades</span>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    value={batch.weight || ''} 
                    onChange={(e) => updateBatchWeight(code, index, e.target.value)}
                    style={{ 
                      width: '80px', 
                      padding: '6px', 
                      borderRadius: '4px', 
                      border: '1px solid #cbd5e1', 
                      outline: 'none',
                      fontSize: '12px',
                      textAlign: 'center'
                    }}
                  />
                  <span style={{ fontSize: '12px', color: '#64748b' }}>kg</span>
                  <button onClick={() => removeBatch(code, index)} style={{ alignSelf: 'flex-end', padding: '4px 8px', borderRadius: '4px', border: 'none', backgroundColor: '#ef4444', color: 'white', cursor: 'pointer', fontSize: '10px' }}>×</button>
                </div>
              ))}
            </div>
            <button onClick={() => addBatch(code)} style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer', fontWeight: 'bold', color: theme.primary }}>Agregar Lote de 20 Cajas</button>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: theme.primary }}>Peso Total General: {getOverallTotalWeight().toFixed(2)} kg</div>
        </div>

        <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 'bold' }}>Cálculo de Costo Total</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>COSTO POR KG (Bs)</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00" 
                value={costPerKg || ''} 
                onChange={(e) => setCostPerKg(parseFloat(e.target.value) || 0)}
                style={{ 
                  width: '120px', 
                  padding: '10px', 
                  borderRadius: '6px', 
                  border: '1px solid #e2e8f0', 
                  outline: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>COSTO TOTAL</label>
              <div style={{ 
                padding: '10px', 
                borderRadius: '6px', 
                backgroundColor: 'white', 
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
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button onClick={onBack} style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', cursor: 'pointer', fontWeight: 'bold', color: theme.textMain }}>Cancelar</button>
          <button style={{ flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Truck size={16} /> Registrar Recepción
          </button>
        </div>
      </Card>
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
      {/* Resumen rápido */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        <StatCard
          title="Vehículos en ruta"
          value={vehicles.length}
          change="+2"
          icon={Truck}
          color={theme.primary}
        />
        <StatCard
          title="Órdenes entregadas (hoy)"
          value={deliveries.reduce((s, d) => s + d.orders, 0)}
          change="+12"
          icon={CheckCircle2}
          color="#10b981"
        />
        <StatCard
          title="Canastos entregados (hoy)"
          value={totalBasketsDelivered}
          change="+18"
          icon={Archive}
          color="#f59e0b"
        />
        <StatCard
          title="Vehículo seleccionado"
          value={selectedVehicle.id}
          icon={MapPin}
          color="#3b82f6"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '24px', alignItems: 'stretch' }}>
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
            <div>
              <div style={{ fontWeight: 'bold' }}>Mapa de Vehículos en Ruta</div>
              <div style={{ fontSize: '12px', color: theme.textMuted }}>
                Visualiza la ubicación actual y el estado de cada unidad
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: theme.textMuted }}>RUTA</label>
              <select
                value={routeFilter}
                onChange={(e) => {
                  setRouteFilter(e.target.value);
                  const first = vehicles.find(v => e.target.value === 'ALL' || v.route === e.target.value);
                  if (first) setSelectedVehicleId(first.id);
                }}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  fontSize: '12px',
                  outline: 'none',
                }}
              >
                {routes.map(r => (
                  <option key={r} value={r}>
                    {r === 'ALL' ? 'Todas las rutas' : r}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={{ height: '360px' }}>
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
                >
                  <Popup>
                    <div style={{ fontSize: '12px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        📍 {d.client}
                      </div>
                      <div>Ruta: {d.route}</div>
                      <div>Vehículo: {d.vehicleId}</div>
                      <div>Chofer: {d.driver}</div>
                      <div>Órdenes entregadas: {d.orders}</div>
                      <div>Canastos entregados: {d.baskets}</div>
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
        </Card>

        {/* Lista de vehículos y resumen de canastos/órdenes */}
        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ fontWeight: 'bold' }}>Vehículos en ruta</div>
            <div style={{ fontSize: '12px', color: theme.textMuted }}>Selecciona una unidad para centrar el mapa</div>
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

          <div style={{ padding: '14px 18px', borderTop: '1px solid #f1f5f9' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '6px', fontSize: '13px' }}>
              Entregas del vehículo seleccionado
            </div>
            {selectedVehicleDeliveries.length === 0 ? (
              <div style={{ fontSize: '12px', color: theme.textMuted }}>
                No hay entregas registradas para esta unidad.
              </div>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '12px', maxHeight: '140px', overflowY: 'auto' }}>
                {selectedVehicleDeliveries.map((d, idx) => (
                  <li key={idx} style={{ padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '600' }}>{d.client}</span>
                      <span style={{ color: theme.textMuted }}>{d.time}</span>
                    </div>
                    <div style={{ color: theme.textMuted }}>
                      {d.orders} ord. · {d.baskets} canastos
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>
      </div>

      {/* Detalle general de solicitudes entregadas */}
      <Card style={{ padding: 0 }}>
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontWeight: 'bold' }}>Detalle de Solicitudes Entregadas</div>
            <div style={{ fontSize: '12px', color: theme.textMuted }}>
              Resumen de entregas por cliente, vehículo y canastos
            </div>
          </div>
        </div>
        <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', textAlign: 'left' }}>
                <th style={{ padding: '8px 14px' }}>Hora</th>
                <th style={{ padding: '8px 14px' }}>Cliente</th>
                <th style={{ padding: '8px 14px' }}>Ruta</th>
                <th style={{ padding: '8px 14px' }}>Vehículo</th>
                <th style={{ padding: '8px 14px' }}>Chofer</th>
                <th style={{ padding: '8px 14px' }}>Órdenes</th>
                <th style={{ padding: '8px 14px' }}>Canastos</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeliveries.map((d, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '8px 14px', fontSize: '12px', color: theme.textMuted }}>{d.time}</td>
                  <td style={{ padding: '8px 14px', fontWeight: '600' }}>{d.client}</td>
                  <td style={{ padding: '8px 14px' }}>{d.route}</td>
                  <td style={{ padding: '8px 14px' }}>{d.vehicleId}</td>
                  <td style={{ padding: '8px 14px' }}>{d.driver}</td>
                  <td style={{ padding: '8px 14px' }}>{d.orders}</td>
                  <td style={{ padding: '8px 14px', fontWeight: '800', color: theme.primary }}>{d.baskets}</td>
                </tr>
              ))}
              {filteredDeliveries.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '16px', textAlign: 'center', color: theme.textMuted }}>
                    No hay entregas registradas para el filtro actual.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
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

  const filteredClients = clientBaskets.filter(c => {
    const s = search.toLowerCase();
    return (
      c.client.toLowerCase().includes(s) ||
      c.route.toLowerCase().includes(s)
    );
  });

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
              <div style={{ fontWeight: 'bold' }}>Canastos en Clientes</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Detalle por cliente y ruta</div>
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

        {/* Stock en almacenes */}
        <Card style={{ padding: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold' }}>Canastos en Almacén</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Distribución por depósito</div>
            </div>
          </div>
          <div>
            {warehouseLocations.map((w, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 20px',
                  borderBottom: idx === warehouseLocations.length - 1 ? 'none' : '1px solid #f1f5f9',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600' }}>{w.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Sector: {w.section}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '800', color: theme.frozen }}>{w.baskets} canastos</div>
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
                        width: `${(w.baskets / summary.inWarehouse) * 100}%`,
                        height: '100%',
                        backgroundColor: theme.frozen,
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
const SettingsView = ({ theme }) => {
  const [activeSection, setActiveSection] = useState('general');
  
  const sections = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'providers', label: 'Proveedores', icon: Package },
    { id: 'products', label: 'Productos', icon: Box },
    { id: 'clients', label: 'Clientes', icon: UserCircle },
    { id: 'routes', label: 'Rutas', icon: MapPin },
    { id: 'vehicles', label: 'Vehículos', icon: Truck },
    { id: 'drivers', label: 'Choferes', icon: Users },
    { id: 'warehouses', label: 'Almacenes', icon: Building2 },
    { id: 'prices', label: 'Precios', icon: DollarSign },
    { id: 'baskets', label: 'Canastos', icon: Archive },
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

      {activeSection === 'general' && <GeneralSettings theme={theme} />}
      {activeSection === 'providers' && <ProvidersSettings theme={theme} />}
      {activeSection === 'products' && <ProductsSettings theme={theme} />}
      {activeSection === 'clients' && <ClientsSettings theme={theme} />}
      {activeSection === 'routes' && <RoutesSettings theme={theme} />}
      {activeSection === 'vehicles' && <VehiclesSettings theme={theme} />}
      {activeSection === 'drivers' && <DriversSettings theme={theme} />}
      {activeSection === 'warehouses' && <WarehousesSettings theme={theme} />}
      {activeSection === 'prices' && <PricesSettings theme={theme} />}
      {activeSection === 'baskets' && <BasketsSettings theme={theme} />}
      {activeSection === 'users' && <UsersSettings theme={theme} />}
    </div>
  );
};

// Componentes de cada sección de configuración
const GeneralSettings = ({ theme }) => {
  const [cutoffTime, setCutoffTime] = useState('10:00');
  const [companyName, setCompanyName] = useState('Distribuidora Bolivia');
  const [timezone, setTimezone] = useState('America/La_Paz');

  return (
    <Card>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Configuración General</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>NOMBRE DE LA EMPRESA</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>HORA DE CORTE</label>
          <input
            type="time"
            value={cutoffTime}
            onChange={(e) => setCutoffTime(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '200px' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>ZONA HORARIA</label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '300px' }}
          >
            <option value="America/La_Paz">America/La_Paz (GMT-4)</option>
            <option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</option>
          </select>
        </div>
        <button style={{ alignSelf: 'flex-start', backgroundColor: theme.primary, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> Guardar Configuración
        </button>
      </div>
    </Card>
  );
};

const ProvidersSettings = ({ theme }) => {
  const [providers, setProviders] = useState([
    { id: 1, name: 'Avícola Sofía', code: 'SOFIA', contact: 'contacto@sofia.com', phone: '+591 2 1234567', active: true },
    { id: 2, name: 'PIO / IMBA', code: 'PIO', contact: 'contacto@pio.com', phone: '+591 2 7654321', active: true },
  ]);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', contact: '', phone: '' });

  const handleSave = () => {
    if (editing) {
      setProviders(providers.map(p => p.id === editing ? { ...p, ...formData } : p));
    } else {
      setProviders([...providers, { id: Date.now(), ...formData, active: true }]);
    }
    setEditing(null);
    setFormData({ name: '', code: '', contact: '', phone: '' });
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
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CÓDIGO</label>
              <input type="text" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CONTACTO</label>
              <input type="email" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>TELÉFONO</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={handleSave} style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              <Save size={14} /> Guardar
            </button>
            <button onClick={() => { setEditing(null); setFormData({ name: '', code: '', contact: '', phone: '' }); }} style={{ backgroundColor: '#f1f5f9', color: theme.textMain, border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Código</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Contacto</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Teléfono</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {providers.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: '600' }}>{p.name}</td>
              <td style={{ padding: '12px' }}>{p.code}</td>
              <td style={{ padding: '12px' }}>{p.contact}</td>
              <td style={{ padding: '12px' }}>{p.phone}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: p.active ? '#dcfce7' : '#fee2e2', color: p.active ? '#166534' : '#991b1b' }}>
                  {p.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <button onClick={() => { setEditing(p.id); setFormData({ name: p.name, code: p.code, contact: p.contact, phone: p.phone }); }} style={{ marginRight: '8px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }}>
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

const ProductsSettings = ({ theme }) => {
  const [products, setProducts] = useState([
    { code: 104, name: 'Rojo', color: '#ef4444', active: true },
    { code: 105, name: 'Blanco', color: '#ffffff', active: true },
    { code: 106, name: 'Amarillo', color: '#facc15', active: true },
    { code: 107, name: 'Verde', color: '#22c55e', active: true },
    { code: 108, name: 'Azul', color: '#3b82f6', active: true },
    { code: 109, name: 'Negro', color: '#000000', active: true },
    { code: 110, name: 'Menudencia', color: '#8b5cf6', active: true },
  ]);

  return (
    <Card>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Productos / Categorías</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Código</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Color</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.code} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.code}</td>
              <td style={{ padding: '12px' }}>{p.name}</td>
              <td style={{ padding: '12px' }}>
                <div style={{ width: '40px', height: '16px', backgroundColor: p.color, borderRadius: '4px', border: '1px solid #e2e8f0' }}></div>
              </td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: p.active ? '#dcfce7' : '#fee2e2', color: p.active ? '#166534' : '#991b1b' }}>
                  {p.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <button style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }}>
                  <Edit size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

const ClientsSettings = ({ theme }) => {
  const [clients, setClients] = useState([
    { id: 1, name: 'Pollería El Rey', route: 'El Alto Norte', contact: 'rey@email.com', phone: '+591 71234567', active: true },
    { id: 2, name: 'Doña Juana', route: 'El Alto Sur', contact: 'juana@email.com', phone: '+591 71234568', active: true },
    { id: 3, name: 'Mercado Central - Puesto 4', route: 'La Paz Centro', contact: 'mercado@email.com', phone: '+591 71234569', active: true },
  ]);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Clientes</h3>
        <button style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Nuevo Cliente
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Ruta</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Contacto</th>
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
              <td style={{ padding: '12px' }}>{c.contact}</td>
              <td style={{ padding: '12px' }}>{c.phone}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: c.active ? '#dcfce7' : '#fee2e2', color: c.active ? '#166534' : '#991b1b' }}>
                  {c.active ? 'Activo' : 'Inactivo'}
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

const RoutesSettings = ({ theme }) => {
  const [routes, setRoutes] = useState([
    { id: 1, name: 'El Alto Norte', description: 'Zona norte de El Alto', active: true },
    { id: 2, name: 'El Alto Sur', description: 'Zona sur de El Alto', active: true },
    { id: 3, name: 'La Paz Centro', description: 'Centro de La Paz', active: true },
  ]);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Rutas / Grupos</h3>
        <button style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Nueva Ruta
        </button>
      </div>
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
          {routes.map(r => (
            <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: '600' }}>{r.name}</td>
              <td style={{ padding: '12px' }}>{r.description}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: r.active ? '#dcfce7' : '#fee2e2', color: r.active ? '#166534' : '#991b1b' }}>
                  {r.active ? 'Activo' : 'Inactivo'}
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

const VehiclesSettings = ({ theme }) => {
  const [vehicles, setVehicles] = useState([
    { id: 'VH-01', plate: '1234-ABC', capacity: '5000 kg', status: 'Activo', active: true },
    { id: 'VH-02', plate: '5678-DEF', capacity: '4500 kg', status: 'Activo', active: true },
    { id: 'VH-03', plate: '9999-XYZ', capacity: '6000 kg', status: 'Mantenimiento', active: false },
  ]);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Vehículos</h3>
        <button style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Nuevo Vehículo
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Placa</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Capacidad</th>
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

const DriversSettings = ({ theme }) => {
  const [drivers, setDrivers] = useState([
    { id: 1, name: 'Juan Pérez', license: 'ABC123', phone: '+591 71234567', active: true },
    { id: 2, name: 'María González', license: 'DEF456', phone: '+591 71234568', active: true },
    { id: 3, name: 'Carlos Ramírez', license: 'GHI789', phone: '+591 71234569', active: true },
  ]);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Choferes</h3>
        <button style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Nuevo Chofer
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Licencia</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Teléfono</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map(d => (
            <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: '600' }}>{d.name}</td>
              <td style={{ padding: '12px' }}>{d.license}</td>
              <td style={{ padding: '12px' }}>{d.phone}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: d.active ? '#dcfce7' : '#fee2e2', color: d.active ? '#166534' : '#991b1b' }}>
                  {d.active ? 'Activo' : 'Inactivo'}
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

const WarehousesSettings = ({ theme }) => {
  const [warehouses, setWarehouses] = useState([
    { id: 1, name: 'Almacén Central La Paz', section: 'Zona A', address: 'Av. Principal 123', active: true },
    { id: 2, name: 'Depósito El Alto', section: 'Zona Frío', address: 'Calle Comercio 456', active: true },
    { id: 3, name: 'Depósito Viacha', section: 'Principal', address: 'Carretera Viacha Km 5', active: true },
  ]);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Almacenes / Depósitos</h3>
        <button style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Nuevo Almacén
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Sector</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Dirección</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map(w => (
            <tr key={w.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: '600' }}>{w.name}</td>
              <td style={{ padding: '12px' }}>{w.section}</td>
              <td style={{ padding: '12px' }}>{w.address}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: w.active ? '#dcfce7' : '#fee2e2', color: w.active ? '#166534' : '#991b1b' }}>
                  {w.active ? 'Activo' : 'Inactivo'}
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

const PricesSettings = ({ theme }) => {
  const [prices, setPrices] = useState([
    { provider: 'SOFIA', code: 104, basePrice: 12.50, active: true },
    { provider: 'SOFIA', code: 107, basePrice: 13.00, active: true },
    { provider: 'PIO', code: 104, basePrice: 12.00, active: true },
  ]);

  return (
    <Card>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Configuración de Precios</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Proveedor</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Código</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Precio Base (Bs/kg)</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((p, idx) => (
            <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: '600' }}>{p.provider}</td>
              <td style={{ padding: '12px' }}>{p.code}</td>
              <td style={{ padding: '12px' }}>Bs {p.basePrice.toFixed(2)}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: p.active ? '#dcfce7' : '#fee2e2', color: p.active ? '#166534' : '#991b1b' }}>
                  {p.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                <button style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: 'white', cursor: 'pointer' }}>
                  <Edit size={14} />
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
  const [basketConfig, setBasketConfig] = useState({
    totalBaskets: 2200,
    costPerBasket: 25.00,
    maxDaysInClient: 7,
  });

  return (
    <Card>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Configuración de Canastos</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>TOTAL DE CANASTOS EN INVENTARIO</label>
          <input
            type="number"
            value={basketConfig.totalBaskets}
            onChange={(e) => setBasketConfig({...basketConfig, totalBaskets: parseInt(e.target.value) || 0})}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '300px' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>COSTO POR CANASTO (Bs)</label>
          <input
            type="number"
            step="0.01"
            value={basketConfig.costPerBasket}
            onChange={(e) => setBasketConfig({...basketConfig, costPerBasket: parseFloat(e.target.value) || 0})}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '300px' }}
          />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>DÍAS MÁXIMOS EN CLIENTE (ANTES DE MORA)</label>
          <input
            type="number"
            value={basketConfig.maxDaysInClient}
            onChange={(e) => setBasketConfig({...basketConfig, maxDaysInClient: parseInt(e.target.value) || 0})}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', width: '300px' }}
          />
        </div>
        <button style={{ alignSelf: 'flex-start', backgroundColor: theme.primary, color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Save size={16} /> Guardar Configuración
        </button>
      </div>
    </Card>
  );
};

const UsersSettings = ({ theme }) => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin Bolivia', email: 'admin@distribuidora.com', role: 'Administrador', active: true },
    { id: 2, name: 'Operador 1', email: 'operador1@distribuidora.com', role: 'Operador', active: true },
  ]);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Usuarios</h3>
        <button style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} /> Nuevo Usuario
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8fafc', color: '#64748b', fontSize: '12px' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>Nombre</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Rol</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Estado</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{ padding: '12px', fontWeight: '600' }}>{u.name}</td>
              <td style={{ padding: '12px' }}>{u.email}</td>
              <td style={{ padding: '12px' }}>{u.role}</td>
              <td style={{ padding: '12px' }}>
                <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', backgroundColor: u.active ? '#dcfce7' : '#fee2e2', color: u.active ? '#166534' : '#991b1b' }}>
                  {u.active ? 'Activo' : 'Inactivo'}
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
            </div>
          </div>

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
                                <option value="Transferencia">🏦 Transf</option>
                                <option value="Cheque">📄 Cheque</option>
                                <option value="Tarjeta">💳 Tarjeta</option>
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
                        <option value="Transferencia">🏦 Transferencia</option>
                        <option value="Cheque">📄 Cheque</option>
                        <option value="Tarjeta">💳 Tarjeta</option>
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

const ReportsView = ({ theme }) => {
  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', color: theme.primary }}>Reportes</h1>
      <Card>
        <p style={{ textAlign: 'center', color: theme.textMuted }}>
          Módulo de reportes en desarrollo...
        </p>
      </Card>
    </div>
  );
};

export default App;