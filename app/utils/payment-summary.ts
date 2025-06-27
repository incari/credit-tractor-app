import type { Payment } from "../types/payment"
import { generatePaymentSchedule } from "./payment-utils"

export function calculatePaymentSummary(payments: Payment[]) {
  const totalAmount = payments.reduce((sum, payment) => {
    const totalWithInterest = payment.price * (1 + payment.interestRate / 100)
    return sum + totalWithInterest
  }, 0)

  // Calculate actual paid amount (initial payments + paid installments)
  const totalPaid = payments.reduce((sum, payment) => {
    const schedule = generatePaymentSchedule(payment)
    const paidInstallments = schedule.filter((s) => s.isPaid)
    const paidInstallmentAmount = paidInstallments.reduce(
      (installmentSum, installment) => installmentSum + installment.amount,
      0,
    )
    return sum + payment.initialPayment + paidInstallmentAmount
  }, 0)

  const totalToPay = totalAmount - totalPaid

  return {
    totalAmount,
    totalPaid,
    totalToPay,
  }
}
