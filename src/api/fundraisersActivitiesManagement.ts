import { AxiosError } from "axios";
import createApiClient from "./createApiClient";

const client = createApiClient(
  import.meta.env.VITE_FUNDRAISERS_ACTIVITIES_MANAGEMENT_API_BASE_URL
);

export type ActivityResponse = {
  readonly id: string;
  readonly name: string;
  readonly charityId: string | null;
  readonly userId: string | null;
  readonly isSystemDefined: boolean;
};

export async function getSystemDefinedActivities() {
  const response = await client.get<ActivityResponse[]>(
    `/activities?isSystemDefined=true`
  );

  return response.data;
}

export async function getActivity(
  activityId: string
): Promise<ActivityResponse | undefined> {
  try {
    const response = await client.get<ActivityResponse>(
      `/activities/${activityId}`
    );

    return response.data;
  } catch (error) {
    if (!(error instanceof AxiosError) || error.response?.status !== 404) {
      throw error;
    }

    return undefined;
  }
}
