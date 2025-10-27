// This file is used for development purposes only
// feel free to update it as you see fit

import React from "react";
import { createRoot } from "react-dom/client";

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    fontFamily: "sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "500px",
    margin: "0 auto",
    maxHeight: "800px",
  },
};

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
  {
    start: 7000,
    end: 8000,
    speaker: "Alice",
    text: "I'm good, thanks! How about you?",
  },
  {
    start: 9000,
    end: 10000,
    speaker: "Bob",
    text: "Doing well. Did you finish the report?",
  },
  {
    start: 11000,
    end: 12000,
    speaker: "Alice",
    text: "Yes, I sent it this morning.",
  },
  {
    start: 13000,
    end: 14000,
    speaker: "Bob",
    text: "Great! I'll review it after lunch.",
  },
  {
    start: 15000,
    end: 16000,
    speaker: "Alice",
    text: "Let me know if you have any questions.",
  },
  {
    start: 17000,
    end: 18000,
    speaker: "Bob",
    text: "Will do. Are you joining the team call later?",
  },
  {
    start: 19000,
    end: 20000,
    speaker: "Alice",
    text: "Yes, I'll be there at 3 PM.",
  },
  {
    start: 21000,
    end: 22000,
    speaker: "Bob",
    text: "Perfect. See you then!",
  },
  {
    start: 23000,
    end: 24000,
    speaker: "Alice",
    text: "See you!",
  },
];

const App: React.FC = () => <div style={styles.container}></div>;

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
