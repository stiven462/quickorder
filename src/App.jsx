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
import {
  agregarAlCarrito,
  actualizarCantidadProducto,
  calcularSubtotalCarrito,
  confirmarCarrito,
  eliminarDelCarrito,
  obtenerTotalCarrito,
} from './services/cartService';

function App() {
  const [categoriaActiva, setCategoriaActiva] = useState("Inicio");
  const [carrito, setCarrito] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  useEffect(() => {
    setCartCount(obtenerTotalCarrito(carrito));
  }, [carrito]);

  const handleAddToCart = (producto) => {
    setCarrito((prev) => agregarAlCarrito(prev, producto));
    setIsCartOpen(true);
  };

  const handleSeleccionarCategoriaFooter = (cat) => {
    setCategoriaActiva(cat);
    navigate('/');
  };

  const subtotal = calcularSubtotalCarrito(carrito);

  const handleActualizarCantidad = (productoId, cantidad) => {
    setCarrito((prev) => actualizarCantidadProducto(prev, productoId, cantidad));
  };

  const handleEliminarProducto = (productoId) => {
    setCarrito((prev) => eliminarDelCarrito(prev, productoId));
  };

  const handleConfirmarPedido = async () => {
    try {
      await confirmarCarrito(carrito, { nombre: 'Cliente' });
      setCarrito([]);
      setIsCartOpen(false);
      alert('Pedido confirmado correctamente.');
    } catch (error) {
      alert(error.message || 'No se pudo confirmar el pedido.');
    }
  };

  return (
    <div className="app-layout">
      <Header 
        categorias={categorias}
        categoriaActiva={categoriaActiva} 
        onSelectCategoria={setCategoriaActiva}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <aside className="cart-panel" onClick={(event) => event.stopPropagation()}>
            <div className="cart-panel-header">
              <div>
                <span className="cart-panel-label">Mi pedido</span>
                <h3>Carrito</h3>
              </div>
              <button type="button" className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
                ✕
              </button>
            </div>

            {carrito.length === 0 ? (
              <div className="cart-empty-state">
                <p>Tu carrito está vacío.</p>
                <span>Agrega productos para continuar.</span>
              </div>
            ) : (
              <>
                <div className="cart-items-list">
                  {carrito.map((item) => (
                    <div key={item.id ?? item.nombre} className="cart-item">
                      <div className="cart-item-image">
                        {item.imagen ? <img src={item.imagen} alt={item.nombre} /> : <span>🍔</span>}
                      </div>

                      <div className="cart-item-info">
                        <h4>{item.nombre}</h4>
                        <p>$ {Number(item.precio || 0).toLocaleString('es-CO')}</p>
                        <div className="cart-item-controls">
                          <button type="button" onClick={() => handleActualizarCantidad(item.id ?? item.nombre, Number(item.cantidad || 1) - 1)}>-</button>
                          <span>{item.cantidad}</span>
                          <button type="button" onClick={() => handleActualizarCantidad(item.id ?? item.nombre, Number(item.cantidad || 1) + 1)}>+</button>
                        </div>
                      </div>

                      <button type="button" className="cart-item-remove" onClick={() => handleEliminarProducto(item.id ?? item.nombre)}>
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>$ {subtotal.toLocaleString('es-CO')}</strong>
                  </div>
                  <button type="button" className="cart-confirm-btn" onClick={handleConfirmarPedido}>
                    Confirmar pedido
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
      
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