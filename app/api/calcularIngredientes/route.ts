import { NextResponse } from "next/server";
import OpenAI from "openai";
import { JSDOM } from "jsdom";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function parseHtmlToJson(menuGeneradoHtml: string): any {
  try {
    const dom = new JSDOM(menuGeneradoHtml);
    const document = dom.window.document;
    const menuItems = document.querySelectorAll(".menu-item");

    const menuJson = Array.from(menuItems).map((item) => {
      const name = item.querySelector(".item-name")?.textContent?.trim() || "";
      const quantity = item.querySelector(".item-quantity")?.textContent?.trim() || "";
      const unit = item.querySelector(".item-unit")?.textContent?.trim() || "";

      return { name, quantity, unit };
    });

    return menuJson;
  } catch (error) {
    console.error("Error parsing HTML to JSON:", error);
    return null;
  }
}

export async function POST(request: Request) {
    try {
      const { cantidadAdultos, cantidadNinos, menuGeneradoHtml } = await request.json();
      const menuGeneradoJson = parseHtmlToJson(menuGeneradoHtml);

      if (!cantidadAdultos || !cantidadNinos || !menuGeneradoJson) {
        
        
        return NextResponse.json(
          { success: false, message: "Faltan datos requeridos (cantidadAdultos, cantidadNinos, menuGeneradoJson)." },
          { status: 400 }
        );
  
      }
      const prompt = `Con base en el siguiente menú en formato JSON:
  ${menuGeneradoJson}
  
  Calcula la cantidad de ingredientes necesarios para preparar este menú considerando:
  - ${cantidadAdultos} adultos
  - ${cantidadNinos} niños
  
  Devuelve la respuesta en formato tabla HTML, donde cada fila sea un ingrediente con las columnas: Nombre del ingrediente, Cantidad necesaria y Unidad de medida. No incluyas texto adicional.`;
  
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Eres un asistente que calcula ingredientes necesarios para un menú basado en la cantidad de personas y el tiempo, devolviendo una tabla HTML bien estructurada.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      });
  
      const ingredientesHtml = completion.choices[0].message.content;
      console.log("Datos recibidos:", { cantidadAdultos, cantidadNinos, menuGeneradoJson });
  
      return NextResponse.json({ success: true, ingredientes: ingredientesHtml});
    } catch (error) {
      console.error("Error al calcular ingredientes:", error);
      return NextResponse.json({ success: false, message: "Error al procesar la solicitud" }, { status: 500 });
    }
  
 }


  


