import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const formData = await request.json()

    // Validar que todos los campos requeridos estén presentes
    if (!formData.tiempo || !formData.preferencias || !formData.cantidadPersonas || !formData.presupuesto) {
      return NextResponse.json({ success: false, message: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Validar que la cantidad de personas y el presupuesto sean números válidos
    const cantidadPersonas = Number(formData.cantidadPersonas)
    const presupuesto = Number(formData.presupuesto)

    if (isNaN(cantidadPersonas) || cantidadPersonas <= 0) {
      return NextResponse.json(
        { success: false, message: "La cantidad de personas debe ser un número positivo" },
        { status: 400 },
      )
    }

    if (isNaN(presupuesto) || presupuesto <= 0) {
      return NextResponse.json(
        { success: false, message: "El presupuesto debe ser un número positivo" },
        { status: 400 },
      )
    }

    // Aquí normalmente guardarías los datos en una base de datos
    // Por ahora, simulamos un procesamiento exitoso

    // Simulamos un pequeño retraso como en una API real
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Devolver una respuesta exitosa
    return NextResponse.json({
      success: true,
      message: "Reserva recibida correctamente",
      reservaId: `RES-${Date.now()}`, // Generamos un ID único para la reserva
      data: formData,
    })
  } catch (error) {
    console.error("Error al procesar la reserva:", error)
    return NextResponse.json({ success: false, message: "Error al procesar la solicitud" }, { status: 500 })
  }
}

