import { getGroupings } from "../api/fundraisersChallengesGroupings";

export const getCampaignGroupingsDetails = async (
  charityId: string,
  campaignId: string
) => {
  const groupings = await getGroupings(charityId, campaignId);

  return groupings.map((grouping) => ({
    id: grouping.id,
    label: grouping.label,
    groups: grouping.groups.map((group) => ({
      id: group.id,
      label: group.label,
    })),
  }));
};
