"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import MenuTable from "@/components/ui/menutable"


function parseHtmlToJson(menuGeneradoHtml: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(menuGeneradoHtml, "text/html");
  const rows = doc.querySelectorAll("tr");
  const result: Array<Record<string, string>> = [];

  rows.forEach((row) => {
    const cells = row.querySelectorAll("td, th");
    const rowData: Record<string, string> = {};

    cells.forEach((cell, index) => {
      rowData[`column${index + 1}`] = cell.textContent?.trim() || "";
    });

    if (Object.keys(rowData).length > 0) {
      result.push(rowData);
    }
  });

  return result;
}
// Definimos la interfaz para los elementos del menú
interface MenuItem {
  id: number
  nombre: string
  descripcion: string
  precio: number
  categoria: string
}

interface ReservaState {
  loading: boolean
  success: boolean
  error: string
  reservaId: string | null
  presupuesto: string
}

export default function Formulario() {
  const [formData, setFormData] = useState({
    tiempo: "",
    preferencias: "",
    restriccionesAlimenticias: "",
  })
  const [formDataIng, setFormDataIng] = useState({
    cantidadAdultos: "",
    cantidadNinos: "",
    menuGeneradoJson: "",
  })


  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [menuGeneradoHtml, setMenuGeneradoHtml] = useState("")
  const [ingredientesHtml, setIngredientesHtml] = useState<string>("")
  const [menuLoading, setMenuLoading] = useState(false)
  const [menuError, setMenuError] = useState("")
  const [reservaState, setReservaState] = useState<ReservaState>({
    loading: false,
    success: false,
    error: "",
    reservaId: null,
    presupuesto: "",
  })
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Fetch menu items
  useEffect(() => {
    const fetchMenu = async () => {
      setMenuLoading(true)
      try {
        const response = await fetch("/api/menu")
        const data = await response.json()
        if (data.success) setMenuItems(data.data)
        else setMenuError("Error al cargar el menú")
      } catch (err) {
        setMenuError("Error de conexión al servidor")
        console.error("Error fetching menu:", err)
      } finally {
        setMenuLoading(false)
      }
    }
    fetchMenu()
  }, [])

  const validateForm = () => {
    if (!formData.tiempo) return "Por favor selecciona un tiempo"
    if (!formData.preferencias) return "Por favor selecciona tus preferencias"
    if (!formData.restriccionesAlimenticias) return "Por favor ingresa tus restricciones alimenticias"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationError = validateForm()
    if (validationError) {
      setReservaState({ ...reservaState, error: validationError, success: false })
      return
    }

    setReservaState({ ...reservaState, loading: true })
    try {
      const response = await fetch("/api/reserva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) {
        setReservaState({ ...reservaState, success: true, reservaId: data.reservaId })
        setShowConfirmation(true)
        setFormData({ tiempo: "", preferencias: "", restriccionesAlimenticias: "", })
      } else {
        setReservaState({ ...reservaState, error: data.message || "Error al procesar la reserva" })
      }
    } catch (err) {
      console.error("Error al enviar la reserva:", err)
      setReservaState({ ...reservaState, error: "Error de conexión al servidor" })
    } finally {
      setReservaState({ ...reservaState, loading: false })
    }
  }

  const handleGenerarMenu = async () => {
    setMenuLoading(true)
    setMenuError("")
    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (data.success) setMenuGeneradoHtml(data.menu)
      else setMenuError(data.message || "No se pudo generar el menú")
    } catch (err) {
      console.error("Error al generar menú:", err)
      setMenuError("Error de conexión con el servidor")
    } finally {
      setMenuLoading(false)
    }
  }
 //funcion para manejar el calculo de ingredientes 
  const handleCalcularIngredientes = async () => {
    if (!formDataIng.cantidadAdultos || !formDataIng.cantidadNinos) {
      alert("Por favor ingresa la cantidad de adultos y niños.");
      return;
    }
  
    try {
      const response = await fetch("/api/calcularIngredientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cantidadAdultos: formDataIng.cantidadAdultos,
          cantidadNinos: formDataIng.cantidadNinos,
          menugeneradoJson: parseHtmlToJson(menuGeneradoHtml),
      
        }),
      });
        

      const data = await response.json();
  
      if (data.success) {
        setIngredientesHtml(data.ingredientesHtml); // Actualizar el estado con la tabla HTML
      } else {
        alert("Error al calcular los ingredientes.");
      }
    } catch (err) {
      console.error("Error al calcular los ingredientes:", err);
      alert("Error de conexión con el servidor.");
    }
  };


  // Agrupar elementos del menú por categoría
  const menuByCategory = menuItems.reduce((acc, item) => {
    acc[item.categoria] = acc[item.categoria] || []
    acc[item.categoria].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)


  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">EasyCook</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {reservaState.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{reservaState.error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="tiempo">Tiempo</Label>
              <Select value={formData.tiempo} onValueChange={(value) => setFormData({ ...formData, tiempo: value })}>
                <SelectTrigger id="tiempo">
                  <SelectValue placeholder="Selecciona el tiempo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="quincenal">Quincenal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferencias">Preferencias</Label>
              <Select value={formData.preferencias} onValueChange={(value) => setFormData({ ...formData, preferencias: value })}>
                <SelectTrigger id="preferencias">
                  <SelectValue placeholder="Selecciona tus preferencias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegano">Vegano</SelectItem>
                  <SelectItem value="vegetariano">Vegetariano</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="restriccionesAlimenticias">Restricciones Alimenticias</Label>
              <Input id="restriccionesAlimenticias" type="string" value={formData.restriccionesAlimenticias} onChange={(e) => setFormData({ ...formData, restriccionesAlimenticias: e.target.value })} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={handleGenerarMenu} disabled={menuLoading}>
              {menuLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando menú...</>) : "Generar Menú Personalizado"}
            </Button>
          </CardFooter>
        </form>
        {menuGeneradoHtml && (
  <div className="mt-6 border rounded-md p-4 bg-background">
    <h2 className="text-lg font-semibold mb-2">Menú personalizado generado:</h2>
    <MenuTable htmlTable={menuGeneradoHtml} />
    <div className="mt-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cantidadAdultos">Cantidad de adultos</Label>
        <Input
          type="number"
          id="cantidadAdultos"
          value={formDataIng.cantidadAdultos}
          onChange={(e) => setFormDataIng({ ...formDataIng, cantidadAdultos: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cantidadNinos">Cantidad de niños</Label>
        <Input
          type="number"
          id="cantidadNinos"
          value={formDataIng.cantidadNinos}
          onChange={(e) => setFormDataIng({ ...formDataIng, cantidadNinos: e.target.value })}
        />
      </div>

      <Button onClick={handleCalcularIngredientes} variant="outline" disabled={menuLoading}>
        {menuLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculando ingredientes...</>) : "Calcular Ingredientes"}
      </Button>

      {ingredientesHtml && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Ingredientes necesarios:</h3>
          <div className="space-y-2">
            <div className="prose" dangerouslySetInnerHTML={{ __html: ingredientesHtml }} />
          </div>
        </div>
      )}
    </div>
  </div>
)}      </Card>
    </div>
  )
  }


