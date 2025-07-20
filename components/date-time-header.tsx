"use client"

import { useState, useEffect } from "react"
import { Clock, Calendar } from "lucide-react"

export function DateTimeHeader() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-UY", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "America/Montevideo",
    })
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-UY", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "America/Montevideo",
    })
  }

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium capitalize">{formatDate(currentTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">{formatTime(currentTime)} (Uruguay)</span>
          </div>
        </div>
        <div className="text-sm font-medium">{getGreeting()}, Administrador</div>
      </div>
    </div>
  )
}
