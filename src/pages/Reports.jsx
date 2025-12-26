import React, { useMemo, useState } from 'react'
import { api } from '../api'

export default function Reports() {
  const [from, setFrom] = useState('2025-12-01')
  const [to, setTo] = useState('2025-12-31')

  const [top, setTop] = useState([])
  const [sold, setSold] = useState([])
  const [chart, setChart] = useState([])

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Normaliza respuestas del backend a un formato común para el front
  function normalizeSoldRows(rows) {
    return (rows || []).map(r => ({
      productName: r.productName ?? r.name ?? r.label ?? '---',
      qty: Number(r.qty ?? r.qtySold ?? 0),
      revenue: Number(r.revenue ?? r.value ?? 0),
    }))
  }

  function normalizeTopRows(rows, soldRowsNormalized) {
    // Tu endpoint /top3 NO trae revenue, entonces lo sacamos de sold-products (mismo rango)
    const revenueMap = new Map(
      (soldRowsNormalized || []).map(x => [x.productName, x.revenue])
    )

    return (rows || []).map(r => {
      const productName = r.productName ?? r.name ?? '---'
      const qty = Number(r.qty ?? r.qtySold ?? 0)
      const revenue = Number(r.revenue ?? revenueMap.get(productName) ?? 0)

      return { productName, qty, revenue }
    })
  }

  function normalizeChartRows(rows) {
    // /chart-by-product regresa {label, value}
    return (rows || []).map(r => ({
      productName: r.productName ?? r.name ?? r.label ?? '---',
      qty: Number(r.qty ?? r.qtySold ?? 0), // puede venir vacío aquí, no pasa nada
      revenue: Number(r.revenue ?? r.value ?? 0),
    }))
  }

  async function loadAll() {
    setLoading(true)
    setError('')
    try {
      const [topRes, soldRes, chartRes] = await Promise.all([
        api.get('/reports/top3'),
        api.get('/reports/sold-products', { params: { from, to } }),
        api.get('/reports/chart-by-product', { params: { from, to } }),
      ])

      const soldNormalized = normalizeSoldRows(soldRes.data)
      setSold(soldNormalized)

      setTop(normalizeTopRows(topRes.data, soldNormalized))
      setChart(normalizeChartRows(chartRes.data))

    } catch (e) {
      setError(e?.response?.data?.message || 'Error cargando reportes')
    } finally {
      setLoading(false)
    }
  }

  const maxRevenue = useMemo(() => {
    const revenues = chart.map(x => x.revenue || 0)
    return Math.max(1, ...revenues)
  }, [chart])

  return (
    <div className="row">
      <div className="card">
        <h1>Reportes gerenciales</h1>

        <div className="row">
          <div>
            <label>Desde</label>
            <input type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div>
            <label>Hasta</label>
            <input type="date" value={to} onChange={e => setTo(e.target.value)} />
          </div>
        </div>

        <div className="row" style={{ alignItems: 'center', marginTop: 12 }}>
          <button onClick={loadAll}>Generar reportes</button>
          {loading ? <span className="small">Cargando...</span> : null}
        </div>

        {error ? <p style={{ color: '#b00020' }}>{String(error)}</p> : null}

        <div style={{ marginTop: 12 }} className="small">
          <b>¿Qué significan los números de “gráfica”?</b>
          <ul>
            <li><b>qty</b>: cuántas veces se vendió ese producto en el rango.</li>
            <li><b>revenue</b>: dinero total generado por ese producto en el rango.</li>
            <li>La “barra” representa proporcionalmente el <b>revenue</b>.</li>
          </ul>
        </div>
      </div>

      <div className="card">
        <h2>Top 3 productos</h2>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Ingreso</th>
            </tr>
          </thead>
          <tbody>
            {top.map((x, i) => (
              <tr key={i}>
                <td>{x.productName}</td>
                <td>{x.qty}</td>
                <td>${x.revenue}</td>
              </tr>
            ))}
            {!top.length ? <tr><td colSpan="3" className="small">Genera reportes para ver datos.</td></tr> : null}
          </tbody>
        </table>

        <h2>Productos vendidos en rango</h2>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Ingreso</th>
            </tr>
          </thead>
          <tbody>
            {sold.map((x, i) => (
              <tr key={i}>
                <td>{x.productName}</td>
                <td>{x.qty}</td>
                <td>${x.revenue}</td>
              </tr>
            ))}
            {!sold.length ? <tr><td colSpan="3" className="small">Genera reportes para ver datos.</td></tr> : null}
          </tbody>
        </table>

        <h2>Ventas por producto (barra simple)</h2>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>revenue</th>
              <th style={{ width: 220 }}>Barra</th>
            </tr>
          </thead>
          <tbody>
            {chart.map((x, i) => (
              <tr key={i}>
                <td>{x.productName}</td>
                <td>${x.revenue}</td>
                <td>
                  <div className="bar">
                    <div style={{ width: `${Math.round((x.revenue / maxRevenue) * 100)}%` }} />
                  </div>
                </td>
              </tr>
            ))}
            {!chart.length ? <tr><td colSpan="3" className="small">Genera reportes para ver datos.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
