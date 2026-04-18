import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 w-full", className)}
      classNames={{
        months: "flex flex-col w-full",
        month: "w-full",
        caption: "flex justify-center pb-2 pt-1 relative items-center",
        caption_label: "text-base font-bold text-[#111111]",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-8 w-8 bg-white border border-gray-200 p-0 hover:bg-[#E31E24] hover:text-white hover:border-[#E31E24] transition-colors"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex w-full",
        head_cell: "text-[#999999] rounded-md flex-1 font-semibold text-xs text-center py-2",
        row: "flex w-full mt-1",
        cell: cn(
          "relative flex-1 p-0.5 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#E31E24]/10 [&:has([aria-selected])]:rounded-lg",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-lg [&:has(>.day-range-start)]:rounded-l-lg"
            : "[&:has([aria-selected])]:rounded-lg"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "w-full h-10 p-0 font-medium text-sm rounded-lg hover:bg-[#E31E24]/10 hover:text-[#E31E24] aria-selected:opacity-100"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-[#E31E24] text-white hover:bg-[#E31E24] hover:text-white focus:bg-[#E31E24] focus:text-white rounded-lg font-bold",
        day_today: "bg-[#E31E24]/10 text-[#E31E24] font-bold",
        day_outside:
          "day-outside text-[#CCCCCC] aria-selected:bg-[#E31E24]/5 aria-selected:text-[#CCCCCC]",
        day_disabled: "text-[#DDDDDD] opacity-40 cursor-not-allowed",
        day_range_middle:
          "aria-selected:bg-[#E31E24]/10 aria-selected:text-[#E31E24]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props} />
  );
}
Calendar.displayName = "Calendar"

export { Calendar }
