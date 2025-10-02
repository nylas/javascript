import { render } from "@testing-library/react";
import { it } from "vitest";

// --- example code:start --
import React from "react";
import { SendNotetaker } from "../../lib/notetaker/SendNotetaker/SendNotetaker";

function App() {
  return (
    <SendNotetaker
      showNameInput={true}
      showAdvancedSettings={false}
      className="custom-send-notetaker"
      onSend={(data, resetForm) => {
        console.log("Notetaker sent:", data);
        // Optionally reset the form after sending
        resetForm();
      }}
      onError={(error) => console.error("Send error:", error)}
    />
  );
}
// --- example code:end --

it("should render the send notetaker example", () => {
  render(<App />);
});
