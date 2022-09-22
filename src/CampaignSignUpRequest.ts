import { v4 as uuid } from "uuid";
import {
  patchSignUpQuestions,
  putSignUp,
  SignUpRequestChallengeOptions,
  SignUpRequestGroup,
  SignUpRequestStatus,
} from "./api/charitiesCampaignsSignUps";

export default class CampaignSignUpRequest {
  constructor(
    public readonly charityId: string,
    public readonly campaignId: string
  ) {
    if (!charityId) {
      this.throwErrorWithLinksToDocumentation("charityId must be provided");
    }

    if (!campaignId) {
      this.throwErrorWithLinksToDocumentation("campaignId must be provided");
    }
  }

  public readonly signUpId = uuid();

  private _status: SignUpRequestStatus = "creating";
  private _hasBeenSubmitted = false;

  private _hasNewSignUpDataToSend: boolean = false;
  private _hasNewMiscellaneousQuestionsDataToSend: boolean = false;

  private _firstName: string | null = null;
  private _lastName: string | null = null;
  private _email: string | null = null;

  private _groups: { [groupingId: string]: string } = {};
  private _additionalQuestions: { [question: string]: string } = {};
  private _challengeOptions: SignUpRequestChallengeOptions = {
    activityId: null,
    activityTarget: null,
    measurementId: null,
    musicPlaylist: null,
  };

  private _isOptedInToMarketing: boolean | null = null;

  get firstName() {
    return this._firstName;
  }

  public setFirstName(firstName: string) {
    this.throwIfHasBeenSubmitted();

    if (!firstName) {
      this.throwErrorWithLinksToDocumentation(
        "setFirstName must be passed a value"
      );
    }

    this._hasNewSignUpDataToSend = true;
    this._firstName = firstName;
  }

  get lastName() {
    return this._lastName;
  }

  public setLastName(lastName: string) {
    this.throwIfHasBeenSubmitted();

    if (!lastName) {
      this.throwErrorWithLinksToDocumentation(
        "setLastName must be passed a value"
      );
    }

    this._hasNewSignUpDataToSend = true;
    this._lastName = lastName;
  }

  get email() {
    return this._email;
  }

  public setEmail(email: string) {
    this.throwIfHasBeenSubmitted();

    if (!email) {
      this.throwErrorWithLinksToDocumentation(
        "setEmail must be passed a value"
      );
    }

    this._hasNewSignUpDataToSend = true;
    this._email = email;
  }

  get groups(): SignUpRequestGroup[] {
    return Object.entries(this._groups).map(([key, value]) => ({
      groupingId: key,
      groupId: value,
    }));
  }

  public setGroup(groupingId: string, groupId: string) {
    this.throwIfHasBeenSubmitted();

    if (Object.keys(this._groups).length === 5) {
      this.throwErrorWithLinksToDocumentation(
        "Group selections for a maximum of 5 groupings may be added using setGroup"
      );
    }

    if (!groupingId) {
      this.throwErrorWithLinksToDocumentation(
        "setGroup must be passed a value for groupingId"
      );
    }

    if (!groupId) {
      this.throwErrorWithLinksToDocumentation(
        "setGroup must be passed a value for groupId"
      );
    }

    this._hasNewSignUpDataToSend = true;
    this._groups[groupingId] = groupId;
  }

  get additionalQuestions(): Record<string, string> {
    return { ...this._additionalQuestions };
  }

  public setAdditionalQuestion(question: string, answer: string) {
    this.throwIfHasBeenSubmitted();

    if (Object.keys(this._additionalQuestions).length === 30) {
      this.throwErrorWithLinksToDocumentation(
        "A maximum of 30 questions may be added using setMiscellaneousQuestion"
      );
    }

    if (!question) {
      this.throwErrorWithLinksToDocumentation(
        "setMiscellaneousQuestion must be passed a value for question"
      );
    }

    if (question.length > 100) {
      this.throwErrorWithLinksToDocumentation(
        "setMiscellaneousQuestion may not be passed a value for question longer than 100 characters"
      );
    }

    if (!answer && answer !== "") {
      this.throwErrorWithLinksToDocumentation(
        "setMiscellaneousQuestion must be passed a value for answer"
      );
    }

    this._hasNewMiscellaneousQuestionsDataToSend = true;
    this._additionalQuestions[question] = answer;
  }

  get challengeOptions(): SignUpRequestChallengeOptions {
    return { ...this._challengeOptions };
  }

