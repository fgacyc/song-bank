import * as React from "react";
import { CalendarIcon, ChevronDown, X } from "lucide-react";
import { Button } from "@/features/shared/ui/Button";
import { Calendar } from "@/features/shared/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/features/shared/ui/Popover";
import { useEffect } from "react";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export function DatePicker({
  value: controlledValue,
  onChange,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(controlledValue);
  const [month, setMonth] = React.useState<Date | undefined>(controlledValue);

  useEffect(() => {
    setDate(controlledValue);
    setMonth(controlledValue);
  }, [controlledValue]);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDate(undefined);
    setMonth(undefined);
    onChange?.(undefined);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id="date-picker"
          variant="outline"
          className="h-[36px] min-w-[180px] justify-between gap-2 rounded-lg border border-border bg-background px-3 text-left font-normal hover:bg-background/80"
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-3.5 text-text-secondary" />
            <span
              className={date ? "text-text-primary" : "text-text-secondary"}
            >
              {date ? formatDate(date) : "Release Date"}
            </span>
          </div>
          {date ? (
            <button
              type="button"
              onClick={handleClear}
              className="flex h-6 w-6 items-center justify-center rounded hover:bg-bg-quaternary"
              aria-label="Clear date"
            >
              <X className="size-4 text-text-secondary opacity-50 hover:opacity-100" />
            </button>
          ) : (
            <ChevronDown className="size-4 text-text-secondary opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0"
        align="end"
        alignOffset={-8}
        sideOffset={10}
      >
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          month={month}
          onMonthChange={setMonth}
          onSelect={(date) => {
            setDate(date);
            onChange?.(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
