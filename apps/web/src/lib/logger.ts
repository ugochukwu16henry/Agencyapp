type Level = "info" | "warn" | "error";

export function logEvent(level: Level, event: string, payload?: Record<string, unknown>) {
  const body = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...(payload ? { payload } : {}),
  };

  if (level === "error") {
    console.error(JSON.stringify(body));
    return;
  }

  if (level === "warn") {
    console.warn(JSON.stringify(body));
    return;
  }

  console.info(JSON.stringify(body));
}
