"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EnhancedCombobox } from "./enhanced-combobox"
import type { Payment, UserSettings, CreditCard } from "../types/payment"
import { translations } from "../utils/translations"
import { CurrencySelector } from "./currency-selector"

interface PaymentFormProps {
  onSubmit: (payment: Payment) => void
  userSettings: UserSettings
  onAddCard?: (card: CreditCard) => void
  initialData?: Payment
  isEditing?: boolean
}

export function PaymentForm({ onSubmit, userSettings, onAddCard, initialData, isEditing = false }: PaymentFormProps) {
  const t = translations[userSettings.language]

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price?.toString() || "",
    installments: initialData?.installments?.toString() || "",
    firstPaymentDate: initialData?.firstPaymentDate || today,
    creditCard: initialData?.creditCard || userSettings.lastUsedCard || "",
    initialPayment: initialData?.initialPayment?.toString() || "0",
    interestRate: initialData?.interestRate?.toString() || "0",
    paymentType: initialData?.paymentType || ("monthly" as "monthly" | "beginning" | "ending" | "custom"),
    customDayOfMonth: initialData?.customDayOfMonth?.toString() || "15",
    currency: initialData?.currency || userSettings.currency,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payment: Payment = {
      id: initialData?.id || "",
      name: formData.name,
      price: Number.parseFloat(formData.price),
      installments: Number.parseInt(formData.installments),
      firstPaymentDate: formData.firstPaymentDate,
      creditCard: formData.creditCard,
      initialPayment: Number.parseFloat(formData.initialPayment),
      interestRate: Number.parseFloat(formData.interestRate),
      paymentType: formData.paymentType,
      customDayOfMonth: formData.paymentType === "custom" ? Number.parseInt(formData.customDayOfMonth) : undefined,
      currency: formData.currency,
      paidInstallments: initialData?.paidInstallments || [],
    }

    onSubmit(payment)

    if (!isEditing) {
      // Reset form only if not editing
      setFormData({
        name: "",
        price: "",
        installments: "",
        firstPaymentDate: today,
        creditCard: userSettings.lastUsedCard || "",
        initialPayment: "0",
        interestRate: "0",
        paymentType: "monthly",
        customDayOfMonth: "15",
        currency: userSettings.currency,
      })
    }
  }

  const handleAddCard = (card: { name: string; lastFour: string }) => {
    const newCard: CreditCard = {
      id: Date.now().toString(),
      name: card.name,
      lastFour: card.lastFour,
    }
    onAddCard?.(newCard)
  }

  const creditCardOptions = userSettings.creditCards.map((card) => ({
    value: card.lastFour,
    label: `${card.name} (****${card.lastFour})`,
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t.name}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder={t.name}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">{t.currency}</Label>
          <CurrencySelector
            value={formData.currency}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">{t.price}</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
            placeholder="100.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="installments">{t.installments}</Label>
          <Input
            id="installments"
            type="number"
            min="1"
            value={formData.installments}
            onChange={(e) => setFormData((prev) => ({ ...prev, installments: e.target.value }))}
            placeholder="3"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstPaymentDate">{t.firstPaymentDate}</Label>
          <Input
            id="firstPaymentDate"
            type="date"
            value={formData.firstPaymentDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, firstPaymentDate: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="creditCard">{t.creditCard}</Label>
          <EnhancedCombobox
            options={creditCardOptions}
            value={formData.creditCard}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, creditCard: value }))}
            onAddCard={handleAddCard}
            placeholder="Select or search card..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="initialPayment">{t.initialPayment}</Label>
          <Input
            id="initialPayment"
            type="number"
            step="0.01"
            min="0"
            value={formData.initialPayment}
            onChange={(e) => setFormData((prev) => ({ ...prev, initialPayment: e.target.value }))}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interestRate">{t.interestRate}</Label>
          <Input
            id="interestRate"
            type="number"
            step="0.01"
            min="0"
            value={formData.interestRate}
            onChange={(e) => setFormData((prev) => ({ ...prev, interestRate: e.target.value }))}
            placeholder="0.00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentType">{t.paymentSchedule}</Label>
          <Select
            value={formData.paymentType}
            onValueChange={(value: "monthly" | "beginning" | "ending" | "custom") =>
              setFormData((prev) => ({ ...prev, paymentType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">{t.everyMonth}</SelectItem>
              <SelectItem value="beginning">{t.beginningOfMonth}</SelectItem>
              <SelectItem value="ending">{t.endingOfMonth}</SelectItem>
              <SelectItem value="custom">{t.customDayOfMonth}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.paymentType === "custom" && (
          <div className="space-y-2">
            <Label htmlFor="customDayOfMonth">{t.dayOfMonth}</Label>
            <Input
              id="customDayOfMonth"
              type="number"
              min="1"
              max="31"
              value={formData.customDayOfMonth}
              onChange={(e) => setFormData((prev) => ({ ...prev, customDayOfMonth: e.target.value }))}
              placeholder="15"
            />
          </div>
        )}
      </div>

      <Button type="submit" className="w-full">
        {isEditing ? t.updatePayment : t.addNewPayment}
      </Button>
    </form>
  )
}
