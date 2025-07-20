"use client"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, Calendar, Users, AlertTriangle, RotateCcw } from "lucide-react"

interface FiltersAndSearchProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  statusFilter: string
  onStatusFilterChange: (status: string) => void
  cabinFilter: string
  onCabinFilterChange: (cabin: string) => void
  dateFilter: string
  onDateFilterChange: (date: string) => void
  onClearFilters: () => void
  cabins: Array<{ name: string }>
  totalResults: number
}

export function FiltersAndSearch({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  cabinFilter,
  onCabinFilterChange,
  dateFilter,
  onDateFilterChange,
  onClearFilters,
  cabins,
  totalResults,
}: FiltersAndSearchProps) {
  const hasActiveFilters = statusFilter !== "all" || cabinFilter !== "all" || dateFilter !== "all" || searchTerm !== ""

  return (
    <div className="bg-white p-4 rounded-lg border shadow-sm space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Filter className="w-4 h-4" />
        Filtros y Búsqueda
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar huésped..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filtro por Estado */}
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="confirmada">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Confirmadas
              </div>
            </SelectItem>
            <SelectItem value="pendiente">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Pendientes
              </div>
            </SelectItem>
            <SelectItem value="cancelada">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Canceladas
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Filtro por Cabaña */}
        <Select value={cabinFilter} onValueChange={onCabinFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Cabaña" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las cabañas</SelectItem>
            {cabins.map((cabin) => (
              <SelectItem key={cabin.name} value={cabin.name}>
                {cabin.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filtro por Fecha */}
        <div className="flex gap-1">
          <Select value={dateFilter} onValueChange={onDateFilterChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las fechas</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="tomorrow">Mañana</SelectItem>
              <SelectItem value="this-week">Esta semana</SelectItem>
              <SelectItem value="next-week">Próxima semana</SelectItem>
              <SelectItem value="this-month">Este mes</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDateFilterChange("today")}
            title="Ir a hoy"
            className="px-3"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Botón limpiar filtros */}
        <Button
          variant="outline"
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          className="flex items-center gap-2 bg-transparent"
        >
          <X className="w-4 h-4" />
          Limpiar
        </Button>
      </div>

      {/* Resultados y filtros activos */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {totalResults} reserva{totalResults !== 1 ? "s" : ""} encontrada{totalResults !== 1 ? "s" : ""}
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 flex-wrap">
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Search className="w-3 h-3" />"{searchTerm}"
              </Badge>
            )}
            {statusFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {statusFilter}
              </Badge>
            )}
            {cabinFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {cabinFilter}
              </Badge>
            )}
            {dateFilter !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {dateFilter}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