  public setChallengeActivity(
    activityId: string,
    measurementId: string,
    activityTarget: number | null = null
  ) {
    this.throwIfHasBeenSubmitted();

    if (!activityId) {
      this.throwErrorWithLinksToDocumentation(
        "setChallengeActivity must be passed a value for activityId"
      );
    }

    if (!measurementId) {
      this.throwErrorWithLinksToDocumentation(
        "setChallengeActivity must be passed a value for measurementId"
      );
    }

    if (
      activityTarget !== null &&
      (activityTarget <= 0 || Number.isNaN(Number(activityTarget)))
    ) {
      this.throwErrorWithLinksToDocumentation(
        "setChallengeActivity must be passed a positive number value for activityTarget"
      );
    }

    this._hasNewSignUpDataToSend = true;
    this._challengeOptions.activityId = activityId;
    this._challengeOptions.measurementId = measurementId;
    this._challengeOptions.activityTarget = activityTarget;
  }

  public setChallengeMusicPlaylist(challengeMusicPlaylistEnabled: boolean) {
    this.throwIfHasBeenSubmitted();

    if (
      challengeMusicPlaylistEnabled !== true &&
      challengeMusicPlaylistEnabled !== false
    ) {
      this.throwErrorWithLinksToDocumentation(
        "setChallengeMusicPlaylist must be passed a boolean value"
      );
    }

    this._hasNewSignUpDataToSend = true;

    this._challengeOptions.musicPlaylist = challengeMusicPlaylistEnabled;
  }

  get isOptedInToMarketing() {
    return this._isOptedInToMarketing;
  }

  public setIsOptedInToMarketing(isOptedInToMarketing: boolean) {
    this.throwIfHasBeenSubmitted();

    if (isOptedInToMarketing !== true && isOptedInToMarketing !== false) {
      this.throwErrorWithLinksToDocumentation(
        "setIsOptedInToMarketing must be passed a boolean value"
      );
    }

    this._hasNewSignUpDataToSend = true;

    this._isOptedInToMarketing = isOptedInToMarketing;
  }

  public async submit() {
    this.throwIfHasBeenSubmitted();

    if (!this._firstName) {
      this.throwErrorWithLinksToDocumentation(
        "firstName must be set before submit can be called"
      );
    }

    if (!this._lastName) {
      this.throwErrorWithLinksToDocumentation(
        "lastName must be set before submit can be called"
      );
    }

    if (!this._email) {
      this.throwErrorWithLinksToDocumentation(
        "email must be set before submit can be called"
      );
    }

    this._status = "submitted";
    this._hasNewSignUpDataToSend = true;

    await this.sendData();

    this._hasBeenSubmitted = true;
  }

  public async sendData() {
    this.throwIfHasBeenSubmitted();

    await this.sendMiscellaneousQuestionsIfChanged();
    await this.sendSignUpIfChanged();
  }

  private async sendMiscellaneousQuestionsIfChanged() {
    if (!this._hasNewMiscellaneousQuestionsDataToSend) {
      return;
    }

    await patchSignUpQuestions(
      this.charityId,
      this.campaignId,
      this.signUpId,
      this.additionalQuestions
    );

    this._hasNewMiscellaneousQuestionsDataToSend = false;
  }

  private async sendSignUpIfChanged() {
    if (!this._hasNewSignUpDataToSend) {
      return;
    }

    await putSignUp(this.charityId, this.campaignId, {
      campaignId: this.campaignId,
      challengeOptions: this.challengeOptions,
      email: this.email,
      firstName: this.firstName,
      groups: this.groups,
      id: this.signUpId,
      isOptedInToMarketing: this._isOptedInToMarketing,
      isTestResource: false,
      lastName: this.lastName,
      status: this._status,
    });

    this._hasNewSignUpDataToSend = false;
  }

  private throwIfHasBeenSubmitted() {
    if (!this._hasBeenSubmitted) {
      return;
    }

    this.throwErrorWithLinksToDocumentation(
      "Changes are not permitted after the sign-up request has been submitted"
    );
  }

  private throwErrorWithLinksToDocumentation(message: string) {
    throw new Error(
      `${message}\nFor more information, please see the documentation:\n\t- https://github.com/GivePenny/CampaignSignUpHelper#readme\n\t- https://docs.givepenny.com/content/api/charities/campaigns/signupsservice/sign-up/putsignuprequest.html\n\t- https://docs.givepenny.com/content/api/charities/campaigns/signupsservice/questions/patchsignupquestions.html`
    );
  }
}
