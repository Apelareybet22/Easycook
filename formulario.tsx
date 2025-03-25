"use client"

import type React from "react"

import MenuTable from "@/components/ui/menutable"

/*
export default function ResultadoMenu({ resultado }: { resultado: string }) {
  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-bold mb-4">Menú generado</h1>
      <MenuTable htmlTable={resultado} />
    </div>
  )
} */

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// Definimos la interfaz para los elementos del menú
interface MenuItem {
  id: number
  nombre: string
  descripcion: string
  precio: number
  categoria: string
}

// Interfaz para el estado de la reserva
interface ReservaState {
  loading: boolean
  success: boolean
  error: string
  reservaId: string | null
}

export default function Formulario() {
  const [formData, setFormData] = useState({
    tiempo: "",
    preferencias: "",
    cantidadPersonas: "",
    presupuesto: "",
  })  

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [menuGeneradoHtml, setMenuGeneradoHtml] = useState("")
  const [menuLoading, setMenuLoading] = useState(false)
  const [menuError, setMenuError] = useState("")

  // Estado para manejar el proceso de reserva
  const [reservaState, setReservaState] = useState<ReservaState>({
    loading: false,
    success: false,
    error: "",
    reservaId: null,
  })

  // Estado para el diálogo de confirmación
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Función para obtener el menú desde la API
  const fetchMenu = async () => {
    setMenuLoading(true)
    setMenuError("")

    try {
      const response = await fetch("/api/menu")
      const data = await response.json()

      if (data.success) {
        setMenuItems(data.data)
      } else {
        setMenuError("Error al cargar el menú")
      }
    } catch (err) {
      setMenuError("Error de conexión al servidor")
      console.error("Error fetching menu:", err)
    } finally {
      setMenuLoading(false)
    }
  }

  // Cargar el menú cuando se monte el componente
  useEffect(() => {
    fetchMenu()
  }, [])

  // Función para validar el formulario
  const validateForm = () => {
    if (!formData.tiempo) return "Por favor selecciona un tiempo"
    if (!formData.preferencias) return "Por favor selecciona tus preferencias"
    if (!formData.cantidadPersonas) return "Por favor ingresa la cantidad de personas"
    if (Number(formData.cantidadPersonas) <= 0) return "La cantidad de personas debe ser mayor a 0"
    if (!formData.presupuesto) return "Por favor ingresa tu presupuesto"
    if (Number(formData.presupuesto) <= 0) return "El presupuesto debe ser mayor a 0"
    return null
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar el formulario
    const validationError = validateForm()
    if (validationError) {
      setReservaState({
        ...reservaState,
        error: validationError,
        success: false,
      })
      return
    }

    // Iniciar el proceso de envío
    setReservaState({
      loading: true,
      success: false,
      error: "",
      reservaId: null,
    })

    try {
      const response = await fetch("/api/reserva", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // Éxito en la reserva
        setReservaState({
          loading: false,
          success: true,
          error: "",
          reservaId: data.reservaId,
        })
        setShowConfirmation(true)

        // Limpiar el formulario después de una reserva exitosa
        setFormData({
          tiempo: "",
          preferencias: "",
          cantidadPersonas: "",
          presupuesto: "",
        })
      } else {
        // Error en la reserva
        setReservaState({
          loading: false,
          success: false,
          error: data.message || "Error al procesar la reserva",
          reservaId: null,
        })
      }
    } catch (err) {
      console.error("Error al enviar la reserva:", err)
      setReservaState({
        loading: false,
        success: false,
        error: "Error de conexión al servidor",
        reservaId: null,
      })
    }
  }

  //added
  const handleGenerarMenu = async () => {
    setMenuLoading(true)
    setMenuError("")
    setMenuGeneradoHtml("")
  
    try {
      const response = await fetch("/api/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
  
      const data = await response.json()
  
      if (data.success) {
        setMenuGeneradoHtml(data.menu)
      } else {
        setMenuError(data.message || "No se pudo generar el menú")
      }
    } catch (err) {
      console.error("Error al generar menú:", err)
      setMenuError("Error de conexión con el servidor")
    } finally {
      setMenuLoading(false)
    }
  }
  

  // Función para cerrar el diálogo de confirmación
  const handleCloseConfirmation = () => {
    setShowConfirmation(false)
  }

  // Agrupar los elementos del menú por categoría
  const menuByCategory = menuItems.reduce(
    (acc, item) => {
      if (!acc[item.categoria]) {
        acc[item.categoria] = []
      }
      acc[item.categoria].push(item)
      return acc
    },
    {} as Record<string, MenuItem[]>,
  )

  // Obtener las categorías únicas
  const categories = Object.keys(menuByCategory)

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs defaultValue="formulario" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="formulario">Formulario de Reserva</TabsTrigger>
          <TabsTrigger value="menu">Menú</TabsTrigger>
        </TabsList>

        <TabsContent value="formulario">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Formulario de Reserva</CardTitle>
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
                  <Select
                    value={formData.tiempo}
                    onValueChange={(value) => setFormData({ ...formData, tiempo: value })}
                  >
                    <SelectTrigger id="tiempo">
                      <SelectValue placeholder="Selecciona el tiempo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manana">Diario</SelectItem>
                      <SelectItem value="tarde">Semanal</SelectItem>
                      <SelectItem value="noche">Quincenal</SelectItem>
                      <SelectItem value="todo-el-dia">Mensual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferencias">Preferencias</Label>
                  <Select
                    value={formData.preferencias}
                    onValueChange={(value) => setFormData({ ...formData, preferencias: value })}
                  >
                    <SelectTrigger id="preferencias">
                      <SelectValue placeholder="Selecciona tus preferencias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="interior">Vegano</SelectItem>
                      <SelectItem value="exterior">Vegetariano</SelectItem>
                      <SelectItem value="terraza">Keto</SelectItem>
                      <SelectItem value="privado">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cantidadPersonas">Cantidad de personas</Label>
                  <Input
                    id="cantidadPersonas"
                    type="number"
                    placeholder="Ingresa el número de personas"
                    value={formData.cantidadPersonas}
                    onChange={(e) => setFormData({ ...formData, cantidadPersonas: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="presupuesto">Presupuesto</Label>
                  <Input
                    id="presupuesto"
                    type="number"
                    placeholder="Ingresa tu presupuesto"
                    value={formData.presupuesto}
                    onChange={(e) => setFormData({ ...formData, presupuesto: e.target.value })}
                  />
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
  <Button type="submit" className="w-full sm:w-auto" disabled={reservaState.loading}>
    {reservaState.loading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Procesando...
      </>
    ) : (
      "Enviar Reserva"
    )}
  </Button>

  <Button
    type="button"
    variant="outline"
    className="w-full sm:w-auto"
    onClick={handleGenerarMenu}
    disabled={menuLoading}
  >
    {menuLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Generando menú...
      </>
    ) : (
      "Generar Menú Personalizado"
    )}
  </Button>
</CardFooter>             
            </form>
            {menuGeneradoHtml && (
  <div className="mt-6 border rounded-md p-4 bg-background">
    <h2 className="text-lg font-semibold mb-2">Menú personalizado generado:</h2>
    <MenuTable htmlTable={menuGeneradoHtml} />
  </div>
)}
          </Card>
        </TabsContent>

        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Nuestro Menú</CardTitle>
            </CardHeader>
            <CardContent>
              {menuLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Cargando menú...</span>
                </div>
              ) : menuError ? (
                <div className="text-center py-10 text-red-500">
                  {menuError}
                  <Button variant="outline" className="mt-4" onClick={fetchMenu}>
                    Intentar nuevamente
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {categories.map((category) => (
                    <div key={category} className="space-y-4">
                      <h3 className="text-xl font-semibold">{category}</h3>
                      <Separator />
                      <div className="space-y-4">
                        {menuByCategory[category].map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 hover:bg-accent transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{item.nombre}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{item.descripcion}</p>
                              </div>
                              <Badge variant="outline" className="ml-2">
                                ${item.precio.toFixed(2)}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 space-y-4">
  <Button onClick={handleGenerarMenu} disabled={menuLoading}>
    {menuLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Generando menú personalizado...
      </>
    ) : (
      "Generar menú saludable personalizado"
    )}
  </Button>

  {menuError && (
    <p className="text-red-500 text-sm">{menuError}</p>
  )}

  {menuGeneradoHtml && (
    <div className="mt-6 border rounded-md p-4 bg-background">
      <h2 className="text-lg font-semibold mb-2">Menú personalizado generado por IA:</h2>
      <MenuTable htmlTable={menuGeneradoHtml} />
    </div>
  )}
</div>

            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={fetchMenu} disabled={menuLoading}>
                {menuLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Actualizando...
                  </>
                ) : (
                  "Actualizar Menú"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo de confirmación de reserva */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center text-green-600">
              <CheckCircle className="mr-2 h-5 w-5" />
              ¡Reserva Confirmada!
            </DialogTitle>
            <DialogDescription>Tu reserva ha sido procesada correctamente.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="mb-2">Detalles de la reserva:</p>
            <div className="bg-muted p-3 rounded-md">
              <p>
                <strong>ID de Reserva:</strong> {reservaState.reservaId}
              </p>
              <p>
                <strong>Tiempo:</strong>{" "}
                {formData.tiempo === "manana"
                  ? "Mañana"
                  : formData.tiempo === "tarde"
                    ? "Tarde"
                    : formData.tiempo === "noche"
                      ? "Noche"
                      : formData.tiempo === "todo-el-dia"
                        ? "Todo el día"
                        : ""}
              </p>
              <p>
                <strong>Preferencias:</strong>{" "}
                {formData.preferencias === "interior"
                  ? "Interior"
                  : formData.preferencias === "exterior"
                    ? "Exterior"
                    : formData.preferencias === "terraza"
                      ? "Terraza"
                      : formData.preferencias === "privado"
                        ? "Espacio privado"
                        : ""}
              </p>
              <p>
                <strong>Personas:</strong> {formData.cantidadPersonas}
              </p>
              <p>
                <strong>Presupuesto:</strong> ${formData.presupuesto}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCloseConfirmation}>Aceptar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )

  
  
}

