import React from "react";
import { render } from "@testing-library/react";

import { VideoPlayer, videoPlayerStore as videoStore } from "./VideoPlayer";

describe("VideoPlayer", () => {
  test("renders the video player component without crashing", () => {
    const testVideoUrl = "test-video.mp4";
    const { container } = render(<VideoPlayer videoUrl={testVideoUrl} />);
    const videoElement = container.querySelector("video source");
    expect(videoElement).toBeTruthy();
    expect(videoElement?.getAttribute("src")).toBe(testVideoUrl);
  });
});
