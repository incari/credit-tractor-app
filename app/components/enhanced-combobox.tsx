"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CreditCard {
  lastFour: string
  name: string
}

interface EnhancedComboboxProps {
  options: { value: string; label: string }[]
  value: string
  onValueChange: (value: string) => void
  onAddCard?: (card: CreditCard) => void
  placeholder?: string
}

export function EnhancedCombobox({
  options,
  value,
  onValueChange,
  onAddCard,
  placeholder = "Select or search...",
}: EnhancedComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const [showAddDialog, setShowAddDialog] = React.useState(false)
  const [newCard, setNewCard] = React.useState({ name: "", lastFour: "" })
  const [error, setError] = React.useState("")

  const filteredOptions = options.filter((option) => {
    const searchLower = searchValue.toLowerCase()
    return (
      option.label.toLowerCase().includes(searchLower) ||
      option.value.toLowerCase().includes(searchLower) ||
      // Extract card name from label format "Card Name (****1234)"
      option.label
        .split(" (")[0]
        .toLowerCase()
        .includes(searchLower)
    )
  })

  const displayValue = options.find((option) => option.value === value)?.label || value

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue)
    setOpen(false)
    setSearchValue("")
  }

  const handleAddCard = () => {
    setError("")

    if (!newCard.name || !newCard.lastFour || newCard.lastFour.length !== 4) {
      setError("Please fill in all fields correctly")
      return
    }

    // Check if card already exists
    const cardExists = options.some((option) => option.value === newCard.lastFour)
    if (cardExists) {
      setError("A card with these last four digits already exists")
      return
    }

    onAddCard?.(newCard)
    onValueChange(newCard.lastFour)
    setNewCard({ name: "", lastFour: "" })
    setShowAddDialog(false)
    setOpen(false)
  }

  // Add this function to handle opening the dialog with autofill
  const handleOpenAddDialog = () => {
    setError("")
    // Autofill based on search value
    if (searchValue) {
      const isNumeric = /^\d+$/.test(searchValue)
      if (isNumeric && searchValue.length <= 4) {
        // If it's numbers, put in lastFour field
        setNewCard({ name: "", lastFour: searchValue })
      } else {
        // If it's text, put in name field
        setNewCard({ name: searchValue, lastFour: "" })
      }
    }
    setShowAddDialog(true)
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {displayValue || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search by name or number..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                <div className="p-2 space-y-2">
                  <p className="text-sm text-muted-foreground">No cards found.</p>
                  <Button variant="outline" size="sm" className="w-full" onClick={handleOpenAddDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Card
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem key={option.value} value={option.value} onSelect={() => handleSelect(option.value)}>
                    <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                    {option.label}
                  </CommandItem>
                ))}
                <CommandItem onSelect={handleOpenAddDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Card
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Credit Card</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="cardName">Card Name</Label>
              <Input
                id="cardName"
                value={newCard.name}
                onChange={(e) => setNewCard((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="My Credit Card"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastFour">Last Four Digits</Label>
              <Input
                id="lastFour"
                value={newCard.lastFour}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 4)
                  setNewCard((prev) => ({ ...prev, lastFour: value }))
                  setError("") // Clear error when user types
                }}
                placeholder="1234"
                maxLength={4}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddCard}
                className="flex-1"
                disabled={!newCard.name || newCard.lastFour.length !== 4 || !!error}
              >
                Add Card
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
