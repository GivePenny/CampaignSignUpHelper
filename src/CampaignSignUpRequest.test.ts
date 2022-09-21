import { describe, it, expect, vi, afterEach } from "vitest";
import { v4 as uuid, validate as isUuid } from "uuid";

import {
  putSignUp,
  patchSignUpQuestions,
  SignUpRequest,
} from "./api/charitiesCampaignsSignUps";

import CampaignSignUpRequest from "./CampaignSignUpRequest";

vi.mock("./api/charitiesCampaignsSignUps");

const charityId = uuid();
const campaignId = uuid();

const createAndSubmitValidCampaignSignUpRequest = async () => {
  const campaignSignUpRequest = new CampaignSignUpRequest(
    charityId,
    campaignId
  );
  campaignSignUpRequest.setFirstName(uuid());
  campaignSignUpRequest.setLastName(uuid());
  campaignSignUpRequest.setEmail(uuid());
  await campaignSignUpRequest.submitSignUpRequest();
  return campaignSignUpRequest;
};

const assertOnLastPutSignUp = (
  // eslint-disable-next-line no-unused-vars
  assertionAction: (lastPutSignUpRequest: SignUpRequest) => void
) => {
  expect(vi.mocked(putSignUp).mock.lastCall?.[0]).toBe(charityId);
  expect(vi.mocked(putSignUp).mock.lastCall?.[1]).toBe(campaignId);

  const lastPutSignUpRequest = vi.mocked(putSignUp).mock
    .lastCall?.[2] as SignUpRequest;

  assertionAction(lastPutSignUpRequest);
};

const assertLastPatchedQuestionsMatch = (
  expectedSignUpId: string,
  expectedLastPatchedQuestions: Record<string, string>
) => {
  expect(vi.mocked(patchSignUpQuestions).mock.lastCall?.[0]).toBe(charityId);
  expect(vi.mocked(patchSignUpQuestions).mock.lastCall?.[1]).toBe(campaignId);
  expect(vi.mocked(patchSignUpQuestions).mock.lastCall?.[2]).toBe(
    expectedSignUpId
  );

  const lastPatchedQuestions = vi.mocked(patchSignUpQuestions).mock
    .lastCall?.[3] as Record<string, string>;

  expect(lastPatchedQuestions).toStrictEqual(expectedLastPatchedQuestions);
};

const errorWithLinksToDocumentation = (expectedMessage: string) =>
  new Error(
    `${expectedMessage}\nFor more information, please see the documentation:\n\t- https://github.com/GivePenny/CampaignSignUpHelper#readme\n\t- https://docs.givepenny.com/content/api/charities/campaigns/signupsservice/sign-up/putsignuprequest.html\n\t- https://docs.givepenny.com/content/api/charities/campaigns/signupsservice/questions/patchsignupquestions.html`
  );

