# KFE POS Web (React súper básico)

## Requisitos
- Node.js instalado
- Tu API Nest corriendo en `http://localhost:3000`

## Configuración
1) Copia el .env:
```bash
cp .env.example .env
```
2) Instala dependencias:
```bash
npm i
```
3) Corre el front:
```bash
npm run dev
```

## Qué hace este frontend
- **Productos**: crear/listar/editar/desactivar (active) y eliminar.
- **Punto de venta**: seleccionar productos + cantidad y crear una venta.
- **Reportes**:
  - Top 3 productos
  - Productos vendidos en rango (tabla)
  - Ventas por producto para gráfica (muestra barras simples)

> Nota: no hay autenticación.
# kfcfront
