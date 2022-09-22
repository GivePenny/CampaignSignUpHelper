import createApiClient from "./createApiClient";

const client = createApiClient(
  import.meta.env.VITE_FUNDRAISERS_CHALLENGES_GROUPINGS_API_BASE_URL
);

type GroupResponse = {
  readonly id: string;
  readonly label: string;
  readonly imageUrl: string | null;
  readonly thumbnailImageUrl: string | null;
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
  readonly id: string;
  readonly label: string;
  readonly groups: GroupResponse[];
  readonly fundraiserDefinedSubGroupSettings: SubGroupSettings;
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
