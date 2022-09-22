# CampaignSignUpHelper

The CampaignSignUpHelper library intends to simplify integration with the GivePenny campaign sign-up APIs.

## Installation

The library is currently intended to be used via browsers, for example from custom campaign sign-up sites:

```html
<script src="https://assets.givepenny.com/gp-campaign-sign-up-helper.umd.js"></script>
```

## Browser Support

The built UMD module targets ECMAScript 2015 (ES6). [See browser support on Caniuse.com](https://caniuse.com/es6).

## Usage

Once installed, the built UMD module is available on `window` via `window.GPCampaignSignUpHelper`. The module exposes a class `CampaignSignUpRequest`, which should be instantiated for each new campaign sign-up.

Note that the identifiers in the following code snippet are examples only, and should be replaced with real identifiers. See [Development Helper](#development-helper) below for detail on retrieving identifiers for a campaign.

```js
const charityId = "dc3ee97f-f307-45fa-a808-435144eca3fe";
const campaignId = "288c0223-2d78-4460-9ade-afd67eaeb9fb";
const campaignSignUpRequest = new window
  .GPCampaignSignUpHelper
  .CampaignSignUpRequest(
    charityId,
    campaignId
  );
```

### Basic Usage

Once constructed, the `campaignSignUpRequest` may be enriched with further information about the sign-up request, for example:

#### `setFirstName` & `firstName`

The first name of the person requesting to sign up to the campaign can be set using `setFirstName`, and later retrieved using the `firstName` getter.

`setFirstName` takes a single string argument.

```js
// Assuming validation has already been carried out
const firstName = document.querySelector("#first-name-input").value;
campaignSignUpRequest.setFirstName(firstName);

// ...

document.querySelector("#thank-you-message").innerText =
  "Thank you for signing up, " +
  campaignSignUpRequest.firstName +
  "!";
```

Note that `setFirstName` will throw an error if the value is falsy (e.g. `""`).

#### `setLastName` & `lastName`

The last name of the person requesting to sign up to the campaign can be set using `setLastName`, and later retrieved using the `lastName` getter.

`setLastName` takes a single string argument.

```js
// Assuming validation has already been carried out
const lastName = document.querySelector("#last-name-input").value;
campaignSignUpRequest.setLastName(lastName);
```

Note that `setLastName` will throw an error if the value is falsy (e.g. `""`).

#### `setEmail` & `email`

The email address of the person requesting to sign up to the campaign can be set using `setEmail`, and later retrieved using the `email` getter.

This value will be used to contact the person signing up with a link to complete their sign-up. The sign-up API will fail validation if this value is not in a valid email format. It should be ensured that a valid email address is provided when `setEmail` is called (e.g. by using an HTML input with `type="email"`). For more information, please see the [documented outcomes of the PutSignUpRequest Operation](https://docs.givepenny.com/content/api/charities/campaigns/signupsservice/sign-up/putsignuprequest.html#outcomes).

`setEmail` takes a single string argument.

```js
// Assuming validation has already been carried out
const email = document.querySelector("#email-input").value;
campaignSignUpRequest.setEmail(email);

// ...

document.querySelector("#thank-you-message").innerText =
  "Please look out for an email in your " +
  campaignSignUpRequest.email + 
  " inbox with a link to complete your sign-up!";
```

Note that `setEmail` will throw an error if the value is falsy (e.g. `""`).

#### `submit`

Once enriched with at least `firstName`, `lastName` and `email`, the sign-up request may be submitted, for example:

```js
campaignSignUpRequest
  .submit()
  .then(() => {
    // The sign-up request has been submitted
    // Safe to proceed to e.g. show a thank you message
  })
  .catch(() => {
    // There was an error when submitting the sign-up request
  });
```
  
`submit` takes no arguments, and returns a `Promise` which is resolved with no value.

After the sign-up has been submitted, further calls to any of its methods will result in an error being thrown (getters may still be accessed).

### Advanced Usage

While only `firstName`, `lastName` and `email` are required in order for the sign-up request to be submitted, the `CampaignSignUpRequest` class supports capture of further information:

#### `setIsOptedInToMarketing` & `isOptedInToMarketing`

Charity marketing opt-in may be captured on the `campaignSignUpRequest` using `setIsOptedInToMarketing`, and later retrieved using the `isOptedInToMarketing` getter.

`setIsOptedInToMarketing` takes a single boolean parameter.

```js
// Assuming validation has already been carried out
const isOptedInToMarketing =
  document.querySelector("#marketing-opt-in-input").checked;

campaignSignUpRequest.setIsOptedInToMarketing(
  isOptedInToMarketing
);
```

#### `setChallengeActivity`, `setChallengeMusicPlaylist` & `challengeOptions`

Options to be used when the person signing up completes their sign-up and launches their fundraising challenge may be captured on the `campaignSignUpRequest` using `setChallengeActivity` and `setChallengeMusicPlaylist`. These can be later retrieved using the `challengeOptions` getter.

Note that the identifiers in the following code snippets are examples only, and should be replaced with real identifiers. See [Development Helper](#development-helper) below for detail on retrieving activity identifiers for a campaign.

##### `setChallengeActivity`

The `setChallengeActivity` method takes two arguments: GUID string `activityId`, GUID string `measurementId`. It also accepts an optional third number argument `activityTarget`.

Example without `activityTarget`:

```js
const activityId = "528fb77f-1552-4543-95e0-17576b0d5029";
const measurementId = "da94980c-f29f-43c8-953b-8bb2375b8231";

campaignSignUpRequest.setChallengeActivity(
  activityId,
  measurementId
);
```

Example with `activityTarget`:

```js
const activityId = "528fb77f-1552-4543-95e0-17576b0d5029";
const measurementId = "da94980c-f29f-43c8-953b-8bb2375b8231";

// Assuming validation has already been carried out
const activityTarget = Number(
  document.querySelector("#activity-target-select").value
);

campaignSignUpRequest.setChallengeActivity(
  activityId,
  measurementId,
  activityTarget
);
```

Note that `setChallengeActivity` will throw an error if `activityId` or `measurementId` are falsy (e.g. `""`). An error will also be thrown if an `activityTarget` is provided and is negative or `NaN`.

##### `setChallengeMusicPlaylist`

The `setChallengeMusicPlaylist` method takes a single boolean argument.

```js
const challengeMusicPlaylistEnabled =
  document.querySelector("#enable-challenge-music-playlist").checked;

campaignSignUpRequest.setChallengeMusicPlaylist(
  challengeMusicPlaylistEnabled
);
```

#### `setGroup` & `groups`

Group selections for campaign groupings may be captured on the `campaignSignUpRequest` using `setGroup`, and later retrieved using the `groups` getter. For more information on groupings, please see the [Challenge Groupings Service API documentation](https://docs.givepenny.com/content/api/fundraisers/challenges/groupingservice/overview.html).

Note that the identifiers in the following code snippets are examples only, and should be replaced with real identifiers. See [Development Helper](#development-helper) below for detail on retrieving grouping identifiers for a campaign.

The `setGroup` method takes two GUID string arguments: `groupingId` and `groupId`.

```js
const groupingId = "25936cfe-a4bb-4dec-868e-e07ae6763e33";
const groupId = "2020bd47-7aef-4221-a113-6bc9e7ecdc56";

campaignSignUpRequest.setGroup(
  groupingId,
  groupId
);
```

The `groups` getter returns an array of objects containing keys `groupingId` and `groupId`, e.g.:

```js
[
  {
    groupingId: "25936cfe-a4bb-4dec-868e-e07ae6763e33",
    groupId: "2020bd47-7aef-4221-a113-6bc9e7ecdc56",
  }
]
```

Note that `setGroup` will throw an error if `groupingId` or `groupId` are falsy (e.g. `""`).

#### `setAdditionalQuestion` & `additionalQuestions`

Additional miscellaneous questions & answers may be captured on the `campaignSignUpRequest` using `setAdditionalQuestion`. These may later be retrieved using the `additionalQuestions` getter. For more information on these additional questions, please see the [PatchSignUpQuestions API Operation documentation](https://docs.givepenny.com/content/api/charities/campaigns/signupsservice/questions/patchsignupquestions.html).

The `setAdditionalQuestion` method takes two string arguments: `question` and `answer`.

```js
const question = "Where did you hear about the campaign?";

// Assuming validation has already been carried out
const answer =
  document.querySelector("#sign-up-source-select").value;

campaignSignUpRequest.setAdditionalQuestion(
  question,
  answer
);
```

Note that `setAdditionalQuestion` will throw an error if `question` is falsy (e.g. `""`). An empty string `answer` is valid. Furthermore, `question` values may not be longer than 100 characters, and at most 30 different questions may be set.

The `additionalQuestions` getter returns an object containing keys for added questions with values set to their answers, e.g. from the above code snippet:

```js
{
  "Where did you hear about the campaign?":
    "Social media"
}
```

#### `sendData`

In addition to the `submit` method, `CampaignSignUpRequest` exposes a `sendData` method. This method allows the current state of the `CampaignSignUpRequest` to be sent to the API without marking the request as having been submitted. This allows for data to be saved at more frequent intervals, e.g. after each step of a multi-step form. Ultimately this can be used to aid in reporting of incomplete sign-up requests (those where the person signing up abandoned the process part way through).

`sendData` takes no arguments, and returns a `Promise` which is resolved with no value.

```js
campaignSignUpRequest
  .sendData()
  .then(() => {
    // The sign-up request data has been sent to the API
  })
  .catch(() => {
    // There was an error when sending the sign-up request data to the API
  });
```

### `CampaignSignUpRequest` Public Class Methods & Getters Reference

- `constructor(charityId, campaignId)`
  - `charityId` parameter is of type `string` (GUID)
  - `campaignId` parameter is of type `string` (GUID)
- `signUpId` getter - returns a GUID `string`
- `charityId` getter - returns a GUID `string`
- `campaignId` getter - returns a GUID `string`
- `setFirstName(firstName)`
  - `firstName` parameter is of type `string`
- `firstName` getter - returns a `string`
- `setLastName(lastName)`
  - `lastName` parameter is of type `string`
- `lastName` getter - returns a `string`
- `setEmail(email)`
  - `email` parameter is of type `string`
- `email` getter - returns a `string`
- `setGroup(groupingId, groupId)`
  - `groupingId` parameter is of type `string` (GUID)
  - `groupId` parameter is of type `string` (GUID)
- `groups` getter - returns an array of `{ groupingId: string, groupId: string }`
- `setAdditionalQuestion(question, answer)`
  - `question` parameter is of type `string`
  - `answer` parameter is of type `string`
- `additionalQuestions` getter - returns an `object` (with `question` keys and values as their `answer`s)
- `setChallengeActivity(activityId, measurementId)`
  - `activityId` parameter is of type `string` (GUID)
  - `measurementId` parameter is of type `string` (GUID)
- `setChallengeActivity(activityId, measurementId, activityTarget)`
  - `activityId` parameter is of type `string` (GUID)
  - `measurementId` parameter is of type `string` (GUID)
  - `activityTarget` parameter is of type `number`
- `setChallengeMusicPlaylist(challengeMusicPlaylistEnabled)`
  - `challengeMusicPlaylistEnabled` parameter is of type `boolean`
- `challengeOptions` getter - returns an `object` with keys `activityId`, `measurementId`, `activityTarget`, `musicPlaylist`
- `setIsOptedInToMarketing(isOptedInToMarketing)`
  - `isOptedInToMarketing` parameter is of type `boolean`
- `isOptedInToMarketing` getter - returns a `boolean`
- `sendData()` - returns a `Promise`
- `submit()` - returns a `Promise`

### General Notes

- The `campaignSignUpRequest` should only be modified using its `set...` methods, mutating values retrieved from getters will not update the actual value on the `campaignSignUpRequest`
  - E.g. `campaignSignUpRequest.challengeOptions.musicPlaylist = true;` will not work, and `campaignSignUpRequest.setChallengeMusicPlaylist(true)` should be used instead
- `setGroup` and `setAdditionalQuestion` may be called multiple times with the same `groupingId` or `question` to update the selected `groupId` or `answer` respectively
- Across all `set...` methods, once a value has been set it may be changed, but may not be unset
  - E.g. `setFirstName("Alice"); setFirstName("Bob");` is fine, while `setFirstName("Alice"); setFirstName(undefined);` is not supported
  - Likewise for `setGroup` and `setAdditionalQuestion`, there are no `removeGroup` or `removeAdditionalQuestion` counterpart methods
- After the sign-up has been submitted, further calls to any of its methods will result in an error being thrown (getters may still be accessed)

## Development Helper

Bundled in the UMD module is a second helper function `getCampaignDetails`. This function accepts a single string argument, which is the URL slug of the campaign (e.g. from a campaign URL <https://givepenny.com/campaign/{slug}>).

The `getCampaignDetails` function returns a `Promise` which is resolved with an object containing identifiers and display labels for details about the campaign that may be useful at sign-up time.

This includes the campaign name & ID and the charity ID. Also included are the groupings for the campaign (if any have been configured, see the [Challenge Groupings Service API documentation](https://docs.givepenny.com/content/api/fundraisers/challenges/groupingservice/overview.html) for more detail), and details around the activities being measured by the campaign (again, if any).

Example of the resolved value from a call to this function:

```json
{
    "name": "Example campaign",
    "campaignId": "246213c7-2f08-4b2d-8c63-afebdf5c3a90",
    "charityId": "ebf54844-5d67-455c-aafa-6cdfd9ed35c5",
    "measuring": [
        {
            "measurementId": "65e12b09-0610-4ec8-886e-7ba7447523e7",
            "preferredUnitId": "dc555699-754e-4d34-a512-eeb4ca2dfbab",
            "activities": [
                {
                    "activityId": "2471718b-62ba-4dfc-9b4b-24ef0cd2514d",
                    "targets": [{ "target": 1000 }],
                    "activityName": "Moving"
                },
                {
                    "activityId": "528fb77f-1552-4543-95e0-17576b0d5029",
                    "targets": [{ "target": 1000 }],
                    "activityName": "Running"
                }
            ],
            "measurementName": "Duration",
            "preferredUnitName": "Minutes"
        }
    ],
    "groupings": [
        {
            "id": "7ba0a276-6adb-4e80-ab6d-2c97c0421e02",
            "label": "Team",
            "groups": [
                {
                    "id": "7ee084c7-5c29-408e-9c14-41df3123e489",
                    "label": "Team 1"
                },
                {
                    "id": "a627d8cb-f8cd-40ee-b18c-db64258367b8",
                    "label": "Team 2"
                }
            ]
        }
    ]
}
```

Some of the APIs used by this helper function are restricted to GivePenny origins by their CORS policies, so the helper has been made available on our documentation site:

[Use the Development Helper on the GivePenny documentation site](https://docs.givepenny.com/content/miscellaneous/campaign-sign-up-helper.html).

## API Documentation

For further information on the services and API operations used by and surrounding this library, please see the following documentation:

- [Charities Campaigns SignUps Service](https://docs.givepenny.com/content/api/charities/campaigns/signupsservice/overview.html)
  - [PutSignUpRequest Operation](https://docs.givepenny.com/content/api/charities/campaigns/signupsservice/sign-up/putsignuprequest.html)
  - [PatchSignUpQuestions Operation](https://docs.givepenny.com/content/api/charities/campaigns/signupsservice/questions/patchsignupquestions.html)
- [Charities Campaigns Management Service](https://docs.givepenny.com/content/api/charities/campaigns/managementservice/overview.html)
  - [ListCampaigns Operation](https://docs.givepenny.com/content/api/charities/campaigns/managementservice/campaigns/listcampaigns.html)
- [Fundraising Activities Discovery Service](https://docs.givepenny.com/content/api/fundraisers/activities/discoveryservice/overview.html)
  - [ListMeasurements Operation](https://docs.givepenny.com/content/api/fundraisers/activities/discoveryservice/measurements/listmeasurements.html)
- [Fundraising Activities Management Service](https://docs.givepenny.com/content/api/fundraisers/activities/managementservice/overview.html)
  - [GetActivities Operation](https://docs.givepenny.com/content/api/fundraisers/activities/managementservice/activities/getactivities.html)
  - [GetActivity Operation](https://docs.givepenny.com/content/api/fundraisers/activities/managementservice/activities/getactivity.html)
- [Challenge Grouping Service](https://docs.givepenny.com/content/api/fundraisers/challenges/groupingservice/overview.html)
  - [GetGroupings Operation](https://docs.givepenny.com/content/api/fundraisers/challenges/groupingservice/groupings/getgroupings.html)
