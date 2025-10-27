import { render } from "@testing-library/react";
import { it } from "vitest";

// --- example code:start --
import { CalendarSync } from "../../src/notetaker/CalendarSync/CalendarSync";
import React from "react";

function App() {
  return (
    <CalendarSync
      calendarId="example-calendar-id"
      grantId="example-grant-id"
      notetakerName="Example Notetaker"
      onUpdate={(calendar) => console.log("Updated calendar:", calendar)}
      onCancel={() => console.log("Edit cancelled")}
      onError={(err) => console.error("Error:", err)}
      hideRecordingSettings={false}
      hideNameInput={false}
    />
  );
}
// --- example code:end --

it("should render the calendar sync example", () => {
  render(<App />);
});
