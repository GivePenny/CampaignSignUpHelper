import { getCampaignBySlug } from "../api/charitiesCampaignsManagement";
import { getCampaignGroupingsDetails } from "./campaignGroupingsHelper";
import { getCampaignMeasurementsDetails } from "./campaignMeasurementsHelper";

export const getCampaignDetails = async (campaignSlug: string) => {
  const campaign = await getCampaignBySlug(campaignSlug);

  if (!campaign) {
    console.error(`Could not find a campaign with slug: ${campaignSlug}`);
    return;
  }

  console.log({
    name: campaign.name,
    campaignId: campaign.id,
    charityId: campaign.charityId,
    measuring: await getCampaignMeasurementsDetails(campaign.measuring),
    groupings: await getCampaignGroupingsDetails(
      campaign.charityId,
      campaign.id
    ),
  });
};
