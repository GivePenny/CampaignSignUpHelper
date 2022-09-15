import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { v4 as uuid } from "uuid";

import {
  getGroupings,
  GroupingResponse,
} from "../api/fundraisersChallengesGroupings";

import { getCampaignGroupingsDetails } from "./campaignGroupingsHelper";

vi.mock("../api/fundraisersChallengesGroupings");

const charityId = uuid();
const campaignId = uuid();

const groupings: GroupingResponse[] = [
  {
    id: uuid(),
    label: "Grouping 1",
    groups: [
      {
        id: uuid(),
        label: "Grouping 1 - Group 1",
        imageUrl: null,
        thumbnailImageUrl: null,
      },
      {
        id: uuid(),
        label: "Grouping 1 - Group 1",
        imageUrl: null,
        thumbnailImageUrl: null,
      },
    ],
    fundraiserDefinedSubGroupSettings: {
      enabled: false,
    },
  },
  {
    id: uuid(),
    label: "Grouping 2",
    groups: [
      {
        id: uuid(),
        label: "Grouping 2 - Group 1",
        imageUrl: null,
        thumbnailImageUrl: null,
      },
      {
        id: uuid(),
        label: "Grouping 2 - Group 1",
        imageUrl: null,
        thumbnailImageUrl: null,
      },
    ],
    fundraiserDefinedSubGroupSettings: {
      enabled: true,
      label: "Sub-group",
    },
  },
];

describe("campaignMeasurementsHelper", () => {
  beforeEach(() => {
    vi.mocked(getGroupings).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should look up groupings with the passed charity and campaign IDs", async () => {
    await getCampaignGroupingsDetails(charityId, campaignId);

    expect(getGroupings).toHaveBeenCalledWith(charityId, campaignId);
  });

  it("should return the expected details when the campaign has no groupings", async () => {
    const details = await getCampaignGroupingsDetails(charityId, campaignId);

    expect(details).toStrictEqual([]);
  });

  it("should return the expected details when campaign measurements are passed and all details are resolved", async () => {
    vi.mocked(getGroupings).mockResolvedValue(groupings);

    const details = await getCampaignGroupingsDetails(charityId, campaignId);

    expect(details).toStrictEqual([
      {
        id: groupings[0].id,
        label: groupings[0].label,
        groups: [
          {
            id: groupings[0].groups[0].id,
            label: groupings[0].groups[0].label,
          },
          {
            id: groupings[0].groups[1].id,
            label: groupings[0].groups[1].label,
          },
        ],
      },
      {
        id: groupings[1].id,
        label: groupings[1].label,
        groups: [
          {
            id: groupings[1].groups[0].id,
            label: groupings[1].groups[0].label,
          },
          {
            id: groupings[1].groups[1].id,
            label: groupings[1].groups[1].label,
          },
        ],
      },
    ]);
  });
});
