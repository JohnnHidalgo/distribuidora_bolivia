import React, { useState } from 'react';
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
  UserCircle,
  ClipboardList,
  Layers,
  Save,
  Trash2,
  MapPin
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('orders');

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

  const styles = {
    container: {
      display: 'flex',
      height: '100vh',
      backgroundColor: theme.bg,
      fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
      color: theme.textMain,
      overflow: 'hidden'
    },
    sidebar: {
      width: '260px',
      backgroundColor: theme.sidebarBg,
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '32px',
      padding: '0 8px'
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
    main: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    header: {
      height: '64px',
      backgroundColor: 'white',
      borderBottom: `1px solid ${theme.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px'
    },
    contentArea: {
      flex: 1,
      padding: '32px',
      overflowY: 'auto'
    }
  };

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView theme={theme} />;
      case 'inventory': return <InventoryView theme={theme} />;
      case 'orders': return <ConsolidationView theme={theme} />;
      case 'assignments': return <AssignmentView theme={theme} />;
      case 'baskets': return <BasketView theme={theme} />;
      default: return <DashboardView theme={theme} />;
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>D</div>
          <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '1px' }}>BOLIVIA</span>
        </div>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <SidebarBtn id="dashboard" icon={LayoutDashboard} label="Dashboard" activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
          <SidebarBtn id="inventory" icon={Package} label="Inventario" activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
          <SidebarBtn id="orders" icon={ShoppingCart} label="Consolidación" activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
          <SidebarBtn id="assignments" icon={Truck} label="Asignaciones" activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
          <SidebarBtn id="baskets" icon={Archive} label="Canastos" activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
          <SidebarBtn id="reports" icon={BarChart3} label="Reportes" activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
        </nav>

        <div style={{ paddingTop: '20px', borderTop: `1px solid #1e293b`, marginTop: '20px' }}>
          <SidebarBtn id="settings" icon={Settings} label="Configuración" activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
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
      <div style={styles.main}>
        <header style={styles.header}>
          <h1 style={{ fontSize: '20px', fontWeight: '600', color: theme.textMain, textTransform: 'capitalize' }}>
            {activeTab.replace(/([A-Z])/g, ' $1').trim()}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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

        <div style={styles.contentArea}>
          {renderView()}
        </div>
      </div>
    </div>
  );
};

// Componentes Auxiliares
const SidebarBtn = ({ id, icon: Icon, label, activeTab, setActiveTab, theme }) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
        borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left', transition: '0.2s',
        backgroundColor: isActive ? theme.primary : 'transparent',
        color: isActive ? 'white' : '#94a3b8',
        boxShadow: isActive ? '0 4px 6px rgba(225, 29, 72, 0.2)' : 'none'
      }}
    >
      <Icon size={20} />
      <span style={{ fontWeight: '600' }}>{label}</span>
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

