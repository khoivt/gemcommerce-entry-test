import React, { useState } from 'react';
import UnitInput from '@/components/atoms/UnitInput';
import UnitToggle from '@/components/atoms/UnitToggle';
import { UNIT } from '@/constants/unit';
import { Unit } from '@/types/common';

interface UnitControlProps {
  defaultValue?: string;
  defaultUnit?: Unit;
  onValueChange?: (value: number, unit: Unit) => void;
}

const UnitControl: React.FC<UnitControlProps> = ({
  defaultValue = '0',
  defaultUnit = UNIT.PERCENT,
  onValueChange,
}) => {
  const [unit, setUnit] = useState<Unit>(defaultUnit);
  const [value, setValue] = useState<string>(defaultValue);

  const handleUnitChange = (newUnit: Unit) => {
    setUnit(newUnit);
    
    // If switching to percent and value > 100, update to 100
    const numValue = parseFloat(value);
    if (newUnit === UNIT.PERCENT && !isNaN(numValue) && numValue > 100) {
      setValue('100');
      if (onValueChange) {
        onValueChange(100, newUnit);
      }
    } else if (onValueChange && !isNaN(numValue)) {
      onValueChange(numValue, newUnit);
    }
  };

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    if (onValueChange) {
      onValueChange(parseFloat(newValue), unit);
    }
  };

  return (
    <div className="p-4 flex flex-col items-center gap-4 w-fit bg-gray-950">
      <div className="w-62 flex items-center gap-1 justify-between">
        <p className="text-xs text-gray-200">Unit</p>
        <UnitToggle value={unit} onChange={handleUnitChange} />
      </div>
      <div className="w-62 flex items-center gap-1 justify-between">
        <p className="text-xs text-gray-200">Value</p>
        <UnitInput
          value={value}
          unit={unit}
          onValueChange={handleValueChange}
        />
      </div>
    </div>
  );
};

export default UnitControl;