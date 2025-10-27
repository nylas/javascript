export enum RecordingType {
  Video = "video",
  Audio = "audio",
  Transcript = "transcript",
  Summary = "summary",
  ActionItems = "action_items",
}

export enum MeetingFilter {
  All = "all",
  Internal = "internal",
  External = "external",
  MyMeetings = "own_events",
  Participant = "participant_only",
}

export interface Notetaker {
  id: string;
  name: string;
  meeting_link: string;
  join_time: number;
  meeting_settings: {
    video_recording: boolean;
    audio_recording: boolean;
    transcription: boolean;
  };
}

interface CalendarNotetaker extends Partial<Notetaker> {
  rules?: {
    event_selection?: MeetingFilter[];
  };
}

export interface Calendar {
  name: string;
  timezone: string;
  hex_color?: string;
  hex_foreground_color?: string;
  grant_id: string;
  id: string;
  object: "calendar";
  is_primary: boolean;
  read_only: boolean;
  is_owned_by_user: boolean;
  notetaker: CalendarNotetaker;
}
