"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Shield, Database, Download } from "lucide-react"

export function SettingsSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configuración</h2>
        <p className="text-gray-600">Administra la configuración del sistema</p>
      </div>

      <div className="grid gap-6">
        {/* Información del Complejo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Información del Complejo
            </CardTitle>
            <CardDescription>Configuración básica del complejo de cabañas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="complexName">Nombre del Complejo</Label>
                <Input id="complexName" defaultValue="Complejo Cabañas del Bosque" />
              </div>
              <div>
                <Label htmlFor="phone">Teléfono Principal</Label>
                <Input id="phone" defaultValue="+54 11 1234-5678" />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" defaultValue="Ruta Provincial 123, Villa La Angostura" />
            </div>
            <div>
              <Label htmlFor="email">Email de Contacto</Label>
              <Input id="email" type="email" defaultValue="info@cabanasdelbosque.com" />
            </div>
          </CardContent>
        </Card>

        {/* Notificaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones
            </CardTitle>
            <CardDescription>Configura las alertas y notificaciones del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Conflictos</Label>
                <p className="text-sm text-gray-600">Notificar cuando hay superposición de reservas</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recordatorios de Check-in</Label>
                <p className="text-sm text-gray-600">Enviar recordatorios 24hs antes del check-in</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones por Email</Label>
                <p className="text-sm text-gray-600">Recibir notificaciones por correo electrónico</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Seguridad
            </CardTitle>
            <CardDescription>Configuración de seguridad y acceso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input id="currentPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input id="newPassword" type="password" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
              <Input id="confirmPassword" type="password" />
            </div>
            <Button>Cambiar Contraseña</Button>
          </CardContent>
        </Card>

        {/* Datos y Respaldo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Datos y Respaldo
            </CardTitle>
            <CardDescription>Gestión de datos y copias de seguridad</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Respaldo Automático</Label>
                <p className="text-sm text-gray-600">Crear respaldos automáticos semanalmente</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar Reservas
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Exportar Huéspedes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
