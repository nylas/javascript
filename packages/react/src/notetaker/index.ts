// Components
export { Transcript } from "./Transcript/Transcript";
export { VideoPlayer } from "./VideoPlayer/VideoPlayer";
export { CalendarSync } from "./CalendarSync/CalendarSync";
export { SendNotetaker } from "./SendNotetaker/SendNotetaker";

// Stores
export { provider } from "./lib/store";
export { calendarSyncStore } from "./CalendarSync/CalendarSync";
export { sendNotetakerStore } from "./SendNotetaker/SendNotetaker";
export { videoPlayerStore } from "./VideoPlayer/VideoPlayer";

// Types - Components
export type {
  Transcript as TranscriptType,
  TranscriptItem,
  TranscriptProps,
  TranscriptClassNames,
} from "./Transcript/Transcript";
export type {
  VideoPlayerProps,
  VideoPlayerClassNames,
} from "./VideoPlayer/VideoPlayer";
export type {
  CalendarSyncProps,
  CalendarSyncClassNames,
  CalendarSyncStore,
} from "./CalendarSync/CalendarSync";
export type {
  SendNotetakerProps,
  SendNotetakerClassNames,
  SendNotetakerStore,
} from "./SendNotetaker/SendNotetaker";

// Types - General
export type {
  Calendar,
  Notetaker,
  MeetingFilter,
  RecordingType,
} from "./types";

// Theme system
export {
  NylasThemeProvider,
  useNylasTheme,
  defaultLightTheme,
  defaultDarkTheme,
  mergeThemes,
} from "./lib/theme";
export type {
  NylasTheme,
  NylasThemeColors,
  NylasThemeSpacing,
  NylasThemeBorderRadius,
  NylasThemeShadows,
  NylasThemeProviderProps,
} from "./lib/theme";

// Styles
import "./style.css";
