import createApiClient from "./createApiClient";

const client = createApiClient(
  import.meta.env.VITE_CHARITIES_CAMPAIGNS_SIGNUPS_API_BASE_URL
);

export type SignUpRequestChallengeOptions = {
  activityId: string | null;
  measurementId: string | null;
  activityTarget: number | null;
  musicPlaylist: boolean | null;
};

export type SignUpRequestGroup = {
  groupingId: string;
  groupId: string;
};

export type SignUpRequestStatus = "creating" | "submitted";

export type SignUpRequest = {
  id: string;
  campaignId: string;
  challengeOptions: SignUpRequestChallengeOptions;
  groups: SignUpRequestGroup[] | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  isOptedInToMarketing: boolean | null;
  isTestResource: boolean;
  status: SignUpRequestStatus;
};

export async function putSignUp(
  charityId: string,
  campaignId: string,
  signUpRequest: SignUpRequest
) {
  await client.put(
    `/charities/${charityId}/campaigns/${campaignId}/signUps/${signUpRequest.id}`,
    signUpRequest
  );
}

export async function patchSignUpQuestions(
  charityId: string,
  campaignId: string,
  signUpId: string,
  questions: Record<string, string>
) {
  await client.patch(
    `/charities/${charityId}/campaigns/${campaignId}/signUps/${signUpId}/questions`,
    questions
  );
}
