'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';

interface VehicleMake {
  MakeId: number;
  MakeName: string;
}

const Filter = () => {
  const [vehicleMakes, setVehicleMakes] = useState<VehicleMake[]>([]);
  const [selectedMake, setSelectedMake] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [years, setYears] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchVehicleMakes = async () => {
      try {
        const response = await fetch('https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json');
        const data = await response.json();
        setVehicleMakes(data.Results.map((item: any) => ({
          MakeId: item.MakeId,
          MakeName: item.MakeName
        })));
      } catch (error) {
        console.error('Error fetching vehicle makes:', error);
      }
    };

    fetchVehicleMakes();
  }, []);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    setYears(Array.from({ length: currentYear - 2015 + 1 }, (_, i) => 2015 + i));
  }, []);

  const handleNext = () => {
    if (selectedMake && selectedYear) {
      router.push(`/result/${selectedMake}/${selectedYear}`);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Filter Vehicles</h1>
      <div className="mb-4">
        <label className="block mb-2">Vehicle Make</label>
        <select
          className="border rounded p-2 w-full text-black bg-white"
          value={selectedMake ?? ''}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedMake(Number(e.target.value))}
        >
          <option value="">Select a vehicle make</option>
          {vehicleMakes.map((make) => (
            <option key={make.MakeId} value={make.MakeId}>
              {make.MakeName}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2">Model Year</label>
        <select
          className="border rounded p-2 w-full text-black bg-white"
          value={selectedYear ?? ''}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedYear(Number(e.target.value))}
        >
          <option value="">Select a model year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <button
        className={`bg-blue-500 text-white py-2 px-4 rounded ${!selectedMake || !selectedYear ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!selectedMake || !selectedYear}
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

export default Filter;
