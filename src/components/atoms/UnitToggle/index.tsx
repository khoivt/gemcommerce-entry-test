import { UNIT } from "@/constants/unit";
import { Unit } from "@/types/common";
import React from "react";

interface UnitToggleProps {
  value: Unit;
  onChange: (unit: Unit) => void;
}

const UnitToggle: React.FC<UnitToggleProps> = ({ value, onChange }) => {
  const units: { value: Unit; label: string }[] = [
    { value: UNIT.PERCENT, label: "%" },
    { value: UNIT.PIXEL, label: "px" },
  ];

  return (
    <div className="flex w-[140px] h-9 gap-0.5 p-0.5 rounded-lg bg-gray-900">
      {units.map((unit) => (
        <button
          key={unit.value}
          onClick={() => onChange(unit.value)}
          className={`flex-1 h-8 rounded-[6px] text-xs font-medium cursor-pointer transition-colors ${
            value === unit.value
              ? "bg-gray-100 text-gray-50"
              : "text-gray-200 hover:text-gray-50"
          }`}
        >
          {unit.label}
        </button>
      ))}
    </div>
  );
};

export default UnitToggle;
