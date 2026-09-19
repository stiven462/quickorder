import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu } from './Menu';
import { Carrito } from './Carrito';

export function Header({
  categorias = [],
  categoriaActiva,
  onSelectCategoria,
  cartCount = 0,
  carrito = [],
  onIncrementar,
  onDecrementar,
  onEliminarDelCarrito,
  onVaciarCarrito
}) {
  const location = useLocation();
  const esCatalogo = location.pathname === '/';
  const [carritoAbierto, setCarritoAbierto] = useState(false);

  return (
    <header className="header-navbar">
      <div className="header-inner">
        {/* Brand / Logo con Link a la ruta raíz */}
        <Link to="/" className="header-brand" style={{ textDecoration: 'none' }}>
          <div className="brand-logo">⚡</div>
          <span className="brand-name">Quick<span className="brand-highlight">Order</span></span>
        </Link>
        
        {/* Nav de categorías sólo en la página de catálogo */}
        {esCatalogo ? (
          <Menu categorias={categorias} onSelectCategoria={onSelectCategoria} categoriaActiva={categoriaActiva} />
        ) : (
          <div className="view-title-nav">
            <span className="view-badge">Modo Administración</span>
          </div>
        )}

        {/* Navegación condicional según la vista actual */}
        <div className="header-actions" style={{ gap: '12px' }}>
          <div className="view-nav">
            {esCatalogo ? (
              <>
                <NavLink 
                  to="/" 
                  end
                  className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
                  style={{ textDecoration: 'none' }}
                >
                  🛍️ Catálogo
                </NavLink>
                <NavLink 
                  to="/productos" 
                  className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
                  style={{ textDecoration: 'none' }}
                >
                  ⚙️ Admin
                </NavLink>
              </>
            ) : (
              <>
                <NavLink 
                  to="/" 
                  end
                  className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
                  style={{ textDecoration: 'none' }}
                >
                  🛍️ Catálogo
                </NavLink>
                <NavLink 
                  to="/productos" 
                  className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
                  style={{ textDecoration: 'none' }}
                >
                  ⚙️ Productos
                </NavLink>
                <NavLink 
                  to="/categorias" 
                  className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
                  style={{ textDecoration: 'none' }}
                >
                  📂 Categorías
                </NavLink>
                <NavLink 
                  to="/clientes" 
                  className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
                  style={{ textDecoration: 'none' }}
                >
                  👥 Clientes
                </NavLink>
                <NavLink 
                  to="/estados-orden" 
                  className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
                  style={{ textDecoration: 'none' }}
                >
                  📦 Estados Orden
                </NavLink>
                <NavLink 
                  to="/usuarios" 
                  className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
                  style={{ textDecoration: 'none' }}
                >
                  👤 Usuarios
                </NavLink>
                <NavLink 
                  to="/informacion" 
                  className={({ isActive }) => `view-btn ${isActive ? "active" : ""}`}
                  style={{ textDecoration: 'none' }}
                >
                  ℹ️ Información
                </NavLink>
              </>
            )}
          </div>

          {esCatalogo && (
            <div className="cart-wrapper">
              <button className="cart-button" onClick={() => setCarritoAbierto((prev) => !prev)}>
                <span className="cart-icon">🛒</span>
                <span className="cart-label">Mi Pedido</span>
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>

              <Carrito
                carrito={carrito}
                abierto={carritoAbierto}
                onCerrar={() => setCarritoAbierto(false)}
                onIncrementar={onIncrementar}
                onDecrementar={onDecrementar}
                onEliminar={onEliminarDelCarrito}
                onVaciar={onVaciarCarrito}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}