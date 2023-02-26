export interface Formatter {
    source: String;
    level: "error" | "warn" | "info" | "http" | "verbose" | "debug" | "silly";
    message: String;
    timestamp: String;
}
