import { useEffect } from 'react';
import { createPortal } from 'react-dom';

function formatearPrecio(precio) {
  return typeof precio === 'number'
    ? `$ ${precio.toLocaleString('es-CO')}`
    : String(precio || '').startsWith('$')
    ? precio
    : `$ ${precio || 0}`;
}

export function Carrito({
  carrito = [],
  abierto,
  onCerrar,
  onIncrementar,
  onDecrementar,
  onEliminar,
  onVaciar
}) {
  useEffect(() => {
    if (!abierto) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onCerrar();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [abierto, onCerrar]);

  const total = carrito.reduce((acc, item) => acc + (Number(item.precio) || 0) * item.cantidad, 0);

  const handleRealizarPedido = () => {
    alert('¡Pedido realizado con éxito! Pronto lo estaremos preparando.');
    onVaciar();
    onCerrar();
  };

  return createPortal(
    <>
      <div
        className={`cart-overlay ${abierto ? 'is-open' : ''}`}
        onClick={onCerrar}
        aria-hidden="true"
      />

      <aside className={`cart-drawer ${abierto ? 'is-open' : ''}`}>
        <div className="cart-drawer-header">
          <h3>🛒 Mi Pedido</h3>
          <div className="cart-drawer-header-actions">
            {carrito.length > 0 && (
              <button className="cart-clear-btn" onClick={onVaciar}>
                Vaciar
              </button>
            )}
            <button className="cart-close-btn" onClick={onCerrar} title="Cerrar">
              ✕
            </button>
          </div>
        </div>

        {carrito.length === 0 ? (
          <div className="cart-empty">
            <p>Tu carrito está vacío.</p>
            <span>Agrega productos desde el catálogo.</span>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {carrito.map((item) => (
                <div className="cart-item" key={item.id}>
                  {item.imagen ? (
                    <img src={item.imagen} alt={item.nombre} className="cart-item-img" />
                  ) : (
                    <div className="cart-item-img-placeholder">🍔</div>
                  )}

                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.nombre}</p>
                    <p className="cart-item-price">{formatearPrecio(item.precio)}</p>
                  </div>

                  <div className="cart-item-qty-controls">
                    <button onClick={() => onDecrementar(item.id)}>−</button>
                    <span>{item.cantidad}</span>
                    <button onClick={() => onIncrementar(item.id)}>+</button>
                  </div>

                  <button className="cart-item-remove" onClick={() => onEliminar(item.id)} title="Eliminar">
                    🗑️
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-drawer-footer">
              <div className="cart-total-row">
                <span>Total</span>
                <span className="cart-total-amount">{formatearPrecio(total)}</span>
              </div>
              <button className="btn-checkout" onClick={handleRealizarPedido}>
                Realizar Pedido
              </button>
            </div>
          </>
        )}
      </aside>
    </>,
    document.body
  );
}
