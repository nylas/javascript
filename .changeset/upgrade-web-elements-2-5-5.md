---
"@nylas/react": patch
---

Upgrade @nylas/web-elements dependency to 2.5.5:
- Fix time slot selection and date picker clicks being non-functional after upgrading to v2.5.0. When configurationId or other auth props were set post-mount (e.g. via React), the scheduler entered a deferred init path where click handlers on the date picker and timeslot picker were registered before the connector existed. Clicking a date or time slot appeared to do nothing. The connector reference is now resolved at click time rather than at registration time, so all interactions work correctly regardless of when auth props arrive.

- [nylas-scheduling] Fix schedulerApiUrl prop being ignored on full page refresh when using React wrappers. The component now correctly waits for React's commit phase to apply props before reading schedulerApiUrl to create the scheduler connector, ensuring the correct API region is used on both client-side navigation and hard page refreshes.
