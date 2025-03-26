import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/*const menuItems = [
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
]*/

// GET: menú de ejemplo
/*export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    success: true,
    data: menuItems,
  })
}*/

// POST: menú generado por IA
export async function POST(request: Request) {
  try {
    const formData = await request.json()

    if (!formData.tiempo || !formData.preferencias || !formData.cantidadPersonas || !formData.restriccionesAlimenticias) {
      return NextResponse.json({ success: false, message: "Todos los campos son requeridos" }, { status: 400 })
    }

    const cantidadPersonas = Number(formData.cantidadPersonas)
    //const presupuesto = Number(formData.presupuesto)

    if (isNaN(cantidadPersonas) || cantidadPersonas <= 0) {
      return NextResponse.json(
        { success: false, message: "La cantidad de personas debe ser un número positivo" },
        { status: 400 }
      )
    }

    /*
    if (isNaN(presupuesto) || presupuesto <= 0) {
      return NextResponse.json(
        { success: false, message: "El presupuesto debe ser un número positivo" },
        { status: 400 }
      )
    } */

    const prompt = `Crea un menú saludable y equilibrado basado en los siguientes datos:
Preferencias: ${formData.preferencias}
Cantidad de personas: ${formData.cantidadPersonas}
Restricciones Alimenticias: ${formData.restriccionesAlimenticias}
Frecuencia de consumo: ${formData.tiempo}

Organiza el menú por día e incluye las siguientes comidas: Desayuno, Almuerzo, Merienda y Cena. Presenta la respuesta únicamente en una tabla HTML bien estructurada, sin ningún texto adicional. Es importante que utilices ingredientes de temporada o de fácil acceso y que las recetas sean de preparación sencilla, evitando técnicas o procesos muy elaborados. El menú debe cumplir con los requerimientos nutricionales establecidos, tanto en términos de macronutrientes como de micronutrientes.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Eres un nutricionista que genera menús personalizados en formato tabla HTML sin ningún texto adicional.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    })

    const menuGenerado = completion.choices[0].message.content

    return NextResponse.json({ success: true, menu: menuGenerado })
  } catch (error) {
    console.error("Error al generar el menú:", error)
    return NextResponse.json({ success: false, message: "Error al procesar la solicitud" }, { status: 500 })
  }
}
