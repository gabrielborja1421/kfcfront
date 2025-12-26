import React from 'react'

export default function Home() {
  return (
    <div className="card">
      <h1>Bienvenido 👋</h1>
      <p className="small">
        Frontend <b>muy básico</b> para tu API de KFE POS (NestJS + MongoDB).
        La idea es que lo puedas explicar fácil.
      </p>
      <ul className="small">
        <li><b>Productos</b>: alta / listado / edición / eliminar.</li>
        <li><b>Punto de venta</b>: crear ventas seleccionando productos y cantidades.</li>
        <li><b>Reportes</b>: top 3, vendidos en rango y “gráfica” de ventas por producto.</li>
      </ul>
      <p className="small">
        Asegúrate de tener tu API corriendo en <code>http://localhost:3000</code> o cambia <code>VITE_API_URL</code> en el .env.
      </p>
    </div>
  )
}
