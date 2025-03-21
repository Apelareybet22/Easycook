"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Formulario() {
  const [formData, setFormData] = useState({
    tiempo: "",
    preferencias: "",
    cantidadPersonas: "",
    presupuesto: "",
    restricciones: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    {
      e.preventDefault();
      // Guardar los datos en el localStorage
      localStorage.setItem("formData", JSON.stringify(formData));
      console.log("Datos guardados en Local Storage:", formData);
    };
    
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">EasyCook</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tiempo">Tiempo</Label>
            <Select value={formData.tiempo} onValueChange={(value) => setFormData({ ...formData, tiempo: value })}>
              <SelectTrigger id="tiempo">
                <SelectValue placeholder="Selecciona el tiempo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Diario">Diaro</SelectItem>
                <SelectItem value="Semanal">Semanal</SelectItem>
                <SelectItem value="Quincenal">Quincenal</SelectItem>
                <SelectItem value="Mensual">Mensual</SelectItem>
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
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Vegetariano">Vegetariano</SelectItem>
                <SelectItem value="Vegano">Vegano</SelectItem>
                <SelectItem value="Keto">Keto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="restricciones">Restricciones Alimenticias</Label>
            <Input
              id="restricciones"
              type="string"
              placeholder="Ingresa tu restriccion alimenticia"
              value={formData.restricciones}
              onChange={(e) => setFormData({ ...formData, restricciones: e.target.value })}
            />
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
        <CardFooter>
          <Button type="submit" className="w-full">
            Enviar
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

