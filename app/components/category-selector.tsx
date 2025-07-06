"use client";

import * as React from "react";
import {
  Check,
  ChevronsUpDown,
  Plus,
  Home as HomeFill,
  Car as CarFill,
  Bolt as BoltFill,
  ShoppingCart as ShoppingCartFill,
  PiggyBank as PiggyBankFill,
  Film as FilmFill,
  Heart as HeartFill,
  Shield as ShieldFill,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useExpenseCategories, useAddExpenseCategory } from "../lib/queries";
import type { ExpenseCategory } from "../types/payment";

interface CategorySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  home: HomeFill,
  car: CarFill,
  bolt: BoltFill,
  "shopping-cart": ShoppingCartFill,
  "piggy-bank": PiggyBankFill,
  film: FilmFill,
  heart: HeartFill,
  shield: ShieldFill,
  // add more as needed
};

export function CategorySelector({
  value,
  onValueChange,
}: CategorySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [newCategoryName, setNewCategoryName] = React.useState("");
  const [newCategoryIcon, setNewCategoryIcon] = React.useState("");
  const [newCategoryColor, setNewCategoryColor] = React.useState("#3B82F6");

  const { data: categories = [], isLoading } = useExpenseCategories();
  const addCategoryMutation = useAddExpenseCategory();

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const selectedCategory = categories.find((category) => category.id === value);

  const handleSelect = (categoryId: string) => {
    onValueChange(categoryId);
    setOpen(false);
    setSearchValue("");
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const newCategory = await addCategoryMutation.mutateAsync({
        name: newCategoryName.trim(),
        icon: newCategoryIcon || null,
        color: newCategoryColor,
        is_default: false,
      });

      onValueChange(newCategory.id);
      setShowCreateDialog(false);
      setNewCategoryName("");
      setNewCategoryIcon("");
      setNewCategoryColor("#3B82F6");
      setOpen(false);
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const colorOptions = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#8B5CF6", // Purple
    "#F97316", // Orange
    "#06B6D4", // Cyan
    "#EC4899", // Pink
  ];

  return (
    <div className="relative">
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCategory ? (
              <div className="flex items-center gap-2">
                {selectedCategory.icon && iconMap[selectedCategory.icon] && (
                  <span style={{ color: selectedCategory.color || "#3B82F6" }}>
                    {React.createElement(iconMap[selectedCategory.icon], {
                      size: 18,
                    })}
                  </span>
                )}
                {selectedCategory.icon && !iconMap[selectedCategory.icon] && (
                  <span style={{ color: selectedCategory.color || "#3B82F6" }}>
                    {selectedCategory.icon}
                  </span>
                )}
                <span>{selectedCategory.name}</span>
              </div>
            ) : (
              "Select category..."
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full p-0"
          align="start"
        >
          <Command>
            <CommandInput
              placeholder="Search categories..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                <div className="p-2 text-center text-sm text-muted-foreground">
                  No category found.
                </div>
              </CommandEmpty>
              <div style={{ maxHeight: 240, overflowY: "auto" }}>
                <CommandGroup>
                  {filteredCategories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.id}
                      onSelect={() => handleSelect(category.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === category.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex items-center gap-2">
                        {category.icon && iconMap[category.icon] && (
                          <span style={{ color: category.color || "#3B82F6" }}>
                            {React.createElement(iconMap[category.icon], {
                              size: 18,
                            })}
                          </span>
                        )}
                        {category.icon && !iconMap[category.icon] && (
                          <span style={{ color: category.color || "#3B82F6" }}>
                            {category.icon}
                          </span>
                        )}
                        <span>{category.name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </div>
              <div className="p-2 border-t bg-background sticky bottom-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowCreateDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create new category
                </Button>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Add a new expense category to organize your expenses.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">Category Name</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Groceries, Rent, Utilities"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category-icon">Icon (Optional)</Label>
              <Input
                id="category-icon"
                value={newCategoryIcon}
                onChange={(e) => setNewCategoryIcon(e.target.value)}
                placeholder="e.g., 🛒, 🏠, 💡"
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      newCategoryColor === color
                        ? "border-gray-800 scale-110"
                        : "border-gray-300"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewCategoryColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCategory}
              disabled={
                !newCategoryName.trim() || addCategoryMutation.isPending
              }
            >
              {addCategoryMutation.isPending
                ? "Creating..."
                : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
