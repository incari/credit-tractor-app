"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Trash2, Plus, Edit, CreditCardIcon } from "lucide-react";
import type { UserSettings, CreditCard, Payment } from "../types/payment";
import { formatCurrency } from "../utils/currencies";
import { translations } from "../utils/translations";
import { calculateCreditUsage } from "../utils/credit-utils";
import { CurrencySelector } from "./currency-selector";
import { useUpdateUserSettings } from "../lib/queries";
import {
  useAddCreditCard,
  useUpdateCreditCard,
  useDeleteCreditCard,
} from "../lib/queries";
import { UserOnboardingModal } from "./UserOnboardingModal";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SettingsProps {
  userSettings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  payments?: Payment[];
  onUpdatePayments?: (payments: Payment[]) => void;
  creditCards?: CreditCard[];
}

export function Settings({
  userSettings,
  onUpdateSettings,
  payments = [],
  onUpdatePayments,
  creditCards,
}: SettingsProps) {
  const [newCard, setNewCard] = useState({
    name: "",
    lastFour: "",
    limit: "",
    yearlyFee: "",
  });
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
  const [addCardError, setAddCardError] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const t = translations[userSettings.language];
  const updateUserSettings = useUpdateUserSettings();
  const addCreditCardMutation = useAddCreditCard();
  const updateCreditCardMutation = useUpdateCreditCard();
  const deleteCreditCardMutation = useDeleteCreditCard();
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Fetch user email on mount
  useEffect(() => {
    supabase.auth
      .getUser()
      .then(({ data }: { data: { user?: { email?: string } } }) => {
        const user = data?.user ?? null;
        setUserEmail(user?.email || null);
      });
  }, []);

  // Use the live credit card list if provided, otherwise fallback to userSettings.creditCards
  const cards = creditCards ?? userSettings.creditCards;

  const handleLanguageChange = (language: UserSettings["language"]) => {
    updateUserSettings.mutate(
      { ...userSettings, language },
      {
        onSuccess: () => onUpdateSettings({ ...userSettings, language }),
        onError: () => alert("Failed to update language setting"),
      }
    );
  };

  const handleCurrencyChange = (currency: string) => {
    updateUserSettings.mutate(
      { ...userSettings, currency },
      {
        onSuccess: () => onUpdateSettings({ ...userSettings, currency }),
        onError: () => alert("Failed to update currency setting"),
      }
    );
  };

  const handleAddCard = () => {
    setAddCardError("");
    if (newCard.name && newCard.lastFour && newCard.lastFour.length === 4) {
      // Check for duplicate last four digits
      const exists = cards.some((card) => card.lastFour === newCard.lastFour);
      if (exists) {
        setAddCardError("A card with these last four digits already exists.");
        return;
      }
      addCreditCardMutation.mutate(
        {
          name: newCard.name,
          lastFour: newCard.lastFour,
          limit: newCard.limit ? Number.parseFloat(newCard.limit) : undefined,
          yearlyFee: newCard.yearlyFee
            ? Number.parseFloat(newCard.yearlyFee)
            : undefined,
        },
        {
          onError: () => setAddCardError("Failed to add credit card"),
        }
      );
      setNewCard({ name: "", lastFour: "", limit: "", yearlyFee: "" });
    }
  };

  const handleUpdateCard = (updatedCard: CreditCard) => {
    const oldCard = (creditCards ?? userSettings.creditCards).find(
      (c) => c.id === updatedCard.id
    );

    updateCreditCardMutation.mutate(updatedCard, {
      onError: () => alert("Failed to update credit card"),
    });

    // Update all payments that use this card
    if (oldCard && onUpdatePayments) {
      const updatedPayments = payments.map((payment) =>
        payment.creditCard === oldCard.lastFour
          ? { ...payment, creditCard: updatedCard.lastFour }
          : payment
      );
      onUpdatePayments(updatedPayments);
    }

    setEditingCard(null);
  };

  const handleDeleteCard = (cardId: string) => {
    deleteCreditCardMutation.mutate(cardId, {
      onError: () => alert("Failed to delete credit card"),
    });
  };

  async function handleDeleteAccountConfirmed() {
    if (deleteEmail !== userEmail) {
      setDeleteError(
        "Email does not match. Please enter your account email to confirm."
      );
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw userError || new Error("User not found");
      const userId = user.id;

      // Call the secure API route to delete user and all data
      const res = await fetch("/api/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to delete account.");

      // Sign out and redirect
      await supabase.auth.signOut();
      router.push("/");
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete account.");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setDeleteEmail("");
    }
  }

  const languages = [
    { code: "EN", name: "English" },
    { code: "ES", name: "Español" },
    { code: "DE", name: "Deutsch" },
    { code: "FR", name: "Français" },
    { code: "IT", name: "Italiano" },
    { code: "PT", name: "Português" },
  ];

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
                onChange={(e) =>
                  setEditingCard((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                placeholder="My Credit Card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editLastFour">{t.lastFourDigits}</Label>
              <Input
                id="editLastFour"
                value={editingCard.lastFour}
                onChange={(e) =>
                  setEditingCard((prev) =>
                    prev ? { ...prev, lastFour: e.target.value } : null
                  )
                }
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
                    prev
                      ? {
                          ...prev,
                          limit: e.target.value
                            ? Number.parseFloat(e.target.value)
                            : undefined,
                        }
                      : null
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
                      ? {
                          ...prev,
                          yearlyFee: e.target.value
                            ? Number.parseFloat(e.target.value)
                            : undefined,
                        }
                      : null
                  )
                }
                placeholder="100.00"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleUpdateCard(editingCard)}
              className="flex-1"
            >
              {t.updateCard}
            </Button>
            <Button
              variant="outline"
              onClick={() => setEditingCard(null)}
              className="flex-1"
            >
              {t.close}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <UserOnboardingModal
        open={showOnboarding}
        onComplete={() => setShowOnboarding(false)}
        onRequestClose={() => setShowOnboarding(false)}
      />
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() => setShowOnboarding(true)}
        >
          Edit Profile Info
        </Button>
      </div>
      {deleteError && (
        <div className="text-red-600 text-sm text-right mt-2">
          {deleteError}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>{t.settings}</CardTitle>
          <CardDescription>{t.settingsDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="language">{t.language}</Label>
              <Select
                value={userSettings.language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem
                      key={lang.code}
                      value={lang.code}
                    >
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">{t.currency}</Label>
              <CurrencySelector
                value={userSettings.currency}
                onValueChange={handleCurrencyChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t.creditCards}</CardTitle>
          <CardDescription>
            Manage your saved credit cards and track usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {cards.map((card) => {
              const usage = calculateCreditUsage(
                payments,
                card,
                userSettings.currency
              );

              return (
                <div
                  key={card.id}
                  className="border rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium">{card.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ****{card.lastFour}
                      </div>
                      {card.yearlyFee && (
                        <div className="text-xs text-muted-foreground">
                          {t.yearlyFee}:{" "}
                          {formatCurrency(
                            card.yearlyFee,
                            userSettings.currency
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingCard(card)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCard(card.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {usage.hasLimit ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t.creditUsage}</span>
                        <span>
                          {formatCurrency(
                            usage.totalUsed,
                            userSettings.currency
                          )}{" "}
                          / {formatCurrency(usage.limit, userSettings.currency)}
                        </span>
                      </div>
                      <Progress
                        value={usage.utilization}
                        className="h-2"
                      />
                      <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                        <div>
                          <span className="font-medium">{t.used}:</span>{" "}
                          {formatCurrency(
                            usage.totalUsed,
                            userSettings.currency
                          )}
                        </div>
                        <div>
                          <span className="font-medium">{t.available}:</span>{" "}
                          {formatCurrency(
                            usage.available,
                            userSettings.currency
                          )}
                        </div>
                        <div>
                          <span className="font-medium">{t.utilization}:</span>{" "}
                          {usage.utilization.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <CreditCardIcon className="h-4 w-4" />
                      <span>{t.noLimit}</span>
                      <span>•</span>
                      <span>
                        {t.totalUsed}:{" "}
                        {formatCurrency(usage.totalUsed, userSettings.currency)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {cards.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No credit cards saved yet
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">{t.addCreditCard}</h4>
            {addCardError && (
              <div className="text-red-500 text-sm mb-2">{addCardError}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="space-y-2">
                <Label htmlFor="cardName">{t.cardName}</Label>
                <Input
                  id="cardName"
                  value={newCard.name}
                  onChange={(e) =>
                    setNewCard((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="My Credit Card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastFour">{t.lastFourDigits}</Label>
                <Input
                  id="lastFour"
                  value={newCard.lastFour}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setNewCard((prev) => ({ ...prev, lastFour: value }));
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
                  onChange={(e) =>
                    setNewCard((prev) => ({ ...prev, limit: e.target.value }))
                  }
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
                  onChange={(e) =>
                    setNewCard((prev) => ({
                      ...prev,
                      yearlyFee: e.target.value,
                    }))
                  }
                  placeholder="100.00"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleAddCard}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Delete Account Section at the end */}
      <div className="mt-8">
        <hr className="my-6" />
        <div className="flex flex-col items-end">
          <Button
            variant="destructive"
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
          >
            Delete Account
          </Button>
        </div>
        <Dialog
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Account</DialogTitle>
              <DialogDescription>
                This action will permanently delete your account and all
                associated data. This cannot be undone.
                <br />
                Please enter your email (
                <span className="font-mono">{userEmail}</span>) to confirm.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter your email to confirm"
                value={deleteEmail}
                onChange={(e) => setDeleteEmail(e.target.value)}
                disabled={deleting}
              />
              {deleteError && (
                <div className="text-red-600 text-sm">{deleteError}</div>
              )}
            </div>
            <DialogFooter className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccountConfirmed}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
