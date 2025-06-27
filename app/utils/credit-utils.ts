import type { Payment, CreditCard } from "../types/payment"
import { generatePaymentSchedule } from "./payment-utils"

export function calculateCreditUsage(payments: Payment[], card: CreditCard, currency: string) {
  // Find all payments using this card
  const cardPayments = payments.filter((payment) => payment.creditCard === card.lastFour)

  // Calculate total amount used on this card (remaining unpaid amounts)
  const totalUsed = cardPayments.reduce((sum, payment) => {
    const schedule = generatePaymentSchedule(payment)
    const unpaidInstallments = schedule.filter((installment) => !installment.isPaid)
    const unpaidAmount = unpaidInstallments.reduce((installmentSum, installment) => {
      return installmentSum + installment.amount
    }, 0)
    return sum + unpaidAmount
  }, 0)

  const limit = card.limit || 0
  const available = limit > 0 ? Math.max(0, limit - totalUsed) : 0
  const utilization = limit > 0 ? (totalUsed / limit) * 100 : 0

  return {
    totalUsed,
    available,
    limit,
    utilization,
    hasLimit: !!card.limit,
  }
}
