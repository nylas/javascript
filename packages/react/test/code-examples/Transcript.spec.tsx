import { render } from "@testing-library/react";
import { it } from "vitest";

// --- example code:start --
import React from "react";
import { Transcript } from "../../src/notetaker/Transcript/Transcript";

const transcriptData = [
  {
    start: 1000,
    end: 2000,
    speaker: "Alice",
    text: "Hello world!",
  },
  {
    start: 5000,
    end: 6000,
    speaker: "Bob",
    text: "How are you?",
  },
];

function App() {
  return (
    <Transcript
      transcript={transcriptData}
      autoscroll={true}
      toolbar={true}
      emptyState={<div>No transcript available.</div>}
      showSpeaker={true}
      showTimestamps={true}
      resumeAutoscrollLabel="Scroll to active"
      onTimestampClick={(timestamp) =>
        console.log("Timestamp clicked:", timestamp)
      }
      transcriptComponent={({ text }) => (
        <span style={{ color: "purple" }}>{text}</span>
      )}
    />
  );
}
// --- example code:end --

it("should render the transcript example", () => {
  render(<App />);
});
