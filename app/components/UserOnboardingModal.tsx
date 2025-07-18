import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
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
import { useUpdateUserSettings } from "@/app/lib/queries";

const languages = [
  { code: "EN", name: "English" },
  { code: "ES", name: "Español" },
  { code: "DE", name: "Deutsch" },
  { code: "FR", name: "Français" },
  { code: "IT", name: "Italiano" },
  { code: "PT", name: "Português" },
];

const currencies = [
  { code: "EUR", name: "Euro" },
  { code: "USD", name: "US Dollar" },
  { code: "GBP", name: "British Pound" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "BRL", name: "Brazilian Real" },
  { code: "MXN", name: "Mexican Peso" },
];

export function UserOnboardingModal({
  open,
  onComplete,
  onRequestClose,
}: {
  open: boolean;
  onComplete: () => void;
  onRequestClose?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [language, setLanguage] = useState<
    "EN" | "ES" | "DE" | "FR" | "IT" | "PT"
  >("EN");
  const [currency, setCurrency] = useState("EUR");
  const [loading, setLoading] = useState(false);
  const updateUserSettings = useUpdateUserSettings();

  const steps = [
    {
      label: "Your Name",
      content: (
        <div className="space-y-4">
          <Label htmlFor="onboarding-name">Name</Label>
          <Input
            id="onboarding-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            autoFocus
          />
        </div>
      ),
      canContinue: !!name.trim(),
    },
    {
      label: "Language",
      content: (
        <div className="space-y-4">
          <Label htmlFor="onboarding-language">Language</Label>
          <Select
            value={language}
            onValueChange={(v) => setLanguage(v as typeof language)}
          >
            <SelectTrigger id="onboarding-language">
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
      ),
      canContinue: !!language,
    },
    {
      label: "Currency",
      content: (
        <div className="space-y-4">
          <Label htmlFor="onboarding-currency">Currency</Label>
          <Select
            value={currency}
            onValueChange={setCurrency}
          >
            <SelectTrigger id="onboarding-currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((cur) => (
                <SelectItem
                  key={cur.code}
                  value={cur.code}
                >
                  {cur.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ),
      canContinue: !!currency,
    },
  ];

  const handleNext = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleFinish = async () => {
    setLoading(true);
    try {
      await updateUserSettings.mutateAsync({
        language,
        currency,
      });
      onComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onRequestClose?.();
      }}
    >
      <DialogContent className="max-w-md animate-fade-in">
        <DialogHeader>
          <DialogTitle>Welcome! Let’s set up your account</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <Progress value={((step + 1) / steps.length) * 100} />
        </div>
        <div className="min-h-[120px] transition-all duration-300">
          {steps[step].content}
        </div>
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0 || loading}
          >
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              disabled={!steps[step].canContinue || loading}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleFinish}
              disabled={!steps[step].canContinue || loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="loader mr-2" />
                  Finishing...
                </span>
              ) : (
                "Finish"
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
