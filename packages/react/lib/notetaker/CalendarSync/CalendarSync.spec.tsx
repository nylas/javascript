import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";

// Mock the http-client
vi.mock("../lib/http-client", () => ({
  default: {
    get: vi.fn(() =>
      Promise.resolve({
        data: {
          data: {
            name: "Test Calendar",
            timezone: "UTC",
            hex_color: "#fff",
            hex_foreground_color: "#000",
            grant_id: "grant-1",
            id: "calendar-1",
            object: "calendar",
            is_primary: true,
            read_only: false,
            is_owned_by_user: true,
            notetaker: {
              name: "Test Notetaker",
              meeting_settings: {
                video_recording: true,
                audio_recording: true,
                transcription: true,
                summary: true,
                action_items: true,
              },
              rules: {
                event_selection: ["all"],
              },
            },
          },
        },
      }),
    ),
    put: vi.fn(() =>
      Promise.resolve({
        data: {
          data: {
            name: "Test Calendar",
            timezone: "UTC",
            hex_color: "#fff",
            hex_foreground_color: "#000",
            grant_id: "grant-1",
            id: "calendar-1",
            object: "calendar",
            is_primary: true,
            read_only: false,
            is_owned_by_user: true,
            notetaker: {
              name: "Test Notetaker",
              meeting_settings: {
                video_recording: true,
                audio_recording: true,
                transcription: true,
                summary: true,
                action_items: true,
              },
              rules: {
                event_selection: ["all"],
              },
            },
          },
        },
      }),
    ),
  },
}));

import { CalendarSync } from "./CalendarSync";

describe("CalendarSync", () => {
  const defaultProps = {
    calendarId: "calendar-1",
    grantId: "grant-1",
    notetakerName: "Test Notetaker",
  };

  it("renders notetaker name and meeting types", async () => {
    render(<CalendarSync {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Notetaker name/i)).toBeTruthy();
      expect(screen.getByText(/Meeting types/i)).toBeTruthy();
      expect(screen.getByDisplayValue("Test Notetaker")).toBeTruthy();
    });
  });

  it("allows changing notetaker name", async () => {
    render(<CalendarSync {...defaultProps} />);
    const input = await screen.findByPlaceholderText(/Notetaker name/i);
    fireEvent.change(input, { target: { value: "New Name" } });
    expect((input as HTMLInputElement).value).toBe("New Name");
  });

  it("hides advanced settings when all recording types are enabled", async () => {
    render(<CalendarSync {...defaultProps} />);
    // Since all recording types are enabled, advanced settings should be hidden by default
    expect(screen.getByText(/Advanced settings/i)).toBeTruthy();

    // Click to expand advanced settings
    const advLink = screen.getByText(/Advanced settings/i);
    fireEvent.click(advLink);

    // Now recording settings should be visible
    expect(screen.getByText(/Recording settings/i)).toBeTruthy();
    // Should see all 5 recording type buttons
    expect(screen.getByText(/Video/i)).toBeTruthy();
    expect(screen.getByText(/Audio/i)).toBeTruthy();
    expect(screen.getByText(/Transcript/i)).toBeTruthy();
    expect(screen.getByText(/Summary/i)).toBeTruthy();
    expect(screen.getByText(/Action Items/i)).toBeTruthy();
  });

  it("shows advanced settings link when not all recording types are enabled", async () => {
    // Mock with only some recording types enabled
    const partialRecordingMock = vi.fn(() =>
      Promise.resolve({
        data: {
          data: {
            name: "Test Calendar",
            timezone: "UTC",
            hex_color: "#fff",
            hex_foreground_color: "#000",
            grant_id: "grant-1",
            id: "calendar-1",
            object: "calendar",
            is_primary: true,
            read_only: false,
            is_owned_by_user: true,
            notetaker: {
              name: "Test Notetaker",
              meeting_settings: {
                video_recording: true,
                audio_recording: true,
                transcription: false,
                summary: false,
                action_items: false,
              },
              rules: {
                event_selection: ["all"],
              },
            },
          },
        },
      }),
    );

    // Temporarily replace the mock
    const httpClient = await import("../lib/http-client");
    const originalGet = httpClient.default.get;
    httpClient.default.get = partialRecordingMock as any;

    render(<CalendarSync {...defaultProps} />);

    // Should show advanced settings link since not all recording types are enabled
    const advLink = await screen.findByText(/Advanced settings/i);
    expect(advLink).toBeTruthy();

    // Click to expand
    fireEvent.click(advLink);
    expect(screen.getByText(/Recording settings/i)).toBeTruthy();

    // Restore original mock
    httpClient.default.get = originalGet;
  });

  it("allows toggling meeting types", async () => {
    render(<CalendarSync {...defaultProps} />);
    const internalBtn = await screen.findByRole("button", {
      name: /Internal/i,
    });
    fireEvent.click(internalBtn);
    expect(
      internalBtn.className.includes("ny:border-primary-500") ||
        internalBtn.className.includes("ny:text-primary-500"),
    ).toBe(true);
  });

  it("calls onUpdate when save is clicked", async () => {
    const onUpdate = vi.fn();
    render(<CalendarSync {...defaultProps} onUpdate={onUpdate} />);
    const input = await screen.findByPlaceholderText(/Notetaker name/i);
    fireEvent.change(input, { target: { value: "New Name" } });
    const saveBtn = await screen.findByRole("button", {
      name: /Save changes/i,
    });
    fireEvent.click(saveBtn);
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled();
    });
  });
});
