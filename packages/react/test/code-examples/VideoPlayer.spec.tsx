import { render } from "@testing-library/react";
import { it } from "vitest";

// --- example code:start --
import React from "react";
import { VideoPlayer } from "../../src/notetaker/VideoPlayer/VideoPlayer";

function App() {
  return (
    <VideoPlayer
      videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      className="custom-video-player"
      poster="https://via.placeholder.com/640x360.png?text=Video+Poster"
      autoPlay={false}
      muted={false}
      loop={false}
      videoType="video/mp4"
      onTimeUpdate={(currentTime) => console.log("Time update:", currentTime)}
      onSeek={(newTime) => console.log("Seeked to:", newTime)}
      onPlay={() => console.log("Video started playing")}
      onPause={() => console.log("Video paused")}
      onEnded={() => console.log("Video ended")}
    />
  );
}
// --- example code:end --

it("should render the video player example", () => {
  render(<App />);
});
