// Lightweight logger for serverless (Edge/Node) environments
// Uses console.* under the hood and adds requestId/context

function getTimestamp() {
  return new Date().toISOString();
}

function format(level, message, meta) {
  const base = { level, time: getTimestamp(), message };
  const merged = meta ? { ...base, ...meta } : base;
  try {
    return JSON.stringify(merged);
  } catch {
    return JSON.stringify({ ...base, meta: String(meta) });
  }
}

export const logger = {
  info(message, meta) {
    console.info(format("info", message, meta));
  },
  warn(message, meta) {
    console.warn(format("warn", message, meta));
  },
  error(message, meta) {
    console.error(format("error", message, meta));
  },
  debug(message, meta) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(format("debug", message, meta));
    }
  },
};

// Helper to extract a request id from headers or generate one
export function getRequestId(request) {
  try {
    const id = request?.headers?.get?.("x-request-id") || request?.headers?.get?.("request-id");
    return id || crypto.randomUUID?.() || Math.random().toString(36).slice(2);
  } catch {
    return Math.random().toString(36).slice(2);
  }
}


