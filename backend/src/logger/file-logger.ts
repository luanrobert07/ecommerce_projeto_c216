import { LoggerService } from "@nestjs/common";
import { appendFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

export class FileLogger implements LoggerService {
  private readonly logFilePath: string;

  constructor(logFilePath = process.env.LOG_FILE_PATH ?? "logs/app.log") {
    this.logFilePath = resolve(logFilePath);
    mkdirSync(dirname(this.logFilePath), { recursive: true });
  }

  log(message: unknown, context?: string) {
    this.write("LOG", message, context);
  }

  error(message: unknown, trace?: string, context?: string) {
    this.write("ERROR", message, context, trace);
  }

  warn(message: unknown, context?: string) {
    this.write("WARN", message, context);
  }

  debug(message: unknown, context?: string) {
    this.write("DEBUG", message, context);
  }

  verbose(message: unknown, context?: string) {
    this.write("VERBOSE", message, context);
  }

  private write(level: string, message: unknown, context?: string, trace?: string) {
    const timestamp = new Date().toISOString();
    const formattedMessage =
      typeof message === "string" ? message : JSON.stringify(message);
    const contextLabel = context ? ` [${context}]` : "";
    const line = `[${timestamp}] ${level}${contextLabel} ${formattedMessage}`;
    const fullLine = trace ? `${line}\n${trace}` : line;

    appendFileSync(this.logFilePath, `${fullLine}\n`);

    if (level === "ERROR") {
      console.error(fullLine);
      return;
    }

    if (level === "WARN") {
      console.warn(fullLine);
      return;
    }

    console.log(fullLine);
  }
}
