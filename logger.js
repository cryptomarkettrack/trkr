import { Logger, ConsoleHandler, LogLevel } from "logging-library";

// Create a logger instance and attach a console handler with level INFO and above as well
// as a custom handler with level WARN.
const logger = new Logger()
  .addHandler(new ConsoleHandler([LogLevel.WARN, LogLevel.INFO, LogLevel.ERROR]))
// A handler can also be configured to only work for specific levels by passing in an array like above.

export default logger;