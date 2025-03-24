import { NextResponse } from "next/server"

// Datos de ejemplo para el menú
const menuItems = [
  {
    id: 1,
    nombre: "Entrada de Ensalada César",
    descripcion: "Lechuga romana fresca con aderezo César, crutones y queso parmesano",
    precio: 8.99,
    categoria: "Entradas",
  },
  {
    id: 2,
    nombre: "Pasta Alfredo",
    descripcion: "Fettuccine con salsa cremosa de queso parmesano y mantequilla",
    precio: 14.99,
    categoria: "Platos Principales",
  },
  {
    id: 3,
    nombre: "Filete de Salmón",
    descripcion: "Salmón a la parrilla con salsa de limón y hierbas, acompañado de vegetales",
    precio: 18.99,
    categoria: "Platos Principales",
  },
  {
    id: 4,
    nombre: "Tiramisú",
    descripcion: "Postre italiano clásico con capas de bizcocho empapado en café y crema de mascarpone",
    precio: 7.99,
    categoria: "Postres",
  },
  {
    id: 5,
    nombre: "Limonada Casera",
    descripcion: "Refrescante limonada preparada con limones frescos y un toque de menta",
    precio: 3.99,
    categoria: "Bebidas",
  },
]

export async function GET() {
  // Simulamos un pequeño retraso como en una API real
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    data: menuItems,
  })
}