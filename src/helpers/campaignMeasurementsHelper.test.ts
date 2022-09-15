import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { v4 as uuid } from "uuid";

import {
  getMeasurements,
  getUnits,
  MeasurementResponse,
  UnitResponse,
} from "../api/fundraisersActivitiesDiscovery";

import {
  ActivityResponse,
  getActivity,
  getSystemDefinedActivities,
} from "../api/fundraisersActivitiesManagement";

import { getCampaignMeasurementsDetails } from "./campaignMeasurementsHelper";
import { CampaignResponse } from "../api/charitiesCampaignsManagement";

vi.mock("../api/fundraisersActivitiesDiscovery");
vi.mock("../api/fundraisersActivitiesManagement");

const measurements: MeasurementResponse[] = [
  {
    id: uuid(),
    name: "Measurement 1",
  },
  {
    id: uuid(),
    name: "Measurement 2",
  },
];

const units: UnitResponse[] = [
  { id: uuid(), name: "Unit 1" },
  { id: uuid(), name: "Unit 2" },
];

const systemDefinedActivities: ActivityResponse[] = [
  {
    id: uuid(),
    name: "System Defined Activity 1",
    isSystemDefined: true,
    charityId: null,
    userId: null,
  },
  {
    id: uuid(),
    name: "System Defined Activity 2",
    isSystemDefined: true,
    charityId: null,
    userId: null,
  },
];

const campaignMeasurements: CampaignResponse["measuring"] = [
  {
    measurementId: measurements[0].id,
    preferredUnitId: units[0].id,
    activities: [
      {
        activityId: systemDefinedActivities[0].id,
        targets: [{ target: 123 }],
      },
    ],
  },
  {
    measurementId: measurements[1].id,
    preferredUnitId: units[1].id,
    activities: [
      {
        activityId: systemDefinedActivities[1].id,
        targets: [{ target: 456 }],
      },
    ],
  },
];

describe("campaignMeasurementsHelper", () => {
  beforeEach(() => {
    vi.mocked(getMeasurements).mockResolvedValue(measurements);
    vi.mocked(getUnits).mockResolvedValue(units);
    vi.mocked(getActivity).mockResolvedValue(undefined);
    vi.mocked(getSystemDefinedActivities).mockResolvedValue(
      systemDefinedActivities
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should not look up details when no measurements are passed", async () => {
    await getCampaignMeasurementsDetails([]);

    expect(getMeasurements).not.toHaveBeenCalled();
    expect(getUnits).not.toHaveBeenCalled();
    expect(getActivity).not.toHaveBeenCalled();
    expect(getSystemDefinedActivities).not.toHaveBeenCalled();
  });

  it("should return an empty array when no measurements are passed", async () => {
    const result = await getCampaignMeasurementsDetails([]);

    expect(result).toStrictEqual([]);
  });

  it("should look up measurements when campaign measurements are passed", async () => {
    await getCampaignMeasurementsDetails(campaignMeasurements);

    expect(getMeasurements).toHaveBeenCalled();
  });

  it("should look up units when campaign measurements are passed", async () => {
    await getCampaignMeasurementsDetails(campaignMeasurements);

    expect(getUnits).toHaveBeenCalled();
  });

  it("should look up system defined activities when campaign measurements are passed", async () => {
    await getCampaignMeasurementsDetails(campaignMeasurements);

    expect(getSystemDefinedActivities).toHaveBeenCalled();
  });

  it("should not look up custom activities when campaign measurements are passed and all activities are system defined", async () => {
    await getCampaignMeasurementsDetails(campaignMeasurements);

    expect(getActivity).not.toHaveBeenCalled();
  });

  it("should look up custom activities when campaign measurements are passed and some activities are not system defined", async () => {
    const campaignMeasurement = {
      ...campaignMeasurements[0],
      activities: [
        {
          activityId: uuid(),
          targets: [{ target: 789 }],
        },
        {
          activityId: uuid(),
          targets: [{ target: 987 }],
        },
      ],
    };

    await getCampaignMeasurementsDetails([campaignMeasurement]);

    expect(getActivity).toHaveBeenCalledWith(
      campaignMeasurement.activities[0].activityId
    );

    expect(getActivity).toHaveBeenCalledWith(
      campaignMeasurement.activities[1].activityId
    );
  });

  it("should return the expected details when campaign measurements are passed and all details are resolved", async () => {
    const details = await getCampaignMeasurementsDetails(campaignMeasurements);

    expect(details).toStrictEqual([
      {
        ...campaignMeasurements[0],
        measurementName: measurements[0].name,
        preferredUnitName: units[0].name,
        activities: [
          {
            ...campaignMeasurements[0].activities[0],
            activityName: systemDefinedActivities[0].name,
          },
        ],
      },
      {
        ...campaignMeasurements[1],
        measurementName: measurements[1].name,
        preferredUnitName: units[1].name,
        activities: [
          {
            ...campaignMeasurements[1].activities[0],
            activityName: systemDefinedActivities[1].name,
          },
        ],
      },
    ]);
  });

  it("should return the expected details when campaign measurements are passed with custom activities and all details are resolved", async () => {
    const customActivities: ActivityResponse[] = [
      {
        id: uuid(),
        name: "Custom Activity 1",
        isSystemDefined: false,
        charityId: uuid(),
        userId: null,
      },
      {
        id: uuid(),
        name: "Custom Activity 2",
        isSystemDefined: false,
        charityId: null,
        userId: uuid(),
      },
    ];

    const campaignMeasurement = {
      ...campaignMeasurements[0],
      activities: [
        {
          activityId: customActivities[0].id,
          targets: [{ target: 789 }],
        },
        {
          activityId: customActivities[1].id,
          targets: [{ target: 987 }],
        },
      ],
    };

    vi.mocked(getActivity).mockImplementation((activityId) =>
      Promise.resolve(
        customActivities.find(
          (customActivity) => customActivity.id === activityId
        )
      )
    );

    const details = await getCampaignMeasurementsDetails([campaignMeasurement]);

    expect(details).toStrictEqual([
      {
        ...campaignMeasurement,
        measurementName: measurements[0].name,
        preferredUnitName: units[0].name,
        activities: [
          {
            ...campaignMeasurement.activities[0],
            activityName: customActivities[0].name,
          },
          {
            ...campaignMeasurement.activities[1],
            activityName: customActivities[1].name,
          },
        ],
      },
    ]);
  });

  it("should return the expected details when campaign measurements are passed and details could not be resolved", async () => {
    const campaignMeasurement = {
      measurementId: uuid(),
      preferredUnitId: uuid(),
      activities: [
        {
          activityId: uuid(),
          targets: [{ target: 789 }],
        },
      ],
    };

    const details = await getCampaignMeasurementsDetails([campaignMeasurement]);

    expect(details).toStrictEqual([
      {
        ...campaignMeasurement,
        measurementName: "UNKNOWN",
        preferredUnitName: "UNKNOWN",
        activities: [
          {
            ...campaignMeasurement.activities[0],
            activityName: "UNKNOWN",
          },
        ],
      },
    ]);
  });
});
