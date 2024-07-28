import React from "react";
import { startOfMonth, endOfMonth } from "date-fns";

type DateRangePickerProps = {
  startDate: Date;
  endDate: Date;
  onChange: (dateRange: { startDate: Date; endDate: Date }) => void;
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ startDate: new Date(e.target.value), endDate });
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ startDate, endDate: new Date(e.target.value) });
  };

  return (
    <div>
      <label htmlFor="startDate">
        Start Date:
        <input
          id="startDate"
          name="startDate"
          type="date"
          value={startDate.toISOString().split("T")[0]}
          onChange={handleStartDateChange}
        />
      </label>
      <label htmlFor="endDate">
        End Date:
        <input
          id="endDate"
          name="endDate"
          type="date"
          value={endDate.toISOString().split("T")[0]}
          onChange={handleEndDateChange}
        />
      </label>
    </div>
  );
};
