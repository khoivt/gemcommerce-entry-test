import UnitControl from './components/molecules/UnitControl';

const App = () => {
  const handleValueChange = (value: number, unit: string) => {
    console.log('Value changed:', value, 'Unit:', unit);
  };
  return (
    <div className="w-screen h-screen bg-neutral-950 flex items-center justify-center text-neutral-100">
      <div className="w-96 bg-neutral-800 p-4 rounded-lg">
        <UnitControl onValueChange={handleValueChange} />
      </div>
    </div>
  )
}

export default App
