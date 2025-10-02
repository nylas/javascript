import React, { useEffect } from "react";
import { label, input, button } from "../lib/primitives";

import { create } from "zustand";
import client from "../lib/http-client";
import { RecordingType, Notetaker } from "../types";
import { DEFAULT_RECORDING_TYPES, RECORDING_TYPES } from "../lib/constants";

type NotetakerPayload = Partial<Notetaker>;

/**
 * Interface for the SendNotetaker component state store.
 * Manages all form data and UI state for the notetaker scheduling functionality.
 */
export interface SendNotetakerStore {
  /**
   * The name of the notetaker to be scheduled.
   */
  name: string;
  /**
   * Sets the notetaker's name.
   * @param name The new name value
   */
  setName: (name: string) => void;
  /**
   * The meeting link (URL) where the notetaker will join.
   */
  meetingLink: string;
  /**
   * Sets the meeting link.
   * @param meetingLink The new meeting link value
   */
  setMeetingLink: (meetingLink: string) => void;
  /**
   * The selected date for the notetaker to join the meeting.
   */
  date: string;
  /**
   * Sets the join date.
   * @param date The new date value (YYYY-MM-DD)
   */
  setDate: (date: string) => void;
  /**
   * The selected time for the notetaker to join the meeting.
   */
  time: string;
  /**
   * Sets the join time.
   * @param time The new time value (HH:mm)
   */
  setTime: (time: string) => void;
  /**
   * Whether the advanced settings section is visible.
   */
  advancedSettings: boolean;
  /**
   * Sets the visibility of the advanced settings section.
   * @param show Whether to show advanced settings
   */
  setAdvancedSettings: (show: boolean) => void;
  /**
   * The currently selected recording types (e.g., video, audio, transcript).
   */
  selectedRecordingTypes: RecordingType[];
  /**
   * Sets the selected recording types.
   * @param types The new array of selected recording types
   */
  setSelectedRecordingTypes: (types: RecordingType[]) => void;
  /**
   * Toggles a recording type in the selection.
   * @param type The recording type to toggle
   */
  toggleRecordingType: (type: RecordingType) => void;
  /**
   * Whether the form is currently submitting (loading state).
   */
  isLoading: boolean;
  /**
   * Sets the loading state.
   * @param isLoading Whether the form is loading
   */
  setIsLoading: (isLoading: boolean) => void;
  /**
   * Resets all form fields and state to their default values.
   */
  reset: () => void;
  /**
   * Handles form submission, sending the notetaker data to the API.
   * @param grantId The grant ID to associate with the notetaker
   * @param onSend Optional callback for successful send
   * @param onError Optional callback for error handling
   */
  handleSubmit: (
    grantId?: string,
    onSend?: (data: Notetaker, resetForm: () => void) => void,
    onError?: (error: any) => void,
  ) => void;
}

// Helper to reset state
const resetState = (
  set: any,
  stateUpdates: Partial<SendNotetakerStore> = {},
) => {
  set({
    name: "",
    meetingLink: "",
    date: "",
    time: "",
    selectedRecordingTypes: DEFAULT_RECORDING_TYPES,
    advancedSettings: false,
    isLoading: false,
    ...stateUpdates,
  });
};

export const sendNotetakerStore = create<SendNotetakerStore>((set, get) => ({
  name: "",
  setName: (name) => set({ name }),
  meetingLink: "",
  setMeetingLink: (meetingLink) => set({ meetingLink }),
  date: "",
  setDate: (date) => set({ date }),
  time: "",
  setTime: (time) => set({ time }),
  advancedSettings: false,
  setAdvancedSettings: (advancedSettings) => set({ advancedSettings }),
  selectedRecordingTypes: DEFAULT_RECORDING_TYPES,
  setSelectedRecordingTypes: (selectedRecordingTypes) =>
    set({ selectedRecordingTypes }),
  toggleRecordingType: (type) => {
    const currentTypes = get().selectedRecordingTypes;
    set({
      selectedRecordingTypes: currentTypes.includes(type)
        ? currentTypes.filter((t) => t !== type)
        : [...currentTypes, type],
    });
  },
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
  reset: () => resetState(set),
  handleSubmit: (grantId = "me", onSend, onError) => {
    const state = get();
    const { name, meetingLink, date, time, selectedRecordingTypes, reset } =
      state;
    const isValid = !!meetingLink;
    if (!isValid || state.isLoading) return;
    set({ isLoading: true });
    // Prepare join time if date and time are set
    let join_time;
    if (date && time) {
      const dateObj = new Date(date);
      const [hours, minutes] = time.split(":").map(Number);
      dateObj.setHours(hours, minutes);
      join_time = Math.round(dateObj.getTime() / 1000);
    }
    // Prepare meeting settings based on selected recording types
    const meeting_settings = {
      video_recording: selectedRecordingTypes.includes(RecordingType.Video),
      audio_recording: selectedRecordingTypes.includes(RecordingType.Audio),
      transcription: selectedRecordingTypes.includes(RecordingType.Transcript),
      summary: selectedRecordingTypes.includes(RecordingType.Summary),
      action_items: selectedRecordingTypes.includes(RecordingType.ActionItems),
    };
    // Create the payload
    const payload: NotetakerPayload = {
      meeting_link: meetingLink,
      name,
      meeting_settings,
    };
    if (join_time) {
      payload.join_time = join_time;
    }
    client
      .post(`/v3/grants/${grantId}/notetakers`, payload)
      .then((res) => {
        const { data } = res;
        if (onSend) onSend(data, reset);
        set({ isLoading: false });
      })
      .catch((error) => {
        console.error("Failed to send notetaker:", error);
        if (onError) onError(error);
        set({ isLoading: false });
      });
  },
}));

