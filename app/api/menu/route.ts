import { NextResponse } from "next/server"
import OpenAI from "openai"
import { JSDOM } from "jsdom"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// POST: menú generado por IA
export async function POST(request: Request) {
  try {
    const formData = await request.json();

    if (!formData.tiempo || !formData.preferencias || !formData.restriccionesAlimenticias) {
      return NextResponse.json({ success: false, message: "Todos los campos son requeridos" }, { status: 400 });
    }

    const prompt = `Crea un menú saludable y equilibrado basado en los siguientes datos:
Preferencias: ${formData.preferencias}
Restricciones Alimenticias: ${formData.restriccionesAlimenticias}
Frecuencia de consumo: ${formData.tiempo}

Organiza el menú por día e incluye las siguientes comidas: Desayuno, Almuerzo, Merienda y Cena. Presenta la respuesta únicamente en una tabla HTML bien estructurada, sin ningún texto adicional. Es importante que utilices ingredientes de temporada o de fácil acceso y que las recetas sean de preparación sencilla, evitando técnicas o procesos muy elaborados. El menú debe cumplir con los requerimientos nutricionales establecidos, tanto en términos de macronutrientes como de micronutrientes.`;

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
    });

    const menuGeneradoHtml = completion.choices[0]?.message?.content;

    if (!menuGeneradoHtml || typeof menuGeneradoHtml !== "string") {
      return NextResponse.json(
        { success: false, message: "No se pudo generar el menú en formato HTML." },
        { status: 500 }
      );
    }


    return NextResponse.json({ success: true, menu: menuGeneradoHtml });
  } catch (error) {
    console.error("Error al calcular ingredientes:", error);
    return NextResponse.json({ success: false, message: "Error al procesar la solicitud" }, { status: 500 });
  }
}





