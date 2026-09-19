import { useState, useEffect } from 'react';

export function FormularioCliente({ clienteAEditar, onGuardar, onCancelar, guardando }) {
  const initialFormState = {
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
    estado: true
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (clienteAEditar) {
      setFormData({
        nombre: clienteAEditar.nombre || '',
        apellido: clienteAEditar.apellido || '',
        correo: clienteAEditar.correo || '',
        telefono: clienteAEditar.telefono || '',
        direccion: clienteAEditar.direccion || '',
        estado: clienteAEditar.estado !== undefined ? Boolean(clienteAEditar.estado) : true
      });
    } else {
      setFormData(initialFormState);
    }
  }, [clienteAEditar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      alert('Por favor completa al menos el nombre del cliente.');
      return;
    }

    const dataToSend = {
      ...formData,
      estado: Boolean(formData.estado === true || formData.estado === 'true' || formData.estado === 1 || formData.estado === '1')
    };

    onGuardar(dataToSend);
  };

  const esEdicion = Boolean(clienteAEditar);

  return (
    <div className="card-form-container cliente-form-container">
      <div className="form-header">
        <h3 className="form-title">
          {esEdicion ? '✏️ Editar Cliente' : '➕ Registrar Nuevo Cliente'}
        </h3>
        <p className="form-subtitle">
          {esEdicion
            ? 'Modifica los datos del cliente seleccionado'
            : 'Ingresa los datos para registrar un cliente en la base de datos'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-input"
              placeholder="Ej. Juan"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Apellido */}
          <div className="form-group">
            <label htmlFor="apellido" className="form-label">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              className="form-input"
              placeholder="Ej. Pérez"
              value={formData.apellido}
              onChange={handleChange}
            />
          </div>

          {/* Correo */}
          <div className="form-group">
            <label htmlFor="correo" className="form-label">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              className="form-input"
              placeholder="juan.perez@email.com"
              value={formData.correo}
              onChange={handleChange}
            />
          </div>

          {/* Teléfono */}
          <div className="form-group">
            <label htmlFor="telefono" className="form-label">Teléfono</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              className="form-input"
              placeholder="Ej. +57 300 123 4567"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          {/* Dirección */}
          <div className="form-group">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input
              type="text"
              id="direccion"
              name="direccion"
              className="form-input"
              placeholder="Ej. Calle 45 #12-34, Apto 301"
              value={formData.direccion}
              onChange={handleChange}
            />
          </div>

          {/* Estado */}
          <div className="form-group">
            <label htmlFor="estado" className="form-label">Estado</label>
            <select
              id="estado"
              name="estado"
              className="form-input"
              value={String(formData.estado)}
              onChange={handleChange}
            >
              <option value="true">🟢 Activo</option>
              <option value="false">⚪ Inactivo</option>
            </select>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={guardando}>
            {guardando ? 'Guardando...' : esEdicion ? 'Actualizar Cliente' : 'Guardar Cliente'}
          </button>
          
          {esEdicion && (
            <button type="button" className="btn-cancel" onClick={onCancelar} disabled={guardando}>
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
