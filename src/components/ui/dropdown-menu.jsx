import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui"

import { cn } from "../utils"

const dropdownMenuClasses = {
  content:
    "z-50 min-w-56 rounded-2xl border border-stone-200 bg-[#f8f7f4] p-6 shadow-lg",
  item: "outline-none",
}

// Root controls the open/close state of the dropdown menu.
function DropdownMenu({ ...rootProps }) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...rootProps} />
}

// Trigger is the button the user clicks, e.g. the hamburger icon.
function DropdownMenuTrigger({ ...triggerProps }) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...triggerProps}
    />
  )
}

// Content is the floating panel. Portal keeps it above the rest of the page.
function DropdownMenuContent({
  className,
  children,
  sideOffset = 12,
  ...contentProps
}) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(dropdownMenuClasses.content, className)}
        {...contentProps}
      >
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
}

// Item is one clickable row/link inside the dropdown menu.
function DropdownMenuItem({ className, ...itemProps }) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      className={cn(dropdownMenuClasses.item, className)}
      {...itemProps}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
}