const DashboardView = ({ theme }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
      <StatCard title="Entregas Hoy" value="42" change="+5" icon={CheckCircle2} color="#10b981" />
      <StatCard title="Total Solicitudes" value="158" change="+12" icon={ShoppingCart} color="#3b82f6" />
      <StatCard title="Canastos en Clientes" value="842" change="-18" icon={Archive} color="#f59e0b" />
      <StatCard title="Stock Crítico" value="3 Categorías" icon={AlertCircle} color="#ef4444" />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <Card>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Pedidos por Categoría (Hoy)</h3>
        {['104', '105', '106', '107', '108', '109'].map((cat, i) => (
          <div key={cat} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyBetween: 'space-between', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
              <span>Código {cat}</span>
              <span style={{ marginLeft: 'auto' }}>{80 - i * 10} Unid.</span>
            </div>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${100 - (i * 12)}%`, height: '100%', backgroundColor: theme.primary }}></div>
            </div>
          </div>
        ))}
      </Card>
      <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        <Truck size={64} style={{ marginBottom: '16px', opacity: 0.2 }} />
        <p style={{ margin: 0, fontWeight: '500' }}>Seguimiento de Vehículos en Tiempo Real</p>
        <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '8px' }}>Módulo de Mapas</span>
      </Card>
    </div>
  </div>
);

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
  const [viewStep, setViewStep] = useState('register');
  const [expandedGroups, setExpandedGroups] = useState({});

  // Categorías por proveedor
  const providerCategories = {
    SOFIA: [104, 105, 106, 107, 108, 109],
    PIO: [104, 105, 106, 107, 108, 109]  // Rojo, Blanco, Amarillo, Verde, Azul, Negro
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '12px', width: 'fit-content' }}>
        <button 
          onClick={() => setViewStep('register')}
          style={{ 
            padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
            backgroundColor: viewStep === 'register' ? 'white' : 'transparent',
            color: viewStep === 'register' ? theme.primary : theme.textMuted,
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <ClipboardList size={18} /> 1. Registro de Pedidos
        </button>
        <button 
          onClick={() => setViewStep('consolidate')}
          style={{ 
            padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold',
            backgroundColor: viewStep === 'consolidate' ? 'white' : 'transparent',
            color: viewStep === 'consolidate' ? theme.primary : theme.textMuted,
            display: 'flex', alignItems: 'center', gap: '8px'
          }}
        >
          <Layers size={18} /> 2. Consolidación Total
        </button>
      </div>

      {viewStep === 'register' ? (
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
                <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#fdf2f2' }}>
                  <option>Avícola Sofía</option>
                  <option>PIO</option>
                  <option>Pío Lindo</option>
                </select>
              </div>

              {/* Selección de Grupo de Cliente (NUEVO) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>GRUPO / RUTA</label>
                <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}>
                  <option>Seleccionar Grupo...</option>
                  <option>El Alto - Zona Norte</option>
                  <option>El Alto - Zona Sur</option>
                  <option>La Paz - Centro</option>
                  <option>Viacha</option>
                </select>
              </div>

              {/* Selección de Cliente */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>CLIENTE DESTINO</label>
                <select style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}>
                  <option>Seleccionar Cliente...</option>
                  <option>Pollería El Rey</option>
                  <option>Súper Pollo</option>
                  <option>Doña Juana</option>
                </select>
              </div>

              {/* Grid de Productos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b' }}>PRODUCTOS REQUERIDOS</label>
                <ProductRow label="Código 104 (Rojo)" />
                <ProductRow label="Código 107 (Verde)" />
                <ProductRow label="Código 109 (Negro)" />
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
              <h3 style={{ margin: 0, fontSize: '16px' }}>Solicitudes Pendientes del Día</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ textAlign: 'left', fontSize: '11px', color: '#94a3b8', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '16px 20px' }}>PROVEEDOR</th>
                    <th style={{ padding: '16px 20px' }}>GRUPO / RUTA</th>
                    <th style={{ padding: '16px 20px' }}>CLIENTE</th>
                    <th style={{ padding: '16px 20px' }}>DETALLE MIXTO</th>
                    <th style={{ padding: '16px 20px' }}>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '16px 20px' }}><span style={{fontSize:'10px', fontWeight:'bold', background:'#fee2e2', color:theme.primary, padding:'2px 6px', borderRadius:'4px'}}>SOFIA</span></td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <MapPin size={12} color="#94a3b8" /> El Alto Norte
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '600' }}>Pollería El Rey</td>
                    <td style={{ padding: '16px 20px', fontSize: '12px' }}>
                      <div style={{color: theme.primary, fontWeight:'bold'}}>104: 10 Cajas</div>
                      <div style={{color: '#64748b'}}>107: 5 Cajas</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}><Trash2 size={16} color="#cbd5e1" style={{cursor:'pointer'}} /></td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #f8fafc' }}>
                    <td style={{ padding: '16px 20px' }}><span style={{fontSize:'10px', fontWeight:'bold', background:'#e0f2fe', color:'#0369a1', padding:'2px 6px', borderRadius:'4px'}}>PIO</span></td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                        <MapPin size={12} color="#94a3b8" /> El Alto Sur
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px', fontWeight: '600' }}>Doña Juana</td>
                    <td style={{ padding: '16px 20px', fontSize: '12px' }}>
                      <div style={{color: theme.frozen, fontWeight:'bold'}}>109: 5 Unidades</div>
                      <div style={{color: '#64748b'}}>104: 2 Unidades</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}><Trash2 size={16} color="#cbd5e1" style={{cursor:'pointer'}} /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Totales Consolidados */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {Object.entries(consolidatedData).map(([provider, groups]) => {
              const categories = providerCategories[provider];
              const providerTotals = calculateProviderTotals(groups, categories);
              return (
                <ConsolidatedBox 
                  key={provider} 
                  title={`Pedido Maestro: ${provider}`} 
                  color={provider === 'SOFIA' ? theme.primary : theme.frozen} 
                  totals={providerTotals} 
                />
              );
            })}
          </div>

          {/* Detalle por Grupo y Cliente */}
          <Card>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: 'bold' }}>Detalle de Pedidos Consolidados</h3>
            {Object.entries(consolidatedData).map(([provider, groups]) => {
              const categories = providerCategories[provider];
              return (
                <div key={provider} style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: 'bold', color: provider === 'SOFIA' ? theme.primary : theme.frozen, marginBottom: '12px' }}>
                    Proveedor: {provider}
                  </h4>
                  {Object.entries(groups).map(([group, clients]) => {
                    const groupTotals = calculateGroupTotals(clients, categories);
                    const isExpanded = expandedGroups[`${provider}-${group}`];
                    return (
                      <div key={group} style={{ marginBottom: '16px', padding: '16px', border: `1px solid #e2e8f0`, borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h5 style={{ fontSize: '14px', fontWeight: 'bold', color: theme.textMain, margin: 0 }}>
                            Grupo: {group}
                          </h5>
                          <button 
                            onClick={() => toggleGroup(provider, group)}
                            style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: theme.primary, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            {isExpanded ? 'Ocultar Detalle' : 'Ver Detalle'} <ChevronRight size={16} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                          </button>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          {Object.entries(groupTotals).map(([code, total]) => (
                            <div key={code} style={{ textAlign: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>Código {code}</div>
                              <div style={{ fontSize: '18px', fontWeight: 'bold', color: theme.primary }}>{total}</div>
                            </div>
                          ))}
                        </div>
                        {isExpanded && (
                          <div style={{ marginTop: '16px' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                              <thead>
                                <tr style={{ backgroundColor: '#f1f5f9', color: '#64748b' }}>
                                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Cliente</th>
                                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Detalle de Pedido</th>
                                </tr>
                              </thead>
                              <tbody>
                                {clients.map((clientData, index) => (
                                  <tr key={index} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '8px 12px', fontWeight: '600' }}>{clientData.client}</td>
                                    <td style={{ padding: '8px 12px' }}>
                                      {Object.entries(clientData.orders).map(([code, qty]) => (
                                        <div key={code} style={{ marginBottom: '4px' }}>
                                          <span style={{ fontWeight: 'bold', color: theme.primary }}>Código {code}:</span> {qty} unidades
                                        </div>
                                      ))}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </Card>

          {/* Botón para guardar el consolidado */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <button 
              onClick={() => alert('Consolidado guardado exitosamente')}
              style={{ 
                backgroundColor: theme.primary, color: 'white', border: 'none', padding: '16px 32px', 
                borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(225, 29, 72, 0.2)'
              }}
            >
              <Save size={20} /> Guardar Consolidado
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


const ProductRow = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
    <span style={{ fontSize: '12px', fontWeight: 'bold', flex: 1 }}>{label}</span>
    <div style={{ display: 'flex', gap: '4px' }}>
      <div style={{ position: 'relative' }}>
        <input type="number" placeholder="0" style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} />
        <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>CAJAS</span>
      </div>
      <div style={{ position: 'relative' }}>
        <input type="number" placeholder="0" style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' }} />
        <span style={{ position: 'absolute', top: '-8px', left: '4px', fontSize: '8px', backgroundColor: 'white', padding: '0 2px', fontWeight: 'bold', color: '#94a3b8' }}>UNID.</span>
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

const AssignmentView = ({ theme }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px' }}>
    <Card>
      <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Plus color={theme.primary} size={20} /> Recepción de Proveedor
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <InputBox label="Proveedor" value="Avícola Sofía" readOnly />
        <InputBox label="Código 104" placeholder="0" />
        <InputBox label="Código 105" placeholder="0" />
        <InputBox label="Código 106" placeholder="0" />
        <button style={{ 
          backgroundColor: theme.primary, color: 'white', border: 'none', padding: '14px', 
          borderRadius: '10px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' 
        }}>
          Registrar Entrada
        </button>
      </div>
    </Card>

    <Card style={{ padding: 0 }}>
      <div style={{ padding: '16px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 'bold' }}>Distribución Sugerida</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
          LISTO PARA ASIGNAR
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>
            <th style={{ padding: '16px 24px' }}>CLIENTE</th>
            <th style={{ padding: '16px 24px' }}>PEDIDO (104)</th>
            <th style={{ padding: '16px 24px' }}>ASIGNADO</th>
            <th style={{ padding: '16px 24px' }}>ESTADO</th>
          </tr>
        </thead>
        <tbody>
          <TableRow client="Pollería El Rey" req={50} asig={50} status="COMPLETO" />
          <TableRow client="Feria Sector A" req={120} asig={100} status="INCOMPLETO" />
          <TableRow client="Súper Pollo" req={30} asig={30} status="COMPLETO" />
        </tbody>
      </table>
    </Card>
  </div>
);

const BasketView = ({ theme }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      <div style={{ 
        backgroundColor: 'white', padding: '40px', borderRadius: '16px', border: '2px dashed #e2e8f0', 
        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' 
      }}>
        <Archive size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
        <div style={{ fontSize: '36px', fontWeight: '900' }}>1,240</div>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', letterSpacing: '1px' }}>EN ALMACÉN FÍSICO</div>
      </div>
      <div style={{ 
        backgroundColor: 'white', padding: '40px', borderRadius: '16px', border: '2px dashed #e2e8f0', 
        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' 
      }}>
        <ArrowRightLeft size={48} color="#fda4af" style={{ marginBottom: '16px' }} />
        <div style={{ fontSize: '36px', fontWeight: '900', color: theme.primary }}>842</div>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', letterSpacing: '1px' }}>DEUDA EN CLIENTES</div>
      </div>
    </div>

    <Card style={{ padding: 0 }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 'bold' }}>Deuda por Cliente</span>
        <button style={{ background: 'none', border: 'none', color: theme.primary, fontWeight: 'bold', cursor: 'pointer' }}>Filtrar Mora</button>
      </div>
      {[
        { name: 'Dona Juana - Ruta Norte', qty: 45 },
        { name: 'Mercado Central Puesto 4', qty: 22 },
        { name: 'Distribuidor Local Sucre', qty: 89 },
      ].map((c, i) => (
        <div key={i} style={{ 
          padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: i === 2 ? 'none' : '1px solid #f8fafc', cursor: 'pointer'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#64748b' }}>{c.name[0]}</div>
            <span style={{ fontWeight: '600' }}>{c.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontWeight: '800', color: theme.primary }}>{c.qty} canastos</span>
            <ChevronRight size={18} color="#cbd5e1" />
          </div>
        </div>
      ))}
    </Card>
  </div>
);

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

export default App;