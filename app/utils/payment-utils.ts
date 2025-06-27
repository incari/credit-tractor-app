import type { Payment, PaymentInstallment } from "../types/payment"

export function generatePaymentSchedule(payment: Payment): PaymentInstallment[] {
  const schedule: PaymentInstallment[] = []
  const totalWithInterest = payment.price * (1 + payment.interestRate / 100)

  // If there's an initial payment, it counts as the first installment
  const remainingAmount = totalWithInterest - payment.initialPayment
  const remainingInstallments = payment.installments - (payment.initialPayment > 0 ? 1 : 0)
  const installmentAmount = remainingInstallments > 0 ? remainingAmount / remainingInstallments : 0

  const firstDate = new Date(payment.firstPaymentDate)

  // Add initial payment as first installment if it exists
  if (payment.initialPayment > 0) {
    schedule.push({
      paymentId: payment.id,
      paymentName: payment.name,
      amount: payment.initialPayment,
      dueDate: payment.firstPaymentDate,
      isPaid: payment.paidInstallments?.includes(0) || false,
      creditCard: payment.creditCard,
      currency: payment.currency || "EUR",
      installmentIndex: 0,
    })
  }

  // Generate remaining installments
  const startIndex = payment.initialPayment > 0 ? 1 : 0
  for (let i = startIndex; i < payment.installments; i++) {
    let dueDate: Date
    const monthOffset = payment.initialPayment > 0 ? i : i + 1 // Offset by 1 month if initial payment exists

    if (payment.paymentType === "monthly") {
      // Same day each month from first payment date
      dueDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + monthOffset, firstDate.getDate())

      // Handle months with fewer days (like February)
      if (dueDate.getMonth() !== (firstDate.getMonth() + monthOffset) % 12) {
        // Day doesn't exist in this month, use last day of month
        dueDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + monthOffset + 1, 0)
      }
    } else if (payment.paymentType === "beginning") {
      // Beginning of each month
      dueDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + monthOffset, 1)
    } else if (payment.paymentType === "ending") {
      // End of each month - if it's the first installment and we're adding initial payment, use current month
      if (i === startIndex && payment.initialPayment > 0) {
        // For the first installment after initial payment, use current month end
        dueDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 1, 0)
      } else {
        // For subsequent installments, use end of month with proper offset
        const monthsFromStart = payment.initialPayment > 0 ? i : i + 1
        dueDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + monthsFromStart, 0)
      }
    } else if (payment.paymentType === "custom" && payment.customDayOfMonth) {
      // Custom day of month
      const targetDay = payment.customDayOfMonth
      dueDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + monthOffset, targetDay)

      // Handle February and months with fewer days
      if (dueDate.getMonth() !== (firstDate.getMonth() + monthOffset) % 12) {
        // Day doesn't exist in this month, use last day of month
        dueDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + monthOffset + 1, 0)
      }
    } else {
      // Fallback to same day each month
      dueDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + monthOffset, firstDate.getDate())

      if (dueDate.getMonth() !== (firstDate.getMonth() + monthOffset) % 12) {
        dueDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + monthOffset + 1, 0)
      }
    }

    const isPaidManually = payment.paidInstallments?.includes(i) || false

    schedule.push({
      paymentId: payment.id,
      paymentName: payment.name,
      amount: installmentAmount,
      dueDate: dueDate.toISOString().split("T")[0],
      isPaid: isPaidManually,
      creditCard: payment.creditCard,
      currency: payment.currency || "EUR",
      installmentIndex: i,
    })
  }

  return schedule
}

export function calculatePaymentSummary(payments: Payment[]) {
  const totalAmount = payments.reduce((sum, payment) => {
    const totalWithInterest = payment.price * (1 + payment.interestRate / 100)
    return sum + totalWithInterest
  }, 0)

  // Calculate actual paid amount (paid installments only)
  const totalPaid = payments.reduce((sum, payment) => {
    const schedule = generatePaymentSchedule(payment)
    const paidInstallments = schedule.filter((s) => s.isPaid)
    const paidInstallmentAmount = paidInstallments.reduce(
      (installmentSum, installment) => installmentSum + installment.amount,
      0,
    )
    return sum + paidInstallmentAmount
  }, 0)

  const totalToPay = totalAmount - totalPaid

  return {
    totalAmount,
    totalPaid,
    totalToPay,
  }
}
