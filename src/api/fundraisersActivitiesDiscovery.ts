import createApiClient from "./createApiClient";

const client = createApiClient(
  import.meta.env.VITE_FUNDRAISERS_ACTIVITIES_DISCOVERY_API_BASE_URL
);

export type MeasurementResponse = {
  readonly id: string;
  readonly name: string;
};

export type UnitResponse = {
  readonly id: string;
  readonly name: string;
};

export async function getMeasurements() {
  const response = await client.get<MeasurementResponse[]>(`/measurements`);

  return response.data;
}

export async function getUnits() {
  const response = await client.get<UnitResponse[]>(`/units`);

  return response.data;
}
