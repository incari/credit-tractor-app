"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Undo2 } from "lucide-react"
import type { UndoAction } from "../types/payment"

interface UndoSnackbarProps {
  action: UndoAction | null
  onUndo: () => void
  onDismiss: () => void
}

export function UndoSnackbar({ action, onUndo, onDismiss }: UndoSnackbarProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (action) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onDismiss, 300) // Wait for animation to complete
      }, 5000) // Auto-dismiss after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [action, onDismiss])

  if (!action) return null

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <Card className="shadow-lg border-l-4 border-l-green-500">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-medium">{action.message}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={onUndo}>
                <Undo2 className="h-4 w-4 mr-1" />
                Undo
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsVisible(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
