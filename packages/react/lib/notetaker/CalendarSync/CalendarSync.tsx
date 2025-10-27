import React, { useEffect } from "react";
import client from "../lib/http-client";
import { Check } from "lucide-react";
import { label, button, input } from "../lib/primitives";
import { create } from "zustand";
import { MeetingFilter, RecordingType, Calendar } from "../types";
import {
  MEETING_TYPES,
  RECORDING_TYPES,
  DEFAULT_RECORDING_TYPES,
} from "../lib/constants";
/**
 * Props for the CalendarSync component.
 */
export interface CalendarSyncProps {
  /**
   * The ID of the calendar to sync with.
   */
  calendarId: string;
  /**
   * The grant ID associated with the calendar. Defaults to 'me' if not provided.
   */
  grantId?: string;
  /**
   * The default name for the notetaker. Used as a placeholder or initial value.
   */
  notetakerName?: string;
  /**
   * Callback fired when the calendar is updated successfully.
   * @param payload The updated Calendar object.
   */
  onUpdate?: (payload: Calendar) => void;
  /**
   * Callback fired when the user cancels editing or disables the notetaker.
   */
  onCancel?: () => void;
  /**
   * Callback fired when an error occurs during API calls or updates.
   * @param err The error object or message.
   */
  onError?: (err: any) => void;
  /**
   * If true, hides the recording settings (advanced settings) UI section.
   */
  hideRecordingSettings?: boolean;
  /**
   * If true, hides the notetaker name input field.
   */
  hideNameInput?: boolean;
}

/**
 * Interface for the CalendarSync component state store.
 * Manages all state for the calendar sync functionality.
 */
export interface CalendarSyncStore {
  /** Selected calendar */
  calendar: Calendar | null;
  /** Sets the selected calendar */
  setCalendar: (calendar: Calendar | null) => void;
  /** Loading state */
  isLoading: boolean;
  /** Sets the loading state */
  setIsLoading: (isLoading: boolean) => void;
  /** Selected meeting filters */
  selectedFilters: MeetingFilter[];
  /** Sets the selected meeting filters */
  setSelectedFilters: (filters: MeetingFilter[]) => void;
  /** Selected recording types */
  selectedRecordingTypes: RecordingType[];
  /** Sets the selected recording types */
  setSelectedRecordingTypes: (types: RecordingType[]) => void;
  /** Toggles a recording type on/off */
  toggleRecordingType: (type: RecordingType) => void;
  /** Whether to show advanced settings */
  advancedSettings: boolean;
  /** Sets whether to show advanced settings */
  setAdvancedSettings: (show: boolean) => void;
  /** Whether user made changes */
  hasChanges: boolean;
  /** Sets whether user made changes */
  setHasChanges: (hasChanges: boolean) => void;
  /** Name for the calendar sync */
  name: string;
  /** Sets the name */
  setName: (name: string) => void;
  /** Reset store to initial state */
  reset: () => void;
  /** Toggles a meeting filter on/off */
  toggleMeetingFilter: (filter: MeetingFilter) => void;
  /** Handles canceling changes and resetting to original values */
  handleCancel: (notetakerName?: string, onCancelCallback?: () => void) => void;
  /** Fetches calendar data from the API */
  getCalendar: (
    calendarId: string,
    grantId: string,
    fallbackNotetakerName?: string,
  ) => Promise<void>;
  /** Saves calendar notetaker settings */
  handleSave: (
    calendarId: string,
    grantId: string,
    onUpdate?: (data: Calendar) => void,
    onError?: (error: any) => void,
  ) => Promise<void>;
  /** Disables the notetaker for a calendar */
  handleDisable: (
    calendarId: string,
    grantId: string,
    fallbackNotetakerName?: string,
    onUpdate?: (data: Calendar) => void,
    onError?: (error: any) => void,
    onCancel?: () => void,
  ) => Promise<void>;
}

// Use the same default recording types as SendNotetaker

