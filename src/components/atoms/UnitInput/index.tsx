import { UNIT } from "@/constants/unit";
import { Unit } from "@/types/common";
import React from "react";
import Tooltip from "../Tooltip";
import { useUnitInput } from "./useUnitInput";

interface UnitInputProps {
  value?: string;
  unit?: Unit;
  onValueChange: (value: string) => void;
}

const UnitInput: React.FC<UnitInputProps> = ({
  value = "0",
  unit = UNIT.PERCENT,
  onValueChange,
}) => {
  const {
    inputValue,
    handleInputChange,
    handleInputBlur,
    handleIncrement,
    handleDecrement,
    isDecrementDisabled,
    isIncrementDisabled,
  } = useUnitInput({ value, unit, onValueChange });

  return (
    <div className="group/container flex items-center w-fit focus-within:outline rounded-lg focus-within:outline-blue-500">
      {/* Decrement Button */}
      <Tooltip
        content="Value must greater than 0"
        position="top"
        isShow={isDecrementDisabled}
      >
        <button
          onClick={handleDecrement}
          disabled={isDecrementDisabled}
          className={`group/minus min-w-9 h-9 flex items-center justify-center rounded-l-lg transition-colors hover:cursor-pointer bg-gray-900 hover:bg-gray-800 group-has-[.input-field:hover]/container:bg-gray-800 disabled:pointer-events-none disabled:!bg-gray-900`}
          aria-label="Decrement value"
        >
          <span
            className={`w-5 h-5 mask-[url('/assets/ic_minus.svg')] bg-gray-50 group-disabled/minus:bg-gray-200`}
            style={{
              maskImage: "url('/assets/ic_minus.svg')",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: "url('/assets/ic_minus.svg')",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
        </button>
      </Tooltip>

      {/* Input Field */}
      <div className="input-field peer p-2 h-9 w-17 bg-gray-900 hover:bg-gray-800 flex items-center">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="w-full bg-transparent text-center text-xs font-medium leading-[20px] text-gray-50 outline-none"
          aria-label="Value input"
        />
      </div>

      {/* Increment Button */}
      <Tooltip
        content="Value must smaller than 100"
        position="top"
        isShow={isIncrementDisabled}
      >
        <button
          onClick={handleIncrement}
          disabled={isIncrementDisabled}
          className={`group/plus min-w-9 h-9 flex items-center justify-center rounded-r-lg transition-colors bg-gray-900 hover:bg-gray-800 hover:cursor-pointer group-has-[.input-field:hover]/container:bg-gray-800 disabled:pointer-events-none disabled:!bg-gray-900`}
          aria-label="Increment value"
        >
          <span
            className={`w-5 h-5 bg-gray-50 group-disabled/plus:bg-gray-200`}
            style={{
              maskImage: "url('/assets/ic_plus.svg')",
              maskSize: "contain",
              maskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskImage: "url('/assets/ic_plus.svg')",
              WebkitMaskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
            }}
          />
        </button>
      </Tooltip>
    </div>
  );
};

export default UnitInput;
