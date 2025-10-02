# @nylas/react

## 2.2.4

### Patch Changes

- [#733](https://github.com/nylas/nylas/pull/733) [`9632ac3`](https://github.com/nylas/nylas/commit/9632ac3d5871ad0e1dc50fb09b3c64845c1ec06b) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Fixed UUID extraction from booking refs did not work for URL encoded values after the last fix.

- Updated dependencies [[`9632ac3`](https://github.com/nylas/nylas/commit/9632ac3d5871ad0e1dc50fb09b3c64845c1ec06b)]:
  - @nylas/web-elements@2.2.4

## 2.2.3

### Patch Changes

- [#726](https://github.com/nylas/nylas/pull/726) [`a19b12c`](https://github.com/nylas/nylas/commit/a19b12cc4fca0aed9541cddd0eb9cf8e9ddda57c) Thanks [@AaronDDM](https://github.com/AaronDDM)! - fix(web-elements): Booking ref and cancel ref UUID utility not properly calculating UUIDs

- [#729](https://github.com/nylas/nylas/pull/729) [`6cca66a`](https://github.com/nylas/nylas/commit/6cca66ad663da728fb42fd5a7995b5fdae3f6b20) Thanks [@AaronDDM](https://github.com/AaronDDM)! - fix: SS-1254 hiding booking and cancellation url does not work

- Updated dependencies [[`53242a1`](https://github.com/nylas/nylas/commit/53242a14833fbab606f532b8da206fc22c609642), [`a19b12c`](https://github.com/nylas/nylas/commit/a19b12cc4fca0aed9541cddd0eb9cf8e9ddda57c), [`6cca66a`](https://github.com/nylas/nylas/commit/6cca66ad663da728fb42fd5a7995b5fdae3f6b20), [`53242a1`](https://github.com/nylas/nylas/commit/53242a14833fbab606f532b8da206fc22c609642)]:
  - @nylas/web-elements@2.2.2

## 2.2.0

### Minor Changes

- [#711](https://github.com/nylas/nylas/pull/711) [`59f43c6`](https://github.com/nylas/nylas/commit/59f43c6bb99b0a420d4774fa85a35d3389cb9f19) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Upgraded stencil to 4.36.1

- [#711](https://github.com/nylas/nylas/pull/711) [`59f43c6`](https://github.com/nylas/nylas/commit/59f43c6bb99b0a420d4774fa85a35d3389cb9f19) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Updated @nylas/react to be compatible with Turbopack

### Patch Changes

- Updated dependencies [[`59f43c6`](https://github.com/nylas/nylas/commit/59f43c6bb99b0a420d4774fa85a35d3389cb9f19)]:
  - @nylas/web-elements@2.2.0

## 2.1.0

### Minor Changes

- [#705](https://github.com/nylas/nylas/pull/705) [`7ba574f`](https://github.com/nylas/nylas/commit/7ba574f2912f119e32ffdfdaed18bb83f7258085) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Fixed nylas-scheduling themes if a session id/config id was not set.

### Patch Changes

- [#701](https://github.com/nylas/nylas/pull/701) [`206e1ca`](https://github.com/nylas/nylas/commit/206e1cac624e89efddbbb0825c6a2923b9078a80) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Renamed specific_date_open_hours to specific_time_availability for consistency

- Updated dependencies [[`206e1ca`](https://github.com/nylas/nylas/commit/206e1cac624e89efddbbb0825c6a2923b9078a80), [`7ba574f`](https://github.com/nylas/nylas/commit/7ba574f2912f119e32ffdfdaed18bb83f7258085)]:
  - @nylas/web-elements@2.1.0
  - @nylas/core@1.2.0

## 2.0.6

### Patch Changes

- [#700](https://github.com/nylas/nylas/pull/700) [`48df648`](https://github.com/nylas/nylas/commit/48df648c8c4d7434d48f3575f4d85cb4d54ee8a2) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated the translations for errors in the custom fields shown on th ebooking form of the scheduling page

- Updated dependencies [[`48df648`](https://github.com/nylas/nylas/commit/48df648c8c4d7434d48f3575f4d85cb4d54ee8a2)]:
  - @nylas/web-elements@2.0.6

## 2.0.5

### Patch Changes

- [#693](https://github.com/nylas/nylas/pull/693) [`870f285`](https://github.com/nylas/nylas/commit/870f285f2331a09ac8e135917ac8f053d98447cd) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated the type for bookedEventInfo event to include all the fields emitted

- [#695](https://github.com/nylas/nylas/pull/695) [`d421948`](https://github.com/nylas/nylas/commit/d421948404480e87e1bf7cc508d6a00f3adbc5ae) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Group config only supports 'booking' type and does not support 'organizer-confirmation' type, so hide the component in the UI if it is a group config

- [#692](https://github.com/nylas/nylas/pull/692) [`f62ebaa`](https://github.com/nylas/nylas/commit/f62ebaa3f617c4de0e734c80331167ca5b1ce1fa) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed: Time overlap validation failed when using Spanish (“es”) due to unrecognized "a.m." / "p.m." formats.

- [#699](https://github.com/nylas/nylas/pull/699) [`842e3fd`](https://github.com/nylas/nylas/commit/842e3fd6329b334be46c6c6682b604733eb5acfe) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Improved the invalid grant error to show a user friendly error message to contact the organizer

- Updated dependencies [[`870f285`](https://github.com/nylas/nylas/commit/870f285f2331a09ac8e135917ac8f053d98447cd), [`d421948`](https://github.com/nylas/nylas/commit/d421948404480e87e1bf7cc508d6a00f3adbc5ae), [`f62ebaa`](https://github.com/nylas/nylas/commit/f62ebaa3f617c4de0e734c80331167ca5b1ce1fa), [`842e3fd`](https://github.com/nylas/nylas/commit/842e3fd6329b334be46c6c6682b604733eb5acfe)]:
  - @nylas/web-elements@2.0.5

## 2.0.4

### Patch Changes

- [#678](https://github.com/nylas/nylas/pull/678) [`06e62c4`](https://github.com/nylas/nylas/commit/06e62c4a557a4fc998bb473dbf0e2634e7fd03e3) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Introduced a "Specific Date Availability" picker to set custom availability for participants on specific dates

- Updated dependencies [[`06e62c4`](https://github.com/nylas/nylas/commit/06e62c4a557a4fc998bb473dbf0e2634e7fd03e3)]:
  - @nylas/web-elements@2.0.4
  - @nylas/core@1.1.8

## 2.0.3

### Patch Changes

- Removed unused dependency "quill" due to a transitive XSS vulnerability. This eliminates the risk of arbitrary JavaScript execution via crafted onloadstart attributes in <img> tags.

- Updated dependencies []:
  - @nylas/web-elements@2.0.3

## 2.0.2

### Patch Changes

- [#669](https://github.com/nylas/nylas/pull/669) [`c4e6ebb`](https://github.com/nylas/nylas/commit/c4e6ebb142531702f3308cb024e2dabea0f4770a) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated the scheduling components to use a prop defaultLanguage to init a component in the specified langugae in a different state eg. Cancelling a booking state.

- Updated dependencies [[`c4e6ebb`](https://github.com/nylas/nylas/commit/c4e6ebb142531702f3308cb024e2dabea0f4770a)]:
  - @nylas/web-elements@2.0.2

## 2.0.1

### Patch Changes

- [#643](https://github.com/nylas/nylas/pull/643) [`d4e5d01`](https://github.com/nylas/nylas/commit/d4e5d0174c08b7ab68a27f30486f40d34da4d069) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added a tag to reveal the version of the components on nylas-scheduling and nylas-scheduler-editor components

- [#650](https://github.com/nylas/nylas/pull/650) [`cc54c58`](https://github.com/nylas/nylas/commit/cc54c589f9355aa34af2a849a526a781b01c36f9) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed a bug in the nylas-availability-picker component where the openHours prop was not correctly applied when used standalone.

- [#640](https://github.com/nylas/nylas/pull/640) [`47cd723`](https://github.com/nylas/nylas/commit/47cd723fdad807593d487d3a8bf76aca16100f24) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the auto re-setting of booking type to 'booking' on config update

- [#655](https://github.com/nylas/nylas/pull/655) [`e39f5fe`](https://github.com/nylas/nylas/commit/e39f5fed6039175c58995339f5a171b32de3ac34) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Enhanced the calendar fetching logic to support pagination and return complete results. The method now retrieves all available calendar data across multiple pages, consistently limits each request to 50 items, and returns the full set of calendars instead of just the first page. This ensures more reliable data coverage and alignment with how configuration data is fetched.

- [#653](https://github.com/nylas/nylas/pull/653) [`5a86c6d`](https://github.com/nylas/nylas/commit/5a86c6d314bae02ef59c521ea132f707b9eab1d9) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Moved the error messages in the scheduler component from the bottom (footer) to a toast / notification. This is similar to the notification in the scheduling component.

- [#641](https://github.com/nylas/nylas/pull/641) [`88c5873`](https://github.com/nylas/nylas/commit/88c58734a1a1cab5fac6a9ec77c4fa5115547fad) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue where the CTA buttons in the organizer confirmation card component were hidden based on hide_rescheduling_options and hide_cancellation_options, these options should only be applciable to the booking confirmation page.

- [#638](https://github.com/nylas/nylas/pull/638) [`648afa4`](https://github.com/nylas/nylas/commit/648afa453b639a4d9f27c9ce67f9b8f53f33bb27) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added a dropdown to select the default value for 'dropdown', 'checkbox' and 'radio-button' form field types. Added a multi-select dropdown to select the default value for 'multi_select' field type.

- Updated dependencies [[`d4e5d01`](https://github.com/nylas/nylas/commit/d4e5d0174c08b7ab68a27f30486f40d34da4d069), [`cc54c58`](https://github.com/nylas/nylas/commit/cc54c589f9355aa34af2a849a526a781b01c36f9), [`47cd723`](https://github.com/nylas/nylas/commit/47cd723fdad807593d487d3a8bf76aca16100f24), [`e39f5fe`](https://github.com/nylas/nylas/commit/e39f5fed6039175c58995339f5a171b32de3ac34), [`5a86c6d`](https://github.com/nylas/nylas/commit/5a86c6d314bae02ef59c521ea132f707b9eab1d9), [`88c5873`](https://github.com/nylas/nylas/commit/88c58734a1a1cab5fac6a9ec77c4fa5115547fad), [`648afa4`](https://github.com/nylas/nylas/commit/648afa453b639a4d9f27c9ce67f9b8f53f33bb27)]:
  - @nylas/web-elements@2.0.1

## 2.0.0

### Major Changes

- [#622](https://github.com/nylas/nylas/pull/622) [`5a8e6ba`](https://github.com/nylas/nylas/commit/5a8e6ba460ea30774b36bd37acdab30fd7d9b228) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Group Events Support Added to Scheduler Components.

  ## 🚨 BREAKING CHANGES 🚨

  ### Prop Changes/Additions

  - The `enableEventTypes` property controls which event types are enabled in the Scheduler editor.
  - Default value:

  ```
  <NylasSchedulerEditor
    enableEventTypes = {{
      one_on_one: true,
      collective: true,
      max_fairness: true,
      max_availability: true,
      group: true,
    }}
  />
  ```

  ### UI Changes

  - The scheduler editor body height has increased from 610px to 900px to accommodate the calendar view for Group Events
  - Clicking "Create new" now opens a type selection screen where users can choose the scheduling configuration they want to create

  ### Configuration and Set-up Changes

  - The previous approach of hardcoding a single scheduling method using the availability_method (e.g., 'max-availability', 'collective', 'max-fairness') is no longer supported.

  Before:

  ```
  <NylasSchedulerEditor
    defaultSchedulerConfigState = {
      selectedConfiguration: {
        requires_session_auth: false,
        availability: {
          availability_rules: {
            availability_method: 'max-availability'
          }
        }
      }
    }
  ```

  After:

  ```
  <NylasSchedulerEditor
    enableEventTypes = {
      {
        one_on_one: false,
        collective: false,
        max_fairness: false,
        max_availability: true,
        group: false,
      }
    }
  ```

  `enableEventTypes` controls which event types are enabled.

  - By default, all event types are enabled and users will see a selection screen when creating a new event.
  - You can disable specific event types by setting them to `false`.
  - At least one event type must remain enabled at all times.
  - If only one event type is enabled, the event type selection screen will be skipped.
  - To disable group events, set:

  ```
  <NylasSchedulerEditor
    enableEventTypes = {{
      one_on_one: true,
      collective: true,
      max_fairness: true,
      max_availability: true,
      group: false,
    }}
  />
  ```

  ### New Event Types

  The scheduler components now emit the following new events for group event operations:

  - `groupEventCreateTriggered`
  - `groupEventUpdateTriggered`
  - `groupEventDeleteTriggered`
  - `groupEventImportTriggered`
  - `saveGroupEventChangesError`

### Patch Changes

- Updated dependencies [[`5a8e6ba`](https://github.com/nylas/nylas/commit/5a8e6ba460ea30774b36bd37acdab30fd7d9b228)]:
  - @nylas/web-elements@2.0.0

## 1.4.5

### Patch Changes

- [#631](https://github.com/nylas/nylas/pull/631) [`ef637ec`](https://github.com/nylas/nylas/commit/ef637ecd3fee67ba96ff8a728f72e18ce68bdafe) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the translation for additional field type

- [#625](https://github.com/nylas/nylas/pull/625) [`d3b7cc1`](https://github.com/nylas/nylas/commit/d3b7cc1d98ab5ff12992339d59b898e6299d26c0) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added translation for Search placeholder

- [#607](https://github.com/nylas/nylas/pull/607) [`a06c459`](https://github.com/nylas/nylas/commit/a06c4595bdb4db676b213e35a483f4dec89797eb) Thanks [@pooja169usp](https://github.com/pooja169usp)! - When a recurring group event is created with an end date in the past, the booking page does not let you book creating a bad UX. Hence we are adding a validation to group event creation where we will not allow creating a recurring group event with an end date in the past.

- [#621](https://github.com/nylas/nylas/pull/621) [`2949791`](https://github.com/nylas/nylas/commit/2949791fe0de1ef7a6745ae655c6bbd685854006) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Add min booking notice component to group type config

- [#623](https://github.com/nylas/nylas/pull/623) [`fc06f75`](https://github.com/nylas/nylas/commit/fc06f7536713e114762c12d80043b90da663ea3a) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Add event_id, calendar_id and master_id if applicable to the reschedule request made by the UI. Without this, the group events cannot be rescheduled from the UI

- [#635](https://github.com/nylas/nylas/pull/635) [`77211b6`](https://github.com/nylas/nylas/commit/77211b65cd6e46938ad471a6a00c5931e4c0ccb6) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Update the translation for booking cancellation successful page

- [#627](https://github.com/nylas/nylas/pull/627) [`bf45abe`](https://github.com/nylas/nylas/commit/bf45abe4cdf05e1805f8f75497b6539c509109ee) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Disabled reccuring option for icloud provider with group events

- [#610](https://github.com/nylas/nylas/pull/610) [`8b53d51`](https://github.com/nylas/nylas/commit/8b53d515d02d59adb61d72121926266cd9ec3f63) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Select the primary calendar as the default calendar for booking calendar and connected calendar when adding a participant

- [#612](https://github.com/nylas/nylas/pull/612) [`ba4615d`](https://github.com/nylas/nylas/commit/ba4615d8100591668ede9bdc5c53104d915fbe13) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Add localization to group events in scheduler editor component

- Updated dependencies [[`ef637ec`](https://github.com/nylas/nylas/commit/ef637ecd3fee67ba96ff8a728f72e18ce68bdafe), [`d3b7cc1`](https://github.com/nylas/nylas/commit/d3b7cc1d98ab5ff12992339d59b898e6299d26c0), [`a06c459`](https://github.com/nylas/nylas/commit/a06c4595bdb4db676b213e35a483f4dec89797eb), [`2949791`](https://github.com/nylas/nylas/commit/2949791fe0de1ef7a6745ae655c6bbd685854006), [`fc06f75`](https://github.com/nylas/nylas/commit/fc06f7536713e114762c12d80043b90da663ea3a), [`77211b6`](https://github.com/nylas/nylas/commit/77211b65cd6e46938ad471a6a00c5931e4c0ccb6), [`bf45abe`](https://github.com/nylas/nylas/commit/bf45abe4cdf05e1805f8f75497b6539c509109ee), [`8b53d51`](https://github.com/nylas/nylas/commit/8b53d515d02d59adb61d72121926266cd9ec3f63), [`ba4615d`](https://github.com/nylas/nylas/commit/ba4615d8100591668ede9bdc5c53104d915fbe13)]:
  - @nylas/web-elements@1.4.5

## 1.4.4

### Patch Changes

- [#594](https://github.com/nylas/nylas/pull/594) [`3af3846`](https://github.com/nylas/nylas/commit/3af38467a73a7cdb0dfa07c4efa8f3dde36e988d) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated the logic to calculate disabled date to be more efficient, which was causing a delay in rendering

- [#597](https://github.com/nylas/nylas/pull/597) [`280dad9`](https://github.com/nylas/nylas/commit/280dad981a3c7cc9c7a30393ff900b6ca53a1fb4) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue where group event with the same start time selects both the timeslots on selection

- Updated dependencies [[`3af3846`](https://github.com/nylas/nylas/commit/3af38467a73a7cdb0dfa07c4efa8f3dde36e988d), [`280dad9`](https://github.com/nylas/nylas/commit/280dad981a3c7cc9c7a30393ff900b6ca53a1fb4)]:
  - @nylas/web-elements@1.4.3

## 1.4.2

### Patch Changes

- Updated the build files

- Updated dependencies []:
  - @nylas/web-elements@1.4.2

## 1.4.1

### Patch Changes

- [#573](https://github.com/nylas/nylas/pull/573) [`6e2994f`](https://github.com/nylas/nylas/commit/6e2994f7dac1f6e34d3fdc10ae2ab20805cf84c5) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fix the issue where adding a participant and updating the open hours directly without hitting save did not register the open hours selected

- [#579](https://github.com/nylas/nylas/pull/579) [`8c70696`](https://github.com/nylas/nylas/commit/8c70696c73e7d1c8c5cd0cd4910bd6647fdca7f2) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue where page name was required for non-group configs. Also fixes the issue where the page name field would be wiped out on saving the config changes without any change to the page name field

- [#575](https://github.com/nylas/nylas/pull/575) [`8967d38`](https://github.com/nylas/nylas/commit/8967d38e77366603cdc98a024fd0b8daf59d6980) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added changelog for the scheduler components to the scheduler component docs + include the changelog in the npm package that is deployed/released

- [#584](https://github.com/nylas/nylas/pull/584) [`7cc5718`](https://github.com/nylas/nylas/commit/7cc57188f7491a8913c0719fda13d09d7ea8d89c) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added missing components to enhance functionality. Added ability to disable email notifications. Fixed language dropdown selection issue in calendar view.

- [#587](https://github.com/nylas/nylas/pull/587) [`73c1130`](https://github.com/nylas/nylas/commit/73c1130683da2e6b818e90f69d64d18a31c875a2) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue where if system settings was set to a different language than en, the months header in the date picker did not translate correctly. Updated French translation to make more sense to a native speaker.

- [#581](https://github.com/nylas/nylas/pull/581) [`a51862d`](https://github.com/nylas/nylas/commit/a51862d4f37466b56679749b2f96a33df81630c9) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fix the issue where the label header does not show the updated label, instead showed a default label

- [#576](https://github.com/nylas/nylas/pull/576) [`6296b4f`](https://github.com/nylas/nylas/commit/6296b4fb3a76719aeffbb6bd52993745ea340d8f) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fix the typescript compatibility issues

- [#588](https://github.com/nylas/nylas/pull/588) [`47be193`](https://github.com/nylas/nylas/commit/47be193b38cf607904c1bbb27506abaf9500b98f) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added support for storing the organizer_locale from the scheduler editor component. This will allow us to send email communications to the organizer in the language selected by the organizer instead of defaulting to English

- [#585](https://github.com/nylas/nylas/pull/585) [`6c39ff4`](https://github.com/nylas/nylas/commit/6c39ff4e8066e29e4831986237570b837b5225eb) Thanks [@pooja169usp](https://github.com/pooja169usp)! - With group events, the organizer pre-selects the type of configuration that they want to create in the select event type page, so hide the scheduling method component in the express flow when creating config

- Updated dependencies [[`6e2994f`](https://github.com/nylas/nylas/commit/6e2994f7dac1f6e34d3fdc10ae2ab20805cf84c5), [`8c70696`](https://github.com/nylas/nylas/commit/8c70696c73e7d1c8c5cd0cd4910bd6647fdca7f2), [`8967d38`](https://github.com/nylas/nylas/commit/8967d38e77366603cdc98a024fd0b8daf59d6980), [`7cc5718`](https://github.com/nylas/nylas/commit/7cc57188f7491a8913c0719fda13d09d7ea8d89c), [`73c1130`](https://github.com/nylas/nylas/commit/73c1130683da2e6b818e90f69d64d18a31c875a2), [`a51862d`](https://github.com/nylas/nylas/commit/a51862d4f37466b56679749b2f96a33df81630c9), [`6296b4f`](https://github.com/nylas/nylas/commit/6296b4fb3a76719aeffbb6bd52993745ea340d8f), [`47be193`](https://github.com/nylas/nylas/commit/47be193b38cf607904c1bbb27506abaf9500b98f), [`6c39ff4`](https://github.com/nylas/nylas/commit/6c39ff4e8066e29e4831986237570b837b5225eb)]:
  - @nylas/web-elements@1.4.1
  - @nylas/core@1.1.7

## 1.4.0

### Minor Changes

- [#525](https://github.com/nylas/nylas/pull/525) [`7180ca7`](https://github.com/nylas/nylas/commit/7180ca7a841561932e02f52976d51e7aa064aaff) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Update nylas-react package to support Next.js app router compatibility by updating package configuration

### Patch Changes

- [#522](https://github.com/nylas/nylas/pull/522) [`df8e0b8`](https://github.com/nylas/nylas/commit/df8e0b8ec4384a61789a1a64754c812729dd4d62) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue where availability method passed in the dev settings was being overridden to collective in the UI

- [#529](https://github.com/nylas/nylas/pull/529) [`f71b973`](https://github.com/nylas/nylas/commit/f71b973e278444b3c055e368804af756abbcf61d) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated the scheduling component to support group event bookings

- [#519](https://github.com/nylas/nylas/pull/519) [`ad075ba`](https://github.com/nylas/nylas/commit/ad075bafa462bd0f5ce7de95d2c98a112d8a51fc) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated the logic for reminder minutes to resort to minutes where necessary

- [#495](https://github.com/nylas/nylas/pull/495) [`c9672e9`](https://github.com/nylas/nylas/commit/c9672e9b6ca2b0d159277ba4e59d3ac43d0b1360) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Introduced a new screen allowing users to select the desired configuration type for creation

- [#507](https://github.com/nylas/nylas/pull/507) [`9e4b5e7`](https://github.com/nylas/nylas/commit/9e4b5e7d2d076606ccf97ddf3732df05ed2d0858) Thanks [@pooja169usp](https://github.com/pooja169usp)! - • The toggle switch state for participant availability now correctly reflects the current state.
  • Open hours now have a default selection when enabling the toggle.

- [#535](https://github.com/nylas/nylas/pull/535) [`d89c58a`](https://github.com/nylas/nylas/commit/d89c58a6b31eae785c3c23eaad693a59da0a8e35) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed group booking error handling so that appropriate error is surfaced in the UI

- [#530](https://github.com/nylas/nylas/pull/530) [`fca52e5`](https://github.com/nylas/nylas/commit/fca52e5a28540e2f94cca8ad20f71729492cf09e) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated scheduler-editor auth to get grant using access token and use that as the email for logged in user. This resolves the UPN email mismatch issue with Microsoft accounts.

- [#527](https://github.com/nylas/nylas/pull/527) [`f7dd3cc`](https://github.com/nylas/nylas/commit/f7dd3cc4531c2f0067b9e864d4b8271ffc88ce38) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fix the date component to display the preselected date and month, if passed in defaultSchedulerState

- [#516](https://github.com/nylas/nylas/pull/516) [`5f83694`](https://github.com/nylas/nylas/commit/5f8369430c04717f10b3798929a36b7229591a11) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the translations for some fields including dropdown, date etc., in the scheduler editor and scheduling components

- [#506](https://github.com/nylas/nylas/pull/506) [`90d2ef3`](https://github.com/nylas/nylas/commit/90d2ef3c4774274c97e598f6544de7cff515f75b) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Expose shadow parts for action options from list configuration component that allows to hide / style

- [#505](https://github.com/nylas/nylas/pull/505) [`51b5d49`](https://github.com/nylas/nylas/commit/51b5d49b6f339c7d6bde8f8189ebe922baf4d7ef) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue where book now button did not fire in the rescheduling flow due to form fields not being set correctly

- [#504](https://github.com/nylas/nylas/pull/504) [`9ff9bd5`](https://github.com/nylas/nylas/commit/9ff9bd537bf30d61d22c9340079b393d6c129140) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue with event duration being reset to 30 minutes when modifying other fields in the editor

- [#501](https://github.com/nylas/nylas/pull/501) [`9344b0e`](https://github.com/nylas/nylas/commit/9344b0e138f8acf73f24942bd60f351e14453a5a) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added a create group config flow along with a group event with recurrence

- [#562](https://github.com/nylas/nylas/pull/562) [`8d3396e`](https://github.com/nylas/nylas/commit/8d3396e61fa8ae07f906d33521c8246018ad6c82) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added front validation for event duration to not be empty/negative and be a multiple of 5

- [#555](https://github.com/nylas/nylas/pull/555) [`d320173`](https://github.com/nylas/nylas/commit/d3201736073cb397d2a7307f702ae55af96d4f24) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue where the booking page showed different selectable dates and timeslots depending on the system settings. With this fix, when selected timezone is changed, the selectable dates are also updated to respect the timezone selected.

- [#446](https://github.com/nylas/nylas/pull/446) [`cb8e196`](https://github.com/nylas/nylas/commit/cb8e196ec80f0320a306bd4481dae584e7d8b480) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Added additional CSS parts to the nylas-scheduling component.

- [#551](https://github.com/nylas/nylas/pull/551) [`8d91968`](https://github.com/nylas/nylas/commit/8d91968683fa58c0b64daa395f2afd27c56ebf55) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the ordering and sorting for the booking form fields in the scheduler editor

- [#502](https://github.com/nylas/nylas/pull/502) [`fb80809`](https://github.com/nylas/nylas/commit/fb80809fa3c35e97a7ea7d7fd809b33fcaf5dcdc) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added retry logic to round robin when booking request fails due to timeslot not being avaialble

- [#528](https://github.com/nylas/nylas/pull/528) [`4d7958b`](https://github.com/nylas/nylas/commit/4d7958b472977b1a3e240b1aef431e0da6fad32d) Thanks [@pooja169usp](https://github.com/pooja169usp)! - The nylas-event-description text area component now fully supports carriage returns, enabling users to enter multi-line comments. Additionally, selecting the “Auto-Populate” feature multiple times no longer duplicates fields, ensuring smoother multi-line text entry and preventing unintended field replication. Please note that the delimiters for additional fields should not be modified, as we rely on them to correctly replace these fields in the description when “Auto-Populate” is clicked.

- [#524](https://github.com/nylas/nylas/pull/524) [`4303932`](https://github.com/nylas/nylas/commit/430393257581c8af1fcafa97a4fede2f982bd2c9) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Expose the calendar in the calendar view + filter 'all host and guests' options from reminders if group config. Updated the logic to add default capacity when creating a group config

- [#534](https://github.com/nylas/nylas/pull/534) [`617b079`](https://github.com/nylas/nylas/commit/617b07950b851286a781401493ee4a4ae4a5199e) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Improved component registration process to properly handle re-registration scenarios, ensuring components receive updated props and connections while preventing duplicate event listeners. This fixes the issue with components not loading the correct values when using custom auth method and composable mode.

- Updated dependencies [[`df8e0b8`](https://github.com/nylas/nylas/commit/df8e0b8ec4384a61789a1a64754c812729dd4d62), [`f71b973`](https://github.com/nylas/nylas/commit/f71b973e278444b3c055e368804af756abbcf61d), [`ad075ba`](https://github.com/nylas/nylas/commit/ad075bafa462bd0f5ce7de95d2c98a112d8a51fc), [`c9672e9`](https://github.com/nylas/nylas/commit/c9672e9b6ca2b0d159277ba4e59d3ac43d0b1360), [`9e4b5e7`](https://github.com/nylas/nylas/commit/9e4b5e7d2d076606ccf97ddf3732df05ed2d0858), [`d89c58a`](https://github.com/nylas/nylas/commit/d89c58a6b31eae785c3c23eaad693a59da0a8e35), [`fca52e5`](https://github.com/nylas/nylas/commit/fca52e5a28540e2f94cca8ad20f71729492cf09e), [`f7dd3cc`](https://github.com/nylas/nylas/commit/f7dd3cc4531c2f0067b9e864d4b8271ffc88ce38), [`5f83694`](https://github.com/nylas/nylas/commit/5f8369430c04717f10b3798929a36b7229591a11), [`90d2ef3`](https://github.com/nylas/nylas/commit/90d2ef3c4774274c97e598f6544de7cff515f75b), [`51b5d49`](https://github.com/nylas/nylas/commit/51b5d49b6f339c7d6bde8f8189ebe922baf4d7ef), [`9ff9bd5`](https://github.com/nylas/nylas/commit/9ff9bd537bf30d61d22c9340079b393d6c129140), [`9344b0e`](https://github.com/nylas/nylas/commit/9344b0e138f8acf73f24942bd60f351e14453a5a), [`8d3396e`](https://github.com/nylas/nylas/commit/8d3396e61fa8ae07f906d33521c8246018ad6c82), [`d320173`](https://github.com/nylas/nylas/commit/d3201736073cb397d2a7307f702ae55af96d4f24), [`cb8e196`](https://github.com/nylas/nylas/commit/cb8e196ec80f0320a306bd4481dae584e7d8b480), [`8d91968`](https://github.com/nylas/nylas/commit/8d91968683fa58c0b64daa395f2afd27c56ebf55), [`fb80809`](https://github.com/nylas/nylas/commit/fb80809fa3c35e97a7ea7d7fd809b33fcaf5dcdc), [`4d7958b`](https://github.com/nylas/nylas/commit/4d7958b472977b1a3e240b1aef431e0da6fad32d), [`4303932`](https://github.com/nylas/nylas/commit/430393257581c8af1fcafa97a4fede2f982bd2c9), [`617b079`](https://github.com/nylas/nylas/commit/617b07950b851286a781401493ee4a4ae4a5199e)]:
  - @nylas/web-elements@1.4.0
  - @nylas/core@1.1.6

## 1.3.6

### Patch Changes

- [#481](https://github.com/nylas/nylas/pull/481) [`3a47075`](https://github.com/nylas/nylas/commit/3a470759afd24946258862e6aba718536402b7ae) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added support to make booking form fields read only in the scheduling component

- [#484](https://github.com/nylas/nylas/pull/484) [`4020840`](https://github.com/nylas/nylas/commit/40208405e5b1899653d4247645f87279513ecab2) Thanks [@pooja169usp](https://github.com/pooja169usp)! - The timeslot picker has been updated to use the selected locale for time formatting, ensuring consistency with user preferences. Additionally, a new hour12 prop has been introduced, allowing explicit control over the hour format. This prop does not have a default value; by default, the timeslot picker will use the hour format determined by the selected locale. However, you can override this by passing hour12={true} to enforce a 12-hour clock or hour12={false} to enforce a 24-hour clock. This update provides greater flexibility while maintaining alignment with user expectations.

- [#493](https://github.com/nylas/nylas/pull/493) [`d724f86`](https://github.com/nylas/nylas/commit/d724f8670eb62442b7401035253e4ce24fde4b62) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Return localtion, booking_ref in the query param upon booking completion and redirect

- [#485](https://github.com/nylas/nylas/pull/485) [`e2cb495`](https://github.com/nylas/nylas/commit/e2cb4958a9e7a0e989dadb49d69f97d8935d57c0) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added validation to reminder minutes to be multiples of 5, because the reminder is sent out in every 5 minute intervals

- [#488](https://github.com/nylas/nylas/pull/488) [`9214810`](https://github.com/nylas/nylas/commit/921481051a3d8537334466bab14fd08958fb282b) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added an empty option in the dropdown for booking form, if no default option is set

- [#489](https://github.com/nylas/nylas/pull/489) [`901501a`](https://github.com/nylas/nylas/commit/901501ac723b831566db1d246115cd2765114cac) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Improved the responsiveness of the scheduling component in mobile and tablet views such that the dates and locale do not overflow

- [#487](https://github.com/nylas/nylas/pull/487) [`c7d27c4`](https://github.com/nylas/nylas/commit/c7d27c4dbe377b05be0572ede305f54032a55fb9) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Ensure that the input components use the color vars from themeConfig prop for background, dropdown content, text colors

- [#492](https://github.com/nylas/nylas/pull/492) [`2733d89`](https://github.com/nylas/nylas/commit/2733d89601a3da72c1d7038c557ce95c0d9d65c6) Thanks [@pooja169usp](https://github.com/pooja169usp)! - If timezone is set to an empty string in the config, default to the browser timezone in the editor UI. This allows the user to adjust the timezone as per their requirement

- [#483](https://github.com/nylas/nylas/pull/483) [`60043b4`](https://github.com/nylas/nylas/commit/60043b4409ff2bd7a42ba42bf80b2bd8decb64da) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added a button to event description component that on click auto-populates the additional fields to the description

- [#496](https://github.com/nylas/nylas/pull/496) [`70a0e33`](https://github.com/nylas/nylas/commit/70a0e33f72ecbf50e6627bf9ccde19454974927a) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added the ability disable/enable emails from the UI

- Updated dependencies [[`3a47075`](https://github.com/nylas/nylas/commit/3a470759afd24946258862e6aba718536402b7ae), [`4020840`](https://github.com/nylas/nylas/commit/40208405e5b1899653d4247645f87279513ecab2), [`d724f86`](https://github.com/nylas/nylas/commit/d724f8670eb62442b7401035253e4ce24fde4b62), [`e2cb495`](https://github.com/nylas/nylas/commit/e2cb4958a9e7a0e989dadb49d69f97d8935d57c0), [`9214810`](https://github.com/nylas/nylas/commit/921481051a3d8537334466bab14fd08958fb282b), [`901501a`](https://github.com/nylas/nylas/commit/901501ac723b831566db1d246115cd2765114cac), [`c7d27c4`](https://github.com/nylas/nylas/commit/c7d27c4dbe377b05be0572ede305f54032a55fb9), [`2733d89`](https://github.com/nylas/nylas/commit/2733d89601a3da72c1d7038c557ce95c0d9d65c6), [`60043b4`](https://github.com/nylas/nylas/commit/60043b4409ff2bd7a42ba42bf80b2bd8decb64da), [`70a0e33`](https://github.com/nylas/nylas/commit/70a0e33f72ecbf50e6627bf9ccde19454974927a)]:
  - @nylas/web-elements@1.3.6
  - @nylas/core@1.1.5

## 1.3.5

### Patch Changes

- [#480](https://github.com/nylas/nylas/pull/480) [`e3a0980`](https://github.com/nylas/nylas/commit/e3a09805268c68881b78fa4432782f2d6526eff9) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added prop nylasBranding to scheduler editor to show / hide the option to manage nylas branding in the email templates

- [#478](https://github.com/nylas/nylas/pull/478) [`85db9bb`](https://github.com/nylas/nylas/commit/85db9bbbdc36dfd83867c6005ec077311f3052c7) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added support for Korean language

- Updated dependencies [[`e3a0980`](https://github.com/nylas/nylas/commit/e3a09805268c68881b78fa4432782f2d6526eff9), [`85db9bb`](https://github.com/nylas/nylas/commit/85db9bbbdc36dfd83867c6005ec077311f3052c7)]:
  - @nylas/web-elements@1.3.5

## 1.3.4

### Patch Changes

- [#476](https://github.com/nylas/nylas/pull/476) [`ead6086`](https://github.com/nylas/nylas/commit/ead60866ffd09677de19ef9c5ec2916dfc4a5f6e) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added an event schedulerConfigCreated to be emitted after successful creation of config (this event includes the id field along with the other things)

- [#470](https://github.com/nylas/nylas/pull/470) [`59e1c51`](https://github.com/nylas/nylas/commit/59e1c510551c82cf9bc3dab47fdbe7fc6f76edfe) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added localization to scheduler editor

- [#473](https://github.com/nylas/nylas/pull/473) [`c9a3f84`](https://github.com/nylas/nylas/commit/c9a3f844aaabcfc1b9cbd3e28e96e2386b457760) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated the scheduling component to respect the timezone and language overrides passed via bookingInfo prop

- [#472](https://github.com/nylas/nylas/pull/472) [`97b4389`](https://github.com/nylas/nylas/commit/97b43899fb24df2d54ecd7cd966809343ebceac3) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Add the ability to enter additional fields from a dropdown for event title and event description components

- [#467](https://github.com/nylas/nylas/pull/467) [`fc0d1a1`](https://github.com/nylas/nylas/commit/fc0d1a1f42138dd48d2320a33b77188b6703b687) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added support for multi-select type additional field

- Updated dependencies [[`ead6086`](https://github.com/nylas/nylas/commit/ead60866ffd09677de19ef9c5ec2916dfc4a5f6e), [`59e1c51`](https://github.com/nylas/nylas/commit/59e1c510551c82cf9bc3dab47fdbe7fc6f76edfe), [`c9a3f84`](https://github.com/nylas/nylas/commit/c9a3f844aaabcfc1b9cbd3e28e96e2386b457760), [`97b4389`](https://github.com/nylas/nylas/commit/97b43899fb24df2d54ecd7cd966809343ebceac3), [`fc0d1a1`](https://github.com/nylas/nylas/commit/fc0d1a1f42138dd48d2320a33b77188b6703b687)]:
  - @nylas/web-elements@1.3.4
  - @nylas/core@1.1.4

## 1.3.3

### Patch Changes

- [#468](https://github.com/nylas/nylas/pull/468) [`5169491`](https://github.com/nylas/nylas/commit/5169491488be7510ee8104fe52b80ffe866c2cf8) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Improved the error handling on nylas-date-component to validate invalid dates

- [#464](https://github.com/nylas/nylas/pull/464) [`edf0860`](https://github.com/nylas/nylas/commit/edf0860c6252aae59667dbaaa0e819d19806035b) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue with booking calendars where the list did not show all the calendars in the html implementation

- [#465](https://github.com/nylas/nylas/pull/465) [`be04be8`](https://github.com/nylas/nylas/commit/be04be80077c22b7453698a00e15515c7b213182) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue where html (web elements) did not render the correct values on booking form, booking options, participant open hours and page styling

- Updated dependencies [[`5169491`](https://github.com/nylas/nylas/commit/5169491488be7510ee8104fe52b80ffe866c2cf8), [`edf0860`](https://github.com/nylas/nylas/commit/edf0860c6252aae59667dbaaa0e819d19806035b), [`be04be8`](https://github.com/nylas/nylas/commit/be04be80077c22b7453698a00e15515c7b213182)]:
  - @nylas/web-elements@1.3.3

## 1.3.2

### Patch Changes

- [#458](https://github.com/nylas/nylas/pull/458) [`b2a4168`](https://github.com/nylas/nylas/commit/b2a4168f65a8ff9d10aeefcfd678e2a8495666ee) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Fixed the participants checkbox being displayed if no availability method was configured (even if that defaulted to "collective").

- [#455](https://github.com/nylas/nylas/pull/455) [`76290fa`](https://github.com/nylas/nylas/commit/76290fafd70c4d4f940671b43b0c5e641afdaed4) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added an option to hide the nylas branding from the email template footer in the communications tab of nylas-scheduler-editor component

- [#459](https://github.com/nylas/nylas/pull/459) [`7896155`](https://github.com/nylas/nylas/commit/789615593971c9c45b0792dbd19260294b87f1f0) Thanks [@AaronDDM](https://github.com/AaronDDM)! - [nylas-participants-custom-availability] Fixed new participant open hours not automatically inherting the default open hours and timezone.

- [#461](https://github.com/nylas/nylas/pull/461) [`12e59df`](https://github.com/nylas/nylas/commit/12e59dfbd25ddc2db341c3bfa739e576e5539bd8) Thanks [@AaronDDM](https://github.com/AaronDDM)! - [nylas-editor-tabs] Fixed form submissions incorrectly priortizing default state values over form state values.

- [#460](https://github.com/nylas/nylas/pull/460) [`5cc9e97`](https://github.com/nylas/nylas/commit/5cc9e9731dd5dcec3fa498e1c5d25b0c9f499c02) Thanks [@AaronDDM](https://github.com/AaronDDM)! - [nylas-scheduler-editor] Fix: missing support for migrated "date" custom fields was causing custom fields to not be rendered.

- [#460](https://github.com/nylas/nylas/pull/460) [`5cc9e97`](https://github.com/nylas/nylas/commit/5cc9e9731dd5dcec3fa498e1c5d25b0c9f499c02) Thanks [@AaronDDM](https://github.com/AaronDDM)! - [nylas-booking-form-config] Fixed typo on the "additionalFields" prop.

- Updated dependencies [[`b2a4168`](https://github.com/nylas/nylas/commit/b2a4168f65a8ff9d10aeefcfd678e2a8495666ee), [`76290fa`](https://github.com/nylas/nylas/commit/76290fafd70c4d4f940671b43b0c5e641afdaed4), [`7896155`](https://github.com/nylas/nylas/commit/789615593971c9c45b0792dbd19260294b87f1f0), [`12e59df`](https://github.com/nylas/nylas/commit/12e59dfbd25ddc2db341c3bfa739e576e5539bd8), [`5cc9e97`](https://github.com/nylas/nylas/commit/5cc9e9731dd5dcec3fa498e1c5d25b0c9f499c02), [`5cc9e97`](https://github.com/nylas/nylas/commit/5cc9e9731dd5dcec3fa498e1c5d25b0c9f499c02)]:
  - @nylas/web-elements@1.3.2
  - @nylas/core@1.1.3

## 1.3.1

### Patch Changes

- [#452](https://github.com/nylas/nylas/pull/452) [`596000b`](https://github.com/nylas/nylas/commit/596000b25e51b55c55f42c793f76a10381defd12) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added support for metadata type additional field including support for optional default value for booking form fields

- [#450](https://github.com/nylas/nylas/pull/450) [`9ed4860`](https://github.com/nylas/nylas/commit/9ed486076a09ade550844c75e7ba6c3e038a31fa) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Set fallback language to English if the browser locale is to a language that we do not officially support

- [#453](https://github.com/nylas/nylas/pull/453) [`f9c9352`](https://github.com/nylas/nylas/commit/f9c935219e44bc40d9e89d9d208d391a021742c3) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated the nylas-booking-form component to prefill booking details in the rescheduling flow.

- Updated dependencies [[`596000b`](https://github.com/nylas/nylas/commit/596000b25e51b55c55f42c793f76a10381defd12), [`9ed4860`](https://github.com/nylas/nylas/commit/9ed486076a09ade550844c75e7ba6c3e038a31fa), [`f9c9352`](https://github.com/nylas/nylas/commit/f9c935219e44bc40d9e89d9d208d391a021742c3)]:
  - @nylas/web-elements@1.3.1
  - @nylas/core@1.1.2

## 1.3.0

### Patch Changes

- [#445](https://github.com/nylas/nylas/pull/445) [`4536cb2`](https://github.com/nylas/nylas/commit/4536cb2b94cdd67ecdd1f25c49ffdaa359a71d22) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue where conferencing in scheduler editor was not showing Google meet option on load when used with CDN web-elements and no auth method. Also, fixed the issue where once Google meets is selected, it cannot be undone

- [#443](https://github.com/nylas/nylas/pull/443) [`5ff9812`](https://github.com/nylas/nylas/commit/5ff981285e21af7ccf8dc7e6e066944d61104366) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added a confirmation modal to confirm delete config in the scheduler editor

- Updated dependencies [[`4536cb2`](https://github.com/nylas/nylas/commit/4536cb2b94cdd67ecdd1f25c49ffdaa359a71d22), [`5ff9812`](https://github.com/nylas/nylas/commit/5ff981285e21af7ccf8dc7e6e066944d61104366), [`d094e7d`](https://github.com/nylas/nylas/commit/d094e7dcdf6a0fe67567644f0410fdc054b6a301)]:
  - @nylas/web-elements@1.3.0

## 1.2.0

### Patch Changes

- [#433](https://github.com/nylas/nylas/pull/433) [`cb286bb`](https://github.com/nylas/nylas/commit/cb286bbc59a3e6f018ae62b636f6cb019d35371e) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added email subject to reminders in the UI

- [#436](https://github.com/nylas/nylas/pull/436) [`b870836`](https://github.com/nylas/nylas/commit/b870836ed932e138d896584c7cb8620e3c19afaa) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue with creating a config using icloud account

- [#432](https://github.com/nylas/nylas/pull/432) [`385bd5f`](https://github.com/nylas/nylas/commit/385bd5f04e21a4451f8df5c6922b4745cce58070) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue where adding multiple form fields of the same type would override/wipe out existing fields

- Updated dependencies [[`cb286bb`](https://github.com/nylas/nylas/commit/cb286bbc59a3e6f018ae62b636f6cb019d35371e), [`d094e7d`](https://github.com/nylas/nylas/commit/d094e7dcdf6a0fe67567644f0410fdc054b6a301), [`b870836`](https://github.com/nylas/nylas/commit/b870836ed932e138d896584c7cb8620e3c19afaa), [`d094e7d`](https://github.com/nylas/nylas/commit/d094e7dcdf6a0fe67567644f0410fdc054b6a301), [`385bd5f`](https://github.com/nylas/nylas/commit/385bd5f04e21a4451f8df5c6922b4745cce58070)]:
  - @nylas/web-elements@1.2.0

## 1.1.7

### Patch Changes

- [#430](https://github.com/nylas/nylas/pull/430) [`5aafd51`](https://github.com/nylas/nylas/commit/5aafd51a52e79f5f935433a9370077217c5d54aa) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Filter out webhook reminders from being surfaced in the UI

- Updated dependencies [[`5aafd51`](https://github.com/nylas/nylas/commit/5aafd51a52e79f5f935433a9370077217c5d54aa)]:
  - @nylas/web-elements@1.1.7

## 1.1.6

### Patch Changes

- [#424](https://github.com/nylas/nylas/pull/424) [`507ae69`](https://github.com/nylas/nylas/commit/507ae699528bc089f617db23d33141270c9a4056) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue where themeConfig prop set on the scheduling component did not update the styles on sub components

- Updated dependencies [[`507ae69`](https://github.com/nylas/nylas/commit/507ae699528bc089f617db23d33141270c9a4056)]:
  - @nylas/web-elements@1.1.6

## 1.1.5

### Patch Changes

- [#421](https://github.com/nylas/nylas/pull/421) [`4ba3bcb`](https://github.com/nylas/nylas/commit/4ba3bcb327e7060dae91c52e9367cfc4284665a2) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fix the email validation regex to allow custom email domains liek .entertainment (example)

- [#404](https://github.com/nylas/nylas/pull/404) [`250e17d`](https://github.com/nylas/nylas/commit/250e17d49bb8e24bb1cd0c635068a8b9c6427488) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the create scheduling config issue

- [#399](https://github.com/nylas/nylas/pull/399) [`eef68ad`](https://github.com/nylas/nylas/commit/eef68ad7043bc5bd025ef369ef367132bd2f8082) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Resolved the issue where the UI was displaying an error for the organizer confirmation URL, despite it being set in the configuration.

- [#420](https://github.com/nylas/nylas/pull/420) [`67abe45`](https://github.com/nylas/nylas/commit/67abe45adc9af25e9425fcc8eedb055632841c0f) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue with confirmation email image url not blocking form submission on invalid url

- [#413](https://github.com/nylas/nylas/pull/413) [`8e0cd98`](https://github.com/nylas/nylas/commit/8e0cd98253809b7699f104cde8fd93bf2afa5b46) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Add all additional fields from bookingInfo prop to redirect url, including the ones not used in the booking form

- [#116](https://github.com/nylas/nylas/pull/116) [`4842469`](https://github.com/nylas/nylas/commit/4842469ed6e335f532840dabaa67c90e9d2c8659) Thanks [@b3ndoi](https://github.com/b3ndoi)! - Added an option to set reminders through the scheduler editor

- [#417](https://github.com/nylas/nylas/pull/417) [`b1477d2`](https://github.com/nylas/nylas/commit/b1477d20d54d59452b99fb9c1a7484bdb9c22aa6) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added an option to set reminders through the scheduler editor

- [#405](https://github.com/nylas/nylas/pull/405) [`d4c812a`](https://github.com/nylas/nylas/commit/d4c812aa9779d74fd3cfe76ff972e9252f201661) Thanks [@pooja169usp](https://github.com/pooja169usp)! - bug-fix: Fixed the time on booked event card

- [#412](https://github.com/nylas/nylas/pull/412) [`0758aa1`](https://github.com/nylas/nylas/commit/0758aa1acc5812eb6d8df4d766200580f2baaa4d) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the issue with the editor event title not updating correctly when selecting all and deleting the title

- Updated dependencies [[`4ba3bcb`](https://github.com/nylas/nylas/commit/4ba3bcb327e7060dae91c52e9367cfc4284665a2), [`250e17d`](https://github.com/nylas/nylas/commit/250e17d49bb8e24bb1cd0c635068a8b9c6427488), [`eef68ad`](https://github.com/nylas/nylas/commit/eef68ad7043bc5bd025ef369ef367132bd2f8082), [`67abe45`](https://github.com/nylas/nylas/commit/67abe45adc9af25e9425fcc8eedb055632841c0f), [`8e0cd98`](https://github.com/nylas/nylas/commit/8e0cd98253809b7699f104cde8fd93bf2afa5b46), [`4842469`](https://github.com/nylas/nylas/commit/4842469ed6e335f532840dabaa67c90e9d2c8659), [`b1477d2`](https://github.com/nylas/nylas/commit/b1477d20d54d59452b99fb9c1a7484bdb9c22aa6), [`d4c812a`](https://github.com/nylas/nylas/commit/d4c812aa9779d74fd3cfe76ff972e9252f201661), [`0758aa1`](https://github.com/nylas/nylas/commit/0758aa1acc5812eb6d8df4d766200580f2baaa4d)]:
  - @nylas/web-elements@1.1.5
  - @nylas/core@1.1.1

## 1.1.4

### Patch Changes

- [#396](https://github.com/nylas/nylas/pull/396) [`4c447fd`](https://github.com/nylas/nylas/commit/4c447fdf3d3b5f1d49ad20eb96a0b030fa80a60b) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Reduced the package size for the CDN build, resolving the issue where jsDelivr returned a “package size exceeded” error when using the CDN.

- [#397](https://github.com/nylas/nylas/pull/397) [`ffa08a2`](https://github.com/nylas/nylas/commit/ffa08a2214474360a0d1247742a6c949723b5df3) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Resolved an issue where custom fields in the query parameters caused a booking error. Now, fields that do not match the additional_fields specified in the configuration are ignored.

- Updated dependencies [[`4c447fd`](https://github.com/nylas/nylas/commit/4c447fdf3d3b5f1d49ad20eb96a0b030fa80a60b), [`ffa08a2`](https://github.com/nylas/nylas/commit/ffa08a2214474360a0d1247742a6c949723b5df3)]:
  - @nylas/web-elements@1.1.4

## 1.1.3

### Patch Changes

- [#381](https://github.com/nylas/nylas/pull/381) [`3154ef4`](https://github.com/nylas/nylas/commit/3154ef4884dfbab68e9c8c48a9a12336595ac837) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the query params populating the booking form in scheduling component returning error on booking

- [#381](https://github.com/nylas/nylas/pull/381) [`3154ef4`](https://github.com/nylas/nylas/commit/3154ef4884dfbab68e9c8c48a9a12336595ac837) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated the scheduling component to include the booking details in the redirect url

- [#382](https://github.com/nylas/nylas/pull/382) [`47b96d4`](https://github.com/nylas/nylas/commit/47b96d455758932df6c41208b414726bd6537926) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added a prop enableUserFeedback that allows to capture user's feedback and issues if any

- Updated dependencies [[`3154ef4`](https://github.com/nylas/nylas/commit/3154ef4884dfbab68e9c8c48a9a12336595ac837), [`3154ef4`](https://github.com/nylas/nylas/commit/3154ef4884dfbab68e9c8c48a9a12336595ac837), [`47b96d4`](https://github.com/nylas/nylas/commit/47b96d455758932df6c41208b414726bd6537926)]:
  - @nylas/web-elements@1.1.3

## 1.1.2

### Patch Changes

- [#367](https://github.com/nylas/nylas/pull/367) [`eed1e4c`](https://github.com/nylas/nylas/commit/eed1e4cc01c5d12b5c88e94d69d306d5119346f5) Thanks [@pooja169usp](https://github.com/pooja169usp)!

  - Fixed default selected calendar not selected when creating a config using MS account.
  - Fixed the issue with booking an event where the default selected value in the dropdown was not sent until changed.

- [#368](https://github.com/nylas/nylas/pull/368) [`eed1e4c`](https://github.com/nylas/nylas/commit/eed1e4cc01c5d12b5c88e94d69d306d5119346f5) Thanks [@pooja169usp](https://github.com/pooja169usp)!

  - Updated the Scheduling component to fetch availability only if the ui settings request passes. This prevents the additional API request if the config is invalid.
  - Appended the guest info, additional fields and timeslot to the bokedEventInfo event

- [#369](https://github.com/nylas/nylas/pull/369) [`eed1e4c`](https://github.com/nylas/nylas/commit/eed1e4cc01c5d12b5c88e94d69d306d5119346f5) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Improved the custom event slug component by adding a hard-coded slash (/) as a prefix. Additionally, introduced a placeholder to enhance user clarity and provide guidance during input.

- Updated dependencies [[`eed1e4c`](https://github.com/nylas/nylas/commit/eed1e4cc01c5d12b5c88e94d69d306d5119346f5), [`eed1e4c`](https://github.com/nylas/nylas/commit/eed1e4cc01c5d12b5c88e94d69d306d5119346f5), [`eed1e4c`](https://github.com/nylas/nylas/commit/eed1e4cc01c5d12b5c88e94d69d306d5119346f5)]:
  - @nylas/web-elements@1.1.2

## 1.1.1

### Patch Changes

- [#357](https://github.com/nylas/nylas/pull/357) [`ef9faff`](https://github.com/nylas/nylas/commit/ef9faffb27c33830ce4e59b7bbd324e73b913fef) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Bundle a separate folder dist/cdn for CDN usage. This improves the loading time by including all the necessary dependencies required for a component to load (Each component is imported individually).

- [#364](https://github.com/nylas/nylas/pull/364) [`8f84ba8`](https://github.com/nylas/nylas/commit/8f84ba8d34513d4ccd0a9725913cbc356a765a02) Thanks [@pooja169usp](https://github.com/pooja169usp)!

  - Modified how the Editor manages manual confirmations:
  - If `organizer_confirmation_url` is not set by developers, the `<nylas-booking-confirmation-type>` component will no longer appear in the editor
  - Added validation for configuration creation to ensure that if developers override `booking_type` to "organizer-confirmation", they must also set `organizer_confirmation_url`, otherwise a validation error will be triggered.
  - Deprecated the `prop`, as it is now derived from `selectedConfiguration` and no longer needs to be manually set. This prop will be removed in an upcoming release.

- [#354](https://github.com/nylas/nylas/pull/354) [`af743f8`](https://github.com/nylas/nylas/commit/af743f824b44149d600cdcfba28824b130d7e9d1) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the calculation of start_time for fetching availability when min_booking_notice is set

- [#360](https://github.com/nylas/nylas/pull/360) [`15ea5fc`](https://github.com/nylas/nylas/commit/15ea5fcd34bc8e3565c08c4b6b67503f4441c1f3) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated the page styles component so that it renders only when a slot is passed. The developer has to explicitly pass the slot to the nylas-scheduler-editor component and listen to configSettingLoaded event on the nylas-scheduling component to grab the page styles and apply as needed.

- [#355](https://github.com/nylas/nylas/pull/355) [`43cb274`](https://github.com/nylas/nylas/commit/43cb27454373aab342bae98246379e27cb59b4da) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated the default validation for phone and email input components to be more flexible

- [#350](https://github.com/nylas/nylas/pull/350) [`e684157`](https://github.com/nylas/nylas/commit/e684157e482fb464a524d01c40cca88ed97b02f0) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed hideEditorTabs prop not working for page styles and communications tabs

- [#351](https://github.com/nylas/nylas/pull/351) [`f7e8eb0`](https://github.com/nylas/nylas/commit/f7e8eb033d2154ff87fb52f7f5ae01f5837a5c0b) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated the nylas/identity package bundle to fix CDN issue not including the dependencies

- [#351](https://github.com/nylas/nylas/pull/351) [`f7e8eb0`](https://github.com/nylas/nylas/commit/f7e8eb033d2154ff87fb52f7f5ae01f5837a5c0b) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed mobile styles for the scheduler editor component

- Updated dependencies [[`ef9faff`](https://github.com/nylas/nylas/commit/ef9faffb27c33830ce4e59b7bbd324e73b913fef), [`8f84ba8`](https://github.com/nylas/nylas/commit/8f84ba8d34513d4ccd0a9725913cbc356a765a02), [`af743f8`](https://github.com/nylas/nylas/commit/af743f824b44149d600cdcfba28824b130d7e9d1), [`15ea5fc`](https://github.com/nylas/nylas/commit/15ea5fcd34bc8e3565c08c4b6b67503f4441c1f3), [`43cb274`](https://github.com/nylas/nylas/commit/43cb27454373aab342bae98246379e27cb59b4da), [`e684157`](https://github.com/nylas/nylas/commit/e684157e482fb464a524d01c40cca88ed97b02f0), [`f7e8eb0`](https://github.com/nylas/nylas/commit/f7e8eb033d2154ff87fb52f7f5ae01f5837a5c0b), [`f7e8eb0`](https://github.com/nylas/nylas/commit/f7e8eb033d2154ff87fb52f7f5ae01f5837a5c0b)]:
  - @nylas/web-elements@1.1.1

## 1.1.0

### Minor Changes

- [#145](https://github.com/nylas/nylas/pull/145) [`f2d3f88`](https://github.com/nylas/nylas/commit/f2d3f885db77fe93d11a26375c8070d4f212309c) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Added the ability to login with the scheduler editor component

- [#149](https://github.com/nylas/nylas/pull/149) [`cec6c13`](https://github.com/nylas/nylas/commit/cec6c13be67be8d04013175a5df899a66a178d5a) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Added a new [nylas-list-configurations] component that shows a list of configurations that can be edited or deleted.

- [#139](https://github.com/nylas/nylas/pull/139) [`b467dae`](https://github.com/nylas/nylas/commit/b467dae30f4bcb4431d91a1b307d6ca542fe543f) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Added nylas/identity support for the nylas-scheduler-editor component

### Patch Changes

- [#299](https://github.com/nylas/nylas/pull/299) [`21e6790`](https://github.com/nylas/nylas/commit/21e6790d8650a0921f6992b067cc692a8c62e2e1) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added communications tab to set up automatic communications for your events

- [#285](https://github.com/nylas/nylas/pull/285) [`cbb7b58`](https://github.com/nylas/nylas/commit/cbb7b58cf117b7d170a32b02428084f7a7f64b38) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Deprecated the slot custom-booking-form in nylas-booking-form component in favor of using the additional fields set via the editor config

- [#307](https://github.com/nylas/nylas/pull/307) [`d907fb6`](https://github.com/nylas/nylas/commit/d907fb6fa5a4c635aa451ba8db65e888c5a81346) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Renamed nylas-booking-type component to nylas-scheduling-method for better clarity based on it's function

- [#266](https://github.com/nylas/nylas/pull/266) [`da23410`](https://github.com/nylas/nylas/commit/da234103763b4842479c9240c97a07d5bca22fca) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed participant availability not updating the list on add/remove participants reactively

- [#292](https://github.com/nylas/nylas/pull/292) [`edefe90`](https://github.com/nylas/nylas/commit/edefe908ec147c4190ee609dbe4e2972c613fb70) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed same provider conferencing option not showing up in create config flow

- [#124](https://github.com/nylas/nylas/pull/124) [`5ccd04d`](https://github.com/nylas/nylas/commit/5ccd04dcf91f3a53df3118ffd933604a0fa7eb9e) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [nylas-scheduling] props renamed/deprecated

      - Remove `showThankYouPage` in favor of using `eventInfo`
      - Remove `bookingFlow` in favor of using `rescheduleBookingId`
      - Rename `cancelledEvent` to `cancelledEventInfo` for consistency
      - Rename `defaultSchedulerStoreState` to `defaultSchedulerState` for better clarity

- [#197](https://github.com/nylas/nylas/pull/197) [`55705bc`](https://github.com/nylas/nylas/commit/55705bcba2220905c2d8b42eba4243f6fa34126d) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [nylas-event-duration] Update input to dropdown for quick selection with an input to select custom duration

- [#269](https://github.com/nylas/nylas/pull/269) [`2a62c27`](https://github.com/nylas/nylas/commit/2a62c275684877c71d24642c60b68caaa3c56213) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the package install issue with workspace

- [#238](https://github.com/nylas/nylas/pull/238) [`84d2b21`](https://github.com/nylas/nylas/commit/84d2b21a70d728d7431bc33ab7289885f540c000) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [bug-fix] Fixed editor not able to save due to participants tab

- [#308](https://github.com/nylas/nylas/pull/308) [`fa6d747`](https://github.com/nylas/nylas/commit/fa6d747881da38c7a34f72a0822e3d065d11a524) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added a read only state sheduling method component to booking options in the editor to identify the scheduling method for the selected config

- [#173](https://github.com/nylas/nylas/pull/173) [`62afae4`](https://github.com/nylas/nylas/commit/62afae4574d0a35431841d57e008a2a3dbdb8d7b) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Added stack trace output to the debug utility

- [#127](https://github.com/nylas/nylas/pull/127) [`929044c`](https://github.com/nylas/nylas/commit/929044c985ae6b4a6b940137a7ae038ef8801f3c) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [nylas-scheduling] Added nylasBranding prop to hide nylas branding

- [#177](https://github.com/nylas/nylas/pull/177) [`4a720b9`](https://github.com/nylas/nylas/commit/4a720b91fe0fbe1453e550d61924e2c94ce37121) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Revert enableImportInjection change

- [#261](https://github.com/nylas/nylas/pull/261) [`0a57b53`](https://github.com/nylas/nylas/commit/0a57b532ecaffbc9e2598e44f4b856cb6027b7a0) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added a booking form tab to set additional fields in the config. These additional fields will be displayed in the scheduling page booking form to the end user booking an event.

- [#220](https://github.com/nylas/nylas/pull/220) [`c82ac58`](https://github.com/nylas/nylas/commit/c82ac581830982c95be13a1b8ce713aec03c180a) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated dropdown component to be usable in the booking form for scheduling component

- [#209](https://github.com/nylas/nylas/pull/209) [`ea838bc`](https://github.com/nylas/nylas/commit/ea838bcefe4478608d61e069b171fb854a3518ba) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added nylas-cancellation-policy component

- [#243](https://github.com/nylas/nylas/pull/243) [`816226d`](https://github.com/nylas/nylas/commit/816226d0a834d4e9a97988df4b9beb8c977c3f96) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Only show scheduling page title if organizer name is set

- [#229](https://github.com/nylas/nylas/pull/229) [`7090e66`](https://github.com/nylas/nylas/commit/7090e66b02024457dc2fa709665634f2fc995e48) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed passing configurationId as prop not taking to edit page issue

- [#223](https://github.com/nylas/nylas/pull/223) [`3051ca1`](https://github.com/nylas/nylas/commit/3051ca1a1529910bc8bd0a0655df386dbe900368) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added toggle switch component to the design system

- [#305](https://github.com/nylas/nylas/pull/305) [`56fb61a`](https://github.com/nylas/nylas/commit/56fb61a82e8253d0e66db2856ea40495d5b925c6) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the dropdown for add participants to filter the values based on the typed input value

- [#205](https://github.com/nylas/nylas/pull/205) [`d0fc3f5`](https://github.com/nylas/nylas/commit/d0fc3f5f9ffa85527a30cb4590efb55f6e342770) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Pass the cancel reason to cancelBooking endpoint

- [#173](https://github.com/nylas/nylas/pull/173) [`62afae4`](https://github.com/nylas/nylas/commit/62afae4574d0a35431841d57e008a2a3dbdb8d7b) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Fix: components built using enableimportinjection was causing our build files to explode, resulting in slower load times for our web-components using unpkg.

- [#203](https://github.com/nylas/nylas/pull/203) [`a898ee3`](https://github.com/nylas/nylas/commit/a898ee3f5807f99dfb44c35bd8d51ddca9d551d8) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Renamed nylas-location-component to nylas-event-location for consistency across event info components

- [#346](https://github.com/nylas/nylas/pull/346) [`aa8aaa0`](https://github.com/nylas/nylas/commit/aa8aaa041a33317a1edfa98ed9d8a14b36cad265) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added support to adjust the height of the scheduler editor via shadow parts

- [#303](https://github.com/nylas/nylas/pull/303) [`d22b170`](https://github.com/nylas/nylas/commit/d22b1703a35503d3d9571a2ff74ad5d04f775eb8) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Expose missing shadow parts for scheduling components

- [#295](https://github.com/nylas/nylas/pull/295) [`35767de`](https://github.com/nylas/nylas/commit/35767de956374d135b42ed21035b25c4a98cebca) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed smashing Book now button and cancel button submitting multiple requests

- [#242](https://github.com/nylas/nylas/pull/242) [`2cc7b34`](https://github.com/nylas/nylas/commit/2cc7b34712bdce1b4495b0725c61cbda2de77879) Thanks [@b3ndoi](https://github.com/b3ndoi)! - Added same provider and cross provider conferencing

- [#327](https://github.com/nylas/nylas/pull/327) [`75d87ed`](https://github.com/nylas/nylas/commit/75d87ed64dc1c87edf7e97cdf2e20521730c93fb) Thanks [@gudsson](https://github.com/gudsson)! - [Scheduling] add watcher for themeConfig that applies theme changes

- [#325](https://github.com/nylas/nylas/pull/325) [`2b556e7`](https://github.com/nylas/nylas/commit/2b556e7e58713186f2e1677d2694c1d05bb7c998) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Send selected language to the API on booking and rescheduling endpoints

- [#222](https://github.com/nylas/nylas/pull/222) [`8fc44de`](https://github.com/nylas/nylas/commit/8fc44de8182528e2cf98d43d4fc611383d226332) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Scheduling component updated to conditionally render guests, rescheduling and cancellation options

- [#197](https://github.com/nylas/nylas/pull/197) [`55705bc`](https://github.com/nylas/nylas/commit/55705bcba2220905c2d8b42eba4243f6fa34126d) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added a default action to the 'X' button in the scheduler editor that logs out the user

- [#195](https://github.com/nylas/nylas/pull/195) [`416c649`](https://github.com/nylas/nylas/commit/416c6491d77d4605e939a1ee0295294c5aab505c) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [nylas-date-picker] Add event title and duration to the scheduling page

- [#319](https://github.com/nylas/nylas/pull/319) [`9c4cff9`](https://github.com/nylas/nylas/commit/9c4cff991dc86c3185da5a00c47cbb7649a26268) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the buffer time issue where 0 option was not selectable

- [#245](https://github.com/nylas/nylas/pull/245) [`b6420aa`](https://github.com/nylas/nylas/commit/b6420aa7bc440e01ddf5088e8ce8807532ff95f0) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [scheduler-editor] Added a participants tab to add and manage open hours for additional participants in a configuration. Updated availability tab to set the default open hours of the configurations and manage availability calendars for additional participants.

- [#108](https://github.com/nylas/nylas/pull/108) [`04ed6c4`](https://github.com/nylas/nylas/commit/04ed6c421185c2b89271de9eeb21c75a29bc0f03) Thanks [@AaronDDM](https://github.com/AaronDDM)! - [nylas-scheduling] Renamed the nylas-scheduler component to nylas-scheduling.

- [#284](https://github.com/nylas/nylas/pull/284) [`9229aae`](https://github.com/nylas/nylas/commit/9229aae4ecfad011aed77906fcc1c1eb3ef9d7b5) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added a way to choose the type of booking config being created in the express(create) flow via scheduler editor

- [#293](https://github.com/nylas/nylas/pull/293) [`c7afb40`](https://github.com/nylas/nylas/commit/c7afb40c20e5a6bd777cbe63f55a4653e591aaf0) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Manual confirmation flow for confirming and rejecting the booking by the organizer

- [#306](https://github.com/nylas/nylas/pull/306) [`d7c456b`](https://github.com/nylas/nylas/commit/d7c456b6e322c1c17f4f4918a695016fc949ce8a) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Inherit the css variables from the parent component (nylas-scheduling). This fixes the issue with themeConfig prop not being applied to the child components in the scheduling page.

- [#202](https://github.com/nylas/nylas/pull/202) [`acb24a6`](https://github.com/nylas/nylas/commit/acb24a6fe15201fd558138ad009664bf8f0d450e) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added debug logs and warnings if required props and/or slots are missing

- [#301](https://github.com/nylas/nylas/pull/301) [`7b4c89c`](https://github.com/nylas/nylas/commit/7b4c89ce9fd2f1aac82648b10f3f9500d3bd43fd) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Hide 'Go back' button if eventInfo is not available + fix some eventOverrides not being triggered for scheduling page

- [#230](https://github.com/nylas/nylas/pull/230) [`1b80fa6`](https://github.com/nylas/nylas/commit/1b80fa692a0e1bb31278968cd8e816dbf8fbfafc) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [editor] Renamed `additional_guests_hidden` field to `hide_additional_guests` for consistency in naming

- [#336](https://github.com/nylas/nylas/pull/336) [`8376d63`](https://github.com/nylas/nylas/commit/8376d63661ef53ca90f5246cfb6995e4e569b85b) Thanks [@gudsson](https://github.com/gudsson)! - Updated the readmes

- [#211](https://github.com/nylas/nylas/pull/211) [`ec92421`](https://github.com/nylas/nylas/commit/ec92421938df2862864619f466a13f7fdf11e6a0) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Time slot interval preference component added to the scheduler editor

- [#281](https://github.com/nylas/nylas/pull/281) [`d8b5d18`](https://github.com/nylas/nylas/commit/d8b5d1836547324f4031e1d8acdb1ad23e34325b) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added support for round robin scheduling

- [#321](https://github.com/nylas/nylas/pull/321) [`a61660c`](https://github.com/nylas/nylas/commit/a61660c4480b1b7c803df78c45abde03e96a38d9) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Exposed a prop localization for overriding default localization and/or customizing labels

- [#291](https://github.com/nylas/nylas/pull/291) [`1902f25`](https://github.com/nylas/nylas/commit/1902f25df5e54c3f4f29e0e8705584772f1643a1) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed adding participants by typing in returning an error and added user-friendly error message if using round robin config and typing in additional participant

- [#83](https://github.com/nylas/nylas/pull/83) [`ad7de37`](https://github.com/nylas/nylas/commit/ad7de37f496cad2f808b9467e08de36be9f63e7c) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Auto scroll to the input value on focus if the dropdown is open

- [#282](https://github.com/nylas/nylas/pull/282) [`2edc349`](https://github.com/nylas/nylas/commit/2edc34914f15f3a60a87789b500d9de76b4dd372) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed additional fields on update and save returning error while booking an event

- [#226](https://github.com/nylas/nylas/pull/226) [`b1c96fd`](https://github.com/nylas/nylas/commit/b1c96fd9fe008f95f06e53bc9d84036bd1ffb742) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Pass additional fields from the custom booking form to the booking endpoint in the scheduling component

- [#216](https://github.com/nylas/nylas/pull/216) [`d36bf9a`](https://github.com/nylas/nylas/commit/d36bf9a4aeff6a341650ddaa97097831e43c84a5) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [bug-fix] fixed booking ref not working with require session auth set to true

- [#316](https://github.com/nylas/nylas/pull/316) [`e2b3b1f`](https://github.com/nylas/nylas/commit/e2b3b1f0dfa66eebd7871fd2952ee9ceb17f6491) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added support for slug and clientId combo to the scheduling component

- [#208](https://github.com/nylas/nylas/pull/208) [`b499224`](https://github.com/nylas/nylas/commit/b49922410bded720f3fc61a19b315fd1bfe98d55) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added nylas-min-booking-notice component

- [#221](https://github.com/nylas/nylas/pull/221) [`e338309`](https://github.com/nylas/nylas/commit/e3383095ad79912115487c711a5b310f3441df6b) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [bug-fix] Fixed wrong date shown in the timeslot picker

- [#205](https://github.com/nylas/nylas/pull/205) [`d0fc3f5`](https://github.com/nylas/nylas/commit/d0fc3f5f9ffa85527a30cb4590efb55f6e342770) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [ui] Scheduling page mobile style tweaks

- [#123](https://github.com/nylas/nylas/pull/123) [`42673bd`](https://github.com/nylas/nylas/commit/42673bd1a6bc9b7266468f5dcb5b2ea65880aaa6) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [nylas-scheduling] Support scheduling for public configs through scheduling component

- [#213](https://github.com/nylas/nylas/pull/213) [`8679650`](https://github.com/nylas/nylas/commit/86796500b03d672f027b4179fd27393d806437c1) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Editor: Added customize booking setting to set hide_additional_guests, hide_cancellation_options and hide_rescheduling_options

- [#240](https://github.com/nylas/nylas/pull/240) [`4a7d72d`](https://github.com/nylas/nylas/commit/4a7d72d9be97d305056f779e804f1eced61fc037) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [bug-fix] Fixed creation on config through Scheduler editor not working

- [#203](https://github.com/nylas/nylas/pull/203) [`a898ee3`](https://github.com/nylas/nylas/commit/a898ee3f5807f99dfb44c35bd8d51ddca9d551d8) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [nylas-scheduling] Support bookingRef for scheduling component

- Updated dependencies [[`21e6790`](https://github.com/nylas/nylas/commit/21e6790d8650a0921f6992b067cc692a8c62e2e1), [`8ada81c`](https://github.com/nylas/nylas/commit/8ada81c95529ce4c78b8ac2a72e46b0ddafacf1d), [`4acfc28`](https://github.com/nylas/nylas/commit/4acfc28de2c24f657736e3141b8ecb8edaee6dab), [`1072a2f`](https://github.com/nylas/nylas/commit/1072a2fe0eb26851f8eab8046d9ef27a842096ce), [`f2d3f88`](https://github.com/nylas/nylas/commit/f2d3f885db77fe93d11a26375c8070d4f212309c), [`5542ab3`](https://github.com/nylas/nylas/commit/5542ab3ebf2b4acbaac9103b36267219d6960c9a), [`f079874`](https://github.com/nylas/nylas/commit/f079874250d6b726327651018b1add86f44aa7f7), [`cbb7b58`](https://github.com/nylas/nylas/commit/cbb7b58cf117b7d170a32b02428084f7a7f64b38), [`d907fb6`](https://github.com/nylas/nylas/commit/d907fb6fa5a4c635aa451ba8db65e888c5a81346), [`da23410`](https://github.com/nylas/nylas/commit/da234103763b4842479c9240c97a07d5bca22fca), [`47fb683`](https://github.com/nylas/nylas/commit/47fb683fd1452eebdf3f89f0dfa93634be3db618), [`edefe90`](https://github.com/nylas/nylas/commit/edefe908ec147c4190ee609dbe4e2972c613fb70), [`5ccd04d`](https://github.com/nylas/nylas/commit/5ccd04dcf91f3a53df3118ffd933604a0fa7eb9e), [`55705bc`](https://github.com/nylas/nylas/commit/55705bcba2220905c2d8b42eba4243f6fa34126d), [`8a2e964`](https://github.com/nylas/nylas/commit/8a2e964962ae05c199616dd62d378060e8de7a97), [`a82b7be`](https://github.com/nylas/nylas/commit/a82b7bee136c39cd180f31b1942b49f6b3ac4a7f), [`8a2e964`](https://github.com/nylas/nylas/commit/8a2e964962ae05c199616dd62d378060e8de7a97), [`2a62c27`](https://github.com/nylas/nylas/commit/2a62c275684877c71d24642c60b68caaa3c56213), [`84d2b21`](https://github.com/nylas/nylas/commit/84d2b21a70d728d7431bc33ab7289885f540c000), [`fa6d747`](https://github.com/nylas/nylas/commit/fa6d747881da38c7a34f72a0822e3d065d11a524), [`7ae32d3`](https://github.com/nylas/nylas/commit/7ae32d333106a1d8f7b826480a9665cc3a282828), [`62afae4`](https://github.com/nylas/nylas/commit/62afae4574d0a35431841d57e008a2a3dbdb8d7b), [`929044c`](https://github.com/nylas/nylas/commit/929044c985ae6b4a6b940137a7ae038ef8801f3c), [`4a720b9`](https://github.com/nylas/nylas/commit/4a720b91fe0fbe1453e550d61924e2c94ce37121), [`0628791`](https://github.com/nylas/nylas/commit/0628791825454967a2fcbb1ac2dd4525a1a56002), [`0a57b53`](https://github.com/nylas/nylas/commit/0a57b532ecaffbc9e2598e44f4b856cb6027b7a0), [`4607e3e`](https://github.com/nylas/nylas/commit/4607e3e999eed77e04c55a6c832a84607ea4f45b), [`c82ac58`](https://github.com/nylas/nylas/commit/c82ac581830982c95be13a1b8ce713aec03c180a), [`ea838bc`](https://github.com/nylas/nylas/commit/ea838bcefe4478608d61e069b171fb854a3518ba), [`cec6c13`](https://github.com/nylas/nylas/commit/cec6c13be67be8d04013175a5df899a66a178d5a), [`816226d`](https://github.com/nylas/nylas/commit/816226d0a834d4e9a97988df4b9beb8c977c3f96), [`7090e66`](https://github.com/nylas/nylas/commit/7090e66b02024457dc2fa709665634f2fc995e48), [`3051ca1`](https://github.com/nylas/nylas/commit/3051ca1a1529910bc8bd0a0655df386dbe900368), [`8ef8bed`](https://github.com/nylas/nylas/commit/8ef8bed63b0b387c4cfe9508d32b5533dcf19e95), [`56fb61a`](https://github.com/nylas/nylas/commit/56fb61a82e8253d0e66db2856ea40495d5b925c6), [`d0fc3f5`](https://github.com/nylas/nylas/commit/d0fc3f5f9ffa85527a30cb4590efb55f6e342770), [`8c3aada`](https://github.com/nylas/nylas/commit/8c3aadae0792893adc06f0fa74b72534853b077b), [`97778be`](https://github.com/nylas/nylas/commit/97778bedb03c6135af4ac649687e7ccbee111e63), [`a898ee3`](https://github.com/nylas/nylas/commit/a898ee3f5807f99dfb44c35bd8d51ddca9d551d8), [`acb24a6`](https://github.com/nylas/nylas/commit/acb24a6fe15201fd558138ad009664bf8f0d450e), [`aa8aaa0`](https://github.com/nylas/nylas/commit/aa8aaa041a33317a1edfa98ed9d8a14b36cad265), [`62afae4`](https://github.com/nylas/nylas/commit/62afae4574d0a35431841d57e008a2a3dbdb8d7b), [`d22b170`](https://github.com/nylas/nylas/commit/d22b1703a35503d3d9571a2ff74ad5d04f775eb8), [`35767de`](https://github.com/nylas/nylas/commit/35767de956374d135b42ed21035b25c4a98cebca), [`2cc7b34`](https://github.com/nylas/nylas/commit/2cc7b34712bdce1b4495b0725c61cbda2de77879), [`ede0b2c`](https://github.com/nylas/nylas/commit/ede0b2c54968796d15fb43ea116706a0a3a6e7fc), [`75d87ed`](https://github.com/nylas/nylas/commit/75d87ed64dc1c87edf7e97cdf2e20521730c93fb), [`bebb0d6`](https://github.com/nylas/nylas/commit/bebb0d65b9750fa9ff73ed45267f45e1c9d683b3), [`436c634`](https://github.com/nylas/nylas/commit/436c63449488024649e41a9fbdc58736db089ce2), [`c4441b5`](https://github.com/nylas/nylas/commit/c4441b599331ac768a5ab3387336ff68e20f8007), [`f079874`](https://github.com/nylas/nylas/commit/f079874250d6b726327651018b1add86f44aa7f7), [`cd5670d`](https://github.com/nylas/nylas/commit/cd5670de495fcb8491d2208a579081f5de2ee512), [`2b556e7`](https://github.com/nylas/nylas/commit/2b556e7e58713186f2e1677d2694c1d05bb7c998), [`8fc44de`](https://github.com/nylas/nylas/commit/8fc44de8182528e2cf98d43d4fc611383d226332), [`13a295f`](https://github.com/nylas/nylas/commit/13a295fd7b8ca3759a5db903788a5347315b39b1), [`55705bc`](https://github.com/nylas/nylas/commit/55705bcba2220905c2d8b42eba4243f6fa34126d), [`62afae4`](https://github.com/nylas/nylas/commit/62afae4574d0a35431841d57e008a2a3dbdb8d7b), [`3cc5fba`](https://github.com/nylas/nylas/commit/3cc5fba4de3d3372a6fd9632d5a83837930778d2), [`416c649`](https://github.com/nylas/nylas/commit/416c6491d77d4605e939a1ee0295294c5aab505c), [`b467dae`](https://github.com/nylas/nylas/commit/b467dae30f4bcb4431d91a1b307d6ca542fe543f), [`e483f58`](https://github.com/nylas/nylas/commit/e483f58ee5c5c5b698501de12b4185726cf4d091), [`9c4cff9`](https://github.com/nylas/nylas/commit/9c4cff991dc86c3185da5a00c47cbb7649a26268), [`74e2330`](https://github.com/nylas/nylas/commit/74e233033bc7a522d1db75b4136cc77fbc566031), [`b6420aa`](https://github.com/nylas/nylas/commit/b6420aa7bc440e01ddf5088e8ce8807532ff95f0), [`04ed6c4`](https://github.com/nylas/nylas/commit/04ed6c421185c2b89271de9eeb21c75a29bc0f03), [`9229aae`](https://github.com/nylas/nylas/commit/9229aae4ecfad011aed77906fcc1c1eb3ef9d7b5), [`c7afb40`](https://github.com/nylas/nylas/commit/c7afb40c20e5a6bd777cbe63f55a4653e591aaf0), [`62afae4`](https://github.com/nylas/nylas/commit/62afae4574d0a35431841d57e008a2a3dbdb8d7b), [`e1c674a`](https://github.com/nylas/nylas/commit/e1c674aeed69205f7a209cd390d09284caada581), [`d7c456b`](https://github.com/nylas/nylas/commit/d7c456b6e322c1c17f4f4918a695016fc949ce8a), [`f079874`](https://github.com/nylas/nylas/commit/f079874250d6b726327651018b1add86f44aa7f7), [`f079874`](https://github.com/nylas/nylas/commit/f079874250d6b726327651018b1add86f44aa7f7), [`6619567`](https://github.com/nylas/nylas/commit/6619567f51be058cc033ca7a0d272d8a69a24fae), [`7b4c89c`](https://github.com/nylas/nylas/commit/7b4c89ce9fd2f1aac82648b10f3f9500d3bd43fd), [`1b80fa6`](https://github.com/nylas/nylas/commit/1b80fa692a0e1bb31278968cd8e816dbf8fbfafc), [`8376d63`](https://github.com/nylas/nylas/commit/8376d63661ef53ca90f5246cfb6995e4e569b85b), [`7104a8b`](https://github.com/nylas/nylas/commit/7104a8bfccc8431688b1a0abb8e0345f81ef25e5), [`ec92421`](https://github.com/nylas/nylas/commit/ec92421938df2862864619f466a13f7fdf11e6a0), [`d8b5d18`](https://github.com/nylas/nylas/commit/d8b5d1836547324f4031e1d8acdb1ad23e34325b), [`6aaf284`](https://github.com/nylas/nylas/commit/6aaf284b61ef5107cbe1288042ba49583d70d7bf), [`a61660c`](https://github.com/nylas/nylas/commit/a61660c4480b1b7c803df78c45abde03e96a38d9), [`8a2e964`](https://github.com/nylas/nylas/commit/8a2e964962ae05c199616dd62d378060e8de7a97), [`1902f25`](https://github.com/nylas/nylas/commit/1902f25df5e54c3f4f29e0e8705584772f1643a1), [`2edc349`](https://github.com/nylas/nylas/commit/2edc34914f15f3a60a87789b500d9de76b4dd372), [`b1c96fd`](https://github.com/nylas/nylas/commit/b1c96fd9fe008f95f06e53bc9d84036bd1ffb742), [`d36bf9a`](https://github.com/nylas/nylas/commit/d36bf9a4aeff6a341650ddaa97097831e43c84a5), [`e2b3b1f`](https://github.com/nylas/nylas/commit/e2b3b1f0dfa66eebd7871fd2952ee9ceb17f6491), [`b499224`](https://github.com/nylas/nylas/commit/b49922410bded720f3fc61a19b315fd1bfe98d55), [`3b7a6bc`](https://github.com/nylas/nylas/commit/3b7a6bcd7efcfc658dd56caa4b096e793f02d11f), [`7ae32d3`](https://github.com/nylas/nylas/commit/7ae32d333106a1d8f7b826480a9665cc3a282828), [`3b7e28d`](https://github.com/nylas/nylas/commit/3b7e28d6f1c08d770e43ad60113b205e8617ef80), [`97778be`](https://github.com/nylas/nylas/commit/97778bedb03c6135af4ac649687e7ccbee111e63), [`7808063`](https://github.com/nylas/nylas/commit/7808063be08b0382b59d820ac617ee7ad3c4753f), [`e338309`](https://github.com/nylas/nylas/commit/e3383095ad79912115487c711a5b310f3441df6b), [`d0fc3f5`](https://github.com/nylas/nylas/commit/d0fc3f5f9ffa85527a30cb4590efb55f6e342770), [`42673bd`](https://github.com/nylas/nylas/commit/42673bd1a6bc9b7266468f5dcb5b2ea65880aaa6), [`2b57ad1`](https://github.com/nylas/nylas/commit/2b57ad1b4cdc6d6068482a0b60335ecb94e0002c), [`9081878`](https://github.com/nylas/nylas/commit/90818781f530c239164716c4e1f0035353c8dce1), [`8679650`](https://github.com/nylas/nylas/commit/86796500b03d672f027b4179fd27393d806437c1), [`4a7d72d`](https://github.com/nylas/nylas/commit/4a7d72d9be97d305056f779e804f1eced61fc037), [`87c5ed3`](https://github.com/nylas/nylas/commit/87c5ed3e8d51688e7793004e91760e1188306bc3), [`a898ee3`](https://github.com/nylas/nylas/commit/a898ee3f5807f99dfb44c35bd8d51ddca9d551d8)]:
  - @nylas/web-elements@1.1.0
  - @nylas/core@1.1.0

## 1.1.0-canary.25

### Patch Changes

- [#346](https://github.com/nylas/nylas/pull/346) [`aa8aaa0`](https://github.com/nylas/nylas/commit/aa8aaa041a33317a1edfa98ed9d8a14b36cad265) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added support to adjust the height of the scheduler editor via shadow parts

- [#336](https://github.com/nylas/nylas/pull/336) [`8376d63`](https://github.com/nylas/nylas/commit/8376d63661ef53ca90f5246cfb6995e4e569b85b) Thanks [@gudsson](https://github.com/gudsson)! - Updated the readmes

- Updated dependencies [[`aa8aaa0`](https://github.com/nylas/nylas/commit/aa8aaa041a33317a1edfa98ed9d8a14b36cad265), [`8376d63`](https://github.com/nylas/nylas/commit/8376d63661ef53ca90f5246cfb6995e4e569b85b)]:
  - @nylas/web-elements@1.1.0-canary.25

## 1.1.0-canary.24

### Patch Changes

- [#307](https://github.com/nylas/nylas/pull/307) [`d907fb6`](https://github.com/nylas/nylas/commit/d907fb6fa5a4c635aa451ba8db65e888c5a81346) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Renamed nylas-booking-type component to nylas-scheduling-method for better clarity based on it's function

- [#308](https://github.com/nylas/nylas/pull/308) [`fa6d747`](https://github.com/nylas/nylas/commit/fa6d747881da38c7a34f72a0822e3d065d11a524) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added a read only state sheduling method component to booking options in the editor to identify the scheduling method for the selected config

- [#305](https://github.com/nylas/nylas/pull/305) [`56fb61a`](https://github.com/nylas/nylas/commit/56fb61a82e8253d0e66db2856ea40495d5b925c6) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the dropdown for add participants to filter the values based on the typed input value

- [#303](https://github.com/nylas/nylas/pull/303) [`d22b170`](https://github.com/nylas/nylas/commit/d22b1703a35503d3d9571a2ff74ad5d04f775eb8) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Expose missing shadow parts for scheduling components

- [#327](https://github.com/nylas/nylas/pull/327) [`75d87ed`](https://github.com/nylas/nylas/commit/75d87ed64dc1c87edf7e97cdf2e20521730c93fb) Thanks [@gudsson](https://github.com/gudsson)! - [Scheduling] add watcher for themeConfig that applies theme changes

- [#325](https://github.com/nylas/nylas/pull/325) [`2b556e7`](https://github.com/nylas/nylas/commit/2b556e7e58713186f2e1677d2694c1d05bb7c998) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Send selected language to the API on booking and rescheduling endpoints

- [#319](https://github.com/nylas/nylas/pull/319) [`9c4cff9`](https://github.com/nylas/nylas/commit/9c4cff991dc86c3185da5a00c47cbb7649a26268) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the buffer time issue where 0 option was not selectable

- [#293](https://github.com/nylas/nylas/pull/293) [`c7afb40`](https://github.com/nylas/nylas/commit/c7afb40c20e5a6bd777cbe63f55a4653e591aaf0) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Manual confirmation flow for confirming and rejecting the booking by the organizer

- [#306](https://github.com/nylas/nylas/pull/306) [`d7c456b`](https://github.com/nylas/nylas/commit/d7c456b6e322c1c17f4f4918a695016fc949ce8a) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Inherit the css variables from the parent component (nylas-scheduling). This fixes the issue with themeConfig prop not being applied to the child components in the scheduling page.

- [#301](https://github.com/nylas/nylas/pull/301) [`7b4c89c`](https://github.com/nylas/nylas/commit/7b4c89ce9fd2f1aac82648b10f3f9500d3bd43fd) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Hide 'Go back' button if eventInfo is not available + fix some eventOverrides not being triggered for scheduling page

- [#321](https://github.com/nylas/nylas/pull/321) [`a61660c`](https://github.com/nylas/nylas/commit/a61660c4480b1b7c803df78c45abde03e96a38d9) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Exposed a prop localization for overriding default localization and/or customizing labels

- [#316](https://github.com/nylas/nylas/pull/316) [`e2b3b1f`](https://github.com/nylas/nylas/commit/e2b3b1f0dfa66eebd7871fd2952ee9ceb17f6491) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added support for slug and clientId combo to the scheduling component

- Updated dependencies [[`d907fb6`](https://github.com/nylas/nylas/commit/d907fb6fa5a4c635aa451ba8db65e888c5a81346), [`fa6d747`](https://github.com/nylas/nylas/commit/fa6d747881da38c7a34f72a0822e3d065d11a524), [`56fb61a`](https://github.com/nylas/nylas/commit/56fb61a82e8253d0e66db2856ea40495d5b925c6), [`d22b170`](https://github.com/nylas/nylas/commit/d22b1703a35503d3d9571a2ff74ad5d04f775eb8), [`75d87ed`](https://github.com/nylas/nylas/commit/75d87ed64dc1c87edf7e97cdf2e20521730c93fb), [`2b556e7`](https://github.com/nylas/nylas/commit/2b556e7e58713186f2e1677d2694c1d05bb7c998), [`9c4cff9`](https://github.com/nylas/nylas/commit/9c4cff991dc86c3185da5a00c47cbb7649a26268), [`c7afb40`](https://github.com/nylas/nylas/commit/c7afb40c20e5a6bd777cbe63f55a4653e591aaf0), [`d7c456b`](https://github.com/nylas/nylas/commit/d7c456b6e322c1c17f4f4918a695016fc949ce8a), [`7b4c89c`](https://github.com/nylas/nylas/commit/7b4c89ce9fd2f1aac82648b10f3f9500d3bd43fd), [`a61660c`](https://github.com/nylas/nylas/commit/a61660c4480b1b7c803df78c45abde03e96a38d9), [`e2b3b1f`](https://github.com/nylas/nylas/commit/e2b3b1f0dfa66eebd7871fd2952ee9ceb17f6491)]:
  - @nylas/web-elements@1.1.0-canary.24
  - @nylas/core@1.1.0-canary.10

## 1.1.0-canary.23

### Patch Changes

- [#299](https://github.com/nylas/nylas/pull/299) [`21e6790`](https://github.com/nylas/nylas/commit/21e6790d8650a0921f6992b067cc692a8c62e2e1) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added communications tab to set up automatic communications for your events

- [#292](https://github.com/nylas/nylas/pull/292) [`edefe90`](https://github.com/nylas/nylas/commit/edefe908ec147c4190ee609dbe4e2972c613fb70) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed same provider conferencing option not showing up in create config flow

- [#295](https://github.com/nylas/nylas/pull/295) [`35767de`](https://github.com/nylas/nylas/commit/35767de956374d135b42ed21035b25c4a98cebca) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed smashing Book now button and cancel button submitting multiple requests

- [#284](https://github.com/nylas/nylas/pull/284) [`9229aae`](https://github.com/nylas/nylas/commit/9229aae4ecfad011aed77906fcc1c1eb3ef9d7b5) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added a way to choose the type of booking config being created in the express(create) flow via scheduler editor

- [#291](https://github.com/nylas/nylas/pull/291) [`1902f25`](https://github.com/nylas/nylas/commit/1902f25df5e54c3f4f29e0e8705584772f1643a1) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed adding participants by typing in returning an error and added user-friendly error message if using round robin config and typing in additional participant

- Updated dependencies [[`21e6790`](https://github.com/nylas/nylas/commit/21e6790d8650a0921f6992b067cc692a8c62e2e1), [`edefe90`](https://github.com/nylas/nylas/commit/edefe908ec147c4190ee609dbe4e2972c613fb70), [`35767de`](https://github.com/nylas/nylas/commit/35767de956374d135b42ed21035b25c4a98cebca), [`9229aae`](https://github.com/nylas/nylas/commit/9229aae4ecfad011aed77906fcc1c1eb3ef9d7b5), [`1902f25`](https://github.com/nylas/nylas/commit/1902f25df5e54c3f4f29e0e8705584772f1643a1)]:
  - @nylas/web-elements@1.1.0-canary.23
  - @nylas/core@1.1.0-canary.9

## 1.1.0-canary.22

### Patch Changes

- [#285](https://github.com/nylas/nylas/pull/285) [`cbb7b58`](https://github.com/nylas/nylas/commit/cbb7b58cf117b7d170a32b02428084f7a7f64b38) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Deprecated the slot custom-booking-form in nylas-booking-form component in favor of using the additional fields set via the editor config

- [#282](https://github.com/nylas/nylas/pull/282) [`2edc349`](https://github.com/nylas/nylas/commit/2edc34914f15f3a60a87789b500d9de76b4dd372) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed additional fields on update and save returning error while booking an event

- Updated dependencies [[`cbb7b58`](https://github.com/nylas/nylas/commit/cbb7b58cf117b7d170a32b02428084f7a7f64b38), [`2edc349`](https://github.com/nylas/nylas/commit/2edc34914f15f3a60a87789b500d9de76b4dd372)]:
  - @nylas/web-elements@1.1.0-canary.22

## 1.1.0-canary.21

### Patch Changes

- [#281](https://github.com/nylas/nylas/pull/281) [`d8b5d18`](https://github.com/nylas/nylas/commit/d8b5d1836547324f4031e1d8acdb1ad23e34325b) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added support for round robin scheduling

- Updated dependencies [[`d8b5d18`](https://github.com/nylas/nylas/commit/d8b5d1836547324f4031e1d8acdb1ad23e34325b)]:
  - @nylas/web-elements@1.1.0-canary.21
  - @nylas/core@1.1.0-canary.8

## 1.1.0-canary.20

### Patch Changes

- [#266](https://github.com/nylas/nylas/pull/266) [`da23410`](https://github.com/nylas/nylas/commit/da234103763b4842479c9240c97a07d5bca22fca) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed participant availability not updating the list on add/remove participants reactively

- [#269](https://github.com/nylas/nylas/pull/269) [`2a62c27`](https://github.com/nylas/nylas/commit/2a62c275684877c71d24642c60b68caaa3c56213) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed the package install issue with workspace

- Updated dependencies [[`da23410`](https://github.com/nylas/nylas/commit/da234103763b4842479c9240c97a07d5bca22fca), [`2a62c27`](https://github.com/nylas/nylas/commit/2a62c275684877c71d24642c60b68caaa3c56213)]:
  - @nylas/web-elements@1.1.0-canary.20
  - @nylas/core@1.1.0-canary.7

## 1.1.0-canary.19

### Patch Changes

- [#261](https://github.com/nylas/nylas/pull/261) [`0a57b53`](https://github.com/nylas/nylas/commit/0a57b532ecaffbc9e2598e44f4b856cb6027b7a0) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added a booking form tab to set additional fields in the config. These additional fields will be displayed in the scheduling page booking form to the end user booking an event.

- [#242](https://github.com/nylas/nylas/pull/242) [`2cc7b34`](https://github.com/nylas/nylas/commit/2cc7b34712bdce1b4495b0725c61cbda2de77879) Thanks [@b3ndoi](https://github.com/b3ndoi)! - Added same provider and cross provider conferencing

- [#245](https://github.com/nylas/nylas/pull/245) [`b6420aa`](https://github.com/nylas/nylas/commit/b6420aa7bc440e01ddf5088e8ce8807532ff95f0) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [scheduler-editor] Added a participants tab to add and manage open hours for additional participants in a configuration. Updated availability tab to set the default open hours of the configurations and manage availability calendars for additional participants.

- Updated dependencies [[`0a57b53`](https://github.com/nylas/nylas/commit/0a57b532ecaffbc9e2598e44f4b856cb6027b7a0), [`2cc7b34`](https://github.com/nylas/nylas/commit/2cc7b34712bdce1b4495b0725c61cbda2de77879), [`b6420aa`](https://github.com/nylas/nylas/commit/b6420aa7bc440e01ddf5088e8ce8807532ff95f0)]:
  - @nylas/web-elements@1.1.0-canary.19
  - @nylas/core@1.1.0-canary.6

## 1.1.0-canary.18

### Patch Changes

- [#243](https://github.com/nylas/nylas/pull/243) [`816226d`](https://github.com/nylas/nylas/commit/816226d0a834d4e9a97988df4b9beb8c977c3f96) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Only show scheduling page title if organizer name is set

- [#240](https://github.com/nylas/nylas/pull/240) [`4a7d72d`](https://github.com/nylas/nylas/commit/4a7d72d9be97d305056f779e804f1eced61fc037) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [bug-fix] Fixed creation on config through Scheduler editor not working

- Updated dependencies [[`816226d`](https://github.com/nylas/nylas/commit/816226d0a834d4e9a97988df4b9beb8c977c3f96), [`4a7d72d`](https://github.com/nylas/nylas/commit/4a7d72d9be97d305056f779e804f1eced61fc037)]:
  - @nylas/web-elements@1.1.0-canary.18

## 1.1.0-canary.17

### Patch Changes

- [#238](https://github.com/nylas/nylas/pull/238) [`84d2b21`](https://github.com/nylas/nylas/commit/84d2b21a70d728d7431bc33ab7289885f540c000) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [bug-fix] Fixed editor not able to save due to participants tab

- Updated dependencies [[`84d2b21`](https://github.com/nylas/nylas/commit/84d2b21a70d728d7431bc33ab7289885f540c000)]:
  - @nylas/web-elements@1.1.0-canary.17

## 1.1.0-canary.16

### Patch Changes

- [#230](https://github.com/nylas/nylas/pull/230) [`1b80fa6`](https://github.com/nylas/nylas/commit/1b80fa692a0e1bb31278968cd8e816dbf8fbfafc) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [editor] Renamed `additional_guests_hidden` field to `hide_additional_guests` for consistency in naming

- Updated dependencies [[`1b80fa6`](https://github.com/nylas/nylas/commit/1b80fa692a0e1bb31278968cd8e816dbf8fbfafc)]:
  - @nylas/web-elements@1.1.0-canary.16
  - @nylas/core@1.1.0-canary.5

## 1.1.0-canary.15

### Patch Changes

- [#220](https://github.com/nylas/nylas/pull/220) [`c82ac58`](https://github.com/nylas/nylas/commit/c82ac581830982c95be13a1b8ce713aec03c180a) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Updated dropdown component to be usable in the booking form for scheduling component

- [#209](https://github.com/nylas/nylas/pull/209) [`ea838bc`](https://github.com/nylas/nylas/commit/ea838bcefe4478608d61e069b171fb854a3518ba) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added nylas-cancellation-policy component

- [#229](https://github.com/nylas/nylas/pull/229) [`7090e66`](https://github.com/nylas/nylas/commit/7090e66b02024457dc2fa709665634f2fc995e48) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Fixed passing configurationId as prop not taking to edit page issue

- [#223](https://github.com/nylas/nylas/pull/223) [`3051ca1`](https://github.com/nylas/nylas/commit/3051ca1a1529910bc8bd0a0655df386dbe900368) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added toggle switch component to the design system

- [#222](https://github.com/nylas/nylas/pull/222) [`8fc44de`](https://github.com/nylas/nylas/commit/8fc44de8182528e2cf98d43d4fc611383d226332) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Scheduling component updated to conditionally render guests, rescheduling and cancellation options

- [#211](https://github.com/nylas/nylas/pull/211) [`ec92421`](https://github.com/nylas/nylas/commit/ec92421938df2862864619f466a13f7fdf11e6a0) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Time slot interval preference component added to the scheduler editor

- [#226](https://github.com/nylas/nylas/pull/226) [`b1c96fd`](https://github.com/nylas/nylas/commit/b1c96fd9fe008f95f06e53bc9d84036bd1ffb742) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Pass additional fields from the custom booking form to the booking endpoint in the scheduling component

- [#216](https://github.com/nylas/nylas/pull/216) [`d36bf9a`](https://github.com/nylas/nylas/commit/d36bf9a4aeff6a341650ddaa97097831e43c84a5) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [bug-fix] fixed booking ref not working with require session auth set to true

- [#208](https://github.com/nylas/nylas/pull/208) [`b499224`](https://github.com/nylas/nylas/commit/b49922410bded720f3fc61a19b315fd1bfe98d55) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added nylas-min-booking-notice component

- [#221](https://github.com/nylas/nylas/pull/221) [`e338309`](https://github.com/nylas/nylas/commit/e3383095ad79912115487c711a5b310f3441df6b) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [bug-fix] Fixed wrong date shown in the timeslot picker

- [#213](https://github.com/nylas/nylas/pull/213) [`8679650`](https://github.com/nylas/nylas/commit/86796500b03d672f027b4179fd27393d806437c1) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Editor: Added customize booking setting to set additional_guests_hidden, hide_cancellation_options and hide_rescheduling_options

- Updated dependencies [[`c82ac58`](https://github.com/nylas/nylas/commit/c82ac581830982c95be13a1b8ce713aec03c180a), [`ea838bc`](https://github.com/nylas/nylas/commit/ea838bcefe4478608d61e069b171fb854a3518ba), [`7090e66`](https://github.com/nylas/nylas/commit/7090e66b02024457dc2fa709665634f2fc995e48), [`3051ca1`](https://github.com/nylas/nylas/commit/3051ca1a1529910bc8bd0a0655df386dbe900368), [`8fc44de`](https://github.com/nylas/nylas/commit/8fc44de8182528e2cf98d43d4fc611383d226332), [`ec92421`](https://github.com/nylas/nylas/commit/ec92421938df2862864619f466a13f7fdf11e6a0), [`b1c96fd`](https://github.com/nylas/nylas/commit/b1c96fd9fe008f95f06e53bc9d84036bd1ffb742), [`d36bf9a`](https://github.com/nylas/nylas/commit/d36bf9a4aeff6a341650ddaa97097831e43c84a5), [`b499224`](https://github.com/nylas/nylas/commit/b49922410bded720f3fc61a19b315fd1bfe98d55), [`e338309`](https://github.com/nylas/nylas/commit/e3383095ad79912115487c711a5b310f3441df6b), [`8679650`](https://github.com/nylas/nylas/commit/86796500b03d672f027b4179fd27393d806437c1)]:
  - @nylas/web-elements@1.1.0-canary.15
  - @nylas/core@1.1.0-canary.4

## 1.1.0-canary.14

### Patch Changes

- [#205](https://github.com/nylas/nylas/pull/205) [`d0fc3f5`](https://github.com/nylas/nylas/commit/d0fc3f5f9ffa85527a30cb4590efb55f6e342770) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Pass the cancel reason to cancelBooking endpoint

- [#205](https://github.com/nylas/nylas/pull/205) [`d0fc3f5`](https://github.com/nylas/nylas/commit/d0fc3f5f9ffa85527a30cb4590efb55f6e342770) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [ui] Scheduling page mobile style tweaks

- Updated dependencies [[`d0fc3f5`](https://github.com/nylas/nylas/commit/d0fc3f5f9ffa85527a30cb4590efb55f6e342770), [`d0fc3f5`](https://github.com/nylas/nylas/commit/d0fc3f5f9ffa85527a30cb4590efb55f6e342770)]:
  - @nylas/web-elements@1.1.0-canary.14

## 1.1.0-canary.13

### Patch Changes

- [#197](https://github.com/nylas/nylas/pull/197) [`55705bc`](https://github.com/nylas/nylas/commit/55705bcba2220905c2d8b42eba4243f6fa34126d) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [nylas-event-duration] Update input to dropdown for quick selection with an input to select custom duration

- [#203](https://github.com/nylas/nylas/pull/203) [`a898ee3`](https://github.com/nylas/nylas/commit/a898ee3f5807f99dfb44c35bd8d51ddca9d551d8) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Renamed nylas-location-component to nylas-event-location for consistency across event info components

- [#197](https://github.com/nylas/nylas/pull/197) [`55705bc`](https://github.com/nylas/nylas/commit/55705bcba2220905c2d8b42eba4243f6fa34126d) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added a default action to the 'X' button in the scheduler editor that logs out the user

- [#195](https://github.com/nylas/nylas/pull/195) [`416c649`](https://github.com/nylas/nylas/commit/416c6491d77d4605e939a1ee0295294c5aab505c) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [nylas-date-picker] Add event title and duration to the scheduling page

- [#202](https://github.com/nylas/nylas/pull/202) [`acb24a6`](https://github.com/nylas/nylas/commit/acb24a6fe15201fd558138ad009664bf8f0d450e) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Added debug logs and warnings if required props and/or slots are missing

- [#203](https://github.com/nylas/nylas/pull/203) [`a898ee3`](https://github.com/nylas/nylas/commit/a898ee3f5807f99dfb44c35bd8d51ddca9d551d8) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [nylas-scheduling] Support bookingRef for scheduling component

- Updated dependencies [[`4acfc28`](https://github.com/nylas/nylas/commit/4acfc28de2c24f657736e3141b8ecb8edaee6dab), [`47fb683`](https://github.com/nylas/nylas/commit/47fb683fd1452eebdf3f89f0dfa93634be3db618), [`55705bc`](https://github.com/nylas/nylas/commit/55705bcba2220905c2d8b42eba4243f6fa34126d), [`a898ee3`](https://github.com/nylas/nylas/commit/a898ee3f5807f99dfb44c35bd8d51ddca9d551d8), [`acb24a6`](https://github.com/nylas/nylas/commit/acb24a6fe15201fd558138ad009664bf8f0d450e), [`cd5670d`](https://github.com/nylas/nylas/commit/cd5670de495fcb8491d2208a579081f5de2ee512), [`13a295f`](https://github.com/nylas/nylas/commit/13a295fd7b8ca3759a5db903788a5347315b39b1), [`55705bc`](https://github.com/nylas/nylas/commit/55705bcba2220905c2d8b42eba4243f6fa34126d), [`416c649`](https://github.com/nylas/nylas/commit/416c6491d77d4605e939a1ee0295294c5aab505c), [`6aaf284`](https://github.com/nylas/nylas/commit/6aaf284b61ef5107cbe1288042ba49583d70d7bf), [`87c5ed3`](https://github.com/nylas/nylas/commit/87c5ed3e8d51688e7793004e91760e1188306bc3), [`a898ee3`](https://github.com/nylas/nylas/commit/a898ee3f5807f99dfb44c35bd8d51ddca9d551d8)]:
  - @nylas/web-elements@1.1.0-canary.13

## 1.1.0-canary.12

### Patch Changes

- Updated dependencies [[`8ada81c`](https://github.com/nylas/nylas/commit/8ada81c95529ce4c78b8ac2a72e46b0ddafacf1d), [`5542ab3`](https://github.com/nylas/nylas/commit/5542ab3ebf2b4acbaac9103b36267219d6960c9a), [`8c3aada`](https://github.com/nylas/nylas/commit/8c3aadae0792893adc06f0fa74b72534853b077b), [`ede0b2c`](https://github.com/nylas/nylas/commit/ede0b2c54968796d15fb43ea116706a0a3a6e7fc), [`436c634`](https://github.com/nylas/nylas/commit/436c63449488024649e41a9fbdc58736db089ce2)]:
  - @nylas/web-elements@1.1.0-canary.12

## 1.1.0-canary.11

### Patch Changes

- Updated dependencies [[`3b7a6bc`](https://github.com/nylas/nylas/commit/3b7a6bcd7efcfc658dd56caa4b096e793f02d11f), [`7808063`](https://github.com/nylas/nylas/commit/7808063be08b0382b59d820ac617ee7ad3c4753f), [`2b57ad1`](https://github.com/nylas/nylas/commit/2b57ad1b4cdc6d6068482a0b60335ecb94e0002c)]:
  - @nylas/web-elements@1.1.0-canary.11

## 1.1.0-canary.10

### Patch Changes

- [#177](https://github.com/nylas/nylas/pull/177) [`4a720b9`](https://github.com/nylas/nylas/commit/4a720b91fe0fbe1453e550d61924e2c94ce37121) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Revert enableImportInjection change

- Updated dependencies [[`4a720b9`](https://github.com/nylas/nylas/commit/4a720b91fe0fbe1453e550d61924e2c94ce37121)]:
  - @nylas/web-elements@1.1.0-canary.10

## 1.1.0-canary.9

### Patch Changes

- [#173](https://github.com/nylas/nylas/pull/173) [`62afae4`](https://github.com/nylas/nylas/commit/62afae4574d0a35431841d57e008a2a3dbdb8d7b) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Added stack trace output to the debug utility

- [#173](https://github.com/nylas/nylas/pull/173) [`62afae4`](https://github.com/nylas/nylas/commit/62afae4574d0a35431841d57e008a2a3dbdb8d7b) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Fix: components built using enableimportinjection was causing our build files to explode, resulting in slower load times for our web-components using unpkg.

- Updated dependencies [[`8a2e964`](https://github.com/nylas/nylas/commit/8a2e964962ae05c199616dd62d378060e8de7a97), [`8a2e964`](https://github.com/nylas/nylas/commit/8a2e964962ae05c199616dd62d378060e8de7a97), [`7ae32d3`](https://github.com/nylas/nylas/commit/7ae32d333106a1d8f7b826480a9665cc3a282828), [`62afae4`](https://github.com/nylas/nylas/commit/62afae4574d0a35431841d57e008a2a3dbdb8d7b), [`62afae4`](https://github.com/nylas/nylas/commit/62afae4574d0a35431841d57e008a2a3dbdb8d7b), [`62afae4`](https://github.com/nylas/nylas/commit/62afae4574d0a35431841d57e008a2a3dbdb8d7b), [`3cc5fba`](https://github.com/nylas/nylas/commit/3cc5fba4de3d3372a6fd9632d5a83837930778d2), [`e483f58`](https://github.com/nylas/nylas/commit/e483f58ee5c5c5b698501de12b4185726cf4d091), [`62afae4`](https://github.com/nylas/nylas/commit/62afae4574d0a35431841d57e008a2a3dbdb8d7b), [`e1c674a`](https://github.com/nylas/nylas/commit/e1c674aeed69205f7a209cd390d09284caada581), [`8a2e964`](https://github.com/nylas/nylas/commit/8a2e964962ae05c199616dd62d378060e8de7a97), [`7ae32d3`](https://github.com/nylas/nylas/commit/7ae32d333106a1d8f7b826480a9665cc3a282828)]:
  - @nylas/web-elements@1.1.0-canary.9
  - @nylas/core@1.1.0-canary.3

## 1.1.0-canary.8

### Patch Changes

- Updated dependencies [[`1072a2f`](https://github.com/nylas/nylas/commit/1072a2fe0eb26851f8eab8046d9ef27a842096ce), [`a82b7be`](https://github.com/nylas/nylas/commit/a82b7bee136c39cd180f31b1942b49f6b3ac4a7f)]:
  - @nylas/web-elements@1.1.0-canary.8

## 1.1.0-canary.7

### Patch Changes

- Updated dependencies [[`f079874`](https://github.com/nylas/nylas/commit/f079874250d6b726327651018b1add86f44aa7f7), [`f079874`](https://github.com/nylas/nylas/commit/f079874250d6b726327651018b1add86f44aa7f7), [`f079874`](https://github.com/nylas/nylas/commit/f079874250d6b726327651018b1add86f44aa7f7), [`f079874`](https://github.com/nylas/nylas/commit/f079874250d6b726327651018b1add86f44aa7f7)]:
  - @nylas/web-elements@1.1.0-canary.7

## 1.1.0-canary.6

### Patch Changes

- Updated dependencies [[`97778be`](https://github.com/nylas/nylas/commit/97778bedb03c6135af4ac649687e7ccbee111e63), [`bebb0d6`](https://github.com/nylas/nylas/commit/bebb0d65b9750fa9ff73ed45267f45e1c9d683b3), [`6619567`](https://github.com/nylas/nylas/commit/6619567f51be058cc033ca7a0d272d8a69a24fae), [`97778be`](https://github.com/nylas/nylas/commit/97778bedb03c6135af4ac649687e7ccbee111e63), [`9081878`](https://github.com/nylas/nylas/commit/90818781f530c239164716c4e1f0035353c8dce1)]:
  - @nylas/web-elements@1.1.0-canary.6
  - @nylas/core@1.1.0-canary.2

## 1.1.0-canary.5

### Minor Changes

- [#149](https://github.com/nylas/nylas/pull/149) [`cec6c13`](https://github.com/nylas/nylas/commit/cec6c13be67be8d04013175a5df899a66a178d5a) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Added a new [nylas-list-configurations] component that shows a list of configurations that can be edited or deleted.

### Patch Changes

- Updated dependencies [[`cec6c13`](https://github.com/nylas/nylas/commit/cec6c13be67be8d04013175a5df899a66a178d5a)]:
  - @nylas/web-elements@1.1.0-canary.5

## 1.1.0-canary.4

### Patch Changes

- Updated dependencies [[`0628791`](https://github.com/nylas/nylas/commit/0628791825454967a2fcbb1ac2dd4525a1a56002)]:
  - @nylas/web-elements@1.1.0-canary.4

## 1.1.0-canary.3

### Minor Changes

- [#145](https://github.com/nylas/nylas/pull/145) [`f2d3f88`](https://github.com/nylas/nylas/commit/f2d3f885db77fe93d11a26375c8070d4f212309c) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Added the ability to login with the scheduler editor component

- [#139](https://github.com/nylas/nylas/pull/139) [`b467dae`](https://github.com/nylas/nylas/commit/b467dae30f4bcb4431d91a1b307d6ca542fe543f) Thanks [@AaronDDM](https://github.com/AaronDDM)! - Added nylas/identity support for the nylas-scheduler-editor component

### Patch Changes

- [#127](https://github.com/nylas/nylas/pull/127) [`929044c`](https://github.com/nylas/nylas/commit/929044c985ae6b4a6b940137a7ae038ef8801f3c) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [nylas-scheduling] Added nylasBranding prop to hide nylas branding

- Updated dependencies [[`f2d3f88`](https://github.com/nylas/nylas/commit/f2d3f885db77fe93d11a26375c8070d4f212309c), [`929044c`](https://github.com/nylas/nylas/commit/929044c985ae6b4a6b940137a7ae038ef8801f3c), [`b467dae`](https://github.com/nylas/nylas/commit/b467dae30f4bcb4431d91a1b307d6ca542fe543f), [`3b7e28d`](https://github.com/nylas/nylas/commit/3b7e28d6f1c08d770e43ad60113b205e8617ef80)]:
  - @nylas/web-elements@1.1.0-canary.3
  - @nylas/core@1.1.0-canary.1

## 1.0.2-canary.2

### Patch Changes

- Updated dependencies [[`7104a8b`](https://github.com/nylas/nylas/commit/7104a8bfccc8431688b1a0abb8e0345f81ef25e5)]:
  - @nylas/core@1.0.2-canary.0
  - @nylas/web-elements@1.0.2-canary.2

## 1.0.2-canary.1

### Patch Changes

- [#124](https://github.com/nylas/nylas/pull/124) [`5ccd04d`](https://github.com/nylas/nylas/commit/5ccd04dcf91f3a53df3118ffd933604a0fa7eb9e) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [nylas-scheduling] props renamed/deprecated

      - Remove `showThankYouPage` in favor of using `eventInfo`
      - Remove `bookingFlow` in favor of using `rescheduleBookingId`
      - Rename `cancelledEvent` to `cancelledEventInfo` for consistency
      - Rename `defaultSchedulerStoreState` to `defaultSchedulerState` for better clarity

- [#108](https://github.com/nylas/nylas/pull/108) [`04ed6c4`](https://github.com/nylas/nylas/commit/04ed6c421185c2b89271de9eeb21c75a29bc0f03) Thanks [@AaronDDM](https://github.com/AaronDDM)! - [nylas-scheduling] Renamed the nylas-scheduler component to nylas-scheduling.

- [#123](https://github.com/nylas/nylas/pull/123) [`42673bd`](https://github.com/nylas/nylas/commit/42673bd1a6bc9b7266468f5dcb5b2ea65880aaa6) Thanks [@pooja169usp](https://github.com/pooja169usp)! - [nylas-scheduling] Support scheduling for public configs through scheduling component

- Updated dependencies [[`5ccd04d`](https://github.com/nylas/nylas/commit/5ccd04dcf91f3a53df3118ffd933604a0fa7eb9e), [`4607e3e`](https://github.com/nylas/nylas/commit/4607e3e999eed77e04c55a6c832a84607ea4f45b), [`8ef8bed`](https://github.com/nylas/nylas/commit/8ef8bed63b0b387c4cfe9508d32b5533dcf19e95), [`74e2330`](https://github.com/nylas/nylas/commit/74e233033bc7a522d1db75b4136cc77fbc566031), [`04ed6c4`](https://github.com/nylas/nylas/commit/04ed6c421185c2b89271de9eeb21c75a29bc0f03), [`42673bd`](https://github.com/nylas/nylas/commit/42673bd1a6bc9b7266468f5dcb5b2ea65880aaa6)]:
  - @nylas/web-elements@1.0.2-canary.1

## 1.0.2-canary.0

### Patch Changes

- [#83](https://github.com/nylas/nylas/pull/83) [`ad7de37`](https://github.com/nylas/nylas/commit/ad7de37f496cad2f808b9467e08de36be9f63e7c) Thanks [@pooja169usp](https://github.com/pooja169usp)! - Auto scroll to the input value on focus if the dropdown is open

- Updated dependencies [[`c4441b5`](https://github.com/nylas/nylas/commit/c4441b599331ac768a5ab3387336ff68e20f8007)]:
  - @nylas/web-elements@1.0.2-canary.0
