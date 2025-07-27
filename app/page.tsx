"use client"

import { useState, useEffect } from "react"
import { CalendarDays, Home, Users, AlertTriangle, Calendar, Table, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReservationsTable } from "@/components/reservations-table"
import { GanttChart } from "@/components/gantt-chart"
import { CollapsibleSidebar } from "@/components/collapsible-sidebar"
import { ReservationModal } from "@/components/reservation-modal"
import { CabinsSection } from "@/components/cabins-section"
import { GuestsSection } from "@/components/guests-section"
import { SettingsSection } from "@/components/settings-section"
import { ReportsSection } from "@/components/reports-section"
import { FiltersAndSearch } from "@/components/filters-and-search"
import { DateTimeHeader } from "@/components/date-time-header"
import { LoginForm } from "@/components/login-form"

// Configuración de las 20 cabañas del complejo
const initialCabins = [
  { id: 1, name: "Cabaña del Bosque", capacity: 6, amenities: ["WiFi", "Cocina", "Chimenea"] },
  { id: 2, name: "Cabaña del Lago", capacity: 4, amenities: ["WiFi", "Cocina", "Vista al lago"] },
  { id: 3, name: "Cabaña de la Montaña", capacity: 8, amenities: ["WiFi", "Cocina", "Jacuzzi", "Parrilla"] },
  { id: 4, name: "Cabaña del Valle", capacity: 4, amenities: ["WiFi", "Cocina", "Jardín"] },
  { id: 5, name: "Cabaña del Río", capacity: 6, amenities: ["WiFi", "Cocina", "Deck", "Pesca"] },
  { id: 6, name: "Cabaña del Pino", capacity: 5, amenities: ["WiFi", "Cocina", "Chimenea", "Parrilla"] },
  { id: 7, name: "Cabaña del Roble", capacity: 7, amenities: ["WiFi", "Cocina", "Jacuzzi", "Vista panorámica"] },
  { id: 8, name: "Cabaña del Cedro", capacity: 4, amenities: ["WiFi", "Cocina", "Jardín privado"] },
  { id: 9, name: "Cabaña del Sauce", capacity: 6, amenities: ["WiFi", "Cocina", "Hamacas", "Fogón"] },
  { id: 10, name: "Cabaña del Álamo", capacity: 5, amenities: ["WiFi", "Cocina", "Terraza", "Parrilla"] },
  { id: 11, name: "Cabaña Familiar Norte", capacity: 8, amenities: ["WiFi", "Cocina", "2 Baños", "Sala de juegos"] },
  { id: 12, name: "Cabaña Familiar Sur", capacity: 8, amenities: ["WiFi", "Cocina", "2 Baños", "Patio grande"] },
  { id: 13, name: "Cabaña Romántica", capacity: 2, amenities: ["WiFi", "Cocina", "Jacuzzi", "Vista al lago"] },
  { id: 14, name: "Cabaña Luna de Miel", capacity: 2, amenities: ["WiFi", "Cocina", "Chimenea", "Cama king"] },
  { id: 15, name: "Cabaña Premium", capacity: 6, amenities: ["WiFi", "Cocina", "Jacuzzi", "Sauna", "Parrilla"] },
  { id: 16, name: "Cabaña Ejecutiva", capacity: 4, amenities: ["WiFi", "Cocina", "Oficina", "Terraza"] },
  { id: 17, name: "Cabaña Aventura", capacity: 6, amenities: ["WiFi", "Cocina", "Equipos deportivos", "Fogón"] },
  { id: 18, name: "Cabaña Relax", capacity: 4, amenities: ["WiFi", "Cocina", "Spa", "Jardín zen"] },
  { id: 19, name: "Cabaña Tradicional", capacity: 5, amenities: ["WiFi", "Cocina", "Chimenea", "Decoración rústica"] },
  { id: 20, name: "Cabaña Moderna", capacity: 6, amenities: ["WiFi", "Cocina", "Smart TV", "Domótica"] },
]

