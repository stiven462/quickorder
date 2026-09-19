import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { CatalogoPage } from './pages/CatalogoPage';
import { ProductosPage } from './pages/ProductosPage';
import { CategoriasPage } from './pages/CategoriasPage';
import { ClientesPage } from './pages/ClientesPage';
import { EstadosOrdenPage } from './pages/EstadosOrdenPage';
import { UsuariosPage } from './pages/UsuariosPage';
import { InformacionPage } from './pages/InformacionPage';
import { NotFoundPage } from './pages/NotFoundPage';

import { obtenerProductos } from './services/productService';
import { obtenerCategorias } from './services/categoryService';
import { obtenerClientes } from './services/clientService';
import { obtenerEstadosOrden } from './services/orderStatusService';
import { obtenerUsuarios } from './services/userService';
import { obtenerInformacion } from './services/informationService';

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState("Inicio");
  const [carrito, setCarrito] = useState([]);

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [estadosOrden, setEstadosOrden] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [informacion, setInformacion] = useState([]);

  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [cargandoCategorias, setCargandoCategorias] = useState(true);
  const [cargandoClientes, setCargandoClientes] = useState(true);
  const [cargandoEstadosOrden, setCargandoEstadosOrden] = useState(true);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(true);
  const [cargandoInformacion, setCargandoInformacion] = useState(true);

  const navigate = useNavigate();

  const cargarProductos = () => {
    setCargandoProductos(true);
    obtenerProductos()
      .then((data) => {
        setProductos(data);
        setCargandoProductos(false);
      })
      .catch((error) => {
        console.error('Error al obtener los productos:', error);
        setCargandoProductos(false);
      });
  };

  const cargarCategorias = () => {
    setCargandoCategorias(true);
    obtenerCategorias()
      .then((data) => {
        setCategorias(data);
        setCargandoCategorias(false);
      })
      .catch((error) => {
        console.error('Error al obtener las categorías:', error);
        setCargandoCategorias(false);
      });
  };

  const cargarClientes = () => {
    setCargandoClientes(true);
    obtenerClientes()
      .then((data) => {
        setClientes(data);
        setCargandoClientes(false);
      })
      .catch((error) => {
        console.error('Error al obtener los clientes:', error);
        setCargandoClientes(false);
      });
  };

  const cargarEstadosOrden = () => {
    setCargandoEstadosOrden(true);
    obtenerEstadosOrden()
      .then((data) => {
        setEstadosOrden(data);
        setCargandoEstadosOrden(false);
      })
      .catch((error) => {
        console.error('Error al obtener los estados de orden:', error);
        setCargandoEstadosOrden(false);
      });
  };

  const cargarUsuarios = () => {
    setCargandoUsuarios(true);
    obtenerUsuarios()
      .then((data) => {
        setUsuarios(data);
        setCargandoUsuarios(false);
      })
      .catch((error) => {
        console.error('Error al obtener los usuarios:', error);
        setCargandoUsuarios(false);
      });
  };

  const cargarInformacion = () => {
    setCargandoInformacion(true);
    obtenerInformacion()
      .then((data) => {
        setInformacion(data);
        setCargandoInformacion(false);
      })
      .catch((error) => {
        console.error('Error al obtener la información:', error);
        setCargandoInformacion(false);
      });
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
    cargarClientes();
    cargarEstadosOrden();
    cargarUsuarios();
    cargarInformacion();
  }, []);

  const handleAddToCart = (producto) => {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.id === producto.id);
      const stockMaximo = producto.stock !== undefined && producto.stock !== null
        ? Number(producto.stock)
        : Infinity;

      if (existente) {
        if (existente.cantidad >= stockMaximo) return prev;
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }

      if (stockMaximo <= 0) return prev;
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const handleIncrementarCantidad = (id) => {
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const stockMaximo = item.stock !== undefined && item.stock !== null
          ? Number(item.stock)
          : Infinity;
        if (item.cantidad >= stockMaximo) return item;
        return { ...item, cantidad: item.cantidad + 1 };
      })
    );
  };

  const handleDecrementarCantidad = (id) => {
    setCarrito((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item))
        .filter((item) => item.cantidad > 0)
    );
  };

  const handleEliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((item) => item.id !== id));
  };

  const handleVaciarCarrito = () => {
    setCarrito([]);
  };

  const cartCount = carrito.reduce((total, item) => total + item.cantidad, 0);

  const handleSeleccionarCategoriaFooter = (cat) => {
    setCategoriaActiva(cat);
    navigate('/');
  };

  return (
    <div className="app-layout">
      <Header
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        onSelectCategoria={setCategoriaActiva}
        cartCount={cartCount}
        carrito={carrito}
        onIncrementar={handleIncrementarCantidad}
        onDecrementar={handleDecrementarCantidad}
        onEliminarDelCarrito={handleEliminarDelCarrito}
        onVaciarCarrito={handleVaciarCarrito}
      />
      
      <main className="app-container">
        <Routes>
          {/* Ruta del Catálogo Principal */}
          <Route 
            path="/" 
            element={
              <CatalogoPage 
                productos={productos}
                categoriaActiva={categoriaActiva}
                onAddToCart={handleAddToCart}
                cargando={cargandoProductos}
              />
            } 
          />

          {/* Ruta de Gestión de Productos */}
          <Route 
            path="/productos" 
            element={
              <ProductosPage 
                productos={productos}
                categorias={categorias}
                onActualizarProductos={cargarProductos}
                cargando={cargandoProductos}
              />
            } 
          />

          {/* Ruta de Gestión de Categorías */}
          <Route 
            path="/categorias" 
            element={
              <CategoriasPage 
                categorias={categorias}
                onActualizarCategorias={cargarCategorias}
                cargando={cargandoCategorias}
              />
            } 
          />

          {/* Ruta de Gestión de Clientes */}
          <Route 
            path="/clientes" 
            element={
              <ClientesPage 
                clientes={clientes}
                onActualizarClientes={cargarClientes}
                cargando={cargandoClientes}
              />
            } 
          />

          {/* Ruta de Gestión de Estados de Orden */}
          <Route 
            path="/estados-orden" 
            element={
              <EstadosOrdenPage 
                estadosOrden={estadosOrden}
                onActualizarEstadosOrden={cargarEstadosOrden}
                cargando={cargandoEstadosOrden}
              />
            } 
          />

          {/* Ruta de Gestión de Usuarios */}
          <Route 
            path="/usuarios" 
            element={
              <UsuariosPage 
                usuarios={usuarios}
                onActualizarUsuarios={cargarUsuarios}
                cargando={cargandoUsuarios}
              />
            } 
          />

          {/* Ruta de Configuración de Información */}
          <Route 
            path="/informacion" 
            element={
              <InformacionPage 
                informacion={informacion}
                onActualizarInformacion={cargarInformacion}
                cargando={cargandoInformacion}
              />
            } 
          />

          {/* Ruta 404 para cualquier otra URL */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer integrado */}
      <Footer 
        categorias={categorias}
        setCategoriaActiva={handleSeleccionarCategoriaFooter}
      />
    </div>
  );
}

export default App;