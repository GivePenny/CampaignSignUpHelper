import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { v4 as uuid } from "uuid";

import {
  CampaignResponse,
  getCampaignBySlug,
} from "../api/charitiesCampaignsManagement";

import { getCampaignDetails } from "./developmentHelper";
import { getCampaignMeasurementsDetails } from "./campaignMeasurementsHelper";
import { getCampaignGroupingsDetails } from "./campaignGroupingsHelper";

vi.mock("../api/charitiesCampaignsManagement");
vi.mock("./campaignGroupingsHelper");
vi.mock("./campaignMeasurementsHelper");

const consoleMock = {
  log: vi.fn().mockName("log"),
  error: vi.fn().mockName("error"),
};

vi.stubGlobal("console", consoleMock);

const campaignSlug = uuid();
const campaign: CampaignResponse = {
  id: uuid(),
  charityId: uuid(),
  measuring: [],
  name: "Test campaign",
};

describe("developmentHelper", () => {
  beforeEach(() => {
    vi.mocked(getCampaignBySlug).mockResolvedValue(campaign);
    vi.mocked(getCampaignGroupingsDetails).mockResolvedValue([]);
    vi.mocked(getCampaignMeasurementsDetails).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should look up the campaign by provided slug", async () => {
    await getCampaignDetails(campaignSlug);

    expect(getCampaignBySlug).toHaveBeenCalledWith(campaignSlug);
  });

  it("should write an error to the console if no campaign is found with the requested slug", async () => {
    vi.mocked(getCampaignBySlug).mockResolvedValue(undefined);

    await getCampaignDetails(campaignSlug);

    expect(console.error).toHaveBeenCalledWith(
      `Could not find a campaign with slug: ${campaignSlug}`
    );
  });

  it("should write the campaign details to the console when a campaign is found with the requested slug", async () => {
    await getCampaignDetails(campaignSlug);

    const lastConsoleLogCallArgument = vi.mocked(console.log).mock
      .lastCall?.[0];

    expect(lastConsoleLogCallArgument.name).toBe(campaign.name);
    expect(lastConsoleLogCallArgument.campaignId).toBe(campaign.id);
    expect(lastConsoleLogCallArgument.charityId).toBe(campaign.charityId);
  });

  it("should write the campaign details to the console with an empty measuring array when a campaign is found with the requested slug and is not measuring anything", async () => {
    await getCampaignDetails(campaignSlug);

    const lastConsoleLogCallArgument = vi.mocked(console.log).mock
      .lastCall?.[0];

    expect(lastConsoleLogCallArgument.measuring).toStrictEqual([]);
  });

  it("should write the campaign details to the console with an empty groupings array when a campaign is found with the requested slug has no groupings", async () => {
    await getCampaignDetails(campaignSlug);

    const lastConsoleLogCallArgument = vi.mocked(console.log).mock
      .lastCall?.[0];

    expect(lastConsoleLogCallArgument.groupings).toStrictEqual([]);
  });

  it("should resolve the groupings details for the campaign when a campaign is found with the requested slug", async () => {
    await getCampaignDetails(campaignSlug);

    expect(getCampaignGroupingsDetails).toHaveBeenCalledWith(
      campaign.charityId,
      campaign.id
    );
  });

  it("should write the campaign details to the console with the expected groupings array when a campaign is found with the requested slug has groupings", async () => {
    const groupingsDetails = [
      {
        id: uuid(),
        label: "Grouping 1",
        groups: [
          {
            id: uuid(),
            label: "Grouping 1 - Group 1",
          },
          {
            id: uuid(),
            label: "Grouping 1 - Group 1",
          },
        ],
      },
      {
        id: uuid(),
        label: "Grouping 2",
        groups: [
          {
            id: uuid(),
            label: "Grouping 2 - Group 1",
          },
          {
            id: uuid(),
            label: "Grouping 2 - Group 1",
          },
        ],
      },
    ];

    vi.mocked(getCampaignGroupingsDetails).mockResolvedValue(groupingsDetails);

    await getCampaignDetails(campaignSlug);

    const lastConsoleLogCallArgument = vi.mocked(console.log).mock
      .lastCall?.[0];

    expect(lastConsoleLogCallArgument.groupings).toStrictEqual(
      groupingsDetails
    );
  });

  it("should resolve the measurements details for the campaign when a campaign is found", async () => {
    await getCampaignDetails(campaignSlug);

    expect(getCampaignMeasurementsDetails).toHaveBeenCalledWith(
      campaign.measuring
    );
  });

  it("should write the campaign details to the console with the expected measuring array when a campaign is found with the requested slug", async () => {
    const measuringDetails = [
      {
        measurementId: uuid(),
        measurementName: "Measurement 1",
        preferredUnitId: uuid(),
        preferredUnitName: "Unit 1",
        activities: [
          {
            activityId: uuid(),
            activityName: "Activity 1",
            targets: [],
          },
          {
            activityId: uuid(),
            activityName: "Activity 2",
            targets: [{ target: 123 }],
          },
        ],
      },
      {
        measurementId: uuid(),
        measurementName: "Measurement 2",
        preferredUnitId: uuid(),
        preferredUnitName: "Unit 2",
        activities: [
          {
            activityId: uuid(),
            activityName: "Activity 3",
            targets: [{ target: 456 }],
          },
        ],
      },
    ];

    vi.mocked(getCampaignMeasurementsDetails).mockResolvedValue(
      measuringDetails
    );

    await getCampaignDetails(campaignSlug);

    const lastConsoleLogCallArgument = vi.mocked(console.log).mock
      .lastCall?.[0];

    expect(lastConsoleLogCallArgument.measuring).toBe(measuringDetails);
  });
});
