-- Script SQL para el sistema de distribuidora Bolivia
-- Base de datos: distribuidora_bolivia
-- Motor: MySQL

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS distribuidora_bolivia;
USE distribuidora_bolivia;

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL UNIQUE,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'manager', 'driver', 'warehouse') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Categorías de Productos
CREATE TABLE categorias_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Proveedores
CREATE TABLE proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    categoria_producto_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_producto_id) REFERENCES categorias_productos(id) ON DELETE SET NULL
);

-- Tabla de Productos
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria_id INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias_productos(id) ON DELETE CASCADE
);

-- Tabla de Grupos de Clientes
CREATE TABLE grupos_clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ruta VARCHAR(100),
    grupo_id INT,
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (grupo_id) REFERENCES grupos_clientes(id) ON DELETE SET NULL
);

-- Tabla de Vehículos
CREATE TABLE vehiculos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    placa VARCHAR(20) NOT NULL UNIQUE,
    monnet VARCHAR(20),
    estado ENUM('Activo', 'Mantenimiento', 'Inactivo') DEFAULT 'Activo',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Tipos de Contenedores
CREATE TABLE tipos_contenedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Contenedores (Baskets/Containers)
CREATE TABLE contenedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo_id INT NOT NULL,
    capacidad INT NOT NULL,
    estado ENUM('Disponible', 'En uso', 'Dañado') DEFAULT 'Disponible',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_id) REFERENCES tipos_contenedores(id) ON DELETE CASCADE
);

-- Tabla de Almacenes (Warehouses)
CREATE TABLE almacenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Movimientos de Contenedores
CREATE TABLE movimientos_contenedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contenedor_id INT NOT NULL,
    cliente_id INT,
    almacen_id INT NOT NULL,
    tipo_movimiento ENUM('Entrada', 'Salida', 'Devolución', 'Ajuste') NOT NULL,
    cantidad INT NOT NULL,
    fecha DATE NOT NULL,
    saldo_cliente INT DEFAULT 0,
    saldo_almacen INT DEFAULT 0,
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contenedor_id) REFERENCES contenedores(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE SET NULL,
    FOREIGN KEY (almacen_id) REFERENCES almacenes(id) ON DELETE CASCADE
);

-- Tabla de Solicitudes de Clientes
CREATE TABLE solicitudes_clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad_solicitada INT NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM('Pendiente', 'Aprobado', 'Rechazado', 'Completado') DEFAULT 'Pendiente',
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Tabla de Asignaciones (Compras a Proveedores)
CREATE TABLE asignaciones_proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad_asignada INT NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM('Pendiente', 'Recibido', 'Cancelado') DEFAULT 'Pendiente',
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Tabla de Distribución (Asignación de compras a solicitudes)
CREATE TABLE distribuciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id INT NOT NULL,
    asignacion_id INT NOT NULL,
    cantidad_distribuida INT NOT NULL,
    fecha DATE NOT NULL,
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes_clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (asignacion_id) REFERENCES asignaciones_proveedores(id) ON DELETE CASCADE
);

