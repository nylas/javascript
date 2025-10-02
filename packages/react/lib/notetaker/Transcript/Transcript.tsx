import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Copy, Search, FileText, Play } from "lucide-react";
import { input, button } from "../lib/primitives";
import { videoPlayerStore } from "../VideoPlayer/VideoPlayer";

dayjs.extend(utc); // needed as utc is a separate plugin

/**
 * Props for the Transcript component.
 */
export interface TranscriptProps {
  /**
   * The array of transcript items to display.
   */
  transcript: TranscriptItem[];
  /**
   * Whether the transcript should automatically scroll to the active item as the video/audio progresses.
   * @default true
   */
  autoscroll?: boolean;
  /**
   * Whether to show the toolbar (search/copy controls) at the top.
   * @default true
   */
  toolbar?: boolean;
  /**
   * Custom ReactNode to display when there are no transcripts.
   */
  emptyState?: React.ReactNode;
  /**
   * Controls whether the speaker name is shown for each transcript item.
   * @default true
   */
  showSpeaker?: boolean;
  /**
   * Controls whether timestamps are shown for each transcript item.
   * @default true
   */
  showTimestamps?: boolean;
  /**
   * Custom label for the "Resume Autoscroll" button.
   * @default "Resume Autoscroll"
   */
  resumeAutoscrollLabel?: string;
  /**
   * Callback function invoked when a timestamp (play button) is clicked.
   * Receives the timestamp in seconds.
   */
  onTimestampClick?: (timestamp: number) => void;
  /**
   * Custom component to render transcript text.
   * If not provided, the default Text component will be used.
   */
  transcriptComponent?: React.ComponentType<{
    text: string;
    highlight: string | null;
  }>;
}

/**
 * Represents a single item in the transcript.
 */
export interface TranscriptItem {
  /** The ID of the transcript item. */
  speaker: string;
  /** The content of the transcript item. */
  start: number;
  /** The creation date of the transcript item. */
  end: number;
  /** The update date of the transcript item. */
  text: string;
}

type ProcessedTranscriptItem = TranscriptItem & {
  active: boolean;
  ts: string | null;
};

type ToolbarState = "default" | "search";

// --- Helper Components ---

