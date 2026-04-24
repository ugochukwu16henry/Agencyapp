import { createRequire } from "node:module";
import path from "node:path";

/**
 * pdf-lib is hoisted to the monorepo root by npm workspaces; Turbopack may not
 * resolve it from a static import. Loading via createRequire matches Node resolution.
 */
export function loadPdfLib() {
  const require = createRequire(path.join(process.cwd(), "package.json"));
  return require("pdf-lib") as typeof import("pdf-lib");
}
