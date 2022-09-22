import createApiClient from "./createApiClient";

const client = createApiClient(
  import.meta.env.VITE_CHARITIES_CAMPAIGNS_MANAGEMENT_API_BASE_URL
);

type CampaignMeasuringActivityResponse = {
  readonly activityId: string;
  readonly targets: { target: number | null }[];
};

type CampaignMeasuringResponse = {
  readonly activities: CampaignMeasuringActivityResponse[];
  readonly measurementId: string;
  readonly preferredUnitId: string;
};

type CampaignChallengeFeaturesResponse = {
  readonly musicPlaylist: "on" | "off" | "optional";
};

export type CampaignResponse = {
  readonly id: string;
  readonly charityId: string;
  readonly name: string;
  readonly measuring: CampaignMeasuringResponse[];
  readonly challengeFeatures: CampaignChallengeFeaturesResponse;
};

export async function getCampaignBySlug(
  campaignSlug: string
): Promise<CampaignResponse | undefined> {
  const response = await client.get<CampaignResponse[]>(
    `/campaigns?slug=${campaignSlug}`
  );

  return response.data[0];
}