const Text: React.FC<{
  text: string;
  highlight: string | null;
}> = ({ text, highlight }) => {
  if (!highlight) return <div>{text}</div>;
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <div>
      {parts.map((part, i) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="ny:rounded ny:bg-yellow-200">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </div>
  );
};

interface ToolbarProps {
  transcripts: ProcessedTranscriptItem[];
  toolbarState: ToolbarState;
  setToolbarState: (state: ToolbarState) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  transcripts,
  toolbarState,
  setToolbarState,
  searchTerm,
  setSearchTerm,
}) => {
  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    setToolbarState("default");
  }, [setSearchTerm, setToolbarState]);

  const handleCopy = useCallback(async () => {
    const textToCopy = transcripts
      .map((t) => `${t.ts} ${t.speaker}: ${t.text}`)
      .join("\n");
    await navigator.clipboard.writeText(textToCopy);
  }, [transcripts]);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value);
  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Escape") {
      handleClearSearch();
    }
  };

  return (
    <div className="ny:toolbar ny:border-b ny:border-gray-200 ny:px-3 ny:py-2 ny:rounded-t">
      {/* Default State */}
      {toolbarState === "default" && (
        <div className="ny:controls ny:flex ny:items-center ny:space-x-3">
          <button
            onClick={() => setToolbarState("search")}
            className={button({ variant: "link" })}
          >
            <Search height={16} className="ny:text-gray-600" />
            <span>Search</span>
          </button>

          <button onClick={handleCopy} className={button({ variant: "link" })}>
            <Copy height={16} className="ny:text-gray-600" />
            <span>Copy</span>
          </button>
        </div>
      )}
      {/* Search */}
      {toolbarState === "search" && (
        <div className="ny:search ny:flex ny:items-center ny:w-full ny:space-x-2">
          <Search height={16} className="ny:text-gray-500 ny:flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchInput}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search transcript..."
            className={input()}
            autoFocus
          />
          <button
            className={button({ variant: "link" })}
            onClick={handleClearSearch}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

const Transcript: React.FC<TranscriptProps> = ({
  transcript = [],
  autoscroll = true,
  toolbar = true,
  emptyState,
  showSpeaker = true,
  showTimestamps = true,
  resumeAutoscrollLabel = "Resume Autoscroll",
  onTimestampClick,
  transcriptComponent,
}) => {
  const { currentTime, setCurrentTime, isPlaying } = videoPlayerStore();
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [toolbarState, setToolbarState] = useState<ToolbarState>("default");
  const [userScrolledAway, setUserScrolledAway] = useState(false); // Track if user manually scrolled
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement>(null);

  const secondsToStr = (milliseconds: number): string => {
    if (milliseconds < 3600000) {
      // Less than 1 hour
      return dayjs.utc(milliseconds).format("mm:ss");
    } else {
      return dayjs.utc(milliseconds).format("HH:mm:ss");
    }
  };

  const handleResumeAutoscroll = useCallback(() => {
    setUserScrolledAway(false);
    if (activeItemRef.current) {
      console.log("Resuming autoscroll");
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []); // No dependencies needed as refs are stable

  const processedTranscripts = useMemo((): ProcessedTranscriptItem[] => {
    if (!transcript || transcript.length === 0) return [];
    const candidateIndex =
      transcript.findIndex((item) => item.start / 1000 >= currentTime) - 1;
    let res = transcript.map((item, index) => ({
      ...item,
      active: index === candidateIndex,
      ts: item.start ? secondsToStr(item.start) : null,
    }));

    if (searchTerm) {
      res = res.filter((x) =>
        x.text.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return res;
  }, [transcript, currentTime, searchTerm]);

  useEffect(() => {
    // Only autoscroll if the prop is true AND the user hasn't scrolled away
    if (
      autoscroll &&
      !userScrolledAway &&
      activeItemRef.current &&
      transcriptContainerRef.current
    ) {
      // Check if the active item is fully visible
      const container = transcriptContainerRef.current;
      const activeItem = activeItemRef.current;
      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      const isVisible =
        itemRect.top >= containerRect.top &&
        itemRect.bottom <= containerRect.bottom;

      if (!isVisible) {
        // Set flag before programmatically scrolling
        activeItem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [processedTranscripts, autoscroll, userScrolledAway]); // Added userScrolledAway dependency

  const handleCopyTimestamp = useCallback((item: ProcessedTranscriptItem) => {
    if (!item.ts || !item.speaker || !item.text) return;
    navigator.clipboard.writeText(`${item.ts} ${item.speaker}: ${item.text}`);
  }, []);

  // Use the custom component if provided, otherwise use the default Text component
  const TextComponent = transcriptComponent || Text;

  return (
    <div className="ny:flex ny:flex-col ny:bg-white ny:border ny:border-gray-200 ny:rounded-lg ny:h-full ny:w-full ny:overflow-y-auto">
      {toolbar && (
        <Toolbar
          transcripts={processedTranscripts}
          toolbarState={toolbarState}
          setToolbarState={setToolbarState}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
      <div
        className="ny:transcripts ny:flex-grow ny:overflow-y-auto ny:p-3 ny:space-y-3 ny:relative"
        ref={transcriptContainerRef}
        onWheel={() => setUserScrolledAway(true)}
        onTouchStart={() => setUserScrolledAway(true)}
        onKeyDown={() => setUserScrolledAway(true)}
        onKeyUp={() => setUserScrolledAway(true)}
      >
        {!processedTranscripts.length &&
          !searchTerm &&
          (emptyState ? (
            emptyState
          ) : (
            <div className="ny:no-results ny:flex ny:flex-col ny:items-center ny:justify-center ny:text-center ny:text-gray-400 ny:py-6 ny:h-full">
              <FileText size={48} className="ny:mb-4 ny:text-gray-100" />
              Transcript not available
            </div>
          ))}
        {!processedTranscripts.length && searchTerm && (
          <div className="ny:no-results ny:text-center ny:text-gray-500 ny:py-6">
            No results found for "{searchTerm}".
          </div>
        )}
        {processedTranscripts.map((item, idx) => (
          <div
            key={item.start + "-" + idx}
            ref={item.active ? activeItemRef : null}
            className={`ny:transcripts-item ny:flex ny:gap-2 ny:p-2 ny:rounded ny:group ny:hover:bg-gray-50 ${item.active ? "ny:bg-blue-50" : ""}`}
            onMouseEnter={() => setFocusedIndex(idx)}
            onMouseLeave={() => setFocusedIndex(-1)}
          >
            {showTimestamps && item.ts && (
              <div className="ny:time ny:w-16 ny:text-right ny:flex-shrink-0 ny:text-sm ny:text-blue-600 ny:relative">
                <span
                  className={`ny:transition-opacity ny:duration-150 ny:ease-in-out ${focusedIndex === idx ? "ny:opacity-0" : "ny:opacity-100"}`}
                >
                  {item.ts}
                </span>
                <span
                  className={`ny:absolute ny:inset-0 ny:flex ny:items-start ny:justify-end ny:space-x-1 ny:pt-1 ny:transition-opacity ny:duration-150 ny:ease-in-out ${
                    focusedIndex === idx ? "ny:opacity-100" : "ny:opacity-0"
                  } ny:group-hover:ny:opacity-100`}
                >
                  {setCurrentTime && (
                    <Play
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentTime(item.start / 1000 + 1);
                        setUserScrolledAway(false);
                        if (onTimestampClick) {
                          onTimestampClick(item.start / 1000 + 1);
                        }
                      }}
                      className="ny:play-btn ny:h-4 ny:w-4 ny:text-gray-400 ny:hover:text-blue-600 ny:cursor-pointer"
                    />
                  )}
                  <Copy
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyTimestamp(item);
                    }}
                    className="ny:copy-btn ny:h-4 ny:w-4 ny:text-gray-400 ny:hover:text-blue-600 ny:cursor-pointer"
                  />
                </span>
              </div>
            )}
            <div className="ny:message ny:flex-grow ny:m-0">
              {showSpeaker && (
                <div className="ny:speaker ny:font-semibold ny:text-sm ny:text-gray-800 ny:mb-0.5">
                  {item.speaker}
                </div>
              )}
              <div className="ny:text-sm ny:text-gray-700 ny:leading-relaxed">
                <TextComponent
                  text={item.text}
                  highlight={searchTerm || null}
                />
              </div>
            </div>
          </div>
        ))}

        {/* Resume Autoscroll Button */}
        {transcript.length > 0 &&
          autoscroll &&
          userScrolledAway &&
          isPlaying && (
            <button
              onClick={handleResumeAutoscroll}
              className={button({
                variant: "primary",
                class:
                  "ny:sticky ny:bottom-4 ny:left-1/2  ny:-translate-x-1/2 ny:rounded-full",
              })}
            >
              {resumeAutoscrollLabel}
            </button>
          )}
      </div>
    </div>
  );
};

export { Transcript };
