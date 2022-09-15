import createApiClient from "./createApiClient";

const client = createApiClient(
  import.meta.env.VITE_CHARITIES_CAMPAIGNS_MANAGEMENT_API_BASE_URL
);

type CampaignMeasuringActivityResponse = {
  activityId: string;
  targets: { target: number | null }[];
};

type CampaignMeasuringResponse = {
  activities: CampaignMeasuringActivityResponse[];
  measurementId: string;
  preferredUnitId: string;
};

export type CampaignResponse = {
  readonly id: string;
  readonly charityId: string;
  readonly name: string;
  readonly measuring: CampaignMeasuringResponse[];
};

export async function getCampaignBySlug(
  campaignSlug: string
): Promise<CampaignResponse | undefined> {
  const response = await client.get<CampaignResponse[]>(
    `/campaigns?slug=${campaignSlug}`
  );

  return response.data[0];
}
