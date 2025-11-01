import { useRef, useMemo, useState, useEffect } from 'react';
import { Unit } from '@/types/common';
import { UNIT } from '@/constants/unit';

interface UseUnitInputProps {
  value: string;
  unit: Unit;
  onValueChange: (value: string) => void;
}

interface UseUnitInputReturn {
  inputValue: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputBlur: () => void;
  handleIncrement: () => void;
  handleDecrement: () => void;
  isDecrementDisabled: boolean;
  isIncrementDisabled: boolean;
}

export const useUnitInput = ({
  value,
  unit,
  onValueChange,
}: UseUnitInputProps): UseUnitInputReturn => {
  const [inputValue, setInputValue] = useState<string>(value);
  
  // Store the last valid value
  const lastValidValueRef = useRef<string>(value);

  // Sync inputValue with value prop when it changes from outside
  useEffect(() => {
    setInputValue(value);
    lastValidValueRef.current = value;
  }, [value]);

  // Sanitize input and find the nearest valid number
  const sanitizeNumber = (input: string): string => {
    if (!input || input === "") {
      return lastValidValueRef.current;
    }

    input = input.trim().replace(/,/g, ".");

    // Check if the input is valid:
    // - Starts with an optional minus, followed by a digit or dot
    // - Letters (a-z, A-Z) are only allowed after the first character
    // - Only one dot is allowed in the entire string
    const isFullyValid =
      /^-?[\d.][\da-zA-Z.]*$/.test(input) &&
      (input.match(/\./g) || []).length <= 1;

    if (!isFullyValid) {
      return lastValidValueRef.current;
    }

    // Find the valid number part from the start of the string
    const match = input.match(/^-?\d*\.?\d*/);

    if (!match || match[0] === "" || match[0] === "-" || match[0] === ".") {
      return lastValidValueRef.current;
    }

    let result = match[0];

    // If result starts with ".", replace with "0."
    if (result.startsWith(".")) {
      result = "0" + result;
    }
    // Remove trailing dot
    if (result.endsWith(".")) {
      result = result.slice(0, -1);
    }

    if (!result || result === "") {
      return "0";
    }

    return result;
  };

  // Validate value by unit and rules
  const validateByUnit = (value: string, currentUnit: Unit): string => {
    const num = parseFloat(value);

    if (isNaN(num)) {
      return lastValidValueRef.current;
    }

    if (num < 0) {
      return "0";
    }

    // For percent unit, if value > 100, return last valid value
    if (currentUnit === UNIT.PERCENT && num > 100) {
      return lastValidValueRef.current;
    }

    return parseFloat(value).toString();
  };

  // Update inputValue when typing (not validated yet)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  // Validate and update value on blur
  const handleInputBlur = (): void => {
    const sanitized = sanitizeNumber(inputValue);
    const validated = validateByUnit(sanitized, unit);
    setInputValue(validated);
    onValueChange(validated);
    lastValidValueRef.current = validated;
  };

  // Increment value
  const handleIncrement = (): void => {
    const num = parseFloat(value) || 0;
    const step = unit === UNIT.PERCENT ? 1 : 10;
    let newValue = num + step;

    if (unit === UNIT.PERCENT && newValue > 100) {
      newValue = 100;
    }

    const newValueStr = newValue.toString();
    setInputValue(newValueStr);
    onValueChange(newValueStr);
    lastValidValueRef.current = newValueStr;
  };

  // Decrement value
  const handleDecrement = (): void => {
    const num = parseFloat(value) || 0;
    const step = unit === UNIT.PERCENT ? 1 : 10;
    let newValue = num - step;

    if (newValue < 0) {
      newValue = 0;
    }

    const newValueStr = newValue.toString();
    setInputValue(newValueStr);
    onValueChange(newValueStr);
    lastValidValueRef.current = newValueStr;
  };

  // Computed values for disabling buttons
  const numValue = useMemo<number>(() => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }, [value]);

  const isDecrementDisabled = useMemo<boolean>(() => numValue <= 0, [numValue]);
  const isIncrementDisabled = useMemo<boolean>(
    () => unit === UNIT.PERCENT && numValue >= 100,
    [unit, numValue]
  );

  return {
    inputValue,
    handleInputChange,
    handleInputBlur,
    handleIncrement,
    handleDecrement,
    isDecrementDisabled,
    isIncrementDisabled,
  };
};