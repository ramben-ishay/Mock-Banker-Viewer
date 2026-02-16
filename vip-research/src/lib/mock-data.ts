// Backwards-compatible entrypoint.
// Several parts of the app (and demo scripts/docs) import from "@/lib/mock-data".
// The data source lives in `data.ts`, so this file simply re-exports it.
export * from "./data";

