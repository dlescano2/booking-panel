"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"

interface DateNavigationProps {
  currentDate: Date
  onDateChange: (date: Date) => void
}

export function DateNavigation({ currentDate, onDateChange }: DateNavigationProps) {
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const currentDay = currentDate.getDate()

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const years = Array.from({ length: 10 }, (_, i) => currentYear - 2 + i)

  // Generar días del mes seleccionado
  const getDaysInMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => i + 1)
  }

  const daysInCurrentMonth = getDaysInMonth(currentYear, currentMonth)

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(currentDate)
    const newMonth = Number.parseInt(monthIndex)
    newDate.setMonth(newMonth)

    // Ajustar el día si el día actual no existe en el nuevo mes
    const daysInNewMonth = new Date(currentYear, newMonth + 1, 0).getDate()
    if (currentDay > daysInNewMonth) {
      newDate.setDate(daysInNewMonth)
    }

    onDateChange(newDate)
  }

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentDate)
    const newYear = Number.parseInt(year)
    newDate.setFullYear(newYear)

    // Ajustar para año bisiesto si es 29 de febrero
    if (currentMonth === 1 && currentDay === 29) {
      const isLeapYear = (newYear % 4 === 0 && newYear % 100 !== 0) || newYear % 400 === 0
      if (!isLeapYear) {
        newDate.setDate(28)
      }
    }

    onDateChange(newDate)
  }

  const handleDayChange = (day: string) => {
    const newDate = new Date(currentDate)
    newDate.setDate(Number.parseInt(day))
    onDateChange(newDate)
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-600" />
        <span className="font-medium text-gray-700">Fecha</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Selector de día */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">Día:</span>
          <Select value={currentDay.toString()} onValueChange={handleDayChange}>
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {daysInCurrentMonth.map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selector de mes */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">Mes:</span>
          <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selector de año */}
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-600">Año:</span>
          <Select value={currentYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
