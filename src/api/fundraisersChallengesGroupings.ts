import createApiClient from "./createApiClient";

const client = createApiClient(
  import.meta.env.VITE_FUNDRAISERS_CHALLENGES_GROUPINGS_API_BASE_URL
);

type GroupResponse = {
  id: string;
  label: string;
  imageUrl: string | null;
  thumbnailImageUrl: string | null;
};

type SubGroupSettings =
  | {
      readonly enabled: true;
      readonly label: string;
    }
  | {
      readonly enabled: false;
    };

export type GroupingResponse = {
  id: string;
  label: string;
  groups: GroupResponse[];
  fundraiserDefinedSubGroupSettings: SubGroupSettings;
};

export async function getGroupings(
  charityId: string,
  campaignId: string
): Promise<GroupingResponse[]> {
  const response = await client.get<GroupingResponse[]>(
    `/charities/${charityId}/campaigns/${campaignId}/groupings`
  );

  return response.data;
}
