"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Clock, ArrowRight } from "lucide-react"

interface QuickDateFiltersProps {
  onDateSelect: (date: Date) => void
  currentDate: Date
}

export function QuickDateFilters({ onDateSelect, currentDate }: QuickDateFiltersProps) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const nextWeek = new Date(today)
  nextWeek.setDate(today.getDate() + 7)

  const nextMonth = new Date(today)
  nextMonth.setMonth(today.getMonth() + 1)

  const quickDates = [
    {
      label: "Hoy",
      date: today,
      icon: <Clock className="w-4 h-4" />,
      description: "Ver reservas de hoy",
    },
    {
      label: "Mañana",
      date: tomorrow,
      icon: <ArrowRight className="w-4 h-4" />,
      description: "Check-ins de mañana",
    },
    {
      label: "Próxima semana",
      date: nextWeek,
      icon: <Calendar className="w-4 h-4" />,
      description: "Saltar 7 días",
    },
    {
      label: "Próximo mes",
      date: nextMonth,
      icon: <Calendar className="w-4 h-4" />,
      description: "Mes siguiente",
    },
  ]

  const isCurrentDate = (date: Date) => {
    return date.toDateString() === currentDate.toDateString()
  }

  return (
    <div className="flex flex-wrap gap-2">
      {quickDates.map((item, index) => (
        <Button
          key={index}
          variant={isCurrentDate(item.date) ? "default" : "outline"}
          size="sm"
          onClick={() => onDateSelect(item.date)}
          className="flex items-center gap-2"
          title={item.description}
        >
          {item.icon}
          {item.label}
        </Button>
      ))}
    </div>
  )
}
