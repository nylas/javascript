import { MeetingFilter, RecordingType } from "../types";
import {
  VideoIcon,
  MicIcon,
  FileTextIcon,
  ScrollTextIcon,
  ListTodoIcon,
  type LucideIcon,
} from "lucide-react";

export const DEFAULT_RECORDING_TYPES = [
  RecordingType.Video,
  RecordingType.Audio,
  RecordingType.Transcript,
  RecordingType.Summary,
  RecordingType.ActionItems,
];

export const RECORDING_TYPES: {
  value: RecordingType;
  label: string;
  icon: LucideIcon;
}[] = [
  { value: RecordingType.Video, label: "Video", icon: VideoIcon },
  { value: RecordingType.Audio, label: "Audio", icon: MicIcon },
  { value: RecordingType.Transcript, label: "Transcript", icon: FileTextIcon },
  { value: RecordingType.Summary, label: "Summary", icon: ScrollTextIcon },
  {
    value: RecordingType.ActionItems,
    label: "Action Items",
    icon: ListTodoIcon,
  },
];

export const MEETING_TYPES: { value: MeetingFilter; label: string }[] = [
  { value: MeetingFilter.All, label: "All" },
  { value: MeetingFilter.Internal, label: "Internal" },
  { value: MeetingFilter.External, label: "External" },
  { value: MeetingFilter.MyMeetings, label: "My meetings" },
  { value: MeetingFilter.Participant, label: "As participant" },
];
