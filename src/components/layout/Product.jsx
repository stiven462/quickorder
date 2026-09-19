export function Product({ indice, nombre, descripcion, precio, imagen, tag, stock, onAddToCart }) {
    const agotado = stock !== undefined && stock !== null && Number(stock) <= 0;

    return (
        <article className="product-card" key={indice}>
            <div className="product-image-container">
                {tag && <span className="product-tag">{tag}</span>}
                {agotado && (
                    <span className="product-tag" style={{ left: 'auto', right: '12px', backgroundColor: '#dc2626' }}>
                        Agotado
                    </span>
                )}
                {imagen ? (
                    <img src={imagen} alt={nombre} className="product-image" loading="lazy" />
                ) : (
                    <div className="product-image-placeholder">🍔</div>
                )}
            </div>
            <div className="product-content">
                <h3 className="product-title">{nombre}</h3>
                <p className="product-description">{descripcion}</p>
                <div className="product-footer">
                    <div className="price-wrapper">
                        <span className="price-label">Precio</span>
                        <span className="product-price">
                            {typeof precio === 'number'
                                ? `$ ${precio.toLocaleString('es-CO')}`
                                : String(precio || '').startsWith('$')
                                ? precio
                                : `$ ${precio || 0}`}
                        </span>
                    </div>
                    <button
                        className="btn-add-order"
                        onClick={() => !agotado && onAddToCart && onAddToCart({ id: indice, nombre, precio, imagen, stock })}
                        disabled={agotado}
                        style={agotado ? { opacity: 0.6, cursor: 'not-allowed', backgroundColor: '#94a3b8' } : {}}
                    >
                        <span className="btn-plus">{agotado ? '✕' : '+'}</span> {agotado ? 'Agotado' : 'Agregar'}
                    </button>
                </div>
            </div>
        </article>
    );
}