import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "./logger";
import { LogLevel } from "../types";

describe("Logger", () => {
  let consoleSpy: {
    log: ReturnType<typeof vi.spyOn>;
    info: ReturnType<typeof vi.spyOn>;
    warn: ReturnType<typeof vi.spyOn>;
    error: ReturnType<typeof vi.spyOn>;
  };

  beforeEach(() => {
    // Spy on console methods
    consoleSpy = {
      log: vi.spyOn(console, "log").mockImplementation(() => {}),
      info: vi.spyOn(console, "info").mockImplementation(() => {}),
      warn: vi.spyOn(console, "warn").mockImplementation(() => {}),
      error: vi.spyOn(console, "error").mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    // Reset all spies
    Object.values(consoleSpy).forEach((spy) => spy.mockRestore());
    // Reset logger to off (default level)
    logger.setLevel("off");
  });

  describe("Log Levels", () => {
    it("should log all levels when set to debug", () => {
      logger.setLevel(LogLevel.DEBUG);

      logger.debug("debug message");
      logger.info("info message");
      logger.warn("warn message");
      logger.error("error message");

      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[DEBUG\]/),
        "debug message",
      );
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[INFO\]/),
        "info message",
      );
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[WARN\]/),
        "warn message",
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[ERROR\]/),
        "error message",
      );
    });

    it("should not log debug when set to info level", () => {
      logger.setLevel(LogLevel.INFO);

      logger.debug("debug message");
      logger.info("info message");
      logger.warn("warn message");
      logger.error("error message");

      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[INFO\]/),
        "info message",
      );
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[WARN\]/),
        "warn message",
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[ERROR\]/),
        "error message",
      );
    });

    it("should only log errors when set to error level", () => {
      logger.setLevel(LogLevel.ERROR);

      logger.debug("debug message");
      logger.info("info message");
      logger.warn("warn message");
      logger.error("error message");

      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[ERROR\]/),
        "error message",
      );
    });

    it("should not log anything when disabled", () => {
      logger.setLevel("off");

      logger.debug("debug message");
      logger.info("info message");
      logger.warn("warn message");
      logger.error("error message");

      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });
  });

  describe("Enable/Disable Methods", () => {
    it("should enable debug level when enable() is called", () => {
      logger.disable();
      logger.enable();

      logger.debug("debug message");
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[DEBUG\]/),
        "debug message",
      );
    });

    it("should disable all logging when disable() is called", () => {
      logger.enable();
      logger.disable();

      logger.debug("debug message");
      logger.info("info message");
      logger.warn("warn message");
      logger.error("error message");

      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
      expect(consoleSpy.warn).not.toHaveBeenCalled();
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });
  });

  describe("Backward Compatibility", () => {
    it("should support log() method as alias for info", () => {
      logger.setLevel(LogLevel.INFO);

      logger.log("log message");
      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[INFO\]/),
        "log message",
      );
    });
  });

  describe("Message Formatting", () => {
    it("should include timestamp and prefix", () => {
      logger.setLevel(LogLevel.INFO);
      logger.info("test message");

      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringMatching(
          /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] \[NYLAS-AUTH\] \[INFO\]$/,
        ),
        "test message",
      );
    });

    it("should handle multiple arguments", () => {
      logger.setLevel(LogLevel.INFO);
      logger.info("message", { key: "value" }, 123);

      expect(consoleSpy.info).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[INFO\]/),
        "message",
        { key: "value" },
        123,
      );
    });
  });

  describe("Auto-enable on localhost", () => {
    let originalLocation: Location;

    beforeEach(() => {
      // Store original location
      originalLocation = window.location;
    });

    afterEach(() => {
      // Restore original location
      Object.defineProperty(window, "location", {
        value: originalLocation,
        writable: true,
      });
    });

    it("should auto-enable debug on localhost", () => {
      // Mock window.location for localhost
      Object.defineProperty(window, "location", {
        value: {
          hostname: "localhost",
          search: "",
        },
        writable: true,
      });

      // Create a new logger instance to test initialization
      const testLogger = new (logger.constructor as any)();

      testLogger.debug("debug on localhost");
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[DEBUG\]/),
        "debug on localhost",
      );
    });

    it("should auto-enable debug on 127.0.0.1", () => {
      Object.defineProperty(window, "location", {
        value: {
          hostname: "127.0.0.1",
          search: "",
        },
        writable: true,
      });

      const testLogger = new (logger.constructor as any)();

      testLogger.debug("debug on 127.0.0.1");
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.stringMatching(/\[.*\] \[NYLAS-AUTH\] \[DEBUG\]/),
        "debug on 127.0.0.1",
      );
    });

    it("should stay disabled on production domains", () => {
      Object.defineProperty(window, "location", {
        value: {
          hostname: "example.com",
          search: "",
        },
        writable: true,
      });

      const testLogger = new (logger.constructor as any)();

      testLogger.debug("debug on production");
      testLogger.info("info on production");

      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.info).not.toHaveBeenCalled();
    });

    it("should respect explicit debug flag over localhost detection", () => {
      // Set up localhost environment
      Object.defineProperty(window, "location", {
        value: {
          hostname: "localhost",
          search: "",
        },
        writable: true,
      });

      // Explicitly disable via localStorage (should override localhost detection)
      localStorage.setItem("NYLAS_CONNECT_DEBUG", "false");

      try {
        const testLogger = new (logger.constructor as any)();

        testLogger.debug("should not show");
        testLogger.info("should not show");

        expect(consoleSpy.log).not.toHaveBeenCalled();
        expect(consoleSpy.info).not.toHaveBeenCalled();
      } finally {
        localStorage.removeItem("NYLAS_CONNECT_DEBUG");
      }
    });
  });
});
