function fallbackUUID(): string {
  // RFC-4122 version 4 compliant
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateToken(): string {
  try {
    // if crypto.randomUUID exists, use it
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    // otherwise, fall through to throw
    throw new Error("no crypto.randomUUID");
  } catch {
    // fallback for InDesign CEP runtimes
    return fallbackUUID();
  }
}