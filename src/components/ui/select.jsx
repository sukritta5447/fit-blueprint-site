import { Check, ChevronDown } from "lucide-react"
import { Select as SelectPrimitive } from "radix-ui"

import { cn } from "../../utils/utils"

const selectClasses = {
  trigger:
    "flex h-12 w-full items-center justify-between rounded-xl border border-stone-300 bg-white px-5 text-sm font-medium text-neutral-500 shadow-xs outline-none transition focus-visible:ring-2 focus-visible:ring-neutral-300 disabled:cursor-not-allowed disabled:opacity-50",
  content:
    "z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-stone-200 bg-white p-2 text-neutral-950 shadow-lg",
  item:
    "relative flex cursor-default select-none items-center rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition hover:bg-stone-100 focus:bg-stone-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
}

// Root keeps the selected value and calls onValueChange when the user picks an item.
function Select({ ...rootProps }) {
  return <SelectPrimitive.Root data-slot="select" {...rootProps} />
}

// Trigger is the button the user clicks to open the select menu.
function SelectTrigger({ className, children, ...triggerProps }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn(selectClasses.trigger, className)}
      {...triggerProps}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-5 text-neutral-500" strokeWidth={1.8} />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

// Value displays the currently selected item inside the trigger.
function SelectValue({ ...valueProps }) {
  return <SelectPrimitive.Value data-slot="select-value" {...valueProps} />
}

// Content is the floating menu. Portal makes sure it appears above the page layout.
function SelectContent({ className, children, ...contentProps }) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(selectClasses.content, className)}
        position="popper"
        sideOffset={8}
        {...contentProps}
      >
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

// Item is one selectable row in the menu.
function SelectItem({ className, children, ...itemProps }) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(selectClasses.item, className)}
      {...itemProps}
    >
      <span className="absolute left-3 flex size-5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" strokeWidth={2} />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