// Zustand store for CalendarSync state
export const calendarSyncStore = create<CalendarSyncStore>((set, get) => {
  // Common API function to reduce duplication
  const updateCalendar = async (
    calendarId: string,
    grantId: string,
    payload: any,
    onUpdate?: (data: Calendar) => void,
    onError?: (error: any) => void,
  ) => {
    set({ isLoading: true });
    try {
      const response = await client.put(
        `/v3/grants/${grantId}/calendars/${calendarId}`,
        payload,
      );
      const responseData = response.data.data;
      set({ calendar: responseData });
      if (onUpdate) {
        onUpdate(responseData);
      }
      return responseData;
    } catch (err) {
      if (onError) {
        onError(err);
      }
      throw err;
    } finally {
      set({
        isLoading: false,
        hasChanges: false,
      });
    }
  };

  // Reset state to specific values
  const resetState = (stateUpdates: Partial<CalendarSyncStore>) => {
    set({
      hasChanges: false,
      advancedSettings: false,
      selectedRecordingTypes: DEFAULT_RECORDING_TYPES,
      ...stateUpdates,
    });
  };

  return {
    // State
    calendar: null,
    isLoading: false,
    selectedFilters: [],
    selectedRecordingTypes: DEFAULT_RECORDING_TYPES,
    advancedSettings: false,
    hasChanges: false,
    name: "",

    // Simple setters
    setCalendar: (calendar) => set({ calendar }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setAdvancedSettings: (advancedSettings) => set({ advancedSettings }),
    setHasChanges: (hasChanges) => set({ hasChanges }),
    setName: (name) => set({ name }),

    // Consolidated setters with logic
    setSelectedFilters: (selectedFilters) =>
      set({
        selectedFilters,
        hasChanges: true,
      }),
    setSelectedRecordingTypes: (selectedRecordingTypes) =>
      set({
        selectedRecordingTypes,
        hasChanges: true,
      }),

    // Toggle functions
    toggleRecordingType: (type) => {
      const currentTypes = get().selectedRecordingTypes;
      set({
        selectedRecordingTypes: currentTypes.includes(type)
          ? currentTypes.filter((t) => t !== type)
          : [...currentTypes, type],
        hasChanges: true,
      });
    },

    toggleMeetingFilter: (filter) => {
      const currentFilters = get().selectedFilters;
      let newFilters: MeetingFilter[];

      if (filter === MeetingFilter.All) {
        // If 'All' is already the only selected type, deselect it
        if (
          currentFilters.length === 1 &&
          currentFilters[0] === MeetingFilter.All
        ) {
          newFilters = [];
        } else {
          newFilters = [MeetingFilter.All];
        }
      } else {
        // Remove 'All' if any other type is selected
        const filtered = currentFilters.filter((f) => f !== MeetingFilter.All);
        newFilters = filtered.includes(filter)
          ? filtered.filter((f) => f !== filter)
          : [...filtered, filter];
      }

      set({
        selectedFilters: newFilters,
        hasChanges: true,
      });
    },

    // Reset to initial state
    reset: () =>
      resetState({
        calendar: null,
        isLoading: false,
        selectedFilters: [],
        name: "",
      }),

    // Cancel changes and restore original values
    handleCancel: (notetakerName, onCancelCallback) => {
      const { calendar } = get();
      resetState({
        selectedFilters: calendar?.notetaker?.rules?.event_selection ?? [],
        name: calendar?.notetaker?.name ?? notetakerName ?? "",
      });
      if (onCancelCallback) {
        onCancelCallback();
      }
    },

    // API operations
    getCalendar: async (calendarId, grantId, fallbackNotetakerName) => {
      set({ isLoading: true });
      try {
        const response = await client.get(
          `/v3/grants/${grantId}/calendars/${calendarId}`,
          { params: { calendarId } },
        );

        const { data } = response.data;
        const meetingSettings = data?.notetaker?.meeting_settings;

        // Determine recording types based on meeting settings
        let types = DEFAULT_RECORDING_TYPES;
        let showAdvanced = false;

        if (meetingSettings) {
          types = [];
          if (meetingSettings.video_recording) {
            types.push(RecordingType.Video);
          }
          if (meetingSettings.audio_recording) {
            types.push(RecordingType.Audio);
          }
          if (meetingSettings.transcription) {
            types.push(RecordingType.Transcript);
          }
          if (meetingSettings.summary) {
            types.push(RecordingType.Summary);
          }
          if (meetingSettings.action_items) {
            types.push(RecordingType.ActionItems);
          }
          showAdvanced = types.length !== DEFAULT_RECORDING_TYPES.length;
        }

        resetState({
          calendar: data,
          name: data.notetaker?.name ?? fallbackNotetakerName,
          selectedFilters: data?.notetaker?.rules?.event_selection ?? [],
          selectedRecordingTypes: types,
          advancedSettings: showAdvanced,
        });
      } catch (error) {
        console.error("Error fetching calendar:", error);
      } finally {
        set({ isLoading: false });
      }
    },

    handleSave: async (calendarId, grantId, onUpdate, onError) => {
      const { selectedRecordingTypes, selectedFilters, name } = get();
      const rType = selectedRecordingTypes || [];

      // Build payload based on selected filters
      const payload = !selectedFilters.length
        ? { notetaker: {} }
        : {
            notetaker: {
              name,
              meeting_settings: {
                video_recording: rType.includes(RecordingType.Video),
                audio_recording: rType.includes(RecordingType.Audio),
                transcription: rType.includes(RecordingType.Transcript),
                summary: rType.includes(RecordingType.Summary),
                action_items: rType.includes(RecordingType.ActionItems),
              },
              rules: { event_selection: selectedFilters },
            },
          };

      try {
        await updateCalendar(calendarId, grantId, payload, onUpdate, onError);
        // Hide advanced settings if all recording types are selected
        if (rType.length === DEFAULT_RECORDING_TYPES.length) {
          set({ advancedSettings: false });
        }
      } catch (err) {
        // Error already handled in updateCalendar
      }
    },

    handleDisable: async (
      calendarId,
      grantId,
      fallbackNotetakerName,
      onUpdate,
      onError,
      onCancel,
    ) => {
      try {
        const response = await updateCalendar(
          calendarId,
          grantId,
          { notetaker: {} },
          undefined, // We'll handle the update callback ourselves
          onError,
        );

        // Fix the payload to properly handle undefined notetaker
        const fixedPayload = { ...response, notetaker: undefined };
        set({ calendar: fixedPayload });

        // Reset state via handleCancel
        get().handleCancel(fallbackNotetakerName, onCancel);

        if (onUpdate) {
          onUpdate(fixedPayload);
        }
      } catch (err) {
        // Error already handled in updateCalendar
      }
    },
  };
});

export function CalendarSync({
  calendarId,
  grantId = "me",
  notetakerName,
  onUpdate,
  onCancel,
  onError,
  hideRecordingSettings = false,
  hideNameInput = false,
}: CalendarSyncProps) {
  const {
    calendar,
    isLoading,
    selectedFilters,
    toggleMeetingFilter,
    selectedRecordingTypes,
    toggleRecordingType,
    advancedSettings,
    setAdvancedSettings,
    hasChanges,
    setHasChanges,
    name,
    setName,
    handleCancel,
    getCalendar,
    handleSave,
    handleDisable,
  } = calendarSyncStore();

  // Calendar fetching hook
  useEffect(() => {
    if (!calendarId) {
      console.error("No calendarId provided in the CalendarSync component");
      return;
    }
    getCalendar(calendarId, grantId, notetakerName);
  }, [calendarId, grantId, notetakerName, getCalendar]);

  useEffect(() => {
    // sets the default notetaker name
    if (notetakerName) {
      setName(notetakerName);
    }
  }, [notetakerName, setName]);

  const isDisabled = Object.keys(calendar?.notetaker || {}).length === 0;

  return (
    <div className="ny:flex ny:flex-col ny:gap-1">
      {/* Notetaker name */}
      {!hideNameInput && (
        <div className="ny:mb-2">
          <label htmlFor="name" className={label()}>
            Notetaker name:
          </label>
          <input
            type="text"
            value={name}
            disabled={isLoading}
            onChange={(e) => {
              setName(e.target.value);
              setHasChanges(true);
            }}
            className={input({ disabled: isLoading })}
            placeholder="Notetaker name"
          />
        </div>
      )}
      {/* Meeting types */}
      <div className="ny:my-2">
        <label htmlFor="name" className={label()}>
          Meeting types:
        </label>
        <div className="ny:flex ny:gap-2 ny:flex-wrap">
          {MEETING_TYPES.map((type) => (
            <button
              type="button"
              className={button({
                disabled: isLoading,
                active: selectedFilters.includes(type.value),
              })}
              key={type.value}
              onClick={() => toggleMeetingFilter(type.value)}
            >
              {selectedFilters.includes(type.value) && (
                <Check
                  size={16}
                  className="ny:inline ny:mr-1 ny:align-middle"
                />
              )}
              {type.label}
            </button>
          ))}
        </div>
      </div>
      {/* Meeting Settings */}
      {!hideRecordingSettings && !advancedSettings && (
        <div
          className="ny:hover:text-primary-500 ny:text-sm ny:text-gray-500 ny:mb-2 ny:cursor-pointer"
          onClick={() => setAdvancedSettings(true)}
          role="button"
          tabIndex={0}
        >
          Advanced settings...
        </div>
      )}
      {!hideRecordingSettings && advancedSettings && (
        <div className="ny:my-2">
          <label htmlFor="name" className={label()}>
            Recording settings:
          </label>
          <div className="ny:flex ny:gap-2 ny:flex-wrap">
            {RECORDING_TYPES.map((it) => {
              const Icon = it.icon;
              return (
                <button
                  key={it.value}
                  type="button"
                  className={button({
                    disabled: isLoading,
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
      {/* Actions */}
      <div className="ny:flex ny:items-center ny:justify-between">
        <div className="ny:flex ny:gap-2 ny:mt-2">
          <button
            type="button"
            onClick={() => handleSave(calendarId, grantId, onUpdate, onError)}
            disabled={isLoading || !hasChanges || !name}
            className={button({
              variant: "primary",
              disabled: isLoading || !hasChanges || !name,
            })}
          >
            {hasChanges ? "Save changes" : "Changes saved"}
          </button>
          {hasChanges && (
            <button
              type="button"
              className={button({
                variant: "link",
                disabled: !hasChanges,
              })}
              onClick={() => handleCancel(notetakerName, onCancel)}
            >
              Cancel
            </button>
          )}
        </div>
        <div>
          {!isDisabled && (
            <button
              type="button"
              className={button({
                variant: "link",
                color: "danger",
                disabled: isLoading,
              })}
              onClick={() =>
                handleDisable(
                  calendarId,
                  grantId,
                  notetakerName,
                  onUpdate,
                  onError,
                  onCancel,
                )
              }
              disabled={isLoading}
            >
              Disable Notetaker
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
