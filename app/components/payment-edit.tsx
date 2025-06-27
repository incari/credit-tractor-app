"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, CreditCard, CheckCircle, X } from "lucide-react"
import { PaymentForm } from "./payment-form"
import type { Payment, UserSettings } from "../types/payment"
import { formatCurrency } from "../utils/currencies"
import { translations } from "../utils/translations"
import { generatePaymentSchedule } from "../utils/payment-utils"

interface PaymentEditProps {
  payments: Payment[]
  userSettings: UserSettings
  onUpdate: (payment: Payment) => void
  onDelete: (id: string) => void
  onMarkAsPaid: (paymentId: string, installmentIndex: number) => void
  onMarkAsUnpaid: (paymentId: string, installmentIndex: number) => void
}

export function PaymentEdit({
  payments,
  userSettings,
  onUpdate,
  onDelete,
  onMarkAsPaid,
  onMarkAsUnpaid,
}: PaymentEditProps) {
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null)
  const [editingInstallments, setEditingInstallments] = useState<string | null>(null)
  const t = translations[userSettings.language]

  const handleUpdate = (updatedPayment: Payment) => {
    onUpdate(updatedPayment)
    setEditingPayment(null)
  }

  if (editingPayment) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.editPayment}</CardTitle>
          <CardDescription>Update the payment plan details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <PaymentForm
            onSubmit={handleUpdate}
            userSettings={userSettings}
            initialData={editingPayment}
            isEditing={true}
          />
          <Button variant="outline" onClick={() => setEditingPayment(null)} className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (editingInstallments) {
    const payment = payments.find((p) => p.id === editingInstallments)
    if (!payment) return null

    const schedule = generatePaymentSchedule(payment)

    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {t.editInstallments} - {payment.name}
          </CardTitle>
          <CardDescription>{t.togglePaymentStatus}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {schedule.map((installment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium">
                    {t.installments} {index + 1}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{new Date(installment.dueDate).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{formatCurrency(installment.amount, installment.currency)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={installment.isPaid ? "default" : "secondary"}>
                    {installment.isPaid ? t.paid : "Unpaid"}
                  </Badge>
                  <Button
                    size="sm"
                    variant={installment.isPaid ? "outline" : "default"}
                    onClick={() =>
                      installment.isPaid
                        ? onMarkAsUnpaid(installment.paymentId, installment.installmentIndex)
                        : onMarkAsPaid(installment.paymentId, installment.installmentIndex)
                    }
                  >
                    {installment.isPaid ? (
                      <>
                        <X className="h-4 w-4 mr-1" />
                        {t.markAsUnpaid}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {t.markAsPaid}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={() => setEditingInstallments(null)} className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t.editPayments}</CardTitle>
          <CardDescription>Select a payment plan to edit or delete</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">{t.noPaymentPlans}</div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => {
                const schedule = generatePaymentSchedule(payment)
                const paidInstallments = schedule.filter((s) => s.isPaid).length
                const totalWithInterest = payment.price * (1 + payment.interestRate / 100)

                return (
                  <div
                    key={payment.id}
                    className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50"
                    onClick={() => setEditingInstallments(payment.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-lg">{payment.name}</h3>
                          <Badge variant="outline">
                            {paidInstallments}/{payment.installments} {t.paid}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                          <div>
                            <span className="font-medium">{t.totalPrice}:</span>{" "}
                            {formatCurrency(totalWithInterest, payment.currency)}
                          </div>
                          <div>
                            <span className="font-medium">{t.installments}:</span> {payment.installments}
                          </div>
                          <div className="flex items-center gap-1">
                            <CreditCard className="h-4 w-4" />
                            <span>****{payment.creditCard}</span>
                          </div>
                          <div>
                            <span className="font-medium">{t.interestRate}:</span> {payment.interestRate}%
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.clickToViewInstallments}</p>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="sm" onClick={() => setEditingPayment(payment)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onDelete(payment.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
