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

// Types
export type {
  Transcript as TranscriptType,
  TranscriptItem,
} from "./Transcript/Transcript";

// Styles
import "./style.css";
