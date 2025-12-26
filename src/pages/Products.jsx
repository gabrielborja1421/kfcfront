import React, { useEffect, useState } from 'react'
import { api } from '../api'

const emptyForm = { name: '', price: 0, active: true }

export default function Products() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  async function load() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/products')
      setItems(data)
    } catch (e) {
      setError(e?.response?.data?.message || 'Error cargando productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  function onChange(key, value) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await api.patch(`/products/${editingId}`, {
          name: form.name,
          price: Number(form.price),
          active: Boolean(form.active),
        })
      } else {
        await api.post('/products', {
          name: form.name,
          price: Number(form.price),
          active: Boolean(form.active),
        })
      }
      setForm(emptyForm)
      setEditingId(null)
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Error guardando producto')
    }
  }

  function startEdit(p) {
    setEditingId(p._id)
    setForm({ name: p.name, price: p.price, active: p.active })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function remove(id) {
    if (!confirm('¿Eliminar producto?')) return
    setError('')
    try {
      await api.delete(`/products/${id}`)
      await load()
    } catch (e) {
      setError(e?.response?.data?.message || 'Error eliminando')
    }
  }

  return (
    <div className="row">
      <div className="card">
        <h1>{editingId ? 'Editar producto' : 'Nuevo producto'}</h1>
        {error ? <p style={{color:'#b00020'}}>{String(error)}</p> : null}

        <form onSubmit={onSubmit}>
          <div style={{marginBottom:12}}>
            <label>Nombre</label>
            <input value={form.name} onChange={e => onChange('name', e.target.value)} placeholder="Ej: Capuccino" />
          </div>

          <div style={{marginBottom:12}}>
            <label>Precio</label>
            <input type="number" value={form.price} onChange={e => onChange('price', e.target.value)} />
          </div>

          <div style={{marginBottom:12}}>
            <label>Estatus</label>
            <select value={String(form.active)} onChange={e => onChange('active', e.target.value === 'true')}>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          <div className="row" style={{alignItems:'center'}}>
            <button type="submit">{editingId ? 'Guardar cambios' : 'Crear'}</button>
            {editingId ? <button type="button" className="secondary" onClick={cancelEdit}>Cancelar</button> : null}
            <button type="button" className="secondary" onClick={load}>Recargar</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h1>Productos</h1>
        {loading ? <p className="small">Cargando...</p> : null}

        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Estatus</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>
                  <span className={`badge ${p.active ? 'ok' : 'off'}`}>
                    {p.active ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{display:'flex', gap:8}}>
                  <button className="secondary" onClick={() => startEdit(p)}>Editar</button>
                  <button className="danger" onClick={() => remove(p._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {!items.length && !loading ? (
              <tr><td colSpan="4" className="small">Sin productos. Crea uno a la izquierda.</td></tr>
            ) : null}
          </tbody>
        </table>

        <p className="small" style={{marginTop:10}}>
          Para ventas, los productos deben estar <b>activos</b>.
        </p>
      </div>
    </div>
  )
}
