import { NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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
   /* return NextResponse.json({
      success: true,
      message: "Reserva recibida correctamente",
      reservaId: `RES-${Date.now()}`, // Generamos un ID único para la reserva
      data: formData,
    })
  } catch (error) {
    console.error("Error al procesar la reserva:", error)
    return NextResponse.json({ success: false, message: "Error al procesar la solicitud" }, { status: 500 })
  }  */

    //integración con OpenIA - Prompt
    const prompt = `Crea un menú saludable y equilibrado basado en los siguientes datos:
Preferencias: ${formData.preferencias}
Cantidad de personas: ${formData.cantidadPersonas}
Frecuencia de consumo: ${formData.tiempo}
Presupuesto: ${formData.presupuesto}

Organiza el menú por día e incluye las siguientes comidas: Desayuno, Almuerzo, Merienda y Cena. Presenta la respuesta únicamente en una tabla HTML bien estructurada, sin ningún texto adicional. Es importante que utilices ingredientes de temporada o de fácil acceso y que las recetas sean de preparación sencilla, evitando técnicas o procesos muy elaborados. El menú debe cumplir con los requerimientos nutricionales establecidos, tanto en términos de macronutrientes como de micronutrientes.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Eres un nutricionista que genera menús personalizados en formato tabla HTML sin ningún texto adicional."
        },
        {
          role: "user",
          content: prompt
        }
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

