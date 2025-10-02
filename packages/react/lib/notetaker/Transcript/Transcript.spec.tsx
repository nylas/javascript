import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, Mock } from "vitest";

// Mock the videoPlayerStore hook
vi.mock("../VideoPlayer/VideoPlayer", () => {
  return {
    videoPlayerStore: vi.fn(),
  };
});

import { videoPlayerStore } from "../VideoPlayer/VideoPlayer";
import { Transcript } from "./Transcript";

const mockTranscript = [
  {
    start: 1000,
    end: 2000,
    speaker: "Alice",
    text: "Hello world",
  },
  {
    start: 5000,
    end: 6000,
    speaker: "Bob",
    text: "How are you?",
  },
];

describe("Transcript", () => {
  let mockSetCurrentTime: ReturnType<typeof vi.fn>;
  let mockCurrentTime: number;

  beforeEach(() => {
    mockSetCurrentTime = vi.fn();
    mockCurrentTime = 0;
    (videoPlayerStore as unknown as Mock).mockReturnValue({
      currentTime: mockCurrentTime,
      setCurrentTime: mockSetCurrentTime,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders transcript items", () => {
    render(<Transcript transcript={mockTranscript} />);
    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.getByText("Bob")).toBeTruthy();
    expect(screen.getByText("Hello world")).toBeTruthy();
    expect(screen.getByText("How are you?")).toBeTruthy();
  });

  it("shows 'Transcript not available' when empty", () => {
    render(<Transcript transcript={[]} />);
    expect(screen.getByText(/Transcript not available/i)).toBeTruthy();
  });

  it("filters transcript by search term", () => {
    render(<Transcript transcript={mockTranscript} />);
    fireEvent.click(screen.getByText(/Search/i));
    const input = screen.getByPlaceholderText(/search transcript/i);
    fireEvent.change(input, { target: { value: "Alice" } });
    expect(screen.getByText(/Alice/)).toBeTruthy();
    expect(screen.queryByText(/Bob/)).toBeFalsy();
    expect(screen.queryByText(/How are you\?/)).toBeFalsy();
  });

  it("shows 'No results found' for unmatched search", () => {
    render(<Transcript transcript={mockTranscript} />);
    fireEvent.click(screen.getByText(/Search/i));
    fireEvent.change(screen.getByPlaceholderText(/search transcript/i), {
      target: { value: "foobar" },
    });
    expect(screen.getByText(/No results found/i)).toBeTruthy();
  });

  it("renders custom transcriptComponent when provided", () => {
    const CustomText = ({ text }) => (
      <div data-testid="custom-text-component">{text.toUpperCase()}</div>
    );
    render(
      <Transcript
        transcript={mockTranscript}
        transcriptComponent={CustomText}
      />,
    );

    // Use different test ID to avoid duplicate testid error
    const customTextElements = screen.getAllByTestId("custom-text-component");
    expect(customTextElements.length).toBe(2);
    // Fallback if toHaveTextContent is not available
    expect((customTextElements[0] as HTMLElement).textContent).toContain(
      "HELLO WORLD",
    );
  });

  it("calls onTimestampClick when timestamp is clicked", async () => {
    const onTimestampClick = vi.fn();
    render(
      <Transcript
        transcript={mockTranscript}
        onTimestampClick={onTimestampClick}
      />,
    );

    // Target the first transcript item
    const transcriptItem = screen
      .getByText("Hello world")
      .closest(".ny\\:transcripts-item");

    // Manually trigger mouseEnter to show the play button
    if (transcriptItem) {
      fireEvent.mouseEnter(transcriptItem);
    }

    // Use querySelector directly with the document object
    const playButton = document.querySelector(".lucide-play");
    expect(playButton).not.toBeNull();
    if (playButton) {
      fireEvent.click(playButton);
    }

    expect(onTimestampClick).toHaveBeenCalledWith(2); // 1000ms/1000 + 1
    expect(mockSetCurrentTime).toHaveBeenCalledWith(2);
  });

  it("hides speakers when showSpeaker is false", () => {
    render(<Transcript transcript={mockTranscript} showSpeaker={false} />);
    expect(screen.queryByText("Alice")).toBeFalsy();
    expect(screen.queryByText("Bob")).toBeFalsy();
  });

  it("hides timestamps when showTimestamps is false", () => {
    render(<Transcript transcript={mockTranscript} showTimestamps={false} />);
    expect(screen.queryByText("00:01")).toBeFalsy();
    expect(screen.queryByText("00:05")).toBeFalsy();
  });

  it("copies transcript text when copy button is clicked", async () => {
    // Mock clipboard
    const mockClipboard = {
      writeText: vi.fn().mockImplementation(() => Promise.resolve()),
    };
    Object.defineProperty(navigator, "clipboard", {
      value: mockClipboard,
      writable: true,
    });

    render(<Transcript transcript={mockTranscript} />);

    // Click toolbar copy button
    const copyToolbarButton = screen.getByText("Copy");
    fireEvent.click(copyToolbarButton);
    expect(mockClipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining("Alice: Hello world"),
    );

    // Copy individual item
    mockClipboard.writeText.mockClear();

    // Manually trigger mouseEnter on the transcript item
    const transcriptItem = screen
      .getByText("Hello world")
      .closest(".ny\\:transcripts-item");
    if (transcriptItem) {
      fireEvent.mouseEnter(transcriptItem);
    }

    // Find and click copy button using querySelector
    const copyButton = document.querySelector(".lucide-copy");
    expect(copyButton).not.toBeNull();
    if (copyButton) {
      fireEvent.click(copyButton);
    }

    expect(mockClipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining("Alice: Hello world"),
    );
  });

  it("renders custom empty state when provided", () => {
    const customEmptyState = (
      <div data-testid="custom-empty">No transcripts yet</div>
    );
    render(<Transcript transcript={[]} emptyState={customEmptyState} />);

    expect(screen.getByTestId("custom-empty")).toBeTruthy();
    expect(screen.queryByText(/Transcript not available/i)).toBeFalsy();
  });

  it("hides toolbar when toolbar prop is false", () => {
    render(<Transcript transcript={mockTranscript} toolbar={false} />);
    expect(screen.queryByText(/Search/i)).toBeFalsy();
    expect(screen.queryByText(/Copy/i)).toBeFalsy();
  });

  it("highlights the active transcript based on current time", () => {
    (videoPlayerStore as unknown as Mock).mockReturnValue({
      currentTime: 1.5, // Between 1000ms and 2000ms
      setCurrentTime: mockSetCurrentTime,
    });

    render(<Transcript transcript={mockTranscript} />);
    const items = document.querySelectorAll(".ny\\:transcripts-item");
    expect(items[0].classList.contains("ny:bg-blue-50")).toBeTruthy();
    expect(items[1].classList.contains("ny:bg-blue-50")).toBeFalsy();
  });
});
