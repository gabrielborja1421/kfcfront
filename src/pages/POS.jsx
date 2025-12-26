import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../api'

export default function POS() {
  const [products, setProducts] = useState([])
  const [items, setItems] = useState([]) // { productId, qty }
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadProducts() {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/products')
      setProducts(data.filter(p => p.active))
    } catch (e) {
      setError(e?.response?.data?.message || 'Error cargando productos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProducts() }, [])

  function addRow() {
    if (!products.length) return
    setItems(prev => [...prev, { productId: products[0]._id, qty: 1 }])
  }

  function updateRow(i, patch) {
    setItems(prev => prev.map((r, idx) => idx === i ? { ...r, ...patch } : r))
  }

  function removeRow(i) {
    setItems(prev => prev.filter((_, idx) => idx !== i))
  }

  const preview = useMemo(() => {
    let total = 0
    const rows = items.map(r => {
      const p = products.find(x => x._id === r.productId)
      const unit = p?.price || 0
      const qty = Number(r.qty) || 0
      const subtotal = unit * qty
      total += subtotal
      return { ...r, name: p?.name || '---', unit, subtotal }
    })
    return { rows, total }
  }, [items, products])

  async function createSale() {
    setError('')
    setSuccess('')
    try {
      if (!items.length) {
        setError('Agrega al menos 1 producto.')
        return
      }
      await api.post('/sales', {
        items: items.map(x => ({ productId: x.productId, qty: Number(x.qty) }))
      })
      setSuccess('✅ Venta creada correctamente')
      setItems([])
    } catch (e) {
      setError(e?.response?.data?.message || 'Error creando venta')
    }
  }

  return (
    <div className="card">
      <h1>Punto de venta</h1>
      <p className="small">Selecciona productos activos, pon cantidad y registra la venta.</p>

      {error ? <p style={{color:'#b00020'}}>{String(error)}</p> : null}
      {success ? <p style={{color:'#0a7a0a'}}>{String(success)}</p> : null}
      {loading ? <p className="small">Cargando productos...</p> : null}

      <div className="row" style={{alignItems:'center', marginBottom: 12}}>
        <button type="button" onClick={addRow}>+ Agregar producto</button>
        <button type="button" className="secondary" onClick={loadProducts}>Recargar productos</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {preview.rows.map((r, i) => (
            <tr key={i}>
              <td>
                <select value={r.productId} onChange={e => updateRow(i, { productId: e.target.value })}>
                  {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </td>
              <td>
                <input type="number" min="1" value={r.qty} onChange={e => updateRow(i, { qty: e.target.value })} />
              </td>
              <td>${r.unit}</td>
              <td>${r.subtotal}</td>
              <td><button className="danger" onClick={() => removeRow(i)}>Quitar</button></td>
            </tr>
          ))}
          {!preview.rows.length ? (
            <tr><td colSpan="5" className="small">Sin items. Da clic en “Agregar producto”.</td></tr>
          ) : null}
        </tbody>
      </table>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 12}}>
        <strong>Total: ${preview.total}</strong>
        <button onClick={createSale}>Registrar venta</button>
      </div>
    </div>
  )
}
