import { CampaignResponse } from "../api/charitiesCampaignsManagement";

import {
  getMeasurements,
  getUnits,
} from "../api/fundraisersActivitiesDiscovery";

import {
  getActivity,
  getSystemDefinedActivities,
} from "../api/fundraisersActivitiesManagement";

const UNKNOWN = "UNKNOWN";

export const getCampaignMeasurementsDetails = async (
  campaignMeasurements: CampaignResponse["measuring"]
) => {
  if (!campaignMeasurements.length) {
    return [];
  }

  const measurements = await getMeasurements();
  const units = await getUnits();
  const activities = await getSystemDefinedActivities();

  const customActivityIds = campaignMeasurements
    .flatMap((campaignMeasurement) => campaignMeasurement.activities)
    .filter(
      (activity) =>
        !activities.find(
          (systemDefinedActivity) =>
            activity.activityId === systemDefinedActivity.id
        )
    )
    .map((activity) => activity.activityId);

  for (const customActivityId of customActivityIds) {
    const activity = await getActivity(customActivityId);

    if (!activity) {
      continue;
    }

    activities.push(activity);
  }

  return campaignMeasurements.map((campaignMeasurement) => ({
    ...campaignMeasurement,
    measurementName:
      measurements.find(
        (measurement) => measurement.id === campaignMeasurement.measurementId
      )?.name || UNKNOWN,
    preferredUnitName:
      units.find((unit) => unit.id === campaignMeasurement.preferredUnitId)
        ?.name || UNKNOWN,
    activities: campaignMeasurement.activities.map(
      (campaignMeasurementActivity) => ({
        ...campaignMeasurementActivity,
        activityName:
          activities.find(
            (activity) => activity.id === campaignMeasurementActivity.activityId
          )?.name || UNKNOWN,
      })
    ),
  }));
};
