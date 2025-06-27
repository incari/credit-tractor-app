"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Trash2, Plus, Edit, CreditCardIcon } from "lucide-react"
import type { UserSettings, CreditCard, Payment } from "../types/payment"
import { formatCurrency } from "../utils/currencies"
import { translations } from "../utils/translations"
import { calculateCreditUsage } from "../utils/credit-utils"
import { CurrencySelector } from "./currency-selector"

interface SettingsProps {
  userSettings: UserSettings
  onUpdateSettings: (settings: UserSettings) => void
  payments?: Payment[]
  onUpdatePayments?: (payments: Payment[]) => void
}

export function Settings({ userSettings, onUpdateSettings, payments = [], onUpdatePayments }: SettingsProps) {
  const [newCard, setNewCard] = useState({ name: "", lastFour: "", limit: "", yearlyFee: "" })
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null)
  const t = translations[userSettings.language]

  const handleLanguageChange = (language: UserSettings["language"]) => {
    onUpdateSettings({ ...userSettings, language })
  }

  const handleCurrencyChange = (currency: string) => {
    onUpdateSettings({ ...userSettings, currency })
  }

  const handleAddCard = () => {
    if (newCard.name && newCard.lastFour && newCard.lastFour.length === 4) {
      const card: CreditCard = {
        id: Date.now().toString(),
        name: newCard.name,
        lastFour: newCard.lastFour,
        limit: newCard.limit ? Number.parseFloat(newCard.limit) : undefined,
        yearlyFee: newCard.yearlyFee ? Number.parseFloat(newCard.yearlyFee) : undefined,
      }
      onUpdateSettings({
        ...userSettings,
        creditCards: [...userSettings.creditCards, card],
      })
      setNewCard({ name: "", lastFour: "", limit: "", yearlyFee: "" })
    }
  }

  const handleUpdateCard = (updatedCard: CreditCard) => {
    const oldCard = userSettings.creditCards.find((c) => c.id === updatedCard.id)

    // Update the card in settings
    onUpdateSettings({
      ...userSettings,
      creditCards: userSettings.creditCards.map((card) => (card.id === updatedCard.id ? updatedCard : card)),
    })

    // Update all payments that use this card
    if (oldCard && onUpdatePayments) {
      const updatedPayments = payments.map((payment) =>
        payment.creditCard === oldCard.lastFour ? { ...payment, creditCard: updatedCard.lastFour } : payment,
      )
      onUpdatePayments(updatedPayments)
    }

    setEditingCard(null)
  }

  const handleDeleteCard = (cardId: string) => {
    onUpdateSettings({
      ...userSettings,
      creditCards: userSettings.creditCards.filter((card) => card.id !== cardId),
    })
  }

  const languages = [
    { code: "EN", name: "English" },
    { code: "ES", name: "Español" },
    { code: "DE", name: "Deutsch" },
    { code: "FR", name: "Français" },
    { code: "IT", name: "Italiano" },
    { code: "PT", name: "Português" },
  ]

  if (editingCard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t.editCreditCard}</CardTitle>
          <CardDescription>Update credit card information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="editCardName">{t.cardName}</Label>
              <Input
                id="editCardName"
                value={editingCard.name}
                onChange={(e) => setEditingCard((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                placeholder="My Credit Card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editLastFour">{t.lastFourDigits}</Label>
              <Input
                id="editLastFour"
                value={editingCard.lastFour}
                onChange={(e) => setEditingCard((prev) => (prev ? { ...prev, lastFour: e.target.value } : null))}
                placeholder="1234"
                maxLength={4}
                pattern="[0-9]{4}"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editLimit">
                {t.creditLimit} ({t.optional})
              </Label>
              <Input
                id="editLimit"
                type="number"
                step="0.01"
                min="0"
                value={editingCard.limit?.toString() || ""}
                onChange={(e) =>
                  setEditingCard((prev) =>
                    prev ? { ...prev, limit: e.target.value ? Number.parseFloat(e.target.value) : undefined } : null,
                  )
                }
                placeholder="5000.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editYearlyFee">
                {t.yearlyFee} ({t.optional})
              </Label>
              <Input
                id="editYearlyFee"
                type="number"
                step="0.01"
                min="0"
                value={editingCard.yearlyFee?.toString() || ""}
                onChange={(e) =>
                  setEditingCard((prev) =>
                    prev
                      ? { ...prev, yearlyFee: e.target.value ? Number.parseFloat(e.target.value) : undefined }
                      : null,
                  )
                }
                placeholder="100.00"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => handleUpdateCard(editingCard)} className="flex-1">
              {t.updateCard}
            </Button>
            <Button variant="outline" onClick={() => setEditingCard(null)} className="flex-1">
              {t.close}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t.settings}</CardTitle>
          <CardDescription>{t.settingsDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">{t.language}</Label>
              <Select value={userSettings.language} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">{t.currency}</Label>
              <CurrencySelector value={userSettings.currency} onValueChange={handleCurrencyChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.creditCards}</CardTitle>
          <CardDescription>Manage your saved credit cards and track usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {userSettings.creditCards.map((card) => {
              const usage = calculateCreditUsage(payments, card, userSettings.currency)

              return (
                <div key={card.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">{card.name}</div>
                      <div className="text-sm text-muted-foreground">****{card.lastFour}</div>
                      {card.yearlyFee && (
                        <div className="text-xs text-muted-foreground">
                          {t.yearlyFee}: {formatCurrency(card.yearlyFee, userSettings.currency)}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingCard(card)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteCard(card.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {usage.hasLimit ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t.creditUsage}</span>
                        <span>
                          {formatCurrency(usage.totalUsed, userSettings.currency)} /{" "}
                          {formatCurrency(usage.limit, userSettings.currency)}
                        </span>
                      </div>
                      <Progress value={usage.utilization} className="h-2" />
                      <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium">{t.used}:</span>{" "}
                          {formatCurrency(usage.totalUsed, userSettings.currency)}
                        </div>
                        <div>
                          <span className="font-medium">{t.available}:</span>{" "}
                          {formatCurrency(usage.available, userSettings.currency)}
                        </div>
                        <div>
                          <span className="font-medium">{t.utilization}:</span> {usage.utilization.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4" />
                      <span>{t.noLimit}</span>
                      <span>•</span>
                      <span>
                        {t.totalUsed}: {formatCurrency(usage.totalUsed, userSettings.currency)}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}

            {userSettings.creditCards.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">No credit cards saved yet</div>
            )}
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">{t.addCreditCard}</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cardName">{t.cardName}</Label>
                <Input
                  id="cardName"
                  value={newCard.name}
                  onChange={(e) => setNewCard((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="My Credit Card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastFour">{t.lastFourDigits}</Label>
                <Input
                  id="lastFour"
                  value={newCard.lastFour}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4)
                    setNewCard((prev) => ({ ...prev, lastFour: value }))
                  }}
                  placeholder="1234"
                  maxLength={4}
                  pattern="[0-9]{4}"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="limit">
                  {t.creditLimit} ({t.optional})
                </Label>
                <Input
                  id="limit"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newCard.limit}
                  onChange={(e) => setNewCard((prev) => ({ ...prev, limit: e.target.value }))}
                  placeholder="5000.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearlyFee">
                  {t.yearlyFee} ({t.optional})
                </Label>
                <Input
                  id="yearlyFee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={newCard.yearlyFee}
                  onChange={(e) => setNewCard((prev) => ({ ...prev, yearlyFee: e.target.value }))}
                  placeholder="100.00"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddCard} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
