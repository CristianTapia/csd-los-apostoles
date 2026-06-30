"use client";

import { FormField, TextInput } from "@/components/ui/form/FormField";

type DateTimeValue = {
  date: string;
  time: string;
};

type DateTimeFieldProps = {
  idPrefix: string;
  name: string;
  value: DateTimeValue;
  onChange: (value: DateTimeValue) => void;
  dateLabel?: string;
  timeLabel?: string;
  error?: string;
};

export function DateTimeField({
  idPrefix,
  name,
  value,
  onChange,
  dateLabel = "Fecha",
  timeLabel = "Hora",
  error,
}: DateTimeFieldProps) {
  const hiddenValue = buildDateTimeValue(value);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name={name} value={hiddenValue} />

      <FormField htmlFor={`${idPrefix}-date`} label={dateLabel} error={error}>
        <TextInput
          id={`${idPrefix}-date`}
          type="date"
          value={value.date}
          onChange={(event) =>
            onChange({
              ...value,
              date: event.target.value,
            })
          }
        />
      </FormField>

      <FormField htmlFor={`${idPrefix}-time`} label={timeLabel}>
        <TextInput
          id={`${idPrefix}-time`}
          type="time"
          value={value.time}
          onChange={(event) =>
            onChange({
              ...value,
              time: event.target.value,
            })
          }
        />
      </FormField>
    </div>
  );
}

function buildDateTimeValue(value: DateTimeValue) {
  if (!value.date && !value.time) return "";

  if (value.date && value.time) {
    return `${value.date}T${value.time}`;
  }

  return "__invalid_datetime__";
}
