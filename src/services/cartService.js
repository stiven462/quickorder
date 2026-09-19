const API_URL = 'https://6aadaa6fa2413bf0ec11b9ec.mockapi.io/orden';

export const obtenerCarrito = () => {
  return [];
};

export const guardarCarrito = () => {
  return;
};

const normalizarIdProducto = (producto) => {
  if (!producto) return null;
  return producto.id ?? producto.nombre ?? null;
};

export const agregarAlCarrito = (carrito = [], producto) => {
  if (!producto) return carrito;

  const productoId = normalizarIdProducto(producto);
  if (!productoId) return carrito;

  const carritoActualizado = [...carrito];
  const indice = carritoActualizado.findIndex(
    (item) => (item.id ?? item.nombre) === productoId
  );

  if (indice >= 0) {
    carritoActualizado[indice] = {
      ...carritoActualizado[indice],
      cantidad: Number(carritoActualizado[indice].cantidad || 0) + 1,
    };
    return carritoActualizado;
  }

  carritoActualizado.push({
    id: productoId,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: Number(producto.precio) || 0,
    imagen: producto.imagen || '',
    categoria: producto.categoria || '',
    stock: producto.stock ?? 0,
    cantidad: 1,
  });

  return carritoActualizado;
};

export const eliminarDelCarrito = (carrito = [], productoId) => {
  return carrito.filter((item) => (item.id ?? item.nombre) !== productoId);
};

export const actualizarCantidadProducto = (carrito = [], productoId, cantidad) => {
  const cantidadNumerica = Number(cantidad);

  if (Number.isNaN(cantidadNumerica) || cantidadNumerica <= 0) {
    return eliminarDelCarrito(carrito, productoId);
  }

  return carrito.map((item) => {
    if ((item.id ?? item.nombre) === productoId) {
      return { ...item, cantidad: cantidadNumerica };
    }
    return item;
  });
};

export const vaciarCarrito = () => {
  return [];
};

export const obtenerTotalCarrito = (carrito = []) => {
  return carrito.reduce((total, item) => total + Number(item.cantidad || 0), 0);
};

export const calcularSubtotalCarrito = (carrito = []) => {
  return carrito.reduce((subtotal, item) => {
    const precio = Number(item.precio || 0);
    const cantidad = Number(item.cantidad || 0);
    return subtotal + precio * cantidad;
  }, 0);
};

export const obtenerOrdenes = () => {
  return fetch(API_URL)
    .then((response) => response.json());
};

export const crearOrden = async (orden = {}) => {
  const payload = {
    clienteId: orden.clienteId ?? '',
    nombreCliente: orden.nombreCliente ?? 'Cliente',
    productos: Array.isArray(orden.productos) ? orden.productos : [],
    estado: orden.estado ?? 'Pendiente',
    total: Number(orden.total ?? 0),
    fecha: orden.fecha ?? new Date().toISOString(),
    observaciones: orden.observaciones ?? '',
    createdAt: new Date().toISOString(),
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('No se pudo registrar la orden en MockAPI');
  }

  return response.json();
};

export const confirmarCarrito = async (carrito = [], cliente = {}) => {
  if (!Array.isArray(carrito) || carrito.length === 0) {
    throw new Error('El carrito está vacío');
  }

  const ordenPayload = {
    clienteId: cliente.id ?? cliente.clienteId ?? '',
    nombreCliente: cliente.nombre ?? cliente.nombreCliente ?? 'Cliente',
    productos: carrito.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      descripcion: item.descripcion,
      precio: Number(item.precio || 0),
      cantidad: Number(item.cantidad || 0),
      imagen: item.imagen || '',
    })),
    total: calcularSubtotalCarrito(carrito),
    estado: 'Pendiente',
    fecha: new Date().toISOString(),
  };

  const ordenCreada = await crearOrden(ordenPayload);
  vaciarCarrito();

  return ordenCreada;
};
