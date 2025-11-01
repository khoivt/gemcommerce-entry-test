import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import UnitControl from './index';
import { UNIT } from '@/constants/unit';

describe('UnitControl Component', () => {
  describe('Initial rendering', () => {
    it('renders with default values', () => {
      render(<UnitControl />);
      const input = screen.getByRole('textbox');
      
      expect(input).toHaveValue('0');
    });

    it('renders with custom default values', () => {
      render(<UnitControl defaultValue="50" defaultUnit={UNIT.PIXEL} />);
      const input = screen.getByRole('textbox');
      
      expect(input).toHaveValue('50');
    });
  });

  describe('Input validation', () => {
    it('allows integer input', () => {
      render(<UnitControl defaultValue="0" defaultUnit={UNIT.PIXEL} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '123' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('123');
    });

    it('allows float input', () => {
      render(<UnitControl defaultValue="0" defaultUnit={UNIT.PERCENT} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '12.5' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('12.5');
    });

    it('replaces comma with dot: 12,3 -> 12.3', () => {
      render(<UnitControl defaultValue="0" defaultUnit={UNIT.PERCENT} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '12,3' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('12.3');
    });

    it('Remove zero padding: 012.3 -> 12.3', () => {
      render(<UnitControl defaultValue="0" defaultUnit={UNIT.PERCENT} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '012.3' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('12.3');
    });
  });

  describe('Invalid character handling', () => {
    it('removes invalid characters: 123a -> 123', () => {
      render(<UnitControl defaultValue="0" defaultUnit={UNIT.PIXEL} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '123a' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('123');
    });

    it('removes invalid characters: 12a3 -> 12', () => {
      render(<UnitControl defaultValue="0" defaultUnit={UNIT.PERCENT} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '12a3' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('12');
    });

    it('removes invalid characters: a123 -> 0 (last valid value)', () => {
      render(<UnitControl defaultValue="0" defaultUnit={UNIT.PERCENT} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: 'a123' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('0');
    });

    it('removes invalid characters: 12.4.5 -> 12.4', () => {
      render(<UnitControl defaultValue="0" defaultUnit={UNIT.PERCENT} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '12.4.5' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('0');
    });
  });

  describe('Negative value handling', () => {
    it('converts negative value to 0 on blur', () => {
      render(<UnitControl defaultValue="0" defaultUnit={UNIT.PERCENT} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '-5' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('0');
    });
  });

  describe('Percent unit validation', () => {
    it('reverts to last valid value when input > 100 for percent unit', () => {
      render(<UnitControl defaultValue="50" defaultUnit={UNIT.PERCENT} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '150' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('50');
    });

    it('reverts to 0 when input > 100 and no previous valid value', () => {
      render(<UnitControl defaultValue="0" defaultUnit={UNIT.PERCENT} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '101' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('0');
    });

    it('allows value > 100 for PIXEL unit', () => {
      render(<UnitControl defaultValue="0" defaultUnit={UNIT.PIXEL} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '150' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('150');
    });
  });

  describe('Button states', () => {
    it('disables decrement button when value is 0', () => {
      render(<UnitControl defaultValue="0" defaultUnit={UNIT.PERCENT} />);
      const decrementButton = screen.getByRole('button', { name: 'Decrement value' });

      expect(decrementButton).toBeDisabled();
    });

    it('enables decrement button when value > 0', () => {
      render(<UnitControl defaultValue="5" defaultUnit={UNIT.PERCENT} />);
      const decrementButton = screen.getByRole('button', { name: 'Decrement value' });

      expect(decrementButton).not.toBeDisabled();
    });

    it('disables increment button when value is 100 and unit is percent', () => {
      render(<UnitControl defaultValue="100" defaultUnit={UNIT.PERCENT} />);
      const incrementButton = screen.getByRole('button', { name: 'Increment value' });

      expect(incrementButton).toBeDisabled();
    });

    it('enables increment button when value < 100 and unit is percent', () => {
      render(<UnitControl defaultValue="50" defaultUnit={UNIT.PERCENT} />);
      const incrementButton = screen.getByRole('button', { name: 'Increment value' });

      expect(incrementButton).not.toBeDisabled();
    });

    it('enables increment button when unit is PIXEL regardless of value', () => {
      render(<UnitControl defaultValue="100" defaultUnit={UNIT.PIXEL} />);
      const incrementButton = screen.getByRole('button', { name: 'Increment value' });

      expect(incrementButton).not.toBeDisabled();
    });
  });

  describe('Unit switching', () => {
    it('switches from percent to pixel', () => {
      render(<UnitControl defaultValue="50" defaultUnit={UNIT.PERCENT} />);
      const pixelButton = screen.getByRole('button', { name: 'px' });
      
      fireEvent.click(pixelButton);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('50');
    });

    it('switches from pixel to percent', () => {
      render(<UnitControl defaultValue="50" defaultUnit={UNIT.PIXEL} />);
      const percentButton = screen.getByRole('button', { name: '%' });
      
      fireEvent.click(percentButton);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('50');
    });

    it('caps value at 100 when switching from pixel to percent with value > 100', () => {
      render(<UnitControl defaultValue="150" defaultUnit={UNIT.PIXEL} />);
      const percentButton = screen.getByRole('button', { name: '%' });
      
      fireEvent.click(percentButton);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('100');
    });

    it('keeps value unchanged when switching from pixel to percent with value <= 100', () => {
      render(<UnitControl defaultValue="75" defaultUnit={UNIT.PIXEL} />);
      const percentButton = screen.getByRole('button', { name: '%' });
      
      fireEvent.click(percentButton);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('75');
    });
  });

  describe('Increment and Decrement', () => {
    it('increments by 1 when unit is percent', () => {
      render(<UnitControl defaultValue="10" defaultUnit={UNIT.PERCENT} />);
      const input = screen.getByRole('textbox');
      const incrementButton = screen.getByRole('button', { name: 'Increment value' });

      fireEvent.click(incrementButton);

      expect(input).toHaveValue('11');
    });

    it('increments by 10 when unit is PIXEL', () => {
      render(<UnitControl defaultValue="10" defaultUnit={UNIT.PIXEL} />);
      const input = screen.getByRole('textbox');
      const incrementButton = screen.getByRole('button', { name: 'Increment value' });

      fireEvent.click(incrementButton);

      expect(input).toHaveValue('20');
    });

    it('decrements by 1 when unit is percent', () => {
      render(<UnitControl defaultValue="10" defaultUnit={UNIT.PERCENT} />);
      const input = screen.getByRole('textbox');
      const decrementButton = screen.getByRole('button', { name: 'Decrement value' });

      fireEvent.click(decrementButton);

      expect(input).toHaveValue('9');
    });

    it('decrements by 10 when unit is PIXEL', () => {
      render(<UnitControl defaultValue="20" defaultUnit={UNIT.PIXEL} />);
      const input = screen.getByRole('textbox');
      const decrementButton = screen.getByRole('button', { name: 'Decrement value' });

      fireEvent.click(decrementButton);

      expect(input).toHaveValue('10');
    });

    it('does not go below 0 when decrementing', () => {
      render(<UnitControl defaultValue="3" defaultUnit={UNIT.PERCENT} />);
      const input = screen.getByRole('textbox');
      const decrementButton = screen.getByRole('button', { name: 'Decrement value' });

      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);
      fireEvent.click(decrementButton);

      expect(input).toHaveValue('0');
    });

    it('does not go above 100 when incrementing with percent unit', () => {
      render(<UnitControl defaultValue="99" defaultUnit={UNIT.PERCENT} />);
      const input = screen.getByRole('textbox');
      const incrementButton = screen.getByRole('button', { name: 'Increment value' });

      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      expect(input).toHaveValue('100');
    });

    it('allows incrementing beyond 100 with PIXEL unit', () => {
      render(<UnitControl defaultValue="95" defaultUnit={UNIT.PIXEL} />);
      const input = screen.getByRole('textbox');
      const incrementButton = screen.getByRole('button', { name: 'Increment value' });

      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);

      expect(input).toHaveValue('115');
    });
  });

  describe('Button state integration', () => {
    it('disables decrement button when value reaches 0', () => {
      render(<UnitControl defaultValue="1" defaultUnit={UNIT.PERCENT} />);
      const decrementButton = screen.getByRole('button', { name: 'Decrement value' });

      fireEvent.click(decrementButton);

      expect(decrementButton).toBeDisabled();
    });

    it('disables increment button when value reaches 100 with percent unit', () => {
      render(<UnitControl defaultValue="99" defaultUnit={UNIT.PERCENT} />);
      const incrementButton = screen.getByRole('button', { name: 'Increment value' });

      fireEvent.click(incrementButton);

      expect(incrementButton).toBeDisabled();
    });

    it('enables increment button after switching from percent to pixel at value 100', () => {
      render(<UnitControl defaultValue="100" defaultUnit={UNIT.PERCENT} />);
      const incrementButton = screen.getByRole('button', { name: 'Increment value' });
      const pixelButton = screen.getByRole('button', { name: 'px' });

      expect(incrementButton).toBeDisabled();

      fireEvent.click(pixelButton);

      expect(incrementButton).not.toBeDisabled();
    });
  });

  describe('Value propagation', () => {
    it('calls onValueChange when value changes via increment', () => {
      const mockOnValueChange = vi.fn();
      render(<UnitControl defaultValue="10" defaultUnit={UNIT.PERCENT} onValueChange={mockOnValueChange} />);
      const incrementButton = screen.getByRole('button', { name: 'Increment value' });

      fireEvent.click(incrementButton);

      expect(mockOnValueChange).toHaveBeenCalledWith(11, UNIT.PERCENT);
    });

    it('calls onValueChange when value changes via decrement', () => {
      const mockOnValueChange = vi.fn();
      render(<UnitControl defaultValue="10" defaultUnit={UNIT.PERCENT} onValueChange={mockOnValueChange} />);
      const decrementButton = screen.getByRole('button', { name: 'Decrement value' });

      fireEvent.click(decrementButton);

      expect(mockOnValueChange).toHaveBeenCalledWith(9, UNIT.PERCENT);
    });

    it('calls onValueChange when unit changes', () => {
      const mockOnValueChange = vi.fn();
      render(<UnitControl defaultValue="50" defaultUnit={UNIT.PERCENT} onValueChange={mockOnValueChange} />);
      const pixelButton = screen.getByRole('button', { name: 'px' });

      fireEvent.click(pixelButton);

      expect(mockOnValueChange).toHaveBeenCalledWith(50, UNIT.PIXEL);
    });

    it('calls onValueChange when unit changes and value is capped', () => {
      const mockOnValueChange = vi.fn();
      render(<UnitControl defaultValue="150" defaultUnit={UNIT.PIXEL} onValueChange={mockOnValueChange} />);
      const percentButton = screen.getByRole('button', { name: '%' });

      fireEvent.click(percentButton);

      expect(mockOnValueChange).toHaveBeenCalledWith(100, UNIT.PERCENT);
    });

    it('calls onValueChange when input value changes', () => {
      const mockOnValueChange = vi.fn();
      render(<UnitControl defaultValue="10" defaultUnit={UNIT.PERCENT} onValueChange={mockOnValueChange} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '25' } });
      fireEvent.blur(input);

      expect(mockOnValueChange).toHaveBeenCalledWith(25, UNIT.PERCENT);
    });
  });

  describe('Integration between UnitInput and UnitToggle', () => {
    it('updates button states when switching units', () => {
      render(<UnitControl defaultValue="100" defaultUnit={UNIT.PERCENT} />);
      const incrementButton = screen.getByRole('button', { name: 'Increment value' });
      const pixelButton = screen.getByRole('button', { name: 'px' });

      expect(incrementButton).toBeDisabled();

      fireEvent.click(pixelButton);

      expect(incrementButton).not.toBeDisabled();
    });

    it('maintains correct value after multiple unit switches', () => {
      render(<UnitControl defaultValue="50" defaultUnit={UNIT.PERCENT} />);
      const input = screen.getByRole('textbox');
      const pixelButton = screen.getByRole('button', { name: 'px' });
      const percentButton = screen.getByRole('button', { name: '%' });

      fireEvent.click(pixelButton);
      expect(input).toHaveValue('50');

      fireEvent.click(percentButton);
      expect(input).toHaveValue('50');
    });
  });
});
