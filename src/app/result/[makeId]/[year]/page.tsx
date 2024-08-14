import React, { Suspense } from 'react';
import Loader from '@/app/Loader';

const fetchVehicleData = async (makeId: string, year: number) => {
  const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeIdYear/makeId/${makeId}/modelyear/${year}?format=json`);
  if (!response.ok) throw new Error('Failed to fetch vehicle data');
  return response.json();
};

const ResultPage: React.FC<{ params: { makeId: string; year: number } }> = async ({ params }) => {
  const { makeId, year } = params;
  const data = await fetchVehicleData(makeId, year);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Result Page</h1>
      <ul>
        {data.Results.map((model: { Model_Name: string }, index: number) => (
          <li key={index} className="mb-2">{model.Model_Name}</li>
        ))}
      </ul>
    </div>
  );
};

export default function ResultPageWrapper(props: any) {
  return (
    <Suspense fallback={<Loader />}>
      <ResultPage {...props} />
    </Suspense>
  );
}