// Datos de ejemplo de reservas - ACTUALIZADOS CON PRECIOS
const initialReservations = [
  {
    id: 1,
    cabin: "Cabaña del Bosque",
    guest: "María González",
    checkIn: "2025-06-15",
    checkOut: "2025-06-18",
    status: "confirmada",
    guests: 4,
    phone: "+54 11 1234-5678",
    email: "maria@email.com",
    notes: "Llegada tarde, después de las 20hs",
    pricePerNight: 15000,
    hasDeposit: true,
    depositAmount: 20000,
  },
  {
    id: 2,
    cabin: "Cabaña del Lago",
    guest: "Carlos Rodríguez",
    checkIn: "2025-06-16",
    checkOut: "2025-06-20",
    status: "pendiente",
    guests: 2,
    phone: "+54 11 2345-6789",
    email: "carlos@email.com",
    pricePerNight: 12000,
    hasDeposit: false,
    depositAmount: 0,
  },
  {
    id: 3,
    cabin: "Cabaña del Bosque",
    guest: "Ana Martínez",
    checkIn: "2025-06-17",
    checkOut: "2025-06-19",
    status: "confirmada",
    guests: 3,
    phone: "+54 11 3456-7890",
    email: "ana@email.com",
    pricePerNight: 15000,
    hasDeposit: true,
    depositAmount: 15000,
  },
  {
    id: 4,
    cabin: "Cabaña de la Montaña",
    guest: "Luis Fernández",
    checkIn: "2025-07-05",
    checkOut: "2025-07-10",
    status: "confirmada",
    guests: 6,
    phone: "+54 11 4567-8901",
    email: "luis@email.com",
    pricePerNight: 20000,
    hasDeposit: true,
    depositAmount: 50000,
  },
  {
    id: 5,
    cabin: "Cabaña del Lago",
    guest: "Patricia Silva",
    checkIn: "2025-07-08",
    checkOut: "2025-07-12",
    status: "confirmada",
    guests: 4,
    phone: "+54 11 5678-9012",
    email: "patricia@email.com",
    pricePerNight: 12000,
    hasDeposit: false,
    depositAmount: 0,
  },
  {
    id: 6,
    cabin: "Cabaña del Río",
    guest: "Roberto Díaz",
    checkIn: "2025-07-15",
    checkOut: "2025-07-18",
    status: "confirmada",
    guests: 5,
    phone: "+54 11 6789-0123",
    email: "roberto@email.com",
    pricePerNight: 18000,
    hasDeposit: true,
    depositAmount: 25000,
  },
  {
    id: 7,
    cabin: "Cabaña del Pino",
    guest: "Elena Morales",
    checkIn: "2025-07-20",
    checkOut: "2025-07-24",
    status: "pendiente",
    guests: 3,
    phone: "+54 11 7890-1234",
    email: "elena@email.com",
    pricePerNight: 16000,
    hasDeposit: false,
    depositAmount: 0,
  },
  {
    id: 8,
    cabin: "Cabaña del Roble",
    guest: "Fernando Castro",
    checkIn: "2025-08-02",
    checkOut: "2025-08-05",
    status: "confirmada",
    guests: 7,
    phone: "+54 11 8901-2345",
    email: "fernando@email.com",
    pricePerNight: 22000,
    hasDeposit: true,
    depositAmount: 30000,
  },
  {
    id: 9,
    cabin: "Cabaña del Cedro",
    guest: "Sofía Herrera",
    checkIn: "2025-08-10",
    checkOut: "2025-08-13",
    status: "confirmada",
    guests: 2,
    phone: "+54 11 9012-3456",
    email: "sofia@email.com",
    pricePerNight: 11000,
    hasDeposit: true,
    depositAmount: 15000,
  },
  {
    id: 10,
    cabin: "Cabaña del Sauce",
    guest: "Diego Ramírez",
    checkIn: "2025-08-15",
    checkOut: "2025-08-18",
    status: "confirmada",
    guests: 4,
    phone: "+54 11 0123-4567",
    email: "diego@email.com",
    pricePerNight: 17000,
    hasDeposit: false,
    depositAmount: 0,
  },
  {
    id: 11,
    cabin: "Cabaña del Álamo",
    guest: "Carmen López",
    checkIn: "2025-08-20",
    checkOut: "2025-08-24",
    status: "pendiente",
    guests: 5,
    phone: "+54 11 1234-5679",
    email: "carmen@email.com",
    pricePerNight: 16500,
    hasDeposit: false,
    depositAmount: 0,
  },
  {
    id: 12,
    cabin: "Cabaña Familiar Norte",
    guest: "Familia Pérez",
    checkIn: "2025-06-25",
    checkOut: "2025-07-02",
    status: "confirmada",
    guests: 8,
    phone: "+54 11 2345-6780",
    email: "perez@email.com",
    pricePerNight: 25000,
    hasDeposit: true,
    depositAmount: 80000,
  },
  {
    id: 13,
    cabin: "Cabaña Romántica",
    guest: "Juan y María",
    checkIn: "2025-07-12",
    checkOut: "2025-07-15",
    status: "confirmada",
    guests: 2,
    phone: "+54 11 3456-7891",
    email: "juan.maria@email.com",
    pricePerNight: 14000,
    hasDeposit: true,
    depositAmount: 20000,
  },
  {
    id: 14,
    cabin: "Cabaña Luna de Miel",
    guest: "Pablo y Ana",
    checkIn: "2025-08-05",
    checkOut: "2025-08-10",
    status: "confirmada",
    guests: 2,
    phone: "+54 11 4567-8902",
    email: "pablo.ana@email.com",
    pricePerNight: 14500,
    hasDeposit: true,
    depositAmount: 30000,
  },
  {
    id: 15,
    cabin: "Cabaña Premium",
    guest: "Empresa TechCorp",
    checkIn: "2025-08-25",
    checkOut: "2025-08-28",
    status: "confirmada",
    guests: 6,
    phone: "+54 11 5678-9013",
    email: "eventos@techcorp.com",
    pricePerNight: 30000,
    hasDeposit: true,
    depositAmount: 50000,
  },
  {
    id: 16,
    cabin: "Cabaña del Valle",
    guest: "Martín Sánchez",
    checkIn: "2025-06-28",
    checkOut: "2025-07-01",
    status: "pendiente",
    guests: 4,
    phone: "+54 11 6789-0124",
    email: "martin@email.com",
    pricePerNight: 13000,
    hasDeposit: false,
    depositAmount: 0,
  },
  {
    id: 17,
    cabin: "Cabaña Aventura",
    guest: "Grupo Montañismo",
    checkIn: "2025-07-25",
    checkOut: "2025-07-28",
    status: "confirmada",
    guests: 6,
    phone: "+54 11 7890-1235",
    email: "montanismo@email.com",
    pricePerNight: 19000,
    hasDeposit: true,
    depositAmount: 25000,
  },
  {
    id: 18,
    cabin: "Cabaña Relax",
    guest: "Sandra Torres",
    checkIn: "2025-08-12",
    checkOut: "2025-08-15",
    status: "confirmada",
    guests: 2,
    phone: "+54 11 8901-2346",
    email: "sandra@email.com",
    pricePerNight: 13500,
    hasDeposit: true,
    depositAmount: 20000,
  },
  {
    id: 19,
    cabin: "Cabaña Tradicional",
    guest: "Familia Gómez",
    checkIn: "2025-06-20",
    checkOut: "2025-06-24",
    status: "confirmada",
    guests: 5,
    phone: "+54 11 9012-3457",
    email: "gomez@email.com",
    pricePerNight: 15500,
    hasDeposit: true,
    depositAmount: 30000,
  },
  {
    id: 20,
    cabin: "Cabaña Moderna",
    guest: "Alejandro Ruiz",
    checkIn: "2025-08-28",
    checkOut: "2025-08-31",
    status: "pendiente",
    guests: 4,
    phone: "+54 11 0123-4568",
    email: "alejandro@email.com",
    pricePerNight: 18500,
    hasDeposit: false,
    depositAmount: 0,
  },
]

