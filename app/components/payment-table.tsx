"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, CreditCard, CheckCircle, X } from "lucide-react"
import type { Payment, UserSettings } from "../types/payment"
import { generatePaymentSchedule } from "../utils/payment-utils"
import { formatCurrency } from "../utils/currencies"
import { translations } from "../utils/translations"

interface PaymentTableProps {
  payments: Payment[]
  userSettings: UserSettings
  onDelete: (id: string) => void
  onMarkAsPaid: (paymentId: string, installmentIndex: number) => void
  onMarkAsUnpaid: (paymentId: string, installmentIndex: number) => void
}

export function PaymentTable({ payments, userSettings, onDelete, onMarkAsPaid, onMarkAsUnpaid }: PaymentTableProps) {
  const t = translations[userSettings.language]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t.paymentPlans}</CardTitle>
          <CardDescription>{t.managePaymentPlans}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.name}</TableHead>
                <TableHead>{t.totalPrice}</TableHead>
                <TableHead>{t.installments}</TableHead>
                <TableHead>{t.creditCard}</TableHead>
                <TableHead>{t.interestRate}</TableHead>
                <TableHead>{t.schedule}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="w-[100px]">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => {
                const schedule = generatePaymentSchedule(payment)
                const completedPayments = schedule.filter((s) => s.isPaid).length
                const totalWithInterest = payment.price * (1 + payment.interestRate / 100)

                return (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.name}</TableCell>
                    <TableCell>{formatCurrency(totalWithInterest, payment.currency)}</TableCell>
                    <TableCell>{payment.installments}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        <span>****{payment.creditCard}</span>
                      </div>
                    </TableCell>
                    <TableCell>{payment.interestRate}%</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {payment.paymentType === "monthly" ? t.every30Days : t.beginningOfMonth}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={completedPayments === payment.installments ? "default" : "secondary"}>
                        {completedPayments}/{payment.installments} {t.paid}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => onDelete(payment.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          {payments.length === 0 && <div className="text-center py-8 text-muted-foreground">{t.noPaymentPlans}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.allUpcomingInstallments}</CardTitle>
          <CardDescription>{t.detailedView}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.paymentPlan}</TableHead>
                <TableHead>{t.amount}</TableHead>
                <TableHead>{t.dueDate}</TableHead>
                <TableHead>{t.creditCard}</TableHead>
                <TableHead>{t.daysUntilDue}</TableHead>
                <TableHead>{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments
                .flatMap((payment) => generatePaymentSchedule(payment))
                .filter((installment) => !installment.isPaid)
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((installment, index) => {
                  const daysUntilDue = Math.ceil(
                    (new Date(installment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                  )

                  return (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{installment.paymentName}</TableCell>
                      <TableCell>{formatCurrency(installment.amount, installment.currency)}</TableCell>
                      <TableCell>{new Date(installment.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CreditCard className="h-4 w-4" />
                          <span>****{installment.creditCard}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={daysUntilDue <= 0 ? "destructive" : daysUntilDue <= 7 ? "default" : "secondary"}
                        >
                          {daysUntilDue <= 0 ? t.overdue : `${daysUntilDue} ${t.days}`}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onMarkAsPaid(installment.paymentId, installment.installmentIndex)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t.markAsPaid}
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Historical Payments Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.historicalPayments}</CardTitle>
          <CardDescription>{t.allCompletedPayments}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.paymentPlan}</TableHead>
                <TableHead>{t.amount}</TableHead>
                <TableHead>{t.dueDate}</TableHead>
                <TableHead>{t.creditCard}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead>{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments
                .flatMap((payment) => generatePaymentSchedule(payment))
                .filter((installment) => installment.isPaid)
                .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
                .map((installment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{installment.paymentName}</TableCell>
                    <TableCell>{formatCurrency(installment.amount, installment.currency)}</TableCell>
                    <TableCell>{new Date(installment.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        <span>****{installment.creditCard}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {t.paid}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onMarkAsUnpaid(installment.paymentId, installment.installmentIndex)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        {t.markAsUnpaid}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {payments.flatMap((payment) => generatePaymentSchedule(payment)).filter((installment) => installment.isPaid)
            .length === 0 && <div className="text-center py-8 text-muted-foreground">{t.noHistoricalPayments}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