-- Tabla de Asignaciones de Entregas (Delivery Assignments)
CREATE TABLE asignaciones_entregas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    conductor_id INT NOT NULL,
    ruta VARCHAR(100),
    fecha DATE NOT NULL,
    estado ENUM('Pendiente', 'En ruta', 'Completada', 'Cancelada') DEFAULT 'Pendiente',
    notas TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE,
    FOREIGN KEY (conductor_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de Detalles de Asignaciones de Entregas
CREATE TABLE detalles_asignaciones_entregas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asignacion_entrega_id INT NOT NULL,
    cliente_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad_asignada INT NOT NULL,
    cantidad_entregada INT DEFAULT 0,
    precio_unitario DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    FOREIGN KEY (asignacion_entrega_id) REFERENCES asignaciones_entregas(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Tabla de Logs de Ubicación GPS (Vehicle Tracking)
CREATE TABLE logs_ubicacion_gps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id INT NOT NULL,
    latitud DECIMAL(10,8) NOT NULL,
    longitud DECIMAL(11,8) NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    velocidad DECIMAL(5,2),
    estado ENUM('En ruta', 'Entregando', 'Retornando', 'Detenido') DEFAULT 'En ruta',
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
);

-- Tabla de Planes de Entrega (Delivery Plans)
CREATE TABLE planes_entrega (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asignacion_entrega_id INT NOT NULL,
    cliente_id INT NOT NULL,
    orden INT NOT NULL,
    hora_estimada TIME,
    distancia_km DECIMAL(5,2),
    tiempo_estimado_min INT,
    notas TEXT,
    FOREIGN KEY (asignacion_entrega_id) REFERENCES asignaciones_entregas(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Tabla de Logs de Entregas (Delivery Logs)
CREATE TABLE logs_entregas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asignacion_entrega_id INT NOT NULL,
    cliente_id INT NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Iniciada', 'Completada', 'Fallida', 'Reintentada') NOT NULL,
    notas TEXT,
    FOREIGN KEY (asignacion_entrega_id) REFERENCES asignaciones_entregas(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Índices para optimización
CREATE INDEX idx_proveedores_categoria ON proveedores(categoria_producto_id);
CREATE INDEX idx_productos_categoria ON productos(categoria_id);
CREATE INDEX idx_clientes_grupo ON clientes(grupo_id);
CREATE INDEX idx_movimientos_contenedores_contenedor ON movimientos_contenedores(contenedor_id);
CREATE INDEX idx_movimientos_contenedores_cliente ON movimientos_contenedores(cliente_id);
CREATE INDEX idx_movimientos_contenedores_almacen ON movimientos_contenedores(almacen_id);
CREATE INDEX idx_movimientos_contenedores_fecha ON movimientos_contenedores(fecha);
CREATE INDEX idx_solicitudes_clientes_cliente ON solicitudes_clientes(cliente_id);
CREATE INDEX idx_solicitudes_clientes_producto ON solicitudes_clientes(producto_id);
CREATE INDEX idx_solicitudes_clientes_fecha ON solicitudes_clientes(fecha);
CREATE INDEX idx_asignaciones_proveedores_proveedor ON asignaciones_proveedores(proveedor_id);
CREATE INDEX idx_asignaciones_proveedores_producto ON asignaciones_proveedores(producto_id);
CREATE INDEX idx_asignaciones_proveedores_fecha ON asignaciones_proveedores(fecha);
CREATE INDEX idx_distribuciones_solicitud ON distribuciones(solicitud_id);
CREATE INDEX idx_distribuciones_asignacion ON distribuciones(asignacion_id);
CREATE INDEX idx_asignaciones_entregas_vehiculo ON asignaciones_entregas(vehiculo_id);
CREATE INDEX idx_asignaciones_entregas_conductor ON asignaciones_entregas(conductor_id);
CREATE INDEX idx_asignaciones_entregas_fecha ON asignaciones_entregas(fecha);
CREATE INDEX idx_detalles_asignaciones_entregas_asignacion ON detalles_asignaciones_entregas(asignacion_entrega_id);
CREATE INDEX idx_detalles_asignaciones_entregas_cliente ON detalles_asignaciones_entregas(cliente_id);
CREATE INDEX idx_detalles_asignaciones_entregas_producto ON detalles_asignaciones_entregas(producto_id);
CREATE INDEX idx_logs_ubicacion_gps_vehiculo ON logs_ubicacion_gps(vehiculo_id);
CREATE INDEX idx_logs_ubicacion_gps_fecha_hora ON logs_ubicacion_gps(fecha_hora);
CREATE INDEX idx_planes_entrega_asignacion ON planes_entrega(asignacion_entrega_id);
CREATE INDEX idx_planes_entrega_cliente ON planes_entrega(cliente_id);
CREATE INDEX idx_logs_entregas_asignacion ON logs_entregas(asignacion_entrega_id);
CREATE INDEX idx_logs_entregas_cliente ON logs_entregas(cliente_id);
CREATE INDEX idx_logs_entregas_fecha_hora ON logs_entregas(fecha_hora);

-- Datos de ejemplo para categorías de productos
INSERT INTO categorias_productos (nombre) VALUES
('POLLO SOFIA'),
('POLLO AVC'),
('OTROS SOFIA'),
('OTROS AVC'),
('PROCESADOS'),
('HUEVO'),
('CERDO'),
('POLLO CONGELADO');

-- Datos de ejemplo para productos (solo algunos)
INSERT INTO productos (nombre, categoria_id) VALUES
('104', 1),
('105', 1),
('cinta', 2),
('verde', 2),
('pechuga', 3),
('filete de Pollo', 3),
('chorizo', 5),
('salchicha bonnisima', 5),
('extracto', 6),
('primera', 6),
('cerdo entero', 7),
('chuletas de cerdo', 7),
('500117', 8);

-- Datos de ejemplo para tipos de contenedores
INSERT INTO tipos_contenedores (nombre, descripcion) VALUES
('Canasto', 'Contenedor tipo canasto para productos'),
('Caja', 'Contenedor tipo caja para productos'),
('Bolsa', 'Contenedor tipo bolsa para productos');

-- Datos de ejemplo para contenedores (solo algunos)
INSERT INTO contenedores (tipo_id, capacidad) VALUES
(1, 50), -- Canasto de 50 unidades
(1, 100), -- Canasto de 100 unidades
(2, 25), -- Caja de 25 unidades
(2, 50); -- Caja de 50 unidades