describe("CampaignSignUpRequest", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("throws an error when constructed with an empty string charityId", () => {
    expect(() => new CampaignSignUpRequest("", campaignId)).toThrow(
      errorWithLinksToDocumentation("charityId must be provided")
    );
  });

  it("throws an error when constructed with an undefined charityId", () => {
    expect(() => new CampaignSignUpRequest(undefined!, campaignId)).toThrow(
      errorWithLinksToDocumentation("charityId must be provided")
    );
  });

  it("throws an error when constructed with a null charityId", () => {
    expect(() => new CampaignSignUpRequest(null!, campaignId)).toThrow(
      errorWithLinksToDocumentation("charityId must be provided")
    );
  });

  it("throws an error when constructed with an empty string campaignId", () => {
    expect(() => new CampaignSignUpRequest(charityId, "")).toThrow(
      errorWithLinksToDocumentation("campaignId must be provided")
    );
  });

  it("throws an error when constructed with an undefined campaignId", () => {
    expect(() => new CampaignSignUpRequest(charityId, undefined!)).toThrow(
      errorWithLinksToDocumentation("campaignId must be provided")
    );
  });

  it("throws an error when constructed with a null campaignId", () => {
    expect(() => new CampaignSignUpRequest(charityId, null!)).toThrow(
      errorWithLinksToDocumentation("campaignId must be provided")
    );
  });

  it("has a valid signUpId when constructed", () => {
    const campaignSignUpRequest = new CampaignSignUpRequest(
      charityId,
      campaignId
    );
    expect(isUuid(campaignSignUpRequest.signUpId)).to.be.true;
  });

  describe(".setFirstName", () => {
    it("throws an error when called with an empty string", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() => campaignSignUpRequest.setFirstName("")).toThrowError(
        errorWithLinksToDocumentation("setFirstName must be passed a value")
      );
    });

    it("throws an error when called with undefined", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() => campaignSignUpRequest.setFirstName(undefined!)).toThrowError(
        errorWithLinksToDocumentation("setFirstName must be passed a value")
      );
    });

    it("throws an error when called with null", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() => campaignSignUpRequest.setFirstName(null!)).toThrowError(
        errorWithLinksToDocumentation("setFirstName must be passed a value")
      );
    });

    it("throws an error after the campaign sign-up has been submitted", async () => {
      const campaignSignUpRequest =
        await createAndSubmitValidCampaignSignUpRequest();
      expect(() => campaignSignUpRequest.setFirstName(uuid())).toThrowError(
        errorWithLinksToDocumentation(
          "Changes are not permitted after the sign-up request has been submitted"
        )
      );
    });
  });

  describe(".firstName", () => {
    it("returns null before setFirstName has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(campaignSignUpRequest.firstName).toBeNull();
    });

    it("returns the expected value after setFirstName has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      const firstName = uuid();
      campaignSignUpRequest.setFirstName(firstName);
      expect(campaignSignUpRequest.firstName).toBe(firstName);
    });
  });

  describe(".setLastName", () => {
    it("throws an error when called with an empty string", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() => campaignSignUpRequest.setLastName("")).toThrowError(
        errorWithLinksToDocumentation("setLastName must be passed a value")
      );
    });

    it("throws an error when called with undefined", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() => campaignSignUpRequest.setLastName(undefined!)).toThrowError(
        errorWithLinksToDocumentation("setLastName must be passed a value")
      );
    });

    it("throws an error when called with null", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() => campaignSignUpRequest.setLastName(null!)).toThrowError(
        errorWithLinksToDocumentation("setLastName must be passed a value")
      );
    });

    it("throws an error after the campaign sign-up has been submitted", async () => {
      const campaignSignUpRequest =
        await createAndSubmitValidCampaignSignUpRequest();
      expect(() => campaignSignUpRequest.setLastName(uuid())).toThrowError(
        errorWithLinksToDocumentation(
          "Changes are not permitted after the sign-up request has been submitted"
        )
      );
    });
  });

  describe(".lastName", () => {
    it("returns null before setLastName has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(campaignSignUpRequest.lastName).toBeNull();
    });

    it("returns the expected value after setLastName has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      const lastName = uuid();
      campaignSignUpRequest.setLastName(lastName);
      expect(campaignSignUpRequest.lastName).toBe(lastName);
    });
  });

  describe(".setEmail", () => {
    it("throws an error when called with an empty string", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() => campaignSignUpRequest.setEmail("")).toThrowError(
        errorWithLinksToDocumentation("setEmail must be passed a value")
      );
    });

    it("throws an error when called with undefined", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() => campaignSignUpRequest.setEmail(undefined!)).toThrowError(
        errorWithLinksToDocumentation("setEmail must be passed a value")
      );
    });

    it("throws an error when called with null", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() => campaignSignUpRequest.setEmail(null!)).toThrowError(
        errorWithLinksToDocumentation("setEmail must be passed a value")
      );
    });

    it("throws an error after the campaign sign-up has been submitted", async () => {
      const campaignSignUpRequest =
        await createAndSubmitValidCampaignSignUpRequest();
      expect(() => campaignSignUpRequest.setEmail(uuid())).toThrowError(
        errorWithLinksToDocumentation(
          "Changes are not permitted after the sign-up request has been submitted"
        )
      );
    });
  });

  describe(".email", () => {
    it("returns null before setEmail has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(campaignSignUpRequest.email).toBeNull();
    });

    it("returns the expected value after setEmail has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      const email = uuid();
      campaignSignUpRequest.setEmail(email);
      expect(campaignSignUpRequest.email).toBe(email);
    });
  });

  describe(".setGroup", () => {
    it("throws an error when called with an empty string grouping ID", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() => campaignSignUpRequest.setGroup("", uuid())).toThrowError(
        errorWithLinksToDocumentation(
          "setGroup must be passed a value for groupingId"
        )
      );
    });

    it("throws an error when called with an undefined grouping ID", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setGroup(undefined!, uuid())
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setGroup must be passed a value for groupingId"
        )
      );
    });

    it("throws an error when called with a null grouping ID", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() => campaignSignUpRequest.setGroup(null!, uuid())).toThrowError(
        errorWithLinksToDocumentation(
          "setGroup must be passed a value for groupingId"
        )
      );
    });

    it("throws an error when called with an empty string group ID", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() => campaignSignUpRequest.setGroup(uuid(), "")).toThrowError(
        errorWithLinksToDocumentation(
          "setGroup must be passed a value for groupId"
        )
      );
    });

    it("throws an error when called with an undefined group ID", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setGroup(uuid(), undefined!)
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setGroup must be passed a value for groupId"
        )
      );
    });

    it("throws an error when called with a null group ID", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() => campaignSignUpRequest.setGroup(uuid(), null!)).toThrowError(
        errorWithLinksToDocumentation(
          "setGroup must be passed a value for groupId"
        )
      );
    });

    it("throws an error when called more than five distinct grouping IDs", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );

      for (let i = 0; i < 5; i++) {
        campaignSignUpRequest.setGroup(uuid(), uuid());
      }

      expect(() => campaignSignUpRequest.setGroup(uuid(), uuid())).toThrowError(
        errorWithLinksToDocumentation(
          "Group selections for a maximum of 5 groupings may be added using setGroup"
        )
      );
    });

    it("throws an error after the campaign sign-up has been submitted", async () => {
      const campaignSignUpRequest =
        await createAndSubmitValidCampaignSignUpRequest();
      expect(() => campaignSignUpRequest.setGroup(uuid(), uuid())).toThrowError(
        errorWithLinksToDocumentation(
          "Changes are not permitted after the sign-up request has been submitted"
        )
      );
    });
  });

  describe(".groups", () => {
    it("returns empty array before setGroup has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(campaignSignUpRequest.groups).toStrictEqual([]);
    });

    it("returns the expected value after setGroups has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      const groupingId1 = uuid();
      const groupId1 = uuid();
      const groupingId2 = uuid();
      const groupId2 = uuid();
      campaignSignUpRequest.setGroup(groupingId1, groupId1);
      campaignSignUpRequest.setGroup(groupingId2, groupId2);
      expect(campaignSignUpRequest.groups).toStrictEqual([
        { groupingId: groupingId1, groupId: groupId1 },
        { groupingId: groupingId2, groupId: groupId2 },
      ]);
    });

    it("returns the expected value after setGroups has been called with the same grouping ID twice", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      const groupingId = uuid();
      const groupId1 = uuid();
      const groupId2 = uuid();
      campaignSignUpRequest.setGroup(groupingId, groupId1);
      campaignSignUpRequest.setGroup(groupingId, groupId2);
      expect(campaignSignUpRequest.groups).toStrictEqual([
        { groupingId, groupId: groupId2 },
      ]);
    });

    it("returns a copy of the groups array (mutating the array does not result in the actual array changing)", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      const groupingId = uuid();
      const groupId = uuid();
      campaignSignUpRequest.groups.push({ groupingId, groupId });
      expect(campaignSignUpRequest.groups).toStrictEqual([]);
    });
  });

  describe(".setMiscellaneousQuestion", () => {
    it("throws an error when called with an empty string question", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setAdditionalQuestion("", uuid())
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setMiscellaneousQuestion must be passed a value for question"
        )
      );
    });

    it("throws an error when called with an undefined question", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setAdditionalQuestion(undefined!, uuid())
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setMiscellaneousQuestion must be passed a value for question"
        )
      );
    });

    it("throws an error when called with a null question", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setAdditionalQuestion(null!, uuid())
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setMiscellaneousQuestion must be passed a value for question"
        )
      );
    });

    it("throws an error when called with a question longer than 100 characters", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setAdditionalQuestion("a".repeat(101), uuid())
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setMiscellaneousQuestion may not be passed a value for question longer than 100 characters"
        )
      );
    });

    it("throws an error when called with an undefined answer", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setAdditionalQuestion(uuid(), undefined!)
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setMiscellaneousQuestion must be passed a value for answer"
        )
      );
    });

    it("throws an error when called with a null answer", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setAdditionalQuestion(uuid(), null!)
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setMiscellaneousQuestion must be passed a value for answer"
        )
      );
    });

    it("does not throw an error when called with an empty string answer", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setAdditionalQuestion(uuid(), "")
      ).not.toThrowError();
    });

    it("throws an error when called more than thirty distinct questions", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );

      for (let i = 0; i < 30; i++) {
        campaignSignUpRequest.setAdditionalQuestion(uuid(), uuid());
      }

      expect(() =>
        campaignSignUpRequest.setAdditionalQuestion(uuid(), uuid())
      ).toThrowError(
        errorWithLinksToDocumentation(
          "A maximum of 30 questions may be added using setMiscellaneousQuestion"
        )
      );
    });

    it("throws an error after the campaign sign-up has been submitted", async () => {
      const campaignSignUpRequest =
        await createAndSubmitValidCampaignSignUpRequest();
      expect(() =>
        campaignSignUpRequest.setAdditionalQuestion(uuid(), uuid())
      ).toThrowError(
        errorWithLinksToDocumentation(
          "Changes are not permitted after the sign-up request has been submitted"
        )
      );
    });
  });

  describe(".miscellaneousQuestions", () => {
    it("returns empty object before setMiscellaneousQuestion has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(campaignSignUpRequest.additionalQuestions).toStrictEqual({});
    });

    it("returns the expected value after setMiscellaneousQuestion has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      const question1 = "a".repeat(100);
      const answer1 = uuid();
      const question2 = uuid();
      const answer2 = uuid();
      campaignSignUpRequest.setAdditionalQuestion(question1, answer1);
      campaignSignUpRequest.setAdditionalQuestion(question2, answer2);
      expect(campaignSignUpRequest.additionalQuestions).toStrictEqual({
        [question1]: answer1,
        [question2]: answer2,
      });
    });

    it("returns the expected value after setMiscellaneousQuestion has been called with the same question twice", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      const question = uuid();
      const answer1 = uuid();
      const answer2 = uuid();
      campaignSignUpRequest.setAdditionalQuestion(question, answer1);
      campaignSignUpRequest.setAdditionalQuestion(question, answer2);
      expect(campaignSignUpRequest.additionalQuestions).toStrictEqual({
        [question]: answer2,
      });
    });

    it("returns a copy of the questions object (mutating the object does not result in the actual object changing)", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      const question = uuid();
      const answer = uuid();
      campaignSignUpRequest.additionalQuestions[question] = answer;
      expect(campaignSignUpRequest.additionalQuestions).toStrictEqual({});
    });
  });

  describe(".setChallengeActivity", () => {
    it("throws an error when called with an empty string activityId", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setChallengeActivity("", uuid())
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setChallengeActivity must be passed a value for activityId"
        )
      );
    });

    it("throws an error when called with an undefined activityId", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setChallengeActivity(undefined!, uuid())
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setChallengeActivity must be passed a value for activityId"
        )
      );
    });

    it("throws an error when called with a null activityId", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setChallengeActivity(null!, uuid())
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setChallengeActivity must be passed a value for activityId"
        )
      );
    });

    it("throws an error when called with an empty string measurementId", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setChallengeActivity(uuid(), "")
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setChallengeActivity must be passed a value for measurementId"
        )
      );
    });

    it("throws an error when called with an undefined measurementId", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setChallengeActivity(uuid(), undefined!)
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setChallengeActivity must be passed a value for measurementId"
        )
      );
    });

    it("throws an error when called with a null measurementId", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setChallengeActivity(uuid(), null!)
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setChallengeActivity must be passed a value for measurementId"
        )
      );
    });

    it("throws an error when called with a non-number activityTarget", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setChallengeActivity(
          uuid(),
          uuid(),
          "Something" as unknown as number
        )
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setChallengeActivity must be passed a positive number value for activityTarget"
        )
      );
    });

    it("throws an error when called with a negative activityTarget", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setChallengeActivity(uuid(), uuid(), -1)
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setChallengeActivity must be passed a positive number value for activityTarget"
        )
      );
    });

    it("throws an error when called with an activityTarget of zero", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setChallengeActivity(uuid(), uuid(), 0)
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setChallengeActivity must be passed a positive number value for activityTarget"
        )
      );
    });

    it("throws an error when called without an activityTarget after the campaign sign-up has been submitted", async () => {
      const campaignSignUpRequest =
        await createAndSubmitValidCampaignSignUpRequest();
      expect(() =>
        campaignSignUpRequest.setChallengeActivity(uuid(), uuid())
      ).toThrowError(
        errorWithLinksToDocumentation(
          "Changes are not permitted after the sign-up request has been submitted"
        )
      );
    });

    it("throws an error when called with an activityTarget after the campaign sign-up has been submitted", async () => {
      const campaignSignUpRequest =
        await createAndSubmitValidCampaignSignUpRequest();
      expect(() =>
        campaignSignUpRequest.setChallengeActivity(uuid(), uuid(), 123)
      ).toThrowError(
        errorWithLinksToDocumentation(
          "Changes are not permitted after the sign-up request has been submitted"
        )
      );
    });
  });

  describe(".setChallengeMusicPlaylist", () => {
    it("throws an error when called with a non boolean value", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setChallengeMusicPlaylist(
          "true" as unknown as boolean
        )
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setChallengeMusicPlaylist must be passed a boolean value"
        )
      );
    });

    it("throws an error when called with undefined", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setChallengeMusicPlaylist(undefined!)
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setChallengeMusicPlaylist must be passed a boolean value"
        )
      );
    });

    it("throws an error when called with a null activityId", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setChallengeMusicPlaylist(null!)
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setChallengeMusicPlaylist must be passed a boolean value"
        )
      );
    });

    it("throws an error after the campaign sign-up has been submitted", async () => {
      const campaignSignUpRequest =
        await createAndSubmitValidCampaignSignUpRequest();
      expect(() =>
        campaignSignUpRequest.setChallengeMusicPlaylist(true)
      ).toThrowError(
        errorWithLinksToDocumentation(
          "Changes are not permitted after the sign-up request has been submitted"
        )
      );
    });
  });

  describe(".challengeOptions", () => {
    it("returns the expected activity values before setChallengeActivity has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(campaignSignUpRequest.challengeOptions.activityId).toBeNull();
      expect(campaignSignUpRequest.challengeOptions.measurementId).toBeNull();
      expect(campaignSignUpRequest.challengeOptions.activityTarget).toBeNull();
    });

    it("returns the expected music playlist value before setChallengeMusicPlaylist has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(campaignSignUpRequest.challengeOptions.musicPlaylist).toBeNull();
    });

    it("returns the expected activity values after setChallengeActivity has been called without a target", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      const activityId = uuid();
      const measurementId = uuid();
      campaignSignUpRequest.setChallengeActivity(activityId, measurementId);
      expect(campaignSignUpRequest.challengeOptions.activityId).toBe(
        activityId
      );
      expect(campaignSignUpRequest.challengeOptions.measurementId).toBe(
        measurementId
      );
      expect(campaignSignUpRequest.challengeOptions.activityTarget).toBeNull();
    });

    it("returns the expected activity values after setChallengeActivity has been called with a target", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      const activityId = uuid();
      const measurementId = uuid();
      const target = 123;
      campaignSignUpRequest.setChallengeActivity(
        activityId,
        measurementId,
        target
      );
      expect(campaignSignUpRequest.challengeOptions.activityId).toBe(
        activityId
      );
      expect(campaignSignUpRequest.challengeOptions.measurementId).toBe(
        measurementId
      );
      expect(campaignSignUpRequest.challengeOptions.activityTarget).toBe(
        target
      );
    });

    it("returns the expected activity values after setChallengeActivity has been called twice", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      const activityId = uuid();
      const measurementId = uuid();
      const target = 123;
      campaignSignUpRequest.setChallengeActivity(uuid(), uuid(), 321);
      campaignSignUpRequest.setChallengeActivity(
        activityId,
        measurementId,
        target
      );
      expect(campaignSignUpRequest.challengeOptions.activityId).toBe(
        activityId
      );
      expect(campaignSignUpRequest.challengeOptions.measurementId).toBe(
        measurementId
      );
      expect(campaignSignUpRequest.challengeOptions.activityTarget).toBe(
        target
      );
    });

    it("returns the expected music playlist value after setChallengeMusicPlaylist has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      campaignSignUpRequest.setChallengeMusicPlaylist(true);
      expect(campaignSignUpRequest.challengeOptions.musicPlaylist).to.be.true;
    });

    it("returns the expected music playlist value after setChallengeMusicPlaylist has been called twice", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      campaignSignUpRequest.setChallengeMusicPlaylist(true);
      campaignSignUpRequest.setChallengeMusicPlaylist(false);
      expect(campaignSignUpRequest.challengeOptions.musicPlaylist).to.be.false;
    });

    it("returns a copy of the challenge options object (mutating the object does not result in the actual object changing)", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      campaignSignUpRequest.challengeOptions.activityId = uuid();
      campaignSignUpRequest.challengeOptions.measurementId = uuid();
      campaignSignUpRequest.challengeOptions.activityTarget = 123;
      campaignSignUpRequest.challengeOptions.musicPlaylist = true;
      expect(campaignSignUpRequest.challengeOptions).toStrictEqual({
        activityId: null,
        measurementId: null,
        activityTarget: null,
        musicPlaylist: null,
      });
    });
  });

  describe(".setIsOptedInToMarketing", () => {
    it("throws an error when called with a non boolean value", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setIsOptedInToMarketing(
          "true" as unknown as boolean
        )
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setIsOptedInToMarketing must be passed a boolean value"
        )
      );
    });

    it("throws an error when called with undefined", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setIsOptedInToMarketing(undefined!)
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setIsOptedInToMarketing must be passed a boolean value"
        )
      );
    });

    it("throws an error when called with a null activityId", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.setIsOptedInToMarketing(null!)
      ).toThrowError(
        errorWithLinksToDocumentation(
          "setIsOptedInToMarketing must be passed a boolean value"
        )
      );
    });

    it("throws an error after the campaign sign-up has been submitted", async () => {
      const campaignSignUpRequest =
        await createAndSubmitValidCampaignSignUpRequest();
      expect(() =>
        campaignSignUpRequest.setIsOptedInToMarketing(true)
      ).toThrowError(
        errorWithLinksToDocumentation(
          "Changes are not permitted after the sign-up request has been submitted"
        )
      );
    });
  });

  describe(".isOptedInToMarketing", () => {
    it("returns the expected value before setIsOptedInToMarketing has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(campaignSignUpRequest.isOptedInToMarketing).toBeNull();
    });

    it("returns the expected value after setIsOptedInToMarketing has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      campaignSignUpRequest.setIsOptedInToMarketing(true);
      expect(campaignSignUpRequest.isOptedInToMarketing).to.be.true;
    });

    it("returns the expected value after setIsOptedInToMarketing has been called twice", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      campaignSignUpRequest.setIsOptedInToMarketing(true);
      campaignSignUpRequest.setIsOptedInToMarketing(false);
      expect(campaignSignUpRequest.isOptedInToMarketing).to.be.false;
    });
  });

  describe(".sendData", () => {
    it("does not make an API call when no set methods have been called", async () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      await campaignSignUpRequest.sendData();

      expect(putSignUp).not.toHaveBeenCalled();
      expect(patchSignUpQuestions).not.toHaveBeenCalled();
    });

    it("does not make an API call when no set methods have been called since the last call", async () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );

      campaignSignUpRequest.setFirstName(uuid());
      campaignSignUpRequest.setAdditionalQuestion(uuid(), uuid());
      await campaignSignUpRequest.sendData();
      await campaignSignUpRequest.sendData();

      expect(putSignUp).toHaveBeenCalledOnce();
      expect(patchSignUpQuestions).toHaveBeenCalledOnce();
    });

    it("makes an API call after first name has been set", async () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );

      campaignSignUpRequest.setFirstName(uuid());
      await campaignSignUpRequest.sendData();

      expect(putSignUp).toHaveBeenCalledOnce();
      expect(patchSignUpQuestions).not.toHaveBeenCalled();

      assertOnLastPutSignUp((lastPutSignUp) => {
        expect(lastPutSignUp.status).toBe("creating");
        expect(lastPutSignUp.firstName).toBe(campaignSignUpRequest.firstName);
      });
    });

    it("makes an API call after last name has been set", async () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );

      campaignSignUpRequest.setLastName(uuid());
      await campaignSignUpRequest.sendData();

      expect(putSignUp).toHaveBeenCalledOnce();
      expect(patchSignUpQuestions).not.toHaveBeenCalled();

      assertOnLastPutSignUp((lastPutSignUp) => {
        expect(lastPutSignUp.status).toBe("creating");
        expect(lastPutSignUp.lastName).toBe(campaignSignUpRequest.lastName);
      });
    });

    it("makes an API call after email has been set", async () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );

      campaignSignUpRequest.setEmail(uuid());
      await campaignSignUpRequest.sendData();

      expect(putSignUp).toHaveBeenCalledOnce();
      expect(patchSignUpQuestions).not.toHaveBeenCalled();

      assertOnLastPutSignUp((lastPutSignUp) => {
        expect(lastPutSignUp.status).toBe("creating");
        expect(lastPutSignUp.email).toBe(campaignSignUpRequest.email);
      });
    });

    it("makes an API call after groups have been set", async () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );

      campaignSignUpRequest.setGroup(uuid(), uuid());
      campaignSignUpRequest.setGroup(uuid(), uuid());
      await campaignSignUpRequest.sendData();

      expect(putSignUp).toHaveBeenCalledOnce();
      expect(patchSignUpQuestions).not.toHaveBeenCalled();

      assertOnLastPutSignUp((lastPutSignUp) => {
        expect(lastPutSignUp.status).toBe("creating");
        expect(lastPutSignUp.groups).toStrictEqual(
          campaignSignUpRequest.groups
        );
      });
    });

    it("makes an API call after miscellaneous questions have been set", async () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );

      campaignSignUpRequest.setAdditionalQuestion(uuid(), uuid());
      campaignSignUpRequest.setAdditionalQuestion(uuid(), uuid());
      await campaignSignUpRequest.sendData();

      expect(putSignUp).not.toHaveBeenCalled();
      expect(patchSignUpQuestions).toHaveBeenCalled();

      assertLastPatchedQuestionsMatch(
        campaignSignUpRequest.signUpId,
        campaignSignUpRequest.additionalQuestions
      );
    });

    it("makes an API call after challenge activity has been set", async () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );

      campaignSignUpRequest.setChallengeActivity(uuid(), uuid(), 123);
      await campaignSignUpRequest.sendData();

      expect(putSignUp).toHaveBeenCalledOnce();
      expect(patchSignUpQuestions).not.toHaveBeenCalled();

      assertOnLastPutSignUp((lastPutSignUp) => {
        expect(lastPutSignUp.status).toBe("creating");
        expect(lastPutSignUp.challengeOptions).toStrictEqual(
          campaignSignUpRequest.challengeOptions
        );
      });
    });

    it("makes an API call after challenge music playlist has been set", async () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );

      campaignSignUpRequest.setChallengeMusicPlaylist(true);
      await campaignSignUpRequest.sendData();

      expect(putSignUp).toHaveBeenCalledOnce();
      expect(patchSignUpQuestions).not.toHaveBeenCalled();

      assertOnLastPutSignUp((lastPutSignUp) => {
        expect(lastPutSignUp.status).toBe("creating");
        expect(lastPutSignUp.challengeOptions).toStrictEqual(
          campaignSignUpRequest.challengeOptions
        );
      });
    });

    it("makes an API call after isOptedInToMarketing has been set", async () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );

      campaignSignUpRequest.setIsOptedInToMarketing(true);
      await campaignSignUpRequest.sendData();

      expect(putSignUp).toHaveBeenCalledOnce();
      expect(patchSignUpQuestions).not.toHaveBeenCalled();

      assertOnLastPutSignUp((lastPutSignUp) => {
        expect(lastPutSignUp.status).toBe("creating");
        expect(lastPutSignUp.isOptedInToMarketing).toStrictEqual(
          campaignSignUpRequest.isOptedInToMarketing
        );
      });
    });

    it("throws an error after the campaign sign-up has been submitted", async () => {
      const campaignSignUpRequest =
        await createAndSubmitValidCampaignSignUpRequest();
      expect(() => campaignSignUpRequest.sendData()).rejects.toThrowError(
        errorWithLinksToDocumentation(
          "Changes are not permitted after the sign-up request has been submitted"
        )
      );
    });
  });

  describe(".submitSignUp", () => {
    it("throws an error before setFirstName has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      expect(() =>
        campaignSignUpRequest.submitSignUpRequest()
      ).rejects.toThrowError(
        errorWithLinksToDocumentation(
          "firstName must be set before submitSignUp can be called"
        )
      );
    });

    it("throws an error before setLastName has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      campaignSignUpRequest.setFirstName(uuid());
      expect(() =>
        campaignSignUpRequest.submitSignUpRequest()
      ).rejects.toThrowError(
        errorWithLinksToDocumentation(
          "lastName must be set before submitSignUp can be called"
        )
      );
    });

    it("throws an error before setEmail has been called", () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      campaignSignUpRequest.setFirstName(uuid());
      campaignSignUpRequest.setLastName(uuid());
      expect(() =>
        campaignSignUpRequest.submitSignUpRequest()
      ).rejects.toThrowError(
        errorWithLinksToDocumentation(
          "email must be set before submitSignUp can be called"
        )
      );
    });

    it("makes an API call when the sign-up request is valid with only required details", async () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      campaignSignUpRequest.setFirstName(uuid());
      campaignSignUpRequest.setLastName(uuid());
      campaignSignUpRequest.setEmail(uuid());

      await campaignSignUpRequest.submitSignUpRequest();

      expect(putSignUp).toHaveBeenCalledOnce();
      expect(patchSignUpQuestions).not.toHaveBeenCalled();

      assertOnLastPutSignUp((lastPutSignUp) => {
        expect(lastPutSignUp.status).toBe("submitted");
        expect(lastPutSignUp.firstName).toBe(campaignSignUpRequest.firstName);
        expect(lastPutSignUp.lastName).toBe(campaignSignUpRequest.lastName);
        expect(lastPutSignUp.email).toBe(campaignSignUpRequest.email);
        expect(lastPutSignUp.groups).toStrictEqual(
          campaignSignUpRequest.groups
        );
        expect(lastPutSignUp.isOptedInToMarketing).toBe(
          campaignSignUpRequest.isOptedInToMarketing
        );
        expect(lastPutSignUp.isTestResource).toBe(false);
        expect(lastPutSignUp.challengeOptions).toStrictEqual(
          campaignSignUpRequest.challengeOptions
        );
      });
    });

    it("makes an API call when the sign-up request is valid with all details provided", async () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      campaignSignUpRequest.setFirstName(uuid());
      campaignSignUpRequest.setLastName(uuid());
      campaignSignUpRequest.setEmail(uuid());
      campaignSignUpRequest.setChallengeActivity(uuid(), uuid(), 123);
      campaignSignUpRequest.setChallengeMusicPlaylist(true);
      campaignSignUpRequest.setGroup(uuid(), uuid());
      campaignSignUpRequest.setGroup(uuid(), uuid());
      campaignSignUpRequest.setIsOptedInToMarketing(false);
      campaignSignUpRequest.setAdditionalQuestion(uuid(), uuid());
      campaignSignUpRequest.setAdditionalQuestion(uuid(), uuid());

      await campaignSignUpRequest.submitSignUpRequest();

      expect(putSignUp).toHaveBeenCalledOnce();
      expect(patchSignUpQuestions).toHaveBeenCalledOnce();

      assertOnLastPutSignUp((lastPutSignUp) => {
        expect(lastPutSignUp.status).toBe("submitted");
        expect(lastPutSignUp.firstName).toBe(campaignSignUpRequest.firstName);
        expect(lastPutSignUp.lastName).toBe(campaignSignUpRequest.lastName);
        expect(lastPutSignUp.email).toBe(campaignSignUpRequest.email);
        expect(lastPutSignUp.groups).toStrictEqual(
          campaignSignUpRequest.groups
        );
        expect(lastPutSignUp.isOptedInToMarketing).toBe(
          campaignSignUpRequest.isOptedInToMarketing
        );
        expect(lastPutSignUp.isTestResource).toBe(false);
        expect(lastPutSignUp.challengeOptions).toStrictEqual(
          campaignSignUpRequest.challengeOptions
        );
      });

      assertLastPatchedQuestionsMatch(
        campaignSignUpRequest.signUpId,
        campaignSignUpRequest.additionalQuestions
      );
    });

    it("makes an API call when the sign-up request is valid with all details provided even if no details have changed", async () => {
      const campaignSignUpRequest = new CampaignSignUpRequest(
        charityId,
        campaignId
      );
      campaignSignUpRequest.setFirstName(uuid());
      campaignSignUpRequest.setLastName(uuid());
      campaignSignUpRequest.setEmail(uuid());
      campaignSignUpRequest.setChallengeActivity(uuid(), uuid(), 123);
      campaignSignUpRequest.setChallengeMusicPlaylist(true);
      campaignSignUpRequest.setGroup(uuid(), uuid());
      campaignSignUpRequest.setGroup(uuid(), uuid());
      campaignSignUpRequest.setIsOptedInToMarketing(false);
      campaignSignUpRequest.setAdditionalQuestion(uuid(), uuid());
      campaignSignUpRequest.setAdditionalQuestion(uuid(), uuid());

      await campaignSignUpRequest.sendData();
      await campaignSignUpRequest.submitSignUpRequest();

      expect(putSignUp).toHaveBeenCalledTimes(2);
      expect(patchSignUpQuestions).toHaveBeenCalledOnce();

      assertOnLastPutSignUp((lastPutSignUp) => {
        expect(lastPutSignUp.status).toBe("submitted");
        expect(lastPutSignUp.firstName).toBe(campaignSignUpRequest.firstName);
        expect(lastPutSignUp.lastName).toBe(campaignSignUpRequest.lastName);
        expect(lastPutSignUp.email).toBe(campaignSignUpRequest.email);
        expect(lastPutSignUp.groups).toStrictEqual(
          campaignSignUpRequest.groups
        );
        expect(lastPutSignUp.isOptedInToMarketing).toBe(
          campaignSignUpRequest.isOptedInToMarketing
        );
        expect(lastPutSignUp.isTestResource).toBe(false);
        expect(lastPutSignUp.challengeOptions).toStrictEqual(
          campaignSignUpRequest.challengeOptions
        );
      });

      assertLastPatchedQuestionsMatch(
        campaignSignUpRequest.signUpId,
        campaignSignUpRequest.additionalQuestions
      );
    });

    it("throws an error after the campaign sign-up has been submitted", async () => {
      const campaignSignUpRequest =
        await createAndSubmitValidCampaignSignUpRequest();
      expect(() => campaignSignUpRequest.sendData()).rejects.toThrowError(
        errorWithLinksToDocumentation(
          "Changes are not permitted after the sign-up request has been submitted"
        )
      );
    });
  });
});