/**
 * Props for the SendNotetaker component.
 */
export interface SendNotetakerProps {
  /**
   * The name of the notetaker, used as an initial value for the name input field.
   */
  notetakerName?: string;
  /**
   * Whether to show the name input field.
   * When false, the name input will be hidden.
   */
  showNameInput?: boolean;
  /**
   * Whether to initially show the advanced settings section.
   * When true, advanced settings will be visible by default.
   */
  showAdvancedSettings?: boolean;
  /**
   * Additional class name(s) for the container element.
   */
  className?: string;
  /**
   * The grant ID to associate with the notetaker. Defaults to "me".
   */
  grantId?: string;
  /**
   * Callback triggered after a successful send operation.
   * @param data The notetaker data returned from the API
   * @param resetForm Function to reset the form state
   */
  onSend?: (data: Notetaker, resetForm: () => void) => void;
  /**
   * Callback triggered when an error occurs during the send operation.
   * @param error The error that occurred
   */
  onError?: (error: any) => void;
}

export function SendNotetaker({
  className,
  onSend,
  onError,
  notetakerName,
  grantId = "me",
}: SendNotetakerProps) {
  const {
    name,
    setName,
    meetingLink,
    setMeetingLink,
    date,
    setDate,
    time,
    setTime,
    advancedSettings,
    setAdvancedSettings,
    selectedRecordingTypes,
    toggleRecordingType,
    isLoading,
    handleSubmit,
  } = sendNotetakerStore();

  useEffect(() => {
    if (notetakerName) {
      setName(notetakerName);
    }
  }, [notetakerName, setName]);

  // Only meeting link is required
  const isValid = !!meetingLink;

  return (
    <div className={`ny:flex ny:flex-col ny:gap-3 ${className}`}>
      {/* Notetaker name */}
      <div>
        <label htmlFor="notetaker-name" className={label()}>
          Notetaker name:
        </label>
        <input
          id="notetaker-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={input()}
          placeholder="Notetaker name"
        />
      </div>
      {/* Meeting link */}
      <div>
        <label htmlFor="meeting-link" className={label()}>
          Meeting link:
        </label>
        <input
          id="meeting-link"
          type="url"
          value={meetingLink}
          required
          onChange={(e) => setMeetingLink(e.target.value)}
          className={input()}
          placeholder="https://meet.google.com/..."
        />
      </div>
      {/* Join date and time */}
      <div>
        <label className={label()}>Join date and time:</label>
        <div className="ny:flex ny:gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={input()}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className={input()}
          />
        </div>
      </div>
      {/* Advanced settings toggle and section */}
      {!advancedSettings && (
        <div
          className="ny:hover:text-primary-500 ny:text-sm ny:text-gray-500 ny:mb-2 ny:cursor-pointer"
          onClick={() => setAdvancedSettings(true)}
          role="button"
          tabIndex={0}
        >
          Advanced settings...
        </div>
      )}
      {advancedSettings && (
        <div className="ny:my-2">
          <label className={label()}>Recording settings:</label>
          <div className="ny:flex ny:gap-2 ny:flex-wrap">
            {RECORDING_TYPES.map((it) => {
              const Icon = it.icon;
              return (
                <button
                  key={it.value}
                  type="button"
                  className={button({
                    active: selectedRecordingTypes.includes(it.value),
                  })}
                  onClick={() => toggleRecordingType(it.value)}
                >
                  <Icon
                    size={16}
                    className="ny:inline ny:mr-1 ny:align-middle"
                  />
                  {it.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <div className="ny:mt-2">
        <button
          type="button"
          className={button({
            variant: "primary",
            disabled: !isValid || isLoading,
          })}
          disabled={!isValid || isLoading}
          onClick={() => handleSubmit(grantId, onSend, onError)}
        >
          {isLoading ? "Sending..." : "Send Notetaker"}
        </button>
      </div>
    </div>
  );
}