export default function Dashboard() {
  // Estados de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [currentUser, setCurrentUser] = useState<string>("")

  // Estados principales de la aplicación
  const [activeView, setActiveView] = useState("gantt")
  const [reservations, setReservations] = useState(initialReservations)
  const [isNewReservationModalOpen, setIsNewReservationModalOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [selectedReservation, setSelectedReservation] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [cabins, setCabins] = useState(initialCabins)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [cabinFilter, setCabinFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  // Función de login
  const handleLogin = (credentials: { username: string; password: string }) => {
    // Validación simple (en producción esto sería contra una API)
    if (credentials.username === "admin" && credentials.password === "admin123") {
      setIsAuthenticated(true)
      setCurrentUser(credentials.username)
      setLoginError("")
    } else {
      setLoginError("Usuario o contraseña incorrectos")
    }
  }

  // Función de logout
  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser("")
    setLoginError("")
  }

  const handleEditReservation = () => {
    setIsViewModalOpen(false)
    setIsEditModalOpen(true)
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={loginError} />
  }

  // Calcular estadísticas del dashboard
  const stats = {
    totalReservations: reservations.length,
    confirmedReservations: reservations.filter((r) => r.status === "confirmada").length,
    pendingReservations: reservations.filter((r) => r.status === "pendiente").length,
    occupancyRate: Math.round((reservations.length / (cabins.length * 7)) * 100),
  }

  /**
   * Actualiza una reserva existente
   */
  const handleUpdateReservation = (id: number, updatedReservation: Partial<any>) => {
    setReservations((prev) =>
      prev.map((reservation) => (reservation.id === id ? { ...reservation, ...updatedReservation } : reservation)),
    )
  }

  /**
   * Elimina una reserva
   */
  const handleDeleteReservation = (id: number) => {
    setReservations((prev) => prev.filter((reservation) => reservation.id !== id))
  }

  /**
   * Crea una nueva reserva
   */
  const handleCreateReservation = (newReservation: Partial<any>) => {
    const id = Math.max(...reservations.map((r) => r.id)) + 1
    setReservations((prev) => [...prev, { ...newReservation, id } as any])
  }

  /**
   * Maneja el clic en una reserva del cronograma
   */
  const handleReservationClick = (reservation: any) => {
    setSelectedReservation(reservation)
    setIsViewModalOpen(true)
  }

  /**
   * Aplica todos los filtros a la lista de reservas
   */
  const applyFilters = (reservations: any[]) => {
    return reservations.filter((reservation) => {
      // Filtro de búsqueda por nombre de huésped
      if (searchTerm && !reservation.guest.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }

      // Filtro por estado de reserva
      if (statusFilter !== "all" && reservation.status !== statusFilter) {
        return false
      }

      // Filtro por cabaña
      if (cabinFilter !== "all" && reservation.cabin !== cabinFilter) {
        return false
      }

      // Filtro por fecha
      if (dateFilter !== "all") {
        const today = new Date().toISOString().split("T")[0]
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]
        const checkIn = reservation.checkIn
        const checkOut = reservation.checkOut

        switch (dateFilter) {
          case "today":
            if (checkIn !== today && checkOut !== today) return false
            break
          case "tomorrow":
            if (checkIn !== tomorrow && checkOut !== tomorrow) return false
            break
          case "this-week":
            const weekStart = new Date()
            weekStart.setDate(weekStart.getDate() - weekStart.getDay())
            const weekEnd = new Date(weekStart)
            weekEnd.setDate(weekStart.getDate() + 6)
            if (new Date(checkIn) < weekStart || new Date(checkIn) > weekEnd) return false
            break
        }
      }

      return true
    })
  }

  // Aplicar filtros a las reservas
  const filteredReservations = applyFilters(reservations)

  /**
   * Limpia todos los filtros
   */
  const handleClearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setCabinFilter("all")
    setDateFilter("all")
  }

  /**
   * Maneja las acciones rápidas del panel de ayuda
   */
  const handleQuickAction = (action: string, data?: any) => {
    switch (action) {
      case "new-reservation":
        setIsNewReservationModalOpen(true)
        break
      case "call":
        if (data) {
          window.open(`tel:${data.phone}`)
        }
        break
    }
  }

  /**
   * Actualiza una cabaña existente
   */
  const handleUpdateCabin = (updatedCabin: any) => {
    setCabins((prev) => prev.map((cabin) => (cabin.id === updatedCabin.id ? updatedCabin : cabin)))
  }

  /**
   * Crea una nueva cabaña
   */
  const handleCreateCabin = (newCabin: any) => {
    const id = Math.max(...cabins.map((c) => c.id)) + 1
    setCabins((prev) => [...prev, { ...newCabin, id }])
  }

  return (
    <div className="flex h-screen bg-gray-50 flex-col">
      {/* Header superior con fecha y hora - Oculto en móvil */}
      <div className="hidden md:block">
        <DateTimeHeader />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar colapsible con resumen del día */}
        <CollapsibleSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          reservations={reservations}
          onQuickAction={handleQuickAction}
          onLogout={handleLogout}
        />

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header del contenido - Oculto en móvil */}
          <header className="hidden md:block bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Panel de Control - Complejo de Cabañas</h1>
                <p className="text-gray-600">Gestiona todas las reservas y cabañas del complejo</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-600">
                  Bienvenido, <strong>{currentUser}</strong>
                </div>
                <Button onClick={() => setIsNewReservationModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Reserva
                </Button>
              </div>
            </div>
          </header>

          {/* Área principal de contenido */}
          <main className="flex-1 overflow-auto p-6">
            <div className="w-full space-y-6">
              {/* Contenido principal (100% del ancho) */}
              <div className="space-y-6">
                {/* Sección Dashboard */}
                {activeSection === "dashboard" && (
                  <>
                    {/* Tarjetas de estadísticas - MÁS COMPACTAS */}
                    

                    {/* Panel de filtros y búsqueda */}
                    <FiltersAndSearch
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      statusFilter={statusFilter}
                      onStatusFilterChange={setStatusFilter}
                      cabinFilter={cabinFilter}
                      onCabinFilterChange={setCabinFilter}
                      dateFilter={dateFilter}
                      onDateFilterChange={setDateFilter}
                      onClearFilters={handleClearFilters}
                      cabins={cabins}
                      totalResults={filteredReservations.length}
                    />

                    {/* Pestañas para cambiar entre cronograma y tabla */}
                    <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
                      <TabsList>
                        <TabsTrigger value="gantt" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Vista Cronograma
                        </TabsTrigger>
                        <TabsTrigger value="table" className="flex items-center gap-2">
                          <Table className="w-4 h-4" />
                          Vista Tabla
                        </TabsTrigger>
                      </TabsList>

                      {/* Vista de cronograma */}
                      <TabsContent value="gantt">
                        <Card>
                          <CardHeader>
                            <CardTitle>Cronograma de Reservas</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <GanttChart
                              reservations={filteredReservations}
                              cabins={cabins}
                              onReservationClick={handleReservationClick}
                            />
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Vista de tabla */}
                      <TabsContent value="table">
                        <Card>
                          <CardHeader>
                            <CardTitle>Lista de Reservas</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ReservationsTable
                              reservations={filteredReservations}
                              onUpdateReservation={handleUpdateReservation}
                              onDeleteReservation={handleDeleteReservation}
                              cabins={cabins}
                            />
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </>
                )}

                {/* Otras secciones del sidebar */}
                {activeSection === "reservations" && (
                  <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold">Gestión de Reservas</h2>
                        <p className="text-gray-600">Administra todas las reservas del complejo</p>
                      </div>
                      <TabsList>
                        <TabsTrigger value="gantt" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Cronograma
                        </TabsTrigger>
                        <TabsTrigger value="table" className="flex items-center gap-2">
                          <Table className="w-4 h-4" />
                          Lista
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <FiltersAndSearch
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      statusFilter={statusFilter}
                      onStatusFilterChange={setStatusFilter}
                      cabinFilter={cabinFilter}
                      onCabinFilterChange={setCabinFilter}
                      dateFilter={dateFilter}
                      onDateFilterChange={setDateFilter}
                      onClearFilters={handleClearFilters}
                      cabins={cabins}
                      totalResults={filteredReservations.length}
                    />

                    <TabsContent value="gantt">
                      <Card>
                        <CardHeader>
                          <CardTitle>Cronograma de Reservas</CardTitle>
                          <CardDescription>
                            Vista tipo Gantt mostrando la ocupación de cada cabaña por fechas
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <GanttChart
                            reservations={filteredReservations}
                            cabins={cabins}
                            onReservationClick={handleReservationClick}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="table">
                      <Card>
                        <CardHeader>
                          <CardTitle>Lista de Reservas</CardTitle>
                          <CardDescription>Vista detallada de todas las reservas del complejo</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ReservationsTable
                            reservations={filteredReservations}
                            onUpdateReservation={handleUpdateReservation}
                            onDeleteReservation={handleDeleteReservation}
                            cabins={cabins}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                )}

                {activeSection === "cabins" && (
                  <CabinsSection
                    cabins={cabins}
                    reservations={reservations}
                    onUpdateCabin={handleUpdateCabin}
                    onCreateCabin={handleCreateCabin}
                  />
                )}
                {activeSection === "guests" && <GuestsSection reservations={reservations} />}
                {activeSection === "reports" && <ReportsSection reservations={reservations} cabins={cabins} />}
                {activeSection === "settings" && <SettingsSection />}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Botón flotante de Nueva Reserva en móvil */}
      {isMobile && (
        <Button
          onClick={() => setIsNewReservationModalOpen(true)}
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      {/* Modales */}
      <ReservationModal
        isOpen={isNewReservationModalOpen}
        onClose={() => setIsNewReservationModalOpen(false)}
        mode="create"
        onSave={handleCreateReservation}
        cabins={cabins}
        reservations={reservations}
      />

      <ReservationModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        reservation={selectedReservation}
        mode="view"
        onSave={() => {}}
        onEdit={handleEditReservation}
        cabins={cabins}
        reservations={reservations}
      />

      <ReservationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        reservation={selectedReservation}
        mode="edit"
        onSave={(updatedReservation) => {
          if (selectedReservation) {
            handleUpdateReservation(selectedReservation.id, updatedReservation)
          }
          setIsEditModalOpen(false)
        }}
        cabins={cabins}
        reservations={reservations}
      />
    </div>
  )
}
