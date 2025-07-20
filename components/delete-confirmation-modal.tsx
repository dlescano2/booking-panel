"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  reservationGuest: string
  cabin: string
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  reservationGuest,
  cabin,
}: DeleteConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer. La reserva será eliminada permanentemente.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="text-sm">
              <strong>Reserva a eliminar:</strong>
            </p>
            <p className="text-sm text-gray-700 mt-1">
              Huésped: <strong>{reservationGuest}</strong>
            </p>
            <p className="text-sm text-gray-700">
              Cabaña: <strong>{cabin}</strong>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Eliminar Reserva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
