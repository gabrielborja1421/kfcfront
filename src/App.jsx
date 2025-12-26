import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import POS from './pages/POS.jsx'
import Reports from './pages/Reports.jsx'

export default function App() {
  return (
    <>
      <nav>
        <div className="nav-inner">
          <strong>KFE POS</strong>
          <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Inicio</NavLink>
          <NavLink to="/products" className={({isActive}) => isActive ? 'active' : ''}>Productos</NavLink>
          <NavLink to="/pos" className={({isActive}) => isActive ? 'active' : ''}>Punto de venta</NavLink>
          <NavLink to="/reports" className={({isActive}) => isActive ? 'active' : ''}>Reportes</NavLink>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </>
  )
}
