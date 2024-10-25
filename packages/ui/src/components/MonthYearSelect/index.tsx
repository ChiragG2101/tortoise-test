import React, { useState, useEffect } from "react";
import {
  startOfMonth,
  format,
  addMonths,
  subMonths,
  isAfter,
  parse,
  getMonth,
  getYear,
} from "date-fns";
import { Select, SelectItem } from "@nextui-org/react";

// Define the type for the props
interface MonthYearSelectProps {
  setMonthYear: (date: { month: number; year: number } | null) => void;
}

// MonthYearSelect component allows users to select a month and year
const MonthYearSelect: React.FC<MonthYearSelectProps> = ({ setMonthYear }) => {
  // State to keep track of the currently selected period
  const [currentPeriod, setCurrentPeriod] = useState<Date | null>(
    startOfMonth(new Date())
  );
  // State to store the list of period options for the dropdown
  const [periodOptions, setPeriodOptions] = useState<string[]>([]);

  useEffect(() => {
    // Extract the month and year from the current period and set it using the provided function
    if (currentPeriod) {
      const [start_month, start_year] = format(currentPeriod, "M yyyy").split(
        " "
      );
      setMonthYear({
        month: parseInt(start_month),
        year: parseInt(start_year),
      });
    }

    // Initialize the current date to 2 months from now and the past date to 1 year ago
    let currentDate = addMonths(startOfMonth(new Date()), 2);
    const pastDate = subMonths(startOfMonth(new Date()), 12);
    const periods: string[] = [];

    // Generate a list of month-year strings from the current date to the past date
    while (
      isAfter(currentDate, pastDate) ||
      currentDate.getTime() === pastDate.getTime()
    ) {
      periods.push(format(currentDate, "MMM yyyy"));
      currentDate = subMonths(currentDate, 1);
    }

    // Update the period options state
    setPeriodOptions(periods);
  }, []);

  // Handle changes in the selected period
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      // Parse the selected date and update the state and props
      const date = parse(e.target.value, "MMM yyyy", new Date());
      setMonthYear({ month: getMonth(date) + 1, year: getYear(date) });
      setCurrentPeriod(date);
    } else {
      // Reset the state and props if no value is selected
      setMonthYear(null);
      setCurrentPeriod(null);
    }
  };

  return (
    <div className="flex gap-2">
      <Select
        defaultSelectedKeys={
          currentPeriod
            ? new Set([format(currentPeriod, "MMM yyyy")])
            : undefined
        }
        size="sm"
        style={{
          width: "150px",
          border: "2px solid #E1E1E1",
          borderRadius: "8px",
        }}
        aria-label="Month & Year"
        placeholder="Select month & year"
        onChange={handlePeriodChange}
      >
        {periodOptions.map((period) => (
          <SelectItem key={period} value={period}>
            {period}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export { MonthYearSelect };